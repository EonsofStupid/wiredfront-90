
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Helper function to handle the OpenAI/DALL-E API call
async function callDallE(apiKey: string, prompt: string, options: any) {
  const model = options.model || 'dall-e-3';
  const size = options.size || '1024x1024';
  const quality = options.quality || 'standard';
  const n = options.n || 1;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      n: n,
      size: size,
      quality: quality,
      response_format: 'url'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`DALL-E API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    imageUrl: data.data[0]?.url || '',
    revised_prompt: data.data[0]?.revised_prompt || prompt
  };
}

// Helper function to handle the Stability API call
async function callStabilityAI(apiKey: string, prompt: string, options: any) {
  const engine = options.engine || 'stable-diffusion-xl-1024-v1-0';
  const width = options.width || 1024;
  const height = options.height || 1024;
  const cfgScale = options.cfg_scale || 7;
  const steps = options.steps || 30;
  const style = options.style || 'enhancement';

  const response = await fetch(`https://api.stability.ai/v1/generation/${engine}/text-to-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      text_prompts: [
        {
          text: prompt,
          weight: 1
        }
      ],
      cfg_scale: cfgScale,
      height: height,
      width: width,
      steps: steps,
      style_preset: style
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Stability AI error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  // Get base64 image and convert to data URL
  const base64Image = data.artifacts?.[0]?.base64 || '';
  const imageUrl = base64Image ? `data:image/png;base64,${base64Image}` : '';

  return {
    imageUrl: imageUrl,
    revised_prompt: prompt
  };
}

// Helper function to handle the Replicate API call
async function callReplicate(apiKey: string, prompt: string, options: any) {
  const model = options.model || 'stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316';
  const width = options.width || 1024;
  const height = options.height || 1024;
  const numOutputs = options.num_outputs || 1;

  // First, create a prediction
  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${apiKey}`
    },
    body: JSON.stringify({
      version: model.split(':')[1],
      input: {
        prompt: prompt,
        width: width,
        height: height,
        num_outputs: numOutputs
      }
    })
  });

  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(`Replicate API error: ${error.detail || createResponse.statusText}`);
  }

  const prediction = await createResponse.json();
  const predictionId = prediction.id;

  // Poll for the result
  let result = null;
  let attempts = 0;
  while (attempts < 30) { // Try for about 60 seconds
    const getResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!getResponse.ok) {
      const error = await getResponse.json();
      throw new Error(`Replicate API polling error: ${error.detail || getResponse.statusText}`);
    }

    result = await getResponse.json();
    if (result.status === 'succeeded') {
      break;
    } else if (result.status === 'failed') {
      throw new Error(`Replicate API generation failed: ${result.error || 'Unknown error'}`);
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }

  if (!result || result.status !== 'succeeded') {
    throw new Error('Timed out waiting for image generation');
  }

  // Return the first image URL
  return {
    imageUrl: result.output?.[0] || '',
    revised_prompt: prompt
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { provider, prompt, options } = await req.json();
    
    // Get the appropriate API key from environment variables
    let apiKey;
    let result;
    
    switch (provider) {
      case 'openai':
        apiKey = Deno.env.get('OPENAI_CHAT_APIKEY');
        if (!apiKey) throw new Error('OPENAI_CHAT_APIKEY is not configured');
        result = await callDallE(apiKey, prompt, options);
        break;
        
      case 'stabilityai':
        apiKey = Deno.env.get('STABILITYAI_CHAT_APIKEY');
        if (!apiKey) throw new Error('STABILITYAI_CHAT_APIKEY is not configured');
        result = await callStabilityAI(apiKey, prompt, options);
        break;
        
      case 'replicate':
        apiKey = Deno.env.get('REPLICATE_CHAT_APIKEY');
        if (!apiKey) throw new Error('REPLICATE_CHAT_APIKEY is not configured');
        result = await callReplicate(apiKey, prompt, options);
        break;
        
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
    
    // Return the result
    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Log the error
    console.error(`Error processing request: ${error.message}`);
    
    // Return an error response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

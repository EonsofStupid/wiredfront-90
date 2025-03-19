
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Helper function to handle the OpenAI API call
async function callOpenAI(apiKey: string, prompt: string, options: any) {
  const systemMessage = options.systemPrompt || "You are a helpful assistant.";
  const model = options.model || 'gpt-4o';
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
      top_p: options.top_p || 1,
      frequency_penalty: options.frequency_penalty || 0,
      presence_penalty: options.presence_penalty || 0
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0]?.message?.content || '',
    usage: data.usage
  };
}

// Helper function to handle the Anthropic API call
async function callAnthropic(apiKey: string, prompt: string, options: any) {
  const systemPrompt = options.systemPrompt || "";
  const model = options.model || 'claude-3-opus-20240229';
  
  // Format the prompt according to Anthropic's requirements
  let formattedPrompt = prompt;
  if (systemPrompt) {
    formattedPrompt = `<system>\n${systemPrompt}\n</system>\n\n<human>\n${prompt}\n</human>\n\n<assistant>`;
  } else {
    formattedPrompt = `<human>\n${prompt}\n</human>\n\n<assistant>`;
  }
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'user', content: formattedPrompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.content?.[0]?.text || '',
    usage: {
      input_tokens: data.usage?.input_tokens || 0,
      output_tokens: data.usage?.output_tokens || 0,
      total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
    }
  };
}

// Helper function to handle the Gemini API call
async function callGemini(apiKey: string, prompt: string, options: any) {
  const systemPrompt = options.systemPrompt || "";
  const model = options.model || 'gemini-1.5-flash';
  
  // Format the prompt with system instructions if provided
  let formattedPrompt = prompt;
  if (systemPrompt) {
    formattedPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;
  }
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: formattedPrompt }]
        }
      ],
      generation_config: {
        temperature: options.temperature || 0.7,
        max_output_tokens: options.maxOutputTokens || 1000,
        top_p: options.top_p || 0.95,
        top_k: options.top_k || 40
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    // Gemini doesn't provide detailed token usage yet
    usage: {
      total_tokens: 1000 // Estimated tokens
    }
  };
}

// Helper function to handle the OpenRouter API call
async function callOpenRouter(apiKey: string, prompt: string, options: any) {
  const systemMessage = options.systemPrompt || "You are a helpful assistant.";
  const model = options.model || 'openai/gpt-4o';
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://wiredfront.com', // Change to your site
      'X-Title': 'WiredFront Chat'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0]?.message?.content || '',
    usage: data.usage
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
        result = await callOpenAI(apiKey, prompt, options);
        break;
        
      case 'anthropic':
        apiKey = Deno.env.get('ANTHROPIC_CHAT_APIKEY');
        if (!apiKey) throw new Error('ANTHROPIC_CHAT_APIKEY is not configured');
        result = await callAnthropic(apiKey, prompt, options);
        break;
        
      case 'gemini':
        apiKey = Deno.env.get('GEMINI_CHAT_APIKEY');
        if (!apiKey) throw new Error('GEMINI_CHAT_APIKEY is not configured');
        result = await callGemini(apiKey, prompt, options);
        break;
        
      case 'openrouter':
        apiKey = Deno.env.get('OPENROUTER_CHAT_APIKEY');
        if (!apiKey) throw new Error('OPENROUTER_CHAT_APIKEY is not configured');
        result = await callOpenRouter(apiKey, prompt, options);
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

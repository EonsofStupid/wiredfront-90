
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { configId, provider } = await req.json();
    
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] ?? '');

    if (authError || !user) {
      throw new Error('Unauthorized');
    }
    
    // Get the API configuration
    const { data: config, error: configError } = await supabaseAdmin
      .from('api_configurations')
      .select('*')
      .eq('id', configId)
      .single();
      
    if (configError) {
      throw new Error(`Config not found: ${configError.message}`);
    }
    
    let testResult = { success: false, message: 'Not implemented', details: null };
    
    // Test the connection based on the provider type
    switch (config.api_type) {
      case 'openai':
        testResult = await testOpenAI();
        break;
      case 'anthropic':
        testResult = await testAnthropic();
        break;
      case 'gemini':
        testResult = await testGemini();
        break;
      case 'stabilityai':
        testResult = await testStabilityAI();
        break;
      case 'replicate':
        testResult = await testReplicate();
        break;
      case 'openrouter':
        testResult = await testOpenRouter();
        break;
      case 'pinecone':
        testResult = await testPinecone();
        break;
      default:
        testResult = { 
          success: false, 
          message: `Unsupported provider type: ${config.api_type}`, 
          details: null 
        };
    }
    
    // Update the validation status in the database
    const { error: updateError } = await supabaseAdmin
      .from('api_configurations')
      .update({ 
        validation_status: testResult.success ? 'valid' : 'invalid',
        last_validated: new Date().toISOString(),
        last_error_message: testResult.success ? null : testResult.message
      })
      .eq('id', configId);
      
    if (updateError) {
      console.error('Error updating validation status:', updateError);
    }
    
    // Log the test
    console.log(`Tested ${config.api_type} connection:`, { 
      success: testResult.success,
      configId,
      userId: user.id 
    });

    return new Response(
      JSON.stringify(testResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error testing AI connection:', error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});

// Helper functions to test each provider
async function testOpenAI() {
  // Verify that the API key is available
  const apiKey = Deno.env.get('OPENAI_CHAT_APIKEY');
  if (!apiKey) {
    return { success: false, message: 'OpenAI API key not found', details: null };
  }
  
  try {
    // Simple models list API call to check if the key works
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { 
        success: false, 
        message: `OpenAI API error: ${error.error?.message || 'Unknown error'}`, 
        details: error 
      };
    }
    
    const data = await response.json();
    return { 
      success: true, 
      message: 'Successfully connected to OpenAI API', 
      details: { modelCount: data.data?.length || 0 } 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Error connecting to OpenAI: ${error.message}`, 
      details: null 
    };
  }
}

async function testAnthropic() {
  const apiKey = Deno.env.get('ANTHROPIC_CHAT_APIKEY');
  if (!apiKey) {
    return { success: false, message: 'Anthropic API key not found', details: null };
  }
  
  // For demo purposes, we're just checking if the key exists
  return { 
    success: true, 
    message: 'Anthropic API key is available', 
    details: null
  };
}

async function testGemini() {
  const apiKey = Deno.env.get('GEMINI_CHAT_APIKEY');
  if (!apiKey) {
    return { success: false, message: 'Gemini API key not found', details: null };
  }
  
  // For demo purposes, we're just checking if the key exists
  return { 
    success: true, 
    message: 'Gemini API key is available', 
    details: null
  };
}

async function testStabilityAI() {
  const apiKey = Deno.env.get('STABILITYAI_CHAT_APIKEY');
  if (!apiKey) {
    return { success: false, message: 'StabilityAI API key not found', details: null };
  }
  
  // For demo purposes, we're just checking if the key exists
  return { 
    success: true, 
    message: 'StabilityAI API key is available', 
    details: null
  };
}

async function testReplicate() {
  const apiKey = Deno.env.get('REPLICATE_CHAT_APIKEY');
  if (!apiKey) {
    return { success: false, message: 'Replicate API key not found', details: null };
  }
  
  // For demo purposes, we're just checking if the key exists
  return { 
    success: true, 
    message: 'Replicate API key is available', 
    details: null
  };
}

async function testOpenRouter() {
  const apiKey = Deno.env.get('OPENROUTER_CHAT_APIKEY');
  if (!apiKey) {
    return { success: false, message: 'OpenRouter API key not found', details: null };
  }
  
  // For demo purposes, we're just checking if the key exists
  return { 
    success: true, 
    message: 'OpenRouter API key is available', 
    details: null
  };
}

async function testPinecone() {
  const apiKey = Deno.env.get('PINECONE_APIKEY');
  if (!apiKey) {
    return { success: false, message: 'Pinecone API key not found', details: null };
  }
  
  // For demo purposes, we're just checking if the key exists
  return { 
    success: true, 
    message: 'Pinecone API key is available', 
    details: null
  };
}

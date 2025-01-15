import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      throw new Error('No file provided')
    }

    // Generate safe filename
    const timestamp = new Date().toISOString()
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${crypto.randomUUID()}.${fileExt}`
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('chat-attachments')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('chat-attachments')
      .getPublicUrl(fileName)

    // Create document record
    const { data: document, error: documentError } = await supabaseClient
      .from('documents')
      .insert({
        title: file.name,
        content: 'Processing...', // Will be updated after text extraction
        file_url: publicUrl,
        file_type: file.type,
        status: 'processing'
      })
      .select()
      .single()

    if (documentError) throw documentError

    // Return success response
    return new Response(
      JSON.stringify({
        message: 'Document uploaded successfully',
        document
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error processing document:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process document',
        details: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
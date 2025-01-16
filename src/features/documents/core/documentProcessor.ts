import { supabase } from '@/integrations/supabase/client';
import { getPineconeClient, getVectorStore, VectorStoreType } from './vectorStore';
import { toast } from 'sonner';

export interface ProcessingOptions {
  chunkSize?: number;
  overlapSize?: number;
  vectorStoreType?: VectorStoreType;
}

export const processDocument = async (
  documentId: string,
  options: ProcessingOptions = {}
) => {
  try {
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError) throw docError;

    // Update processing status
    await supabase
      .from('documents')
      .update({ status: 'processing' })
      .eq('id', documentId);

    // Get content from storage if file_url exists
    let content = document.content;
    if (document.file_url) {
      const { data: fileData, error: fileError } = await supabase.storage
        .from('chat-attachments')
        .download(document.file_url);

      if (fileError) throw fileError;
      content = await fileData.text();
    }

    // Chunk the document
    const chunks = await chunkContent(content, {
      size: options.chunkSize || 1000,
      overlap: options.overlapSize || 200,
    });

    // Store chunks and get embeddings
    const vectorStore = await getVectorStore();
    if (vectorStore?.type === 'pinecone') {
      await storePineconeVectors(documentId, chunks);
    } else {
      await storeSupabaseVectors(documentId, chunks);
    }

    // Update document status
    await supabase
      .from('documents')
      .update({ status: 'indexed' })
      .eq('id', documentId);

    toast.success('Document processed successfully');
  } catch (error) {
    console.error('Error processing document:', error);
    await supabase
      .from('documents')
      .update({ 
        status: 'failed',
        error_message: error.message 
      })
      .eq('id', documentId);
    
    toast.error('Failed to process document');
    throw error;
  }
};

const chunkContent = async (
  content: string,
  options: { size: number; overlap: number }
): Promise<string[]> => {
  const chunks: string[] = [];
  const words = content.split(' ');
  
  for (let i = 0; i < words.length; i += options.size - options.overlap) {
    const chunk = words.slice(i, i + options.size).join(' ');
    chunks.push(chunk);
  }
  
  return chunks;
};

const storeSupabaseVectors = async (documentId: string, chunks: string[]) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No authenticated user');

  for (let i = 0; i < chunks.length; i++) {
    const { error } = await supabase.from('document_chunks').insert({
      document_id: documentId,
      content: chunks[i],
      chunk_index: i,
      metadata: { source: 'text' }
    });

    if (error) throw error;
  }
};

const storePineconeVectors = async (documentId: string, chunks: string[]) => {
  const client = getPineconeClient();
  const index = client.index('documents');

  // Create records for Pinecone
  const records = chunks.map((chunk, i) => ({
    id: `${documentId}_${i}`,
    values: new Array(1536).fill(0), // Placeholder for actual embeddings
    metadata: {
      documentId,
      chunkIndex: i,
      content: chunk
    }
  }));

  // Upsert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await index.upsert(batch);
  }
};
export const API_CONFIGURATIONS = [
    {
        type: 'openai',
        label: 'OpenAI',
        description: 'GPT models for advanced language tasks',
        docsUrl: "https://platform.openai.com/api-keys",
        docsText: "OpenAI dashboard",
        placeholder: "sk-..."
    },
    {
        type: 'gemini',
        label: 'Google Gemini',
        description: 'Google\'s latest AI model',
        docsUrl: "https://makersuite.google.com/app/apikey",
        docsText: "Google AI Studio",
        placeholder: "Enter Gemini API key"
    },
    {
        type: 'anthropic',
        label: 'Anthropic Claude',
        description: 'Advanced reasoning and analysis',
        docsUrl: "https://console.anthropic.com/account/keys",
        docsText: "Anthropic Console",
        placeholder: "sk-ant-..."
    },
    {
        type: 'huggingface',
        label: 'Hugging Face',
        description: 'Open-source AI models',
        docsUrl: "https://huggingface.co/settings/tokens",
        docsText: "Hugging Face settings",
        placeholder: "hf_..."
    }
];
export const VECTOR_DB_CONFIGURATIONS = [
    {
        type: 'pinecone',
        label: 'Pinecone',
        description: 'Vector database for embeddings and similarity search',
        docsUrl: "https://console.pinecone.io/organizations/-/apikeys",
        docsText: "Pinecone Console",
        placeholder: "Enter Pinecone API key"
    },
    {
        type: 'weaviate',
        label: 'Weaviate',
        description: 'Vector database with semantic search capabilities',
        docsUrl: "https://console.weaviate.cloud/dashboard",
        docsText: "Weaviate Cloud Console",
        placeholder: "Enter Weaviate API key"
    }
];

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export function VoiceSettings({ elevenLabsKey, onElevenLabsKeyChange, selectedVoice, onVoiceChange, }) {
    const voices = [
        { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
        { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
        { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
        { id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
        { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
        { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
        { id: "VR6AewLTigWG4xSOukaG", name: "Arnold" },
        { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
        { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam" },
    ];
    const handleSaveAPIKey = async (provider, value, name) => {
        if (!value || !name) {
            toast.error(`Please provide both API key and name for ${provider}`);
            return;
        }
        try {
            // First save the API configuration
            const apiType = provider.toLowerCase();
            const { data, error } = await supabase
                .from('api_configurations')
                .insert([{
                    api_type: apiType,
                    secret_key_name: `${provider.toUpperCase()}_API_KEY`,
                    memorable_name: name,
                    is_enabled: true,
                    validation_status: 'pending'
                }])
                .select()
                .single();
            if (error) {
                console.error(`Error saving ${provider} configuration:`, error);
                throw new Error(error.message || `Failed to save ${provider} API key`);
            }
            // Now save the actual API key securely using the edge function
            const { error: secretError } = await supabase.functions.invoke('manage-api-secret', {
                body: {
                    secretName: `${provider.toUpperCase()}_API_KEY`,
                    secretValue: value,
                    provider: apiType,
                    memorableName: name
                }
            });
            if (secretError) {
                throw new Error(secretError.message || `Failed to save ${provider} API key`);
            }
            if (provider === 'ElevenLabs') {
                onElevenLabsKeyChange(value);
            }
            toast.success(`${provider} API key saved successfully`);
        }
        catch (error) {
            console.error(`Error saving ${provider} key:`, error);
            toast.error(error instanceof Error ? error.message : `Failed to save ${provider} API key`);
        }
    };
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Tabs, { defaultValue: "elevenlabs", className: "space-y-4", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "elevenlabs", children: "ElevenLabs" }), _jsx(TabsTrigger, { value: "whisper", children: "OpenAI Whisper" })] }), _jsx(TabsContent, { value: "elevenlabs", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "ElevenLabs Voice API" }), _jsx(CardDescription, { children: "Configure ElevenLabs for text-to-speech capabilities." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "elevenlabs-name", children: "Configuration Name" }), _jsx(Input, { id: "elevenlabs-name", placeholder: "Enter a memorable name (e.g. elevenlabs_primary)", onChange: (e) => {
                                                    const name = e.target.value;
                                                    const key = document.getElementById('elevenlabs-key')?.value;
                                                    if (name && key) {
                                                        handleSaveAPIKey('ElevenLabs', key, name);
                                                    }
                                                } })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "elevenlabs-key", children: "API Key" }), _jsx(Input, { id: "elevenlabs-key", type: "password", placeholder: "Enter ElevenLabs API key", onChange: (e) => {
                                                    const key = e.target.value;
                                                    const name = document.getElementById('elevenlabs-name')?.value;
                                                    if (name && key) {
                                                        handleSaveAPIKey('ElevenLabs', key, name);
                                                    }
                                                } })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "voice-select", children: "Default Voice" }), _jsxs(Select, { value: selectedVoice, onValueChange: onVoiceChange, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select a voice" }) }), _jsx(SelectContent, { children: voices.map((voice) => (_jsx(SelectItem, { value: voice.id, children: voice.name }, voice.id))) })] })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Get your API key from the", " ", _jsx("a", { href: "https://elevenlabs.io/subscription", target: "_blank", rel: "noopener noreferrer", className: "text-primary hover:underline", children: "ElevenLabs dashboard" })] })] })] }) }), _jsx(TabsContent, { value: "whisper", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "OpenAI Whisper API" }), _jsx(CardDescription, { children: "Configure OpenAI Whisper for voice-to-text capabilities." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "whisper-name", children: "Configuration Name" }), _jsx(Input, { id: "whisper-name", placeholder: "Enter a memorable name (e.g. whisper_primary)", onChange: (e) => {
                                                    const name = e.target.value;
                                                    const key = document.getElementById('whisper-key')?.value;
                                                    if (name && key) {
                                                        handleSaveAPIKey('Whisper', key, name);
                                                    }
                                                } })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "whisper-key", children: "API Key" }), _jsx(Input, { id: "whisper-key", type: "password", placeholder: "Enter OpenAI API key", onChange: (e) => {
                                                    const key = e.target.value;
                                                    const name = document.getElementById('whisper-name')?.value;
                                                    if (name && key) {
                                                        handleSaveAPIKey('Whisper', key, name);
                                                    }
                                                } })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Get your API key from the", " ", _jsx("a", { href: "https://platform.openai.com/api-keys", target: "_blank", rel: "noopener noreferrer", className: "text-primary hover:underline", children: "OpenAI dashboard" })] })] })] }) })] }) }));
}

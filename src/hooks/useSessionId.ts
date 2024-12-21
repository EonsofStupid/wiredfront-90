export const useSessionId = () => {
  const [sessionId] = useState<string>(() => {
    const stored = localStorage.getItem('chat_session_id');
    if (stored) return stored;
    
    const newId = crypto.randomUUID();
    localStorage.setItem('chat_session_id', newId);
    return newId;
  });

  return sessionId;
};
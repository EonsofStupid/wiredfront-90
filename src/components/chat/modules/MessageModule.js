import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const MessageModule = ({ message, isLast, onRetry }) => {
    const [status, setStatus] = useState(message.message_status || 'sent');
    useEffect(() => {
        setStatus(message.message_status || 'sent');
    }, [message.message_status]);
    // Convert timestamp to Date object if needed
    const messageTimestamp = message.timestamp
        ? new Date(message.timestamp)
        : message.created_at
            ? new Date(message.created_at)
            : new Date();
    // Safe access to message status with proper type handling
    const messageStatus = message.message_status || 'sent';
    return (_jsxs("div", { children: [messageStatus && (_jsxs("div", { className: "message-status", children: ["Status: ", messageStatus] })), _jsx("div", { className: "message-timestamp", children: messageTimestamp.toLocaleTimeString() })] }));
};
export default MessageModule;

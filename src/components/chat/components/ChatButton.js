import { jsx as _jsx } from "react/jsx-runtime";
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from '../styles/ChatButton.module.css';
import { cn } from '@/lib/utils';
export const ChatButton = ({ position, scale, onClick, isPreview = false }) => {
    const containerClass = isPreview ? styles.previewButton : styles.chatButtonContainer;
    const buttonClass = cn(styles.chatButton, {
        [styles.bottomLeft]: position === 'bottom-left',
        [styles.bottomRight]: position === 'bottom-right'
    });
    return (_jsx("div", { className: containerClass, style: {
            transform: `scale(${scale})`,
            transformOrigin: position === 'bottom-left' ? 'left center' : 'right center'
        }, children: _jsx(Button, { onClick: onClick, className: buttonClass, size: scale < 0.75 ? 'sm' : scale > 1.25 ? 'lg' : 'default', variant: "default", children: _jsx(MessageSquare, { className: "h-5 w-5" }) }) }));
};

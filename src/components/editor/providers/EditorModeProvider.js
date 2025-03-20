import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const EditorModeContext = createContext(undefined);
export function EditorModeProvider({ children }) {
    const [currentFiles, setCurrentFiles] = useState({});
    const [activeFile, setActiveFile] = useState(null);
    return (_jsx(EditorModeContext.Provider, { value: {
            currentFiles,
            activeFile,
            setCurrentFiles,
            setActiveFile
        }, children: children }));
}
export function useEditorMode() {
    const context = useContext(EditorModeContext);
    if (context === undefined) {
        throw new Error('useEditorMode must be used within an EditorModeProvider');
    }
    return context;
}

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Github, FolderGit2, Key, Layout, Maximize2, Minimize2 } from 'lucide-react';
import '../styles/theme.css';

interface ExtendableTopNavProps {
  className?: string;
}

export const ExtendableTopNav: React.FC<ExtendableTopNavProps> = ({ className = '' }) => {
  const [isExtended, setIsExtended] = useState(true);
  const [iconOnly, setIconOnly] = useState(false);

  const toggleSlide = () => setIsExtended(prev => !prev);
  const toggleIconOnly = () => setIconOnly(prev => !prev);

  return (
    <nav 
      className={`documents-nav fixed top-0 left-0 w-full transition-transform duration-300 ease-in-out z-40
      ${isExtended ? 'translate-y-0' : '-translate-y-full'} ${className}`}
    >
      <div className="documents-glass rounded-b-lg shadow-lg px-3 py-2">
        <div className="flex justify-between items-center">
          {/* Left Side: GitHub Controls */}
          <div className="flex space-x-4 items-center">
            <button className="documents-text-neon documents-hover-neon p-2 rounded-lg transition-colors">
              <Github size={iconOnly ? 20 : 24} />
            </button>
            <button className="documents-text-neon documents-hover-neon p-2 rounded-lg transition-colors">
              <FolderGit2 size={iconOnly ? 20 : 24} />
            </button>
            <button className="documents-text-neon documents-hover-neon p-2 rounded-lg transition-colors">
              <Key size={iconOnly ? 20 : 24} />
            </button>
          </div>

          {/* Center: Navigation Tabs */}
          {!iconOnly && (
            <div className="flex space-x-6 items-center">
              <button className="text-white documents-hover-neon px-3 py-1 rounded-lg transition-colors">
                Files
              </button>
              <button className="text-white documents-hover-neon px-3 py-1 rounded-lg transition-colors">
                Images
              </button>
              <button className="text-white documents-hover-neon px-3 py-1 rounded-lg transition-colors">
                Projects
              </button>
            </div>
          )}

          {/* Right Side: Controls */}
          <div className="flex space-x-4 items-center">
            <button
              onClick={toggleIconOnly}
              className="text-white documents-hover-neon p-2 rounded-lg transition-colors"
              title={iconOnly ? "Show Labels" : "Hide Labels"}
            >
              {iconOnly ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
            </button>
            <button
              onClick={toggleSlide}
              className="text-white documents-hover-neon p-2 rounded-lg transition-colors"
              title={isExtended ? "Slide Up" : "Slide Down"}
            >
              {isExtended ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ExtendableTopNav;
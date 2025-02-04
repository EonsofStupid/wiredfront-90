import React from 'react';
import ExtendableTopNav from './components/ExtendableTopNav';
import './styles/theme.css';

export const DocumentsSection: React.FC = () => {
  return (
    <div className="documents-section">
      <ExtendableTopNav />
      {/* Additional documents components will be added here */}
    </div>
  );
};

export default DocumentsSection;
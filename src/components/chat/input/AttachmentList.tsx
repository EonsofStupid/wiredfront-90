import React from 'react';

interface AttachmentListProps {
  attachments: File[];
}

export const AttachmentList = ({ attachments }: AttachmentListProps) => {
  if (attachments.length === 0) return null;
  
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {attachments.map((file, index) => (
        <div key={index} className="text-sm">
          {file.name}
        </div>
      ))}
    </div>
  );
};
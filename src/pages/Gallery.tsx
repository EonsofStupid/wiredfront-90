
import React, { Suspense } from 'react';

const Gallery = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Image Gallery</h1>
      <Suspense fallback={<div>Loading gallery...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gallery images will be displayed here */}
        </div>
      </Suspense>
    </div>
  );
};

export default Gallery;

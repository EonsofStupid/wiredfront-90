
import React from 'react';

const Gallery = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 gradient-text">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Gallery items will go here */}
        <div className="glass-card p-4 border border-neon-blue/20 rounded-lg aspect-square flex items-center justify-center">
          <span className="text-neon-pink text-5xl">+</span>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

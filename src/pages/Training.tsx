
import React from 'react';

const Training = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 gradient-text">Training</h1>
      <div className="glass-card p-6 border border-neon-blue/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Learning Mode</h2>
        <p className="text-muted-foreground mb-6">
          Training mode helps you improve your coding skills with guided exercises.
          The AI will walk you through code challenges and provide feedback.
        </p>
        <button className="bg-neon-blue text-white px-4 py-2 rounded-lg hover:bg-neon-pink transition-colors">
          Start Learning
        </button>
      </div>
    </div>
  );
};

export default Training;

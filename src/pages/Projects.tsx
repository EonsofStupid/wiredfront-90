
import React from 'react';

const Projects = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 gradient-text">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project cards will go here */}
        <div className="glass-card p-4 border border-neon-blue/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">New Project</h2>
          <p className="text-muted-foreground mb-4">Start a new development project</p>
          <button className="text-neon-blue hover:text-neon-pink transition-colors">
            Create Project →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projects;

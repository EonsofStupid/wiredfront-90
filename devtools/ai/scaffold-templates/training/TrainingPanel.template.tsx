
/**
 * {{FeatureName}} Panel Template
 * 
 * This template is used to scaffold a new TrainingPanel component
 * for guided learning experiences.
 */

import React, { useState } from 'react';
import { use{{FeatureName}}TrackedAtoms } from '../hooks/use{{FeatureName}}TrackedAtoms';
import { use{{FeatureName}}Store } from '../store/{{featureName}}Store';

interface {{FeatureName}}PanelProps {
  title?: string;
  lessonId?: string;
}

export function {{FeatureName}}Panel({ 
  title = "{{FeatureName}}", 
  lessonId 
}: {{FeatureName}}PanelProps) {
  // Local state for the code editor
  const [code, setCode] = useState('');
  
  // Use tracked atoms for component-local state
  const {
    isVisible,
    setIsVisible,
    completedSteps,
    markStepComplete
  } = use{{FeatureName}}TrackedAtoms();
  
  // Use Zustand store for global state
  const { 
    currentLesson,
    lessonProgress,
    loadLesson,
    submitAnswer
  } = use{{FeatureName}}Store();
  
  // Load lesson if lessonId is provided
  React.useEffect(() => {
    if (lessonId) {
      loadLesson(lessonId);
    }
  }, [lessonId, loadLesson]);
  
  // Handle code submission
  const handleSubmit = () => {
    if (!code.trim() || !currentLesson) return;
    
    // Require minimum user input (60% of example solution length)
    const userInputPercentage = (code.length / (currentLesson.exampleSolution?.length || 1)) * 100;
    
    if (userInputPercentage < 60) {
      alert("Please try to write more of the solution yourself before submitting.");
      return;
    }
    
    submitAnswer(code);
    markStepComplete(currentLesson.currentStep);
  };
  
  if (!isVisible || !currentLesson) {
    return null;
  }
  
  return (
    <div className="flex flex-col w-full h-full bg-background border border-border rounded-md shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}: {currentLesson.title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Step {currentLesson.currentStep} of {currentLesson.totalSteps}
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-2 flex-1 overflow-hidden">
        {/* Instructions */}
        <div className="p-4 border-r overflow-y-auto">
          <h3 className="font-medium mb-2">{currentLesson.steps[currentLesson.currentStep - 1]?.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {currentLesson.steps[currentLesson.currentStep - 1]?.description}
          </p>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Steps:</h4>
            <ul className="space-y-1">
              {currentLesson.steps.map((step, index) => (
                <li 
                  key={index} 
                  className={`text-sm flex items-center gap-2 ${
                    completedSteps.includes(index + 1) 
                      ? 'text-success' 
                      : index + 1 === currentLesson.currentStep 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground'
                  }`}
                >
                  {completedSteps.includes(index + 1) && (
                    <span>✓</span>
                  )}
                  {index + 1}. {step.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Code Editor */}
        <div className="flex flex-col h-full">
          <div className="p-2 bg-muted text-sm">
            Write your solution:
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm bg-background border-0 resize-none focus:ring-0 focus:outline-none"
            placeholder="// Type your code here..."
          />
          <div className="p-3 border-t flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {code.length > 0 ? `${code.length} characters` : 'No code entered yet'}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-md hover:bg-primary/90"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

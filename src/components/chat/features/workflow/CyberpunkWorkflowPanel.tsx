
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Play, Pause, Clock, Trash2, Edit } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  schedule?: string;
  lastRun?: string;
  type: 'trigger' | 'scheduled';
}

const CyberpunkWorkflowPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');
  
  // Sample workflows - would come from a service in a real implementation
  const workflows: Workflow[] = [
    {
      id: 'w1',
      name: 'Daily Summary',
      description: 'Create a summary of all messages at the end of each day',
      isActive: true,
      schedule: 'Daily at 11:00 PM',
      lastRun: '2023-08-12T23:00:00Z',
      type: 'scheduled'
    },
    {
      id: 'w2',
      name: 'GitHub PR Notification',
      description: 'Alert when new PRs are opened in the repository',
      isActive: true,
      lastRun: '2023-08-13T14:30:00Z',
      type: 'trigger'
    },
    {
      id: 'w3',
      name: 'Weekly Report',
      description: 'Generate a weekly project progress report',
      isActive: false,
      schedule: 'Every Friday at 5:00 PM',
      type: 'scheduled'
    }
  ];
  
  // Filter workflows based on active tab
  const filteredWorkflows = workflows.filter(workflow => 
    activeTab === 'all' || workflow.isActive
  );

  return (
    <div className="chat-cyberpunk-workflow-panel">
      <div className="chat-cyberpunk-workflow-header">
        <div className="chat-cyberpunk-workflow-tabs">
          <Button
            variant={activeTab === 'active' ? 'default' : 'ghost'}
            size="sm"
            className="chat-cyberpunk-workflow-tab"
            onClick={() => setActiveTab('active')}
          >
            Active
          </Button>
          
          <Button
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            size="sm"
            className="chat-cyberpunk-workflow-tab"
            onClick={() => setActiveTab('all')}
          >
            All
          </Button>
        </div>
        
        <Button size="sm" className="chat-cyberpunk-workflow-add">
          <Plus className="h-3 w-3 mr-1" />
          New Workflow
        </Button>
      </div>
      
      <div className="chat-cyberpunk-workflow-list">
        {filteredWorkflows.length === 0 ? (
          <div className="chat-cyberpunk-workflow-empty">
            No workflows found. Create a new workflow to get started.
          </div>
        ) : (
          filteredWorkflows.map(workflow => (
            <div key={workflow.id} className="chat-cyberpunk-workflow-item">
              <div className="chat-cyberpunk-workflow-item-header">
                <div className="chat-cyberpunk-workflow-item-name-row">
                  <h4 className="chat-cyberpunk-workflow-item-name">{workflow.name}</h4>
                  <Switch checked={workflow.isActive} />
                </div>
                
                <div className="chat-cyberpunk-workflow-item-badges">
                  <span className={`chat-cyberpunk-workflow-item-type ${workflow.type}`}>
                    {workflow.type}
                  </span>
                  
                  {workflow.schedule && (
                    <span className="chat-cyberpunk-workflow-item-schedule">
                      <Clock className="h-3 w-3 mr-1" />
                      {workflow.schedule}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="chat-cyberpunk-workflow-item-description">
                {workflow.description}
              </p>
              
              <div className="chat-cyberpunk-workflow-item-footer">
                {workflow.lastRun && (
                  <span className="chat-cyberpunk-workflow-item-last-run">
                    Last run: {new Date(workflow.lastRun).toLocaleString()}
                  </span>
                )}
                
                <div className="chat-cyberpunk-workflow-item-actions">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="chat-cyberpunk-workflow-item-action"
                  >
                    {workflow.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="chat-cyberpunk-workflow-item-action"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="chat-cyberpunk-workflow-item-action text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CyberpunkWorkflowPanel;


import React, { useState } from 'react';
import { ConversationItem } from './ConversationItem';
import { useConversationStore } from '../../store/conversation/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ConversationListProps {
  onSelect: (id: string) => void;
}

export function ConversationList({ onSelect }: ConversationListProps) {
  const { 
    conversations, 
    currentConversationId, 
    updateConversation, 
    archiveConversation,
    deleteConversation 
  } = useConversationStore();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  // Handle edit conversation title
  const handleEdit = (id: string, title: string) => {
    setCurrentEditId(id);
    setEditTitle(title);
    setEditDialogOpen(true);
  };
  
  const handleSaveEdit = async () => {
    if (currentEditId && editTitle.trim()) {
      const success = await updateConversation(currentEditId, { title: editTitle });
      if (success) {
        toast.success('Conversation renamed');
        setEditDialogOpen(false);
      } else {
        toast.error('Failed to rename conversation');
      }
    }
  };
  
  // Handle delete conversation
  const handleOpenDeleteDialog = (id: string) => {
    setCurrentDeleteId(id);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (currentDeleteId) {
      const success = deleteConversation(currentDeleteId);
      if (success) {
        toast.success('Conversation deleted');
        setDeleteDialogOpen(false);
      } else {
        toast.error('Failed to delete conversation');
      }
    }
  };
  
  // Handle archive conversation
  const handleArchive = (id: string) => {
    const success = archiveConversation(id);
    if (success) {
      toast.success('Conversation archived');
    } else {
      toast.error('Failed to archive conversation');
    }
  };
  
  return (
    <>
      <div className="space-y-2 p-3">
        {conversations.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              id={conversation.id}
              title={conversation.title}
              date={new Date(conversation.last_accessed)}
              isActive={conversation.id === currentConversationId}
              onClick={() => onSelect(conversation.id)}
              onEdit={() => handleEdit(conversation.id, conversation.title)}
              onArchive={() => handleArchive(conversation.id)}
              onDelete={() => handleOpenDeleteDialog(conversation.id)}
            />
          ))
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
          </DialogHeader>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Enter new title"
            className="mt-4"
            autoFocus
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this conversation? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

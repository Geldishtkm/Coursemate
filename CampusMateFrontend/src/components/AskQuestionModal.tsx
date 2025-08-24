import React, { useState } from 'react';
import { X, Send, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useQueries } from '../hooks/useApi';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'physics', label: 'Physics' },
  { value: 'business', label: 'Business' },
  { value: 'general', label: 'General' }
];

export function AskQuestionModal({ isOpen, onClose }: AskQuestionModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { create: createQuery, getAll: getAllQueries } = useQueries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newQuery = {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags.length > 0 ? tags : undefined
      };

      await createQuery.execute(newQuery);
      
      // Reset form
      setTitle('');
      setContent('');
      setCategory('');
      setTags([]);
      
      // Refresh queries data
      await getAllQueries.execute();
      
      // Close modal
      onClose();
      
      // Show success message
      alert('Question posted successfully!');
      
    } catch (error) {
      console.error('Error posting question:', error);
      if (error instanceof Error) {
        alert(`Failed to post question: ${error.message}`);
      } else {
        alert('Failed to post question. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ask a Question</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-gray-600 mb-6">
          Post your question to get help from our community. Be specific and include relevant details to get the best possible answers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Question Title *</Label>
            <Input
              id="title"
              placeholder="e.g., How to implement binary search in Java?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              required
            />
            <p className="text-sm text-gray-500">
              Be specific and concise. A good title helps others understand your question quickly.
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Select Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Description */}
          <div className="space-y-2">
            <Label htmlFor="content">Question Description *</Label>
            <Textarea
              id="content"
              placeholder="Describe your question in detail. Include code examples, error messages, or any relevant context that will help others understand and answer your question effectively."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[120px]"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags like 'Java', 'Algorithms', 'CS101'"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Display existing tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500">
              Tags help others find your question. Press Enter or click + to add a tag.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                'Posting...'
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Post Question
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

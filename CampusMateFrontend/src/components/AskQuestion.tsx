import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  HelpCircle, 
  BookOpen, 
  Code, 
  Calculator, 
  Atom, 
  Globe, 
  Send,
  Plus,
  X
} from "lucide-react";
import { queryAPI } from '../lib/api';

interface QuestionFormData {
  title: string;
  category: string;
  description: string;
  tags: string[];
}

export function AskQuestion() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuestionFormData>({
    title: '',
    category: '',
    description: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  const categories = [
    { value: 'computer-science', label: 'Computer Science', icon: Code, color: 'bg-blue-100 text-blue-800' },
    { value: 'mathematics', label: 'Mathematics', icon: Calculator, color: 'bg-green-100 text-green-800' },
    { value: 'physics', label: 'Physics', icon: Atom, color: 'bg-purple-100 text-purple-800' },
    { value: 'business', label: 'Business', icon: Globe, color: 'bg-orange-100 text-orange-800' },
    { value: 'general', label: 'General', icon: HelpCircle, color: 'bg-gray-100 text-gray-800' }
  ];

  const handleInputChange = (field: keyof QuestionFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the actual API
      const response = await queryAPI.create({
        title: formData.title,
        content: formData.description, // Note: backend expects 'content' not 'description'
        category: formData.category,
        tags: formData.tags
      });
      
      toast({
        title: "Question Posted!",
        description: `Your question "${formData.title}" has been posted successfully`,
      });

      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        tags: []
      });

    } catch (error) {
      toast({
        title: "Post Failed",
        description: "There was an error posting your question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <HelpCircle className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
            <p className="text-lg text-gray-600">Get help from tutors and fellow students</p>
          </div>
        </div>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Post your question to get help from our community. Be specific and include relevant details 
          to get the best possible answers.
        </p>
      </div>

      {/* Question Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Post Your Question</span>
          </CardTitle>
          <CardDescription>
            Fill in the details below to post your question to the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Question Title *</Label>
              <Input
                id="title"
                placeholder="e.g., How to implement binary search in Java?"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="text-lg"
              />
              <p className="text-sm text-gray-500">
                Be specific and concise. A good title helps others understand your question quickly.
              </p>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <Label>Select Category *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.category === category.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('category', category.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${category.color}`}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{category.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              {formData.category && selectedCategory && (
                <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg">
                  <selectedCategory.icon className="h-5 w-5 text-primary" />
                  <span className="text-primary font-medium">
                    Selected: {selectedCategory.label}
                  </span>
                </div>
              )}
            </div>

            {/* Question Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Question Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your question in detail... Include any relevant code, error messages, or context that would help others understand and answer your question."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                rows={8}
                className="text-base"
              />
              <p className="text-sm text-gray-500">
                Provide enough detail for others to understand your problem. Include code snippets, 
                error messages, or any relevant context.
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags (Optional)</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a tag (e.g., java, algorithms, debugging)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Tags help categorize your question and make it easier for others to find and answer.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" size="lg">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? (
                  <>
                    <Send className="h-4 w-4 mr-2 animate-pulse" />
                    Posting Question...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Question
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Tips for Better Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <p><strong>• Be Specific:</strong> Include relevant details and context</p>
              <p><strong>• Show Your Work:</strong> Share what you've tried so far</p>
              <p><strong>• Use Clear Language:</strong> Write in a way others can understand</p>
            </div>
            <div className="space-y-2">
              <p><strong>• Include Code:</strong> Share relevant code snippets</p>
              <p><strong>• Mention Errors:</strong> Include any error messages you're seeing</p>
              <p><strong>• Be Patient:</strong> Give others time to respond</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

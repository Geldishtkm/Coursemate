import React, { useState } from 'react';
import { X, BookOpen, User, Calendar, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import { courseAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: () => void;
}

export function CreateCourseModal({ isOpen, onClose, onCourseCreated }: CreateCourseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    professorName: '',
    semester: 'Fall 2024',
    subjectName: 'Computer Science',
    description: '',
    year: '2024',
    difficultyLevel: 'BEGINNER',
    credits: 3,
    maxStudents: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const subjects = [
    'Computer Science',
    'Mathematics', 
    'Physics',
    'Business',
    'Engineering',
    'Arts',
    'Literature',
    'History'
  ];

  const semesters = [
    'Fall 2024',
    'Spring 2025',
    'Summer 2025',
    'Fall 2025'
  ];

  const difficultyLevels = [
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.code.trim() || !formData.professorName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to create courses",
          variant: "destructive",
        });
        return;
      }

      // Create payload compatible with backend
      const payload = {
        code: formData.code,
        title: formData.title,
        description: formData.description,
        subjectName: formData.subjectName,
        professorName: formData.professorName,
        semester: formData.semester,
        year: formData.year,
        credits: formData.credits,
        maxStudents: formData.maxStudents,
        difficultyLevel: formData.difficultyLevel,
      } as any;

      // Use centralized API client with authentication
      const result = await courseAPI.create(payload, token);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Course created successfully",
        });
        onCourseCreated();
        onClose();
        setFormData({
          title: '',
          code: '',
          professorName: '',
          semester: 'Fall 2024',
          subjectName: 'Computer Science',
          description: '',
          year: '2024',
          difficultyLevel: 'BEGINNER',
          credits: 3,
          maxStudents: 50
        });
      } else {
        throw new Error(result.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <Input
              id="title"
              placeholder="e.g., Data Structures & Algorithms"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          {/* Course Code and Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Course Code *
              </label>
              <Input
                id="code"
                placeholder="e.g., CS301"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
                          <Select value={formData.subjectName} onValueChange={(value) => handleInputChange('subjectName', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
          </div>

          {/* Professor and Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="professor" className="block text-sm font-medium text-gray-700 mb-2">
                Professor *
              </label>
              <Input
                id="professor"
                placeholder="e.g., Dr. Nagy László"
                value={formData.professorName}
                onChange={(e) => handleInputChange('professorName', e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                Semester *
              </label>
              <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Brief description of the course content and objectives..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Difficulty Level and Credits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level *
              </label>
              <Select value={formData.difficultyLevel} onValueChange={(value) => handleInputChange('difficultyLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
                Credits
              </label>
              <Input
                id="credits"
                type="number"
                placeholder="3"
                value={formData.credits}
                onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 3)}
                min="1"
                max="6"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
                'Creating...'
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  Create Course
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

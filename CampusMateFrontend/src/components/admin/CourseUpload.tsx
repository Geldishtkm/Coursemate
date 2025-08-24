import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Users, 
  Calendar,
  Plus,
  X
} from "lucide-react";
import { courseAPI } from '../../lib/api';

interface CourseFormData {
  code: string;
  title: string;
  description: string;
  subjectId: string;
  professorName: string;
  semester: string;
  year: string;
  credits: number;
  maxStudents: number;
  difficultyLevel: string;
  topics: string[];
  prerequisites: string[];
  resources: CourseResource[];
}

interface CourseResource {
  type: 'document' | 'video' | 'link' | 'assignment';
  title: string;
  description: string;
  url?: string;
  fileType?: string;
}

export function CourseUpload() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    code: '',
    title: '',
    description: '',
    subjectId: '',
    professorName: '',
    semester: '',
    year: '',
    credits: 0,
    maxStudents: 0,
    difficultyLevel: '',
    topics: [],
    prerequisites: [],
    resources: []
  });
  const [newTopic, setNewTopic] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newResource, setNewResource] = useState<CourseResource>({
    type: 'document',
    title: '',
    description: '',
    url: '',
    fileType: ''
  });

  // Simple subject input - no backend subjects needed
  const [subjectName, setSubjectName] = useState('');



  const semesters = ['Fall', 'Spring', 'Summer'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleInputChange = (field: keyof CourseFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t !== topic)
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prereq: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prereq)
    }));
  };

  const addResource = () => {
    if (newResource.title.trim() && newResource.description.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, { ...newResource }]
      }));
      setNewResource({
        type: 'document',
        title: '',
        description: '',
        url: '',
        fileType: ''
      });
    }
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.title || !subjectName.trim() || !formData.professorName || !formData.difficultyLevel) {
      toast({
        title: "Validation Error",
        description: "Please fill in the required fields: Course Code, Title, Subject, Professor Name, and Difficulty Level",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Call the real API
      const payload = {
        code: formData.code,
        title: formData.title,
        description: formData.description,
        subjectName: subjectName.trim(),
        professorName: formData.professorName,
        semester: formData.semester,
        year: formData.year,
        credits: formData.credits,
        maxStudents: formData.maxStudents,
        difficultyLevel: formData.difficultyLevel,
        topics: formData.topics,
        prerequisites: formData.prerequisites,
        resources: formData.resources.map(resource => ({
          type: resource.type,
          title: resource.title,
          description: resource.description,
          url: resource.url,
          fileType: resource.fileType
        })),
      } as any;

      const result = await courseAPI.create(payload);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: `Course "${formData.title}" has been created successfully`,
        });
      } else {
        throw new Error(result.message || 'Failed to create course');
      }

      // Reset form
      setFormData({
        code: '',
        title: '',
        description: '',
        subjectId: '',
        professorName: '',
        semester: '',
        year: '',
        credits: 0,
        maxStudents: 0,
        difficultyLevel: '',
        topics: [],
        prerequisites: [],
        resources: []
      });
      setSubjectName(''); // Reset subject input

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the course. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload New Course</span>
          </CardTitle>
          <CardDescription>
            Fill in the course details below. The course will be immediately available to students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., CS301"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Data Structures & Algorithms"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
            </div>

                         <div className="space-y-2">
               <Label htmlFor="description">Course Description (Optional)</Label>
               <Textarea
                 id="description"
                 placeholder="Provide a comprehensive description of the course..."
                 value={formData.description}
                 onChange={(e) => handleInputChange('description', e.target.value)}
                 rows={4}
               />
             </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                           <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Computer Science, Mathematics, Physics"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                  />
                </div>

              <div className="space-y-2">
                <Label htmlFor="professor">Professor Name *</Label>
                <Input
                  id="professor"
                  placeholder="e.g., Dr. John Smith"
                  value={formData.professorName}
                  onChange={(e) => handleInputChange('professorName', e.target.value)}
                  required
                />
              </div>

                             <div className="space-y-2">
                 <Label htmlFor="credits">Credits (Optional)</Label>
                 <Input
                   id="credits"
                   type="number"
                   min="1"
                   max="12"
                   placeholder="3"
                   value={formData.credits}
                   onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 0)}
                 />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level *</Label>
                <Select value={formData.difficultyLevel} onValueChange={(value) => handleInputChange('difficultyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                             <div className="space-y-2">
                 <Label htmlFor="semester">Semester (Optional)</Label>
                 <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                   <SelectTrigger>
                     <SelectValue placeholder="Fall 2024" />
                   </SelectTrigger>
                   <SelectContent>
                     {semesters.map(sem => (
                       <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               <div className="space-y-2">
                 <Label htmlFor="year">Year Level (Optional)</Label>
                 <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                   <SelectTrigger>
                     <SelectValue placeholder="2024" />
                   </SelectTrigger>
                   <SelectContent>
                     {years.map(year => (
                       <SelectItem key={year} value={year}>{year}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                 <Label htmlFor="maxStudents">Max Students (Optional)</Label>
                 <Input
                   id="maxStudents"
                   type="number"
                   min="1"
                   placeholder="50"
                   value={formData.maxStudents}
                   onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 0)}
                 />
               </div>
            </div>



            {/* Topics */}
            <div className="space-y-3">
              <Label>Course Topics (Optional)</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a topic (e.g., Arrays & Linked Lists)"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                />
                <Button type="button" onClick={addTopic} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{topic}</span>
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Prerequisites */}
            <div className="space-y-3">
              <Label>Prerequisites (Optional)</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a prerequisite (e.g., CS201 - Programming Fundamentals)"
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                />
                <Button type="button" onClick={addPrerequisite} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.prerequisites.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="outline" className="flex items-center space-x-1">
                      <span>{prereq}</span>
                      <button
                        type="button"
                        onClick={() => removePrerequisite(prereq)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Course Resources */}
            <div className="space-y-3">
              <Label>Course Resources (Optional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <Label htmlFor="resourceType">Resource Type</Label>
                  <Select 
                    value={newResource.type} 
                    onValueChange={(value: 'document' | 'video' | 'link' | 'assignment') => 
                      setNewResource(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resourceTitle">Title *</Label>
                  <Input
                    id="resourceTitle"
                    placeholder="e.g., Course Syllabus"
                    value={newResource.title}
                    onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="resourceDescription">Description *</Label>
                  <Input
                    id="resourceDescription"
                    placeholder="Brief description of the resource..."
                    value={newResource.description}
                    onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resourceUrl">URL/Link</Label>
                  <Input
                    id="resourceUrl"
                    placeholder="https://example.com/resource"
                    value={newResource.url}
                    onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resourceFileType">File Type</Label>
                  <Input
                    id="resourceFileType"
                    placeholder="PDF, DOCX, MP4, etc."
                    value={newResource.fileType}
                    onChange={(e) => setNewResource(prev => ({ ...prev, fileType: e.target.value }))}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Button type="button" onClick={addResource} size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </div>
              </div>
              
              {/* Display Added Resources */}
              {formData.resources.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Resources:</Label>
                  <div className="space-y-2">
                    {formData.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">{resource.type}</Badge>
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                            {resource.url && (
                              <p className="text-xs text-blue-600">{resource.url}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeResource(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Course
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Upload Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Upload Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <span><strong>Course Code:</strong> Use standard format (e.g., CS301, MATH201)</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span><strong>Title:</strong> Be descriptive and clear about the course content</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <span><strong>Description:</strong> Include learning objectives and outcomes</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <span><strong>Topics:</strong> List main concepts covered in the course</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <span><strong>Prerequisites:</strong> Specify what students need to know before taking this course</span>
            </div>
          </div>
                 </CardContent>
       </Card>

       
     </div>
   );
 }

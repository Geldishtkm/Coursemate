import React, { useState, useEffect } from 'react';
import { X, BookOpen, Video, FileText, Code, Upload, Download, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

interface CourseMaterial {
  id: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'DOCUMENT' | 'CODE' | 'OTHER';
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
}

interface Course {
  id: string;
  title: string;
  code: string;
  professor: string;
  semester: string;
  subject: string;
  description: string;
}

interface CourseMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export function CourseMaterialsModal({ isOpen, onClose, course }: CourseMaterialsModalProps) {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    type: 'DOCUMENT' as const,
    file: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { role } = useUserRole();

  const isAdmin = role === 'ADMIN' || role === 'TUTOR';

  useEffect(() => {
    if (isOpen && course) {
      fetchMaterials();
    }
  }, [isOpen, course]);

  const fetchMaterials = async () => {
    if (!course) return;
    
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/courses/${course.id}/materials`);
      if (response.ok) {
        const data = await response.json();
        setMaterials(data.data || []);
      } else {
        console.log('No materials found or error fetching');
        setMaterials([]);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewMaterial(prev => ({ ...prev, file }));
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMaterial.title.trim() || (!newMaterial.description && !newMaterial.file)) {
      toast({
        title: "Validation Error",
        description: "Please fill in title and either description or select a file",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      // For text materials, send as JSON
      const materialData = {
        title: newMaterial.title,
        description: newMaterial.description,
        type: newMaterial.type,
        fileName: newMaterial.file?.name || `${newMaterial.title}.txt`,
        content: newMaterial.description // Use description as content for text materials
      };

      const response = await fetch(`${API_URL}/courses/${course?.id}/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Material added successfully",
        });
        setNewMaterial({
          title: '',
          description: '',
          type: 'DOCUMENT',
          file: null
        });
        setShowAddForm(false);
        fetchMaterials();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add material');
      }
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/courses/${course?.id}/materials/${materialId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Material deleted successfully",
        });
        fetchMaterials();
      } else {
        throw new Error('Failed to delete material');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: "Error",
        description: "Failed to delete material. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-5 w-5 text-red-500" />;
      case 'DOCUMENT': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'CODE': return <Code className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMaterialTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'Video';
      case 'DOCUMENT': return 'Document';
      case 'CODE': return 'Code';
      default: return 'Other';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Course Materials</h2>
            <p className="text-gray-600">{course.title} ({course.code})</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Course Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Professor:</span>
                <p className="text-gray-900">{course.professor}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Semester:</span>
                <p className="text-gray-900">{course.semester}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Subject:</span>
                <p className="text-gray-900">{course.subject}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Materials:</span>
                <p className="text-gray-900">{materials.length} files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mb-6">
            {!showAddForm ? (
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Material
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Material</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddMaterial} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <Input
                          id="title"
                          placeholder="Material title"
                          value={newMaterial.title}
                          onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                          Type *
                        </label>
                        <Select 
                          value={newMaterial.type} 
                          onValueChange={(value: any) => setNewMaterial(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VIDEO">Video</SelectItem>
                            <SelectItem value="DOCUMENT">Document</SelectItem>
                            <SelectItem value="CODE">Code</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Optional description"
                        value={newMaterial.description}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                    </div>

                    <div>
                      <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                        File *
                      </label>
                      <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
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
                          'Uploading...'
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Upload Material
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Materials List */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Materials ({materials.length})
          </h3>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading materials...
            </div>
          ) : materials.length > 0 ? (
            <div className="space-y-3">
              {materials.map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getMaterialIcon(material.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {material.title}
                          </h4>
                          {material.description && (
                            <p className="text-sm text-gray-600 truncate">
                              {material.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>{material.fileName}</span>
                            <span>{formatFileSize(material.fileSize)}</span>
                            <span>Uploaded {formatDate(material.uploadedAt)}</span>
                            <span>by {material.uploadedBy}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getMaterialTypeLabel(material.type)}
                        </Badge>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {/* TODO: Implement download */}}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteMaterial(material.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials yet</h3>
              <p className="text-gray-500">
                {isAdmin 
                  ? "Upload the first material to get started"
                  : "Materials will appear here once they're uploaded"
                }
              </p>
              {isAdmin && (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add First Material
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

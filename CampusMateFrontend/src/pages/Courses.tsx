import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Trash2, Edit, BookOpen, Users, Calendar, GraduationCap, Search, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CourseMaterialsModal } from '@/components/CourseMaterialsModal';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  maxStudents: number;
  currentStudents?: number;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  semester: string;
  year: string;
  isActive: boolean;
  professor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  materials?: any[];
  createdAt: string;
}

const Courses = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCourses(result.data || []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch courses',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Admin Functions
  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setCourses(courses.filter(c => c.id !== courseId));
          toast({
            title: 'Success',
            description: 'Course deleted successfully',
          });
        } else {
          const errorData = await response.json();
          toast({
            title: 'Error',
            description: errorData.message || 'Failed to delete course',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete course',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEditCourse = (courseId: string) => {
    // For now, show a message that edit functionality is coming soon
    toast({
      title: 'Edit Course',
      description: 'Edit functionality will be available soon',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyProgress = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 33;
      case 'INTERMEDIATE': return 66;
      case 'ADVANCED': return 100;
      default: return 0;
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDifficulty = selectedDifficulty === '' || (course.difficultyLevel && course.difficultyLevel === selectedDifficulty);
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
            {user && user.role === 'ADMIN' && (
              <Button onClick={() => navigate('/admin')} className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Course
              </Button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Difficulties</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedDifficulty 
                      ? "Try adjusting your search criteria" 
                      : "Courses will appear here once they're created"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredCourses.map(course => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                      <p className="text-sm text-gray-600 font-mono">{course.code}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(course.difficultyLevel || 'MEDIUM')}
                    >
                                              {course.difficultyLevel || 'MEDIUM'}
                    </Badge>
                  </div>
                  
                  {/* Difficulty Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Difficulty Level</span>
                      <span>{course.difficultyLevel || 'MEDIUM'}</span>
                    </div>
                    <Progress 
                                              value={getDifficultyProgress(course.difficultyLevel || 'MEDIUM')} 
                      className="h-2"
                    />
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{course.description}</p>
                  
                  {/* Course Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                                              <span>Prof. {course.professor ? `${course.professor.firstName} ${course.professor.lastName}` : 'TBA'}</span>
                    </div>
                                         <div className="flex items-center gap-2 text-sm text-gray-600">
                       <Calendar className="h-4 w-4" />
                       <span>{course.semester || 'TBA'} {course.year || 'TBA'}</span>
                     </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{course.currentStudents || 0}/{course.maxStudents} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                                              <span>{course.credits || 3} credits</span>
                    </div>
                  </div>

                  {/* Subject Info */}
                  {course.subject && (
                    <div className="mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {course.subject.name} ({course.subject.code})
                      </Badge>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    {/* Main Action */}
                    <Button 
                      className="w-full"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowMaterialsModal(true);
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Access Materials
                    </Button>

                    {/* Admin Controls */}
                    {user && user.role === 'ADMIN' && (
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCourse(course.id)}
                          className="flex-1 flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3 pt-3 border-t">
                    <Badge 
                      variant={course.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Course Materials Modal */}
      <CourseMaterialsModal 
        isOpen={showMaterialsModal}
        onClose={() => {
          setShowMaterialsModal(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
      />
    </div>
  );
};

export default Courses;

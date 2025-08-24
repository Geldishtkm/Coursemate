import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2, Edit, Users, Calendar, GitBranch, Clock, Search, Plus, User, X, Bell, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectJoinRequestsModal } from '@/components/ProjectJoinRequestsModal';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  maxMembers: number;
  currentMembers: number;
  progress: number;
  deadline: string;
  skillsRequired: string[];
  leaderId: string;
  leaderEmail: string;
  leaderFirstName: string;
  leaderLastName: string;
  courseId?: string;
  courseName?: string;
  createdAt: string;
}

const Projects = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinRequestsModal, setShowJoinRequestsModal] = useState(false);
  const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setProjects(result.data || []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch projects',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Admin Functions
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setProjects(projects.filter(p => p.id !== projectId));
          toast({
            title: 'Success',
            description: 'Project deleted successfully',
          });
        } else {
          const errorData = await response.json();
          toast({
            title: 'Error',
            description: errorData.message || 'Failed to delete project',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete project',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEditProject = (projectId: string) => {
    // For now, show a message that edit functionality is coming soon
    toast({
      title: 'Edit Project',
      description: 'Edit functionality will be available soon',
    });
  };

  const handleRequestToJoin = async (projectId: string) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectId,
          message: "I would like to join this project"
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Join request sent successfully',
        });
        // Refresh projects to update status
        fetchProjects();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to send join request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      toast({
        title: 'Error',
        description: 'Failed to send join request',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'text-red-600';
    if (progress < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const isProjectLeader = (project: Project) => {
    return user && project.leaderId === user.id;
  };

  const canRequestToJoin = (project: Project) => {
    return user && 
           !isProjectLeader(project) && 
           project.currentMembers < project.maxMembers &&
           project.status !== 'COMPLETED';
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Project Collaboration</h1>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowMyRequestsModal(true)} 
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                My Requests
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowJoinRequestsModal(true)} 
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Join Requests
              </Button>
              <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Project
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedStatus 
                      ? "Try adjusting your search criteria" 
                      : "Be the first to create a project!"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredProjects.map(project => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg leading-6">{project.title}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(project.status)}
                    >
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="text-xs w-fit">
                    {project.category}
                  </Badge>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{project.description}</p>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className={`font-semibold ${getProgressColor(project.progress)}`}>
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Project Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>Led by {project.leaderFirstName} {project.leaderLastName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{project.currentMembers}/{project.maxMembers} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                    {project.courseName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Course: {project.courseName}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills Required */}
                  {project.skillsRequired && project.skillsRequired.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Skills Required:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.skillsRequired.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {project.skillsRequired.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.skillsRequired.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    {/* Main Action */}
                    {isProjectLeader(project) ? (
                      <Button 
                        className="w-full"
                        onClick={() => toast({
                          title: 'Manage Project',
                          description: 'Project management features will be available soon',
                        })}
                      >
                        <GitBranch className="h-4 w-4 mr-2" />
                        Manage Project
                      </Button>
                    ) : canRequestToJoin(project) ? (
                      <Button 
                        className="w-full"
                        onClick={() => handleRequestToJoin(project.id)}
                        variant="outline"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Request to Join
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => toast({
                          title: 'View Project',
                          description: 'Project details view will be available soon',
                        })}
                        variant="outline"
                      >
                        <GitBranch className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                    )}

                    {/* Admin Controls */}
                    {user && user.role === 'ADMIN' && (
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project.id)}
                          className="flex-1 flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Team Members Preview */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Team</span>
                      <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">
                            {project.leaderFirstName[0]}{project.leaderLastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {Array.from({ length: Math.min(project.currentMembers - 1, 3) }).map((_, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-gray-200">
                              +
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.currentMembers > 4 && (
                          <Avatar className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-gray-300">
                              +{project.currentMembers - 4}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CreateProjectForm 
              onClose={() => setShowCreateModal(false)}
              onProjectCreated={() => {
                setShowCreateModal(false);
                fetchProjects();
              }}
            />
          </div>
        </div>
      )}

      {/* Join Requests Modals */}
      <ProjectJoinRequestsModal 
        isOpen={showJoinRequestsModal}
        onClose={() => setShowJoinRequestsModal(false)}
        showMyRequests={false}
      />
      
      <ProjectJoinRequestsModal 
        isOpen={showMyRequestsModal}
        onClose={() => setShowMyRequestsModal(false)}
        showMyRequests={true}
      />
    </div>
  );
};

// Simple Create Project Form Component
const CreateProjectForm = ({ onClose, onProjectCreated }: { onClose: () => void; onProjectCreated: () => void }) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    maxMembers: 5,
    deadline: '',
    skillsRequired: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const categories = [
    'Web Development',
    'Mobile Development', 
    'Data Science',
    'AI/Machine Learning',
    'Design',
    'Research',
    'Other'
  ];

  const addSkill = () => {
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.deadline) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          spots: formData.maxMembers,
          deadline: formData.deadline,
          skillsRequired: formData.skillsRequired,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Project created successfully",
        });
        onProjectCreated();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to create project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Project Title *
        </label>
        <Input
          id="title"
          placeholder="e.g., Student Portal App"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <Textarea
          id="description"
          placeholder="Describe your project goals and requirements..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          required
        />
      </div>

      {/* Category and Max Members */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 mb-2">
            Max Members
          </label>
          <Input
            id="maxMembers"
            type="number"
            min="2"
            max="20"
            value={formData.maxMembers}
            onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 5 }))}
          />
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
          Deadline *
        </label>
        <Input
          id="deadline"
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
          required
        />
      </div>

      {/* Skills Required */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills Required
        </label>
        <div className="flex space-x-2 mb-2">
          <Input
            placeholder="Add a skill (e.g., React, Python)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" onClick={addSkill} size="sm">
            Add
          </Button>
        </div>
        {formData.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.skillsRequired.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
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
              <GitBranch className="h-4 w-4" />
              Create Project
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default Projects;

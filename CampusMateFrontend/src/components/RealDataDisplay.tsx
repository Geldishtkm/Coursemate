import React, { useEffect, useState } from 'react';
import { useAuth, useCourses, useUsers, useProjects, useSubjects, useQueries } from '../hooks/useApi';
import { User, Course, Project, Subject, Query } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  FolderOpen, 
  Info, 
  MessageSquare, 
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { AskQuestionModal } from './AskQuestionModal';
import { QuestionDetailModal } from './QuestionDetailModal';

export function RealDataDisplay() {
  const auth = useAuth();
  const courses = useCourses();
  const users = useUsers();
  const projects = useProjects();
  const subjects = useSubjects();
  const queries = useQueries();
  const [isAskQuestionModalOpen, setIsAskQuestionModalOpen] = useState(false);
  const [isQuestionDetailModalOpen, setIsQuestionDetailModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Query | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    spots: '',
    description: ''
  });

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Debug logging for queries data
  useEffect(() => {
    if (queries.getAll.data) {
      console.log('Queries data updated:', queries.getAll.data);
      console.log('Queries data type:', typeof queries.getAll.data);
      console.log('Is array:', Array.isArray(queries.getAll.data));
      if (Array.isArray(queries.getAll.data)) {
        console.log('Queries count:', queries.getAll.data.length);
      }
    }
  }, [queries.getAll.data]);

  const loadAllData = () => {
    courses.getAll.execute();
    users.getAll.execute();
    projects.getAll.execute();
    subjects.getAll.execute();
    queries.getAll.execute();
  };

  const refreshData = () => {
    loadAllData();
  };

  const openQuestionDetail = (question: Query) => {
    setSelectedQuestion(question);
    setIsQuestionDetailModalOpen(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectForm.title || !projectForm.category || !projectForm.description || !projectForm.spots) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmittingProject(true);
    
    try {
      const response = await fetch('http://localhost:8080/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: projectForm.title,
          description: projectForm.description,
          category: projectForm.category,
          spots: parseInt(projectForm.spots)
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Project created successfully:', result);
        
        // Reset form and hide it
        setProjectForm({
          title: '',
          category: '',
          spots: '',
          description: ''
        });
        setShowProjectForm(false);
        
        // Refresh projects data
        projects.getAll.execute();
        
        // Show success message
        alert('Project proposal submitted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to create project:', errorData);
        alert(`Failed to submit project: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error submitting project. Please check the console for details.');
    } finally {
      setIsSubmittingProject(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">CourseMate Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time data from your Spring Boot backend
          </p>
        </div>
        <Button onClick={refreshData} variant="outline">
          🔄 Refresh Data
        </Button>
      </div>

      {/* Data Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Users</p>
                <p className="text-2xl font-bold">
                  {users.getAll.data ? users.getAll.data.length : '...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Courses</p>
                <p className="text-2xl font-bold">
                  {courses.getAll.data ? courses.getAll.data.length : '...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Projects</p>
                <p className="text-2xl font-bold">
                  {projects.getAll.data ? projects.getAll.data.length : '...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-teal-600" />
              <div>
                <p className="text-sm font-medium">Subjects</p>
                <p className="text-2xl font-bold">
                  {subjects.getAll.data ? subjects.getAll.data.length : '...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              <div>
                <p className="text-sm font-medium">Queries</p>
                <p className="text-2xl font-bold">
                  {queries.getAll.data ? queries.getAll.data.length : '...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">👥 Users</TabsTrigger>
          <TabsTrigger value="courses">📚 Courses</TabsTrigger>
          <TabsTrigger value="projects">🚀 Projects</TabsTrigger>
          <TabsTrigger value="subjects">📖 Subjects</TabsTrigger>
          <TabsTrigger value="queries">❓ Queries</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Users</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
          
          {users.getAll.loading && (
            <div className="text-center py-8">Loading users...</div>
          )}
          
          {users.getAll.error && (
            <div className="text-center py-8 text-red-600">
              Error: {users.getAll.error}
            </div>
          )}
          
          {users.getAll.data && Array.isArray(users.getAll.data) && users.getAll.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.getAll.data.map((user: User) => (
                <Card key={user.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Role:</span>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                      {user.department && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Department:</span>
                          <span className="text-sm">{user.department}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Joined:</span>
                        <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No users found. Create your first user!
            </div>
          )}
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Courses</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
          
          {courses.getAll.loading && (
            <div className="text-center py-8">Loading courses...</div>
          )}
          
          {courses.getAll.error && (
            <div className="text-center py-8 text-red-600">
              Error: {courses.getAll.error}
            </div>
          )}
          
          {courses.getAll.data && Array.isArray(courses.getAll.data) && courses.getAll.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.getAll.data.map((course: Course) => (
                <Card key={course.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant={course.isActive ? "default" : "secondary"}>
                        {course.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{course.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Subject:</span>
                        <span className="text-sm">{course.subject?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Professor:</span>
                        <span className="text-sm">{course.professor?.firstName} {course.professor?.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Credits:</span>
                        <span className="text-sm">{course.credits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Students:</span>
                        <span className="text-sm">{course.maxStudents}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No courses found. Create your first course!
            </div>
          )}
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Projects</h2>
            <Button size="sm" onClick={() => setShowProjectForm(!showProjectForm)}>
              <Plus className="h-4 w-4 mr-2" />
              {showProjectForm ? 'Cancel' : 'Propose New Project'}
            </Button>
          </div>
          
          {/* Project Creation Form */}
          {showProjectForm && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Propose a New Project</h3>
              <p className="text-gray-600 mb-4">Share your project idea with the community</p>
              
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project title *</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter project title"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select category *</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose category</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Game Development">Game Development</option>
                      <option value="IoT">IoT</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team spots needed... *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={projectForm.spots}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, spots: e.target.value }))}
                    placeholder="Number of team members needed"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Describe your project idea, goals, and requirements... *</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project in detail..."
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1"
                    disabled={isSubmittingProject}
                  >
                    {isSubmittingProject ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProjectForm(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Card>
          )}
          
          {projects.getAll.loading && (
            <div className="text-center py-8">Loading projects...</div>
          )}
          
          {projects.getAll.error && (
            <div className="text-center py-8 text-red-600">
              Error: {projects.getAll.error}
            </div>
          )}
          
          {projects.getAll.data && Array.isArray(projects.getAll.data) && projects.getAll.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.getAll.data.map((project: Project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant={
                        project.status === 'COMPLETED' ? 'default' :
                        project.status === 'IN_PROGRESS' ? 'secondary' :
                        project.status === 'PLANNING' ? 'outline' : 'destructive'
                      }>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>{project.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Leader:</span>
                        <span className="text-sm">{project.leader?.firstName} {project.leader?.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Members:</span>
                        <span className="text-sm">{project.currentMembers}/{project.maxMembers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Progress:</span>
                        <span className="text-sm">{project.progress}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Deadline:</span>
                        <span className="text-sm">{new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No projects found. Create your first project!
            </div>
          )}
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Subjects</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>
          
          {subjects.getAll.loading && (
            <div className="text-center py-8">Loading subjects...</div>
          )}
          
          {subjects.getAll.error && (
            <div className="text-center py-8 text-red-600">
              Error: {subjects.getAll.error}
            </div>
          )}
          
          {subjects.getAll.data && Array.isArray(subjects.getAll.data) && subjects.getAll.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.getAll.data.map((subject: Subject) => (
                <Card key={subject.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <Badge variant={
                        subject.difficulty === 'BEGINNER' ? 'default' :
                        subject.difficulty === 'INTERMEDIATE' ? 'secondary' : 'destructive'
                      }>
                        {subject.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{subject.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Department:</span>
                        <span className="text-sm">{subject.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Credits:</span>
                        <span className="text-sm">{subject.credits}</span>
                      </div>
                      {subject.prerequisites.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Prerequisites:</span>
                          <span className="text-sm">{subject.prerequisites.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No subjects found. Create your first subject!
            </div>
          )}
        </TabsContent>

        {/* Queries Tab */}
        <TabsContent value="queries" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Queries</h2>
            <Button size="sm" onClick={() => setIsAskQuestionModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </div>
          
          {queries.getAll.loading && (
            <div className="text-center py-8">Loading queries...</div>
          )}
          
          {queries.getAll.error && (
            <div className="text-center py-8 text-red-600">
              Error: {queries.getAll.error}
            </div>
          )}
          
          {queries.getAll.data && Array.isArray(queries.getAll.data) && queries.getAll.data.length > 0 ? (
            <div className="space-y-4">
              {/* Debug info */}
              <div className="text-sm text-gray-500 mb-2">
                Found {queries.getAll.data.length} queries
              </div>
              {queries.getAll.data.map((query: Query) => (
                <Card key={query.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openQuestionDetail(query)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{query.title}</CardTitle>
                      <Badge variant={
                        query.status === 'ANSWERED' ? 'default' :
                        query.status === 'CLOSED' ? 'destructive' :
                        'outline'
                      }>
                        {query.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      by {query.author?.firstName} {query.author?.lastName} • {query.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3 line-clamp-2">{query.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <span>👍 {query.upvotes}</span>
                        <span>👎 {query.downvotes}</span>
                        <span>💬 {query.responseCount || 0} responses</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openQuestionDetail(query); }}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No queries found. Ask your first question!
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Ask Question Modal */}
      <AskQuestionModal 
        isOpen={isAskQuestionModalOpen}
        onClose={() => {
          setIsAskQuestionModalOpen(false);
        }}
      />

      {/* Question Detail Modal */}
      <QuestionDetailModal
        isOpen={isQuestionDetailModalOpen}
        onClose={() => {
          setIsQuestionDetailModalOpen(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
      />
    </div>
  );
}

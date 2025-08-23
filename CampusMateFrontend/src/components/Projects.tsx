import React, { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  maxMembers: number;
  currentMembers: number;
  status: string;
  deadline: string;
  leader: {
    firstName: string;
    lastName: string;
  };
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    spots: ''
  });

  const categories = [
    'Mobile Development',
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Cybersecurity',
    'Game Development',
    'IoT',
    'Blockchain',
    'Cloud Computing',
    'DevOps'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('New project:', formData);
    
    try {
      const response = await fetch('http://localhost:8080/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          spots: parseInt(formData.spots)
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Project created successfully:', result);
        
        // Add the new project to the list
        if (result.data) {
          setProjects(prev => [...prev, result.data]);
        }
        
        // Reset form and hide it
        setFormData({
          title: '',
          description: '',
          category: '',
          spots: ''
        });
        setShowForm(false);
        
        // Show success message
        alert('Project created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to create project:', errorData);
        alert(`Failed to create project: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please check the console for details.');
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('http://localhost:8080/projects');
      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setProjects(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  // Load projects when component mounts
  React.useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          {showForm ? 'Cancel' : 'Create Project'}
        </button>
      </div>

      {/* Create Project Form */}
      {showForm && (
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-bold mb-2">Create New Project</h2>
          <p className="text-gray-600 mb-4">Fill in the details below to create a new project</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                <select 
                  value={formData.category} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('category', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                id="description"
                placeholder="Describe your project in detail"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="spots" className="block text-sm font-medium text-gray-700">Available Spots *</label>
                <input
                  id="spots"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="Number of team members needed"
                  value={formData.spots}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('spots', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Create Project
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>🏷️</span>
                <span>{project.category}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>👥</span>
                <span>{project.currentMembers}/{project.maxMembers} members</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📅</span>
                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
              
              <div className="pt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  project.status === 'RECRUITING' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  project.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="pt-2 text-sm text-gray-500">
                Leader: {project.leader.firstName} {project.leader.lastName}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found. Create your first project to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Projects;

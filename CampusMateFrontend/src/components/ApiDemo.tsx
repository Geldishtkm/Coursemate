import React, { useEffect } from 'react';
import { useAuth, useCourses, useUsers, useProjects, useSubjects, useQueries } from '../hooks/useApi';
import { apiClient } from '../lib/api';

export function ApiDemo() {
  const auth = useAuth();
  const courses = useCourses();
  const users = useUsers();
  const projects = useProjects();
  const subjects = useSubjects();
  const queries = useQueries();

  // Test backend connection on component mount
  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await apiClient.getRoot();
      console.log('Backend connection successful:', response);
    } catch (error) {
      console.error('Backend connection failed:', error);
    }
  };

  const handleTestAuth = () => {
    auth.health.execute();
  };

  const handleTestCourses = () => {
    courses.getAll.execute();
  };

  const handleTestUsers = () => {
    users.getAll.execute();
  };

  const handleTestProjects = () => {
    projects.getAll.execute();
  };

  const handleTestSubjects = () => {
    subjects.getAll.execute();
  };

  const handleTestQueries = () => {
    queries.getAll.execute();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">CourseMate API Demo</h1>
      
      {/* Backend Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Backend Connected</h2>
        <p className="text-green-700">
          Your Spring Boot backend is running at <code className="bg-green-100 px-2 py-1 rounded">http://localhost:8080</code>
        </p>
      </div>

      {/* API Test Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Auth API */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🔐 Authentication API</h3>
          <button
            onClick={handleTestAuth}
            disabled={auth.health.loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {auth.health.loading ? 'Testing...' : 'Test Auth Health'}
          </button>
          {auth.health.data && (
            <div className="mt-3 p-2 bg-blue-100 rounded text-sm">
              <strong>Response:</strong> {auth.health.data}
            </div>
          )}
          {auth.health.error && (
            <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-700">
              <strong>Error:</strong> {auth.health.error}
            </div>
          )}
        </div>

        {/* Courses API */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3">📚 Courses API</h3>
          <button
            onClick={handleTestCourses}
            disabled={courses.getAll.loading}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {courses.getAll.loading ? 'Loading...' : 'Get All Courses'}
          </button>
          {courses.getAll.data && (
            <div className="mt-3 p-2 bg-green-100 rounded text-sm">
              <strong>Courses Found:</strong> {courses.getAll.data.length}
            </div>
          )}
          {courses.getAll.error && (
            <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-700">
              <strong>Error:</strong> {courses.getAll.error}
            </div>
          )}
        </div>

        {/* Users API */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">👥 Users API</h3>
          <button
            onClick={handleTestUsers}
            disabled={users.getAll.loading}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {users.getAll.loading ? 'Loading...' : 'Get All Users'}
          </button>
          {users.getAll.data && (
            <div className="mt-3 p-2 bg-purple-100 rounded text-sm">
              <strong>Users Found:</strong> {users.getAll.data.length}
            </div>
          )}
          {users.getAll.error && (
            <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-700">
              <strong>Error:</strong> {users.getAll.error}
            </div>
          )}
        </div>

        {/* Projects API */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-800 mb-3">🚀 Projects API</h3>
          <button
            onClick={handleTestProjects}
            disabled={projects.getAll.loading}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {projects.getAll.loading ? 'Loading...' : 'Get All Projects'}
          </button>
          {projects.getAll.data && (
            <div className="mt-3 p-2 bg-orange-100 rounded text-sm">
              <strong>Projects Found:</strong> {projects.getAll.data.length}
            </div>
          )}
          {projects.getAll.error && (
            <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-700">
              <strong>Error:</strong> {projects.getAll.error}
            </div>
          )}
        </div>

        {/* Subjects API */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-teal-800 mb-3">📖 Subjects API</h3>
          <button
            onClick={handleTestSubjects}
            disabled={subjects.getAll.loading}
            className="w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
          >
            {subjects.getAll.loading ? 'Loading...' : 'Get All Subjects'}
          </button>
          {subjects.getAll.data && (
            <div className="mt-3 p-2 bg-teal-100 rounded text-sm">
              <strong>Subjects Found:</strong> {subjects.getAll.data.length}
            </div>
          )}
          {subjects.getAll.error && (
            <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-700">
              <strong>Error:</strong> {subjects.getAll.error}
            </div>
          )}
        </div>

        {/* Queries API */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-indigo-800 mb-3">❓ Queries API</h3>
          <button
            onClick={handleTestQueries}
            disabled={queries.getAll.loading}
            className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {queries.getAll.loading ? 'Loading...' : 'Get All Queries'}
          </button>
          {queries.getAll.data && (
            <div className="mt-3 p-2 bg-indigo-100 rounded text-sm">
              <strong>Queries Found:</strong> {queries.getAll.data.length}
            </div>
          )}
          {queries.getAll.error && (
            <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-700">
              <strong>Error:</strong> {queries.getAll.error}
            </div>
          )}
        </div>
      </div>

      {/* API Documentation */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Available API Endpoints</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">🔐 Authentication</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><code>POST /auth/login</code> - User login</li>
              <li><code>POST /auth/register</code> - User registration</li>
              <li><code>GET /auth/health</code> - Auth service health</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">📚 Courses</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><code>GET /courses</code> - Get all courses</li>
              <li><code>GET /courses/{'{id}'}</code> - Get course by ID</li>
              <li><code>POST /courses</code> - Create new course</li>
              <li><code>PUT /courses/{'{id}'}</code> - Update course</li>
              <li><code>DELETE /courses/{'{id}'}</code> - Delete course</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">👥 Users</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><code>GET /users</code> - Get all users</li>
              <li><code>GET /users/{'{id}'}</code> - Get user by ID</li>
              <li><code>GET /users/profile</code> - Get current user profile</li>
              <li><code>PUT /users/profile</code> - Update user profile</li>
              <li><code>DELETE /users/{'{id}'}</code> - Delete user</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">🚀 Projects</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><code>GET /projects</code> - Get all projects</li>
              <li><code>GET /projects/{'{id}'}</code> - Get project by ID</li>
              <li><code>POST /projects</code> - Create new project</li>
              <li><code>PUT /projects/{'{id}'}</code> - Update project</li>
              <li><code>DELETE /projects/{'{id}'}</code> - Delete project</li>
              <li><code>POST /projects/{'{id}'}/join</code> - Join project</li>
              <li><code>POST /projects/{'{id}'}/leave</code> - Leave project</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">📖 Subjects</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><code>GET /subjects</code> - Get all subjects</li>
              <li><code>GET /subjects/{'{id}'}</code> - Get subject by ID</li>
              <li><code>POST /subjects</code> - Create new subject</li>
              <li><code>PUT /subjects/{'{id}'}</code> - Update subject</li>
              <li><code>DELETE /subjects/{'{id}'}</code> - Delete subject</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">❓ Queries</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><code>GET /queries</code> - Get all queries</li>
              <li><code>GET /queries/{'{id}'}</code> - Get query by ID</li>
              <li><code>POST /queries</code> - Create new query</li>
              <li><code>PUT /queries/{'{id}'}</code> - Update query</li>
              <li><code>DELETE /queries/{'{id}'}</code> - Delete query</li>
              <li><code>POST /queries/{'{id}'}/upvote</code> - Upvote query</li>
              <li><code>POST /queries/{'{id}'}/downvote</code> - Downvote query</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">🚀 How to Use</h2>
        <div className="text-blue-700 space-y-2">
          <p><strong>1.</strong> Click any of the test buttons above to test the API endpoints</p>
          <p><strong>2.</strong> Use the custom hooks in your components: <code className="bg-blue-100 px-2 py-1 rounded">useAuth()</code>, <code className="bg-blue-100 px-2 py-1 rounded">useCourses()</code>, etc.</p>
          <p><strong>3.</strong> Import the API functions directly: <code className="bg-blue-100 px-2 py-1 rounded">import { authAPI, courseAPI } from '../lib/api'</code></p>
          <p><strong>4.</strong> All API calls are automatically typed with TypeScript interfaces</p>
        </div>
      </div>
    </div>
  );
}

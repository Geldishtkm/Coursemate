// API service layer for CourseMate backend
const API_BASE_URL = 'http://localhost:8080';

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
  role?: 'STUDENT' | 'TUTOR' | 'ADMIN';
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  studentId?: string;
  department?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userInfo?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  studentId?: string;
  department?: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Course types
export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  subject: Subject;
  professor: User;
  semester: string;
  year: string;
  credits: number;
  maxStudents: number;
  difficultyLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Subject types
export interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
  department: string;
  credits: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  prerequisites: string[];
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  leader: User;
  course?: Course;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  maxMembers: number;
  currentMembers: number;
  progress: number;
  deadline: string;
  skillsRequired: string[];
  createdAt: string;
  updatedAt: string;
}

// Query types
export interface Query {
  id: string;
  title: string;
  content: string;
  category: string;
  author: User;
  course?: Course;
  status: 'OPEN' | 'ANSWERED' | 'CLOSED';
  tags: string[];
  upvotes: number;
  downvotes: number;
  responseCount: number;
  isSolved: boolean;
  solvedAt?: string;
  solvedBy?: User;
  createdAt: string;
  updatedAt: string;
}

// Response types
export interface Response {
  id: string;
  content: string;
  author: User;
  queryId: string;
  isAccepted: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If can't parse JSON, use default message
        }
        
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        error.response = response;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      
      // Enhance error with additional context
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        const enhancedError = new Error('Failed to fetch - connection refused or network error') as any;
        enhancedError.originalError = error;
        enhancedError.status = 'CONNECTION_REFUSED';
        throw enhancedError;
      }
      
      throw error;
    }
  }

  // Root endpoints
  async getRoot() {
    return this.request<{
      name: string;
      version: string;
      status: string;
      endpoints: Record<string, string>;
    }>('/');
  }

  async getHealth() {
    return this.request<string>('/health');
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getAuthHealth(): Promise<ApiResponse<string>> {
    return this.request<string>('/auth/health');
  }

  // Course endpoints
  async getAllCourses(): Promise<ApiResponse<Course[]>> {
    return this.request<Course[]>('/courses');
  }

  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    return this.request<Course>(`/courses/${id}`);
  }

  async createCourse(courseData: Partial<Course>, token?: string): Promise<ApiResponse<Course>> {
    return this.request<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }, token);
  }

  async updateCourse(id: string, courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    return this.request<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async getCurrentUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile');
  }

  async updateUserProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Project endpoints
  async getAllProjects(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>('/projects');
  }

  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(projectData: Partial<Project>, token?: string): Promise<ApiResponse<Project>> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }, token);
  }

  async updateProject(id: string, projectData: Partial<Project>, token?: string): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }, token);
  }

  async deleteProject(id: string, token?: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    }, token);
  }

  async joinProject(id: string): Promise<ApiResponse<string>> {
    return this.request<string>(`/projects/${id}/join`, {
      method: 'POST',
    });
  }

  async leaveProject(id: string): Promise<ApiResponse<string>> {
    return this.request<string>(`/projects/${id}/leave`, {
      method: 'POST',
    });
  }

  // Project join request methods
  async requestToJoinProject(projectId: string, message?: string, token?: string): Promise<ApiResponse<any>> {
    const body: any = { projectId };
    if (message) body.message = message;
    
    return this.request<any>(`/projects/${projectId}/join`, {
      method: 'POST',
      body: JSON.stringify(body),
    }, token);
  }

  async getProjectJoinRequests(projectId: string, token?: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/projects/${projectId}/join-requests`, {}, token);
  }

  async getMyProjectJoinRequests(token?: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/projects/my-projects/join-requests', {}, token);
  }

  async respondToJoinRequest(requestId: string, action: string, message?: string, token?: string): Promise<ApiResponse<any>> {
    const body: any = { requestId, action };
    if (message) body.responseMessage = message;
    
    return this.request<any>(`/projects/join-requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify(body),
    }, token);
  }

  async getMyJoinRequests(token?: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/projects/my-join-requests', {}, token);
  }

  async cancelJoinRequest(requestId: string, token?: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/projects/join-requests/${requestId}`, {
      method: 'DELETE',
    }, token);
  }

  // Get user's status with a project
  async getUserProjectStatus(projectId: string, token?: string): Promise<ApiResponse<string>> {
    return this.request<string>(`/projects/${projectId}/user-status`, {}, token);
  }

  // Subject endpoints
  async getAllSubjects(): Promise<ApiResponse<Subject[]>> {
    return this.request<Subject[]>('/subjects');
  }

  async getSubjectById(id: string): Promise<ApiResponse<Subject>> {
    return this.request<Subject>(`/subjects/${id}`);
  }

  async createSubject(subjectData: Partial<Subject>): Promise<ApiResponse<Subject>> {
    return this.request<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  async updateSubject(id: string, subjectData: Partial<Subject>): Promise<ApiResponse<Subject>> {
    return this.request<Subject>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
  }

  async deleteSubject(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  // Query endpoints
  async getAllQueries(): Promise<ApiResponse<Query[]>> {
    return this.request<Query[]>('/queries');
  }

  async getQueryById(id: string): Promise<ApiResponse<Query>> {
    return this.request<Query>(`/queries/${id}`);
  }

  async createQuery(queryData: Partial<Query>): Promise<ApiResponse<Query>> {
    return this.request<Query>('/queries', {
      method: 'POST',
      body: JSON.stringify(queryData),
    });
  }

  async updateQuery(id: string, queryData: Partial<Query>): Promise<ApiResponse<Query>> {
    return this.request<Query>(`/queries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(queryData),
    });
  }

  async deleteQuery(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/queries/${id}`, {
      method: 'DELETE',
    });
  }

  async upvoteQuery(id: string): Promise<ApiResponse<string>> {
    return this.request<string>(`/queries/${id}/upvote`, {
      method: 'POST',
    });
  }

  async downvoteQuery(id: string): Promise<ApiResponse<string>> {
    return this.request<string>(`/queries/${id}/downvote`, {
      method: 'POST',
    });
  }

  // Response API methods
  async getResponsesForQuery(queryId: string): Promise<ApiResponse<Response[]>> {
    return this.request<Response[]>(`/queries/${queryId}/responses`);
  }

  async createResponse(queryId: string, responseData: Partial<Response>): Promise<ApiResponse<Response>> {
    return this.request<Response>(`/queries/${queryId}/responses`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }

  async updateResponse(responseId: string, responseData: Partial<Response>): Promise<ApiResponse<Response>> {
    return this.request<Response>(`/queries/responses/${responseId}`, {
      method: 'PUT',
      body: JSON.stringify(responseData),
    });
  }

  async deleteResponse(responseId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/queries/responses/${responseId}`, {
      method: 'DELETE',
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual API functions for convenience
export const authAPI = {
  login: apiClient.login.bind(apiClient),
  register: apiClient.register.bind(apiClient),
  health: apiClient.getAuthHealth.bind(apiClient),
};

export const courseAPI = {
  getAll: apiClient.getAllCourses.bind(apiClient),
  getById: apiClient.getCourseById.bind(apiClient),
  create: (courseData: Partial<Course>, token?: string) => apiClient.createCourse(courseData, token),
  update: apiClient.updateCourse.bind(apiClient),
  delete: apiClient.deleteCourse.bind(apiClient),
};

export const userAPI = {
  getAll: apiClient.getAllUsers.bind(apiClient),
  getById: apiClient.getUserById.bind(apiClient),
  getProfile: apiClient.getCurrentUserProfile.bind(apiClient),
  updateProfile: apiClient.updateUserProfile.bind(apiClient),
  delete: apiClient.deleteUser.bind(apiClient),
};

export const projectAPI = {
  getAll: apiClient.getAllProjects.bind(apiClient),
  getById: apiClient.getProjectById.bind(apiClient),
  create: (projectData: Partial<Project>, token?: string) => apiClient.createProject(projectData, token),
  update: (id: string, projectData: Partial<Project>, token?: string) => apiClient.updateProject(id, projectData, token),
  delete: (id: string, token?: string) => apiClient.deleteProject(id, token),
  join: apiClient.joinProject.bind(apiClient),
  leave: apiClient.leaveProject.bind(apiClient),
  // New join request methods
  requestToJoin: (projectId: string, message?: string, token?: string) => apiClient.requestToJoinProject(projectId, message, token),
  getJoinRequests: (projectId: string, token?: string) => apiClient.getProjectJoinRequests(projectId, token),
  getMyProjectJoinRequests: (token?: string) => apiClient.getMyProjectJoinRequests(token),
  respondToJoinRequest: (requestId: string, action: string, message?: string, token?: string) => apiClient.respondToJoinRequest(requestId, action, message, token),
  getMyJoinRequests: (token?: string) => apiClient.getMyJoinRequests(token),
  cancelJoinRequest: (requestId: string, token?: string) => apiClient.cancelJoinRequest(requestId, token),
  getUserProjectStatus: (projectId: string, token?: string) => apiClient.getUserProjectStatus(projectId, token),
};

export const subjectAPI = {
  getAll: apiClient.getAllSubjects.bind(apiClient),
  getById: apiClient.getSubjectById.bind(apiClient),
  create: apiClient.createSubject.bind(apiClient),
  update: apiClient.updateSubject.bind(apiClient),
  delete: apiClient.deleteSubject.bind(apiClient),
};

export const queryAPI = {
  getAll: apiClient.getAllQueries.bind(apiClient),
  getById: apiClient.getQueryById.bind(apiClient),
  create: apiClient.createQuery.bind(apiClient),
  update: apiClient.updateQuery.bind(apiClient),
  delete: apiClient.deleteQuery.bind(apiClient),
  upvote: apiClient.upvoteQuery.bind(apiClient),
  downvote: apiClient.downvoteQuery.bind(apiClient),
};

export const responseAPI = {
  getForQuery: apiClient.getResponsesForQuery.bind(apiClient),
  create: apiClient.createResponse.bind(apiClient),
  update: apiClient.updateResponse.bind(apiClient),
  delete: apiClient.deleteResponse.bind(apiClient),
};

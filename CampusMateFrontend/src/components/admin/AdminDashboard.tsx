import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  FolderOpen, 
  Info, 
  MessageSquare, 
  Plus,
  Settings,
  BarChart3,
  Shield,
  Upload,
  Home,
  ArrowLeft
} from "lucide-react";
import { CourseUpload } from './CourseUpload';
import { UserManagement } from './UserManagement';
import { SubjectManagement } from './SubjectManagement';
import { ProjectManagement } from './ProjectManagement';
import { QueryManagement } from './QueryManagement';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Courses",
      value: "89",
      change: "+5%",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Ongoing Projects",
      value: "156",
      change: "+23%",
      icon: FolderOpen,
      color: "text-orange-600"
    },
    {
      title: "Open Queries",
      value: "34",
      change: "-8%",
      icon: MessageSquare,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to Main Site</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/courses" 
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
              </Link>
              <Link 
                to="/queries" 
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Queries</span>
              </Link>
              <Link 
                to="/projects" 
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
                <p className="text-sm text-gray-500">Manage CourseMate system</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Main Site
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Quick Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Admin Panel</span>
          </nav>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Admin Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="courses">📚 Courses</TabsTrigger>
            <TabsTrigger value="users">👥 Users</TabsTrigger>
            <TabsTrigger value="subjects">📖 Subjects</TabsTrigger>
            <TabsTrigger value="projects">🚀 Projects</TabsTrigger>
            <TabsTrigger value="queries">❓ Queries</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">New course "Machine Learning" uploaded</span>
                      <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">User "john.doe@email.com" registered</span>
                      <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Project "AI Chatbot" status updated</span>
                      <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                                 <CardContent>
                   <div className="grid grid-cols-2 gap-3">
                     <Button 
                       className="w-full" 
                       size="sm"
                       onClick={() => setActiveTab("courses")}
                     >
                       <Plus className="h-4 w-4 mr-2" />
                       Add Course
                     </Button>
                     <Button 
                       className="w-full" 
                       variant="outline" 
                       size="sm"
                       onClick={() => setActiveTab("users")}
                     >
                       <Users className="h-4 w-4 mr-2" />
                       Manage Users
                     </Button>
                     <Button 
                       className="w-full" 
                       variant="outline" 
                       size="sm"
                       onClick={() => setActiveTab("overview")}
                     >
                       <BookOpen className="h-4 w-4 mr-2" />
                       View Reports
                     </Button>
                     <Button 
                       className="w-full" 
                       variant="outline" 
                       size="sm"
                       onClick={() => setActiveTab("overview")}
                     >
                       <Settings className="h-4 w-4 mr-2" />
                       System Settings
                     </Button>
                   </div>
                 </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
                <p className="text-gray-600">Upload, edit, and manage all courses</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload New Course
              </Button>
            </div>
            <CourseUpload />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <SubjectManagement />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <ProjectManagement />
          </TabsContent>

          {/* Queries Tab */}
          <TabsContent value="queries" className="space-y-6">
            <QueryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

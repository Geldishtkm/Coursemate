import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";

export function ProjectManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
          <p className="text-gray-600">Manage student projects and collaborations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <span>All Projects</span>
          </CardTitle>
          <CardDescription>
            View and manage student projects, teams, and progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Project management interface coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

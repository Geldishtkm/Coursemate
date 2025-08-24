import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";

export function SubjectManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subject Management</h2>
          <p className="text-gray-600">Manage academic subjects and departments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Subject
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>All Subjects</span>
          </CardTitle>
          <CardDescription>
            View and manage academic subjects, departments, and difficulty levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Subject management interface coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

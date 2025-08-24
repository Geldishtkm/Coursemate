import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Edit, Trash2 } from "lucide-react";

export function UserManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage all users, professors, and students</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>All Users</span>
          </CardTitle>
          <CardDescription>
            View and manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            User management interface coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

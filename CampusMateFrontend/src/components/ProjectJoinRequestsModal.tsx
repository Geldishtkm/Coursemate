import React, { useState, useEffect } from 'react';
import { X, Check, XCircle, User, MessageSquare, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { projectAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectJoinRequest {
  id: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userDepartment?: string;
  projectId?: string;
  projectTitle?: string;
  projectCategory?: string;
  message?: string;
  responseMessage?: string;
  createdAt: string;
  status: string;
}

interface ProjectJoinRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string; // If provided, shows requests for specific project
  showMyRequests?: boolean; // If true, shows user's own join requests
}

export function ProjectJoinRequestsModal({ isOpen, onClose, projectId, showMyRequests }: ProjectJoinRequestsModalProps) {
  const [joinRequests, setJoinRequests] = useState<ProjectJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [isProcessingAny, setIsProcessingAny] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchJoinRequests();
    }
  }, [isOpen, projectId]);

  const fetchJoinRequests = async () => {
    try {
      setLoading(true);
      let response;
      
      if (showMyRequests) {
        // Get user's own join requests
        response = await projectAPI.getMyJoinRequests(token);
      } else if (projectId) {
        // Get requests for specific project
        response = await projectAPI.getJoinRequests(projectId, token);
      } else {
        // Get all requests for user's projects
        response = await projectAPI.getMyProjectJoinRequests(token);
      }
      
      if (response.success) {
        setJoinRequests(response.data || []);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch join requests",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching join requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch join requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (requestId: string, action: 'approve' | 'reject') => {
    // Prevent multiple clicks - more robust check
    if (processingRequest === requestId || isProcessingAny) {
      return;
    }
    
    try {
      setProcessingRequest(requestId);
      setIsProcessingAny(true);
      const response = await projectAPI.respondToJoinRequest(requestId, action, responseMessage, token);
      
      if (response.success) {
        toast({
          title: "Success!",
          description: `Join request ${action}d successfully`,
        });
        
        // Refresh the list
        fetchJoinRequests();
        setRespondingTo(null);
        setResponseMessage('');
      } else {
        toast({
          title: "Error",
          description: response.message || `Failed to ${action} join request`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error ${action}ing join request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} join request`,
        variant: "destructive"
      });
    } finally {
      setProcessingRequest(null);
      setIsProcessingAny(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const response = await projectAPI.cancelJoinRequest(requestId, token);
      
      if (response.success) {
        toast({
          title: "Success!",
          description: "Join request cancelled successfully",
        });
        
        // Refresh the list
        fetchJoinRequests();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to cancel join request",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error cancelling join request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel join request",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {showMyRequests ? 'My Join Requests' : 
             projectId ? 'Project Join Requests' : 'My Projects - Join Requests'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading join requests...</p>
          </div>
        ) : joinRequests.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No join requests</h3>
            <p className="text-muted-foreground">
              {showMyRequests 
                ? "You haven't sent any join requests yet"
                : projectId 
                  ? "This project has no pending join requests"
                  : "You have no pending join requests for your projects"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {joinRequests.map((request) => {
              // Skip requests with invalid user data
              if (!request.userFirstName || !request.userLastName) {
                return (
                  <Card key={request.id} className="border border-border">
                    <CardHeader className="pb-3">
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">Invalid user data for this request</p>
                      </div>
                    </CardHeader>
                  </Card>
                );
              }

              return (
                <Card key={request.id} className="border border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                                                 <Avatar className="w-10 h-10">
                           <AvatarFallback className="text-sm">
                             {request.userFirstName?.[0]}{request.userLastName?.[0]}
                           </AvatarFallback>
                         </Avatar>
                         <div>
                           <CardTitle className="text-lg">
                             {showMyRequests ? request.projectTitle : `${request.userFirstName} ${request.userLastName}`}
                           </CardTitle>
                           <div className="flex items-center gap-4 text-sm text-muted-foreground">
                             {showMyRequests ? (
                               <>
                                 <span>{request.projectCategory}</span>
                                 {request.message && <span>• {request.message}</span>}
                               </>
                             ) : (
                               <>
                                 <span>{request.userEmail}</span>
                                 {request.userDepartment && (
                                   <span>• {request.userDepartment}</span>
                                 )}
                               </>
                             )}
                           </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {request.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(request.createdAt)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                                         {request.message && (
                       <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                           <MessageSquare className="w-4 h-4" />
                           <span>{showMyRequests ? 'Your message:' : 'Message from applicant:'}</span>
                         </div>
                         <p className="text-sm">{request.message}</p>
                       </div>
                     )}
                     
                     {showMyRequests && request.responseMessage && (
                       <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                           <MessageSquare className="w-4 h-4" />
                           <span>Response from project leader:</span>
                         </div>
                         <p className="text-sm">{request.responseMessage}</p>
                       </div>
                     )}

                                         {request.status === 'PENDING' && !showMyRequests && (
                       <div className="space-y-3">
                         {respondingTo === request.id ? (
                           <div className="space-y-3">
                             <Textarea
                               placeholder="Optional response message..."
                               value={responseMessage}
                               onChange={(e) => setResponseMessage(e.target.value)}
                               rows={2}
                             />
                             <div className="flex gap-2">
                               <Button
                                 size="sm"
                                 onClick={() => handleRespondToRequest(request.id, 'approve')}
                                 className="flex items-center gap-2"
                                 disabled={processingRequest === request.id || isProcessingAny}
                               >
                                 <Check className="w-4 h-4" />
                                 {processingRequest === request.id ? 'Processing...' : 'Approve'}
                               </Button>
                               <Button
                                 size="sm"
                                 variant="destructive"
                                 onClick={() => handleRespondToRequest(request.id, 'reject')}
                                 className="flex items-center gap-2"
                                 disabled={processingRequest === request.id || isProcessingAny}
                               >
                                 <XCircle className="w-4 h-4" />
                                 {processingRequest === request.id ? 'Processing...' : 'Reject'}
                               </Button>
                               <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => {
                                   setRespondingTo(null);
                                   setResponseMessage('');
                                 }}
                               >
                                 Cancel
                               </Button>
                             </div>
                           </div>
                         ) : (
                           <div className="flex gap-2">
                             <Button
                               size="sm"
                               onClick={() => setRespondingTo(request.id)}
                               className="flex items-center gap-2"
                             >
                               <Check className="w-4 h-4" />
                               Respond
                             </Button>
                           </div>
                         )}
                       </div>
                     )}
                     
                     {request.status === 'PENDING' && showMyRequests && (
                       <div className="flex gap-2">
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => handleCancelRequest(request.id)}
                           className="flex items-center gap-2"
                         >
                           <X className="w-4 h-4" />
                           Cancel Request
                         </Button>
                       </div>
                     )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

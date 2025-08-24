import React, { useState, useEffect } from 'react';
import { X, MessageSquare, ThumbsUp, ThumbsDown, Send, Clock, User, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Query, Response, responseAPI } from '../lib/api';
import { useToast } from './ui/use-toast';

// Type guard to ensure response has required fields
const isValidResponse = (response: any): response is Response => {
  console.log('Validating response:', response); // Debug log
  console.log('Response author:', response?.author); // Debug log
  
  // Basic validation - just ensure we have the essential fields
  const isValid = response && 
         typeof response === 'object' && 
         response.id && 
         response.content;
  
  console.log('Response validation result:', isValid); // Debug log
  return isValid;
};

interface QuestionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Query | null;
}

export function QuestionDetailModal({ isOpen, onClose, question }: QuestionDetailModalProps) {
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  
  // Ensure responses is always an array
  const safeResponses = responses || [];
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Validation helper for response content
  const validateResponseContent = (content: string): string | null => {
    if (!content.trim()) {
      return "Response content cannot be empty";
    }
    if (content.trim().length < 10) {
      return "Response must be at least 10 characters long";
    }
    if (content.length > 5000) {
      return "Response cannot exceed 5000 characters";
    }
    return null;
  };

  // Fetch responses when question changes
  useEffect(() => {
    const fetchResponses = async () => {
      if (question?.id) {
        setLoading(true);
        try {
          const response = await responseAPI.getForQuery(question.id);
          console.log('Raw response data:', response); // Debug log
          if (response.success && response.data) {
            console.log('Individual responses:', response.data); // Debug log
            // TEMPORARY: Accept all responses for debugging
            console.log('Accepting all responses for debugging');
            setResponses(response.data);
            
            // TODO: Re-enable validation after debugging
            /*
            // Validate and filter responses to ensure they have required fields
            const validResponses = response.data.filter(isValidResponse);
            console.log('Valid responses after filtering:', validResponses); // Debug log
            setResponses(validResponses);
            */
          } else {
            console.error('Failed to fetch responses:', response.message);
            // If no responses exist, just set empty array
            setResponses([]);
          }
        } catch (error: any) {
          console.error('Error fetching responses:', error);
          
          // Handle specific error cases
          const errorMessage = error?.message || 'Unknown error';
          const errorStatus = error?.status || error?.response?.status;
          
          if (errorMessage.includes('Query not found') || errorMessage.includes('404') || errorStatus === 404) {
            toast({
              title: "Question Not Found",
              description: "This question no longer exists or may have been deleted.",
              variant: "destructive",
            });
            // Close modal for non-existent questions
            setTimeout(() => {
              onClose();
            }, 2000);
          } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Connection refused')) {
            toast({
              title: "Connection Error",
              description: "Unable to load responses. Please check your connection.",
              variant: "destructive",
            });
          }
          
          setResponses([]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (question) {
      fetchResponses();
    }
  }, [question]);

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question) {
      toast({
        title: "Error",
        description: "No question selected",
        variant: "destructive",
      });
      return;
    }

    // Validate response content
    const validationError = validateResponseContent(newResponse);
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const responseData = {
        content: newResponse.trim()
      };

      const result = await responseAPI.create(question.id, responseData);
      console.log('Create response result:', result); // Debug log
      console.log('Response data structure:', JSON.stringify(result.data, null, 2)); // Detailed data log
      
              if (result.success && result.data) {
          // TEMPORARY: Accept any response data for debugging
          console.log('Accepting response data for debugging:', result.data);
          setResponses([result.data, ...(responses || [])]);
          setNewResponse('');
          
          toast({
            title: "Response Posted!",
            description: "Your response has been added successfully.",
          });
          
          // TODO: Re-enable validation after debugging
          /*
          // Validate the new response before adding it to the list
          if (isValidResponse(result.data)) {
            setResponses([result.data, ...(responses || [])]);
            setNewResponse('');
            
            toast({
              title: "Response Posted!",
              description: "Your response has been added successfully.",
            });
          } else {
            console.error('Response validation failed for:', result.data);
            console.error('Response has id:', !!result.data?.id);
            console.error('Response has content:', !!result.data?.content);
            console.error('Response has author:', !!result.data?.author);
            throw new Error("Invalid response data received from server");
          }
          */
        } else {
          throw new Error(result.message || "Failed to create response");
        }
      
    } catch (error: any) {
      console.error('Error posting response:', error);
      
      // Enhanced error handling for different scenarios
      const errorMessage = error?.message || 'Unknown error';
      const errorStatus = error?.status || error?.response?.status;
      
      if (errorMessage.includes('Query not found') || errorMessage.includes('404') || errorStatus === 404) {
        toast({
          title: "Question Not Found",
          description: "This question may have been deleted. Please refresh the page.",
          variant: "destructive",
        });
        // Close modal after a delay to let user read the message
        setTimeout(() => {
          onClose();
        }, 3000);
      } else if (errorMessage.includes('500') || errorStatus === 500) {
        toast({
          title: "Server Error",
          description: "Something went wrong on our end. Please try again later.",
          variant: "destructive",
        });
      } else if (errorMessage.includes('400') || errorStatus === 400) {
        toast({
          title: "Invalid Request",
          description: "Please check your response content and try again.",
          variant: "destructive",
        });
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Connection refused')) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to server. Please check your connection.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to post response. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Question Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Question Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{question.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{question.author?.firstName} {question.author?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeAgo(question.createdAt)}</span>
                  </div>
                  <Badge variant="outline">{question.category}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                                 <Badge variant={
                   question.status === 'ANSWERED' ? 'default' :
                   question.status === 'CLOSED' ? 'destructive' :
                   'outline'
                 }>
                  {question.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{question.content}</p>
            
            {/* Question Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 border-t pt-4">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{question.upvotes} upvotes</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsDown className="h-4 w-4" />
                <span>{question.downvotes} downvotes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{responses.length} responses</span>
              </div>
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {question.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Responses Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Responses ({responses.length})
          </h3>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading responses...
            </div>
          ) : safeResponses && safeResponses.length > 0 ? (
            <div className="space-y-4">
                                            {safeResponses.map((response, index) => (
                 <Card key={response?.id || `response-${index}`} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                                                 <div>
                           <p className="font-medium text-sm">
                             {response.author?.firstName && response.author?.lastName 
                               ? `${response.author.firstName} ${response.author.lastName}`
                               : response.author?.firstName || response.author?.lastName || 'Anonymous User'}
                           </p>
                           <p className="text-xs text-gray-500">
                             {response?.createdAt ? formatTimeAgo(response.createdAt) : 'Just now'}
                           </p>
                         </div>
                      </div>
                                             {response?.isAccepted === true && (
                         <Badge variant="default" className="text-xs">
                           ✓ Accepted
                         </Badge>
                       )}
                    </div>
                    
                                         <p className="text-gray-700 mb-3 whitespace-pre-wrap">{response?.content || 'No content'}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                             <button className="flex items-center gap-1 hover:text-blue-600">
                         <ThumbsUp className="h-4 w-4" />
                         <span>{response?.upvotes || 0}</span>
                       </button>
                       <button className="flex items-center gap-1 hover:text-red-600">
                         <ThumbsDown className="h-4 w-4" />
                         <span>{response?.downvotes || 0}</span>
                       </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : safeResponses && safeResponses.length > 0 ? (
            <div className="text-center py-8 text-gray-500">
              No valid responses found. Some responses may be incomplete.
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No responses yet. Be the first to help!
            </div>
          )}
        </div>

        {/* Add Response Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Your Response</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div>
                <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer
                </label>
                <Textarea
                  id="response"
                  placeholder="Share your knowledge and help others understand this topic better..."
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  className="w-full min-h-[120px]"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !newResponse.trim()}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    'Posting...'
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Post Response
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

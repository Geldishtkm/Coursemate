import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit, MessageSquare, ChevronUp, ChevronDown, Plus, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AskQuestionModal } from '@/components/AskQuestionModal';
import { QuestionDetailModal } from '@/components/QuestionDetailModal';

interface Query {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  responseCount: number;
  isSolved: boolean;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const Queries = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);
  const [showQuestionDetail, setShowQuestionDetail] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Query | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/queries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setQueries(result.data || []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch queries',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch queries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Admin Functions
  const handleDeleteQuery = async (queryId: string) => {
    if (window.confirm('Are you sure you want to delete this query? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_URL}/queries/${queryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setQueries(queries.filter(q => q.id !== queryId));
          toast({
            title: 'Success',
            description: 'Query deleted successfully',
          });
        } else {
          const errorData = await response.json();
          toast({
            title: 'Error',
            description: errorData.message || 'Failed to delete query',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error deleting query:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete query',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEditQuery = (queryId: string) => {
    // For now, show a message that edit functionality is coming soon
    toast({
      title: 'Edit Query',
      description: 'Edit functionality will be available soon',
    });
  };

  const handleUpvote = async (queryId: string) => {
    try {
      const response = await fetch(`${API_URL}/queries/${queryId}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setQueries(queries.map(q => q.id === queryId ? result.data : q));
      }
    } catch (error) {
      console.error('Error upvoting query:', error);
    }
  };

  const handleDownvote = async (queryId: string) => {
    try {
      const response = await fetch(`${API_URL}/queries/${queryId}/downvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setQueries(queries.map(q => q.id === queryId ? result.data : q));
      }
    } catch (error) {
      console.error('Error downvoting query:', error);
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || query.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(queries.map(q => q.category))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Community Questions</h1>
            <Button onClick={() => setShowAskModal(true)} className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ask Question
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Queries List */}
        <div className="space-y-6">
          {filteredQueries.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory 
                    ? "Try adjusting your search criteria" 
                    : "Be the first to ask a question!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredQueries.map(query => (
              <Card key={query.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 hover:text-blue-600 cursor-pointer"
                                 onClick={() => {
                                   setSelectedQuestion(query);
                                   setShowQuestionDetail(true);
                                 }}>
                        {query.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>By {query.author ? `${query.author.firstName} ${query.author.lastName}` : 'Unknown User'}</span>
                        <span>•</span>
                        <span>{query.createdAt ? new Date(query.createdAt).toLocaleDateString() : 'Unknown Date'}</span>
                        <Badge variant={query.isSolved ? "default" : "secondary"}>
                          {query.isSolved ? "Solved" : "Open"}
                        </Badge>
                        <Badge variant="outline">{query.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">{query.content}</p>
                  
                  {/* Tags */}
                  {query.tags && Array.isArray(query.tags) && query.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {query.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Voting */}
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUpvote(query.id)}
                          className="flex items-center gap-1 hover:bg-green-50 hover:text-green-600"
                        >
                          <ChevronUp className="h-4 w-4" />
                          {query.upvotes || 0}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownvote(query.id)}
                          className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600"
                        >
                          <ChevronDown className="h-4 w-4" />
                          {query.downvotes || 0}
                        </Button>
                      </div>

                      {/* Response Count */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/queries/${query.id}`)}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {query.responseCount || 0} {(query.responseCount || 0) === 1 ? 'Response' : 'Responses'}
                      </Button>
                    </div>

                    {/* Admin Controls */}
                    {user && user.role === 'ADMIN' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditQuery(query.id)}
                          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteQuery(query.id)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Ask Question Modal */}
      <AskQuestionModal 
        isOpen={showAskModal}
        onClose={() => {
          setShowAskModal(false);
          fetchQueries(); // Refresh queries after modal closes
        }}
      />

      {/* Question Detail Modal */}
      <QuestionDetailModal 
        isOpen={showQuestionDetail}
        onClose={() => {
          setShowQuestionDetail(false);
          setSelectedQuestion(null);
          fetchQueries(); // Refresh queries after modal closes to update response counts
        }}
        question={selectedQuestion}
      />
    </div>
  );
};

export default Queries;


import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { Target, Plus, Edit, Trash2, ExternalLink, LoaderCircle, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import RelationshipSection from '@/components/RelationshipSection';

// Define the type for our UseCase based on the database schema
export type UseCase = {
  id: string;
  name: string;
  description: string | null;
  business_area: string | null;
  created_at: string;
};

// Helper function for consistent color mapping
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'geography': return 'bg-blue-100 text-blue-800';
    case 'keywords': return 'bg-purple-100 text-purple-800';
    case 'pseudo-customer': return 'bg-amber-100 text-amber-800';
    case 'transaction': return 'bg-red-100 text-red-800';
    case 'respondent': return 'bg-cyan-100 text-cyan-800';
    case 'fintech': return 'bg-emerald-100 text-emerald-800';
    case 'trade finance': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const UseCasesTable = ({ useCases, handleViewDetails, handleDelete }: {
  useCases: UseCase[];
  handleViewDetails: (id: string) => void;
  handleDelete: (id: string) => void;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Business Area</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {useCases.map((useCase) => (
          <TableRow key={useCase.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{useCase.name}</TableCell>
            <TableCell>
              {useCase.business_area ? (
                <Badge className={getCategoryColor(useCase.business_area)}>{useCase.business_area}</Badge>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="line-clamp-2 max-w-md">
                {useCase.description || <span className="text-gray-400">No description</span>}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(useCase.id)}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Link to={`/use-cases/${useCase.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(useCase.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const UseCasesList = () => {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUseCases = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('use_cases')
        .select('*');

      if (error) {
        setError(error.message);
        console.error('Error fetching use cases:', error);
      } else {
        setUseCases(data as UseCase[]);
      }
      setLoading(false);
    };

    fetchUseCases();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this use case?')) {
      // TODO: Implement Supabase delete logic
      console.log('Delete use case:', id);
    }
  };

  const handleViewDetails = (id: string) => {
    console.log('Navigating to use case:', id);
    navigate(`/use-cases/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-gray-600">Loading Use Cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="ml-4 text-lg text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Use Cases</h1>
            <p className="text-gray-600 mt-2">Define business use cases and scenarios</p>
          </div>
          <Link to="/use-cases/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Use Case
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as 'card' | 'list')}
            className="justify-start"
          >
            <ToggleGroupItem value="card" aria-label="Card view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <Card key={useCase.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Target className="w-8 h-8 text-emerald-500" />
                    <div className="flex space-x-2">
                      <Link to={`/use-cases/${useCase.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(useCase.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{useCase.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {useCase.description || 'No description available'}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewDetails(useCase.id)}
                  >
                    View Details
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <UseCasesTable 
            useCases={useCases}
            handleViewDetails={handleViewDetails}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

const UseCaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Use Case Detail (Coming Soon)</h1>
          <p className="text-gray-600 mt-2">Use Case ID: {id}</p>
          <Link to="/use-cases">
            <Button className="mt-4">Back to Use Cases</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const UseCaseForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Use Case (Coming Soon)' : 'New Use Case (Coming Soon)'}
          </h1>
          <Link to="/use-cases">
            <Button className="mt-4">Back to Use Cases</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const UseCases = () => {
  return (
    <Routes>
      <Route path="/" element={<UseCasesList />} />
      <Route path="/new" element={<UseCaseForm />} />
      <Route path="/:id" element={<UseCaseDetail />} />
      <Route path="/:id/edit" element={<UseCaseForm isEdit={true} />} />
    </Routes>
  );
};

export default UseCases;

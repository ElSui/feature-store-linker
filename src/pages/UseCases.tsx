import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { Target, Plus, Edit, Trash2, ExternalLink, LoaderCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const UseCasesList = () => {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

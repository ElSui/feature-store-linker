
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { FileText, Plus, Edit, Trash2, ExternalLink, LoaderCircle, AlertCircle, LayoutGrid, List } from 'lucide-react';
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

// Define the type for our Document based on the database schema
export type RegulatoryDocument = {
  id: string;
  name: string;
  publisher: string | null;
  region: string | null;
  publication_date: string | null;
  document_url: string | null;
  created_at: string;
};

// Helper function for consistent color mapping (including publishers)
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'geography': return 'bg-blue-100 text-blue-800';
    case 'keywords': return 'bg-purple-100 text-purple-800';
    case 'pseudo-customer': return 'bg-amber-100 text-amber-800';
    case 'transaction': return 'bg-red-100 text-red-800';
    case 'respondent': return 'bg-cyan-100 text-cyan-800';
    case 'fintech': return 'bg-emerald-100 text-emerald-800';
    case 'trade finance': return 'bg-indigo-100 text-indigo-800';
    case 'fatf': return 'bg-rose-100 text-rose-800';
    case 'bis': return 'bg-violet-100 text-violet-800';
    case 'fca': return 'bg-teal-100 text-teal-800';
    case 'fed': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const DocumentsTable = ({ documents, handleViewDetails, handleDelete }: {
  documents: RegulatoryDocument[];
  handleViewDetails: (id: string) => void;
  handleDelete: (id: string) => void;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Publisher</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Publication Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          <TableRow key={document.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{document.name}</TableCell>
            <TableCell>
              {document.publisher ? (
                <Badge className={getCategoryColor(document.publisher)}>{document.publisher}</Badge>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TableCell>
            <TableCell>
              {document.region ? (
                <Badge variant="outline">{document.region}</Badge>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TableCell>
            <TableCell>
              {document.publication_date 
                ? new Date(document.publication_date).toLocaleDateString()
                : <span className="text-gray-400">-</span>
              }
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(document.id)}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Link to={`/documents/${document.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(document.id)}
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

const DocumentsList = () => {
  const [documents, setDocuments] = useState<RegulatoryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('regulatory_documents')
        .select('*');

      if (error) {
        setError(error.message);
        console.error('Error fetching documents:', error);
      } else {
        setDocuments(data as RegulatoryDocument[]);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      // TODO: Implement Supabase delete logic
      console.log('Delete document:', id);
    }
  };

  const handleViewDetails = (id: string) => {
    console.log('Navigating to document:', id);
    navigate(`/documents/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-gray-600">Loading Documents...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Regulatory Documents</h1>
            <p className="text-gray-600 mt-2">Manage compliance documents and regulations</p>
          </div>
          <Link to="/documents/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Document
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
            {documents.map((document) => (
              <Card key={document.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div className="flex space-x-2">
                      <Link to={`/documents/${document.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{document.name}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {document.publisher && <Badge variant="secondary">{document.publisher}</Badge>}
                      {document.region && <Badge variant="outline">{document.region}</Badge>}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {document.publication_date && (
                    <div className="text-xs text-gray-500 mb-4">
                      Published: {new Date(document.publication_date).toLocaleDateString()}
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewDetails(document.id)}
                  >
                    View Details
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <DocumentsTable 
            documents={documents}
            handleViewDetails={handleViewDetails}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // For now, show placeholder until we implement detail fetching
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Document Detail (Coming Soon)</h1>
          <p className="text-gray-600 mt-2">Document ID: {id}</p>
          <Link to="/documents">
            <Button className="mt-4">Back to Documents</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const DocumentForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Document (Coming Soon)' : 'New Document (Coming Soon)'}
          </h1>
          <Link to="/documents">
            <Button className="mt-4">Back to Documents</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Documents = () => {
  return (
    <Routes>
      <Route path="/" element={<DocumentsList />} />
      <Route path="/new" element={<DocumentForm />} />
      <Route path="/:id" element={<DocumentDetail />} />
      <Route path="/:id/edit" element={<DocumentForm isEdit={true} />} />
    </Routes>
  );
};

export default Documents;

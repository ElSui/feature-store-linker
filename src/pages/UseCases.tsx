
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { Target, Plus, Edit, Trash2, ExternalLink, LoaderCircle, AlertCircle, LayoutGrid, List, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
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
    <div className="rounded-md border">
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
    </div>
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
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Linked entities state
  const [linkedDocuments, setLinkedDocuments] = useState<any[]>([]);
  const [linkedRiskIndicators, setLinkedRiskIndicators] = useState<any[]>([]);
  const [availableDocuments, setAvailableDocuments] = useState<any[]>([]);
  const [availableRiskIndicators, setAvailableRiskIndicators] = useState<any[]>([]);

  useEffect(() => {
    const fetchUseCaseAndLinks = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Fetch the main use case
        const { data: useCaseData, error: useCaseError } = await supabase
          .from('use_cases')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (useCaseError) {
          setError(useCaseError.message);
          console.error('Error fetching use case:', useCaseError);
          return;
        }

        if (!useCaseData) {
          setError('Use case not found');
          return;
        }

        setUseCase(useCaseData as UseCase);

        // Fetch linked documents
        const { data: documentLinks, error: documentLinksError } = await supabase
          .from('document_use_case_links')
          .select('document_id')
          .eq('use_case_id', id);

        if (documentLinksError) {
          console.error('Error fetching document links:', documentLinksError);
        } else if (documentLinks && documentLinks.length > 0) {
          const documentIds = documentLinks.map(link => link.document_id);
          const { data: documentsData, error: documentsError } = await supabase
            .from('regulatory_documents')
            .select('*')
            .in('id', documentIds);

          if (documentsError) {
            console.error('Error fetching documents:', documentsError);
          } else {
            setLinkedDocuments(documentsData || []);
          }
        }

        // Fetch linked risk indicators
        const { data: riskLinks, error: riskLinksError } = await supabase
          .from('use_case_risk_links')
          .select('risk_indicator_id')
          .eq('use_case_id', id);

        if (riskLinksError) {
          console.error('Error fetching risk links:', riskLinksError);
        } else if (riskLinks && riskLinks.length > 0) {
          const riskIds = riskLinks.map(link => link.risk_indicator_id);
          const { data: risksData, error: risksError } = await supabase
            .from('risk_indicators')
            .select('*')
            .in('id', riskIds);

          if (risksError) {
            console.error('Error fetching risk indicators:', risksError);
          } else {
            setLinkedRiskIndicators(risksData || []);
          }
        }

        // Fetch available entities for linking
        const { data: allDocuments, error: allDocumentsError } = await supabase
          .from('regulatory_documents')
          .select('*');

        if (!allDocumentsError && allDocuments) {
          const linkedDocumentIds = documentLinks?.map(link => link.document_id) || [];
          const availableDocumentsData = allDocuments.filter(doc => !linkedDocumentIds.includes(doc.id));
          setAvailableDocuments(availableDocumentsData);
        }

        const { data: allRisks, error: allRisksError } = await supabase
          .from('risk_indicators')
          .select('*');

        if (!allRisksError && allRisks) {
          const linkedRiskIds = riskLinks?.map(link => link.risk_indicator_id) || [];
          const availableRisksData = allRisks.filter(risk => !linkedRiskIds.includes(risk.id));
          setAvailableRiskIndicators(availableRisksData);
        }

      } catch (error) {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUseCaseAndLinks();
  }, [id]);

  const handleLinkDocuments = (documentIds: number[]) => {
    console.log('Linking documents:', documentIds);
    // TODO: Implement actual linking logic
  };

  const handleUnlinkDocument = (documentId: number) => {
    console.log('Unlinking document:', documentId);
    // TODO: Implement actual unlinking logic
  };

  const handleLinkRiskIndicators = (riskIds: number[]) => {
    console.log('Linking risk indicators:', riskIds);
    // TODO: Implement actual linking logic
  };

  const handleUnlinkRiskIndicator = (riskId: number) => {
    console.log('Unlinking risk indicator:', riskId);
    // TODO: Implement actual unlinking logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-gray-600">Loading Use Case...</p>
        </div>
      </div>
    );
  }

  if (error || !useCase) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="ml-4 text-lg text-red-600">Error: {error || 'Use case not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{useCase.name}</h1>
            
            {/* Key Attributes */}
            {useCase.business_area && (
              <Card className="mb-6">
                <CardContent className="pt-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground mr-2">Business Area:</span>
                      <Badge className={getCategoryColor(useCase.business_area)}>{useCase.business_area}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Link to={`/use-cases/${id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                {/* Description Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Description</h3>
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {useCase.description || (
                      <span className="text-muted-foreground italic">No description available</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Relationship Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <RelationshipSection
                title="Documents"
                description="Regulatory documents associated with this use case"
                linkedEntities={linkedDocuments}
                availableEntities={availableDocuments}
                entityType="documents"
                onLink={handleLinkDocuments}
                onUnlink={handleUnlinkDocument}
              />
              
              <RelationshipSection
                title="Risk Indicators"
                description="Risk indicators identified for this use case"
                linkedEntities={linkedRiskIndicators}
                availableEntities={availableRiskIndicators}
                entityType="risk-indicators"
                onLink={handleLinkRiskIndicators}
                onUnlink={handleUnlinkRiskIndicator}
              />
            </div>
          </div>
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

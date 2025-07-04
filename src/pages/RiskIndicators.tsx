import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { AlertTriangle, Plus, Edit, Trash2, ExternalLink, LoaderCircle, AlertCircle, LayoutGrid, List, FileText } from 'lucide-react';
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

// Define the type for our RiskIndicator based on the database schema
export type RiskIndicator = {
  id: string;
  unique_risk_id: string;
  name: string;
  description: string | null;
  category: string | null;
  aml_typology: string | null;
  predicate_offence: string | null;
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

const RiskIndicatorsTable = ({ riskIndicators, handleViewDetails, handleDelete }: {
  riskIndicators: RiskIndicator[];
  handleViewDetails: (id: string) => void;
  handleDelete: (id: string) => void;
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>AML Typology</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {riskIndicators.map((risk) => (
            <TableRow key={risk.id} className="hover:bg-muted/50">
              <TableCell>
                <Badge variant="outline">{risk.unique_risk_id}</Badge>
              </TableCell>
              <TableCell className="font-medium">{risk.name}</TableCell>
              <TableCell>
                {risk.category ? (
                  <Badge className={getCategoryColor(risk.category)}>{risk.category}</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {risk.aml_typology || <span className="text-gray-400">-</span>}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(risk.id)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Link to={`/risk-indicators/${risk.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(risk.id)}
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

const RiskIndicatorsList = () => {
  const [riskIndicators, setRiskIndicators] = useState<RiskIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRiskIndicators = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('risk_indicators')
        .select('*');

      if (error) {
        setError(error.message);
        console.error('Error fetching risk indicators:', error);
      } else {
        setRiskIndicators(data as RiskIndicator[]);
      }
      setLoading(false);
    };

    fetchRiskIndicators();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this risk indicator?')) {
      // TODO: Implement Supabase delete logic
      console.log('Delete risk indicator:', id);
    }
  };

  const handleViewDetails = (id: string) => {
    console.log('Navigating to risk indicator:', id);
    navigate(`/risk-indicators/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-gray-600">Loading Risk Indicators...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Risk Indicators</h1>
            <p className="text-gray-600 mt-2">Identify and categorize risk factors</p>
          </div>
          <Link to="/risk-indicators/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Risk Indicator
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
            {riskIndicators.map((risk) => (
              <Card key={risk.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                    <div className="flex space-x-2">
                      <Link to={`/risk-indicators/${risk.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(risk.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{risk.name}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{risk.unique_risk_id}</Badge>
                      {risk.category && <Badge variant="secondary">{risk.category}</Badge>}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {risk.description || 'No description available'}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewDetails(risk.id)}
                  >
                    View Details
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <RiskIndicatorsTable 
            riskIndicators={riskIndicators}
            handleViewDetails={handleViewDetails}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

const RiskIndicatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [riskIndicator, setRiskIndicator] = useState<RiskIndicator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Linked entities state
  const [linkedUseCases, setLinkedUseCases] = useState<any[]>([]);
  const [linkedFeatures, setLinkedFeatures] = useState<any[]>([]);
  const [availableUseCases, setAvailableUseCases] = useState<any[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<any[]>([]);

  useEffect(() => {
    const fetchRiskIndicatorAndLinks = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Fetch the main risk indicator
        const { data: riskData, error: riskError } = await supabase
          .from('risk_indicators')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (riskError) {
          setError(riskError.message);
          console.error('Error fetching risk indicator:', riskError);
          return;
        }

        if (!riskData) {
          setError('Risk indicator not found');
          return;
        }

        setRiskIndicator(riskData as RiskIndicator);

        // Fetch linked use cases
        const { data: useCaseLinks, error: useCaseLinksError } = await supabase
          .from('use_case_risk_links')
          .select('use_case_id')
          .eq('risk_indicator_id', id);

        if (useCaseLinksError) {
          console.error('Error fetching use case links:', useCaseLinksError);
        } else if (useCaseLinks && useCaseLinks.length > 0) {
          const useCaseIds = useCaseLinks.map(link => link.use_case_id);
          const { data: useCasesData, error: useCasesError } = await supabase
            .from('use_cases')
            .select('*')
            .in('id', useCaseIds);

          if (useCasesError) {
            console.error('Error fetching use cases:', useCasesError);
          } else {
            setLinkedUseCases(useCasesData || []);
          }
        }

        // Fetch linked features
        const { data: featureLinks, error: featureLinksError } = await supabase
          .from('risk_feature_links')
          .select('feature_id')
          .eq('risk_indicator_id', id);

        if (featureLinksError) {
          console.error('Error fetching feature links:', featureLinksError);
        } else if (featureLinks && featureLinks.length > 0) {
          const featureIds = featureLinks.map(link => link.feature_id);
          const { data: featuresData, error: featuresError } = await supabase
            .from('features')
            .select('*')
            .in('id', featureIds);

          if (featuresError) {
            console.error('Error fetching features:', featuresError);
          } else {
            setLinkedFeatures(featuresData || []);
          }
        }

        // Fetch available entities for linking (optional - for future functionality)
        const { data: allUseCases, error: allUseCasesError } = await supabase
          .from('use_cases')
          .select('*');

        if (!allUseCasesError && allUseCases) {
          const linkedUseCaseIds = useCaseLinks?.map(link => link.use_case_id) || [];
          const availableUseCasesData = allUseCases.filter(uc => !linkedUseCaseIds.includes(uc.id));
          setAvailableUseCases(availableUseCasesData);
        }

        const { data: allFeatures, error: allFeaturesError } = await supabase
          .from('features')
          .select('*');

        if (!allFeaturesError && allFeatures) {
          const linkedFeatureIds = featureLinks?.map(link => link.feature_id) || [];
          const availableFeaturesData = allFeatures.filter(f => !linkedFeatureIds.includes(f.id));
          setAvailableFeatures(availableFeaturesData);
        }

      } catch (error) {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRiskIndicatorAndLinks();
  }, [id]);

  const handleLinkUseCases = (useCaseIds: number[]) => {
    console.log('Linking use cases:', useCaseIds);
    // TODO: Implement actual linking logic
  };

  const handleUnlinkUseCase = (useCaseId: number) => {
    console.log('Unlinking use case:', useCaseId);
    // TODO: Implement actual unlinking logic
  };

  const handleLinkFeatures = (featureIds: number[]) => {
    console.log('Linking features:', featureIds);
    // TODO: Implement actual linking logic
  };

  const handleUnlinkFeature = (featureId: number) => {
    console.log('Unlinking feature:', featureId);
    // TODO: Implement actual unlinking logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-gray-600">Loading Risk Indicator...</p>
        </div>
      </div>
    );
  }

  if (error || !riskIndicator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="ml-4 text-lg text-red-600">Error: {error || 'Risk indicator not found'}</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{riskIndicator.name}</h1>
            
            {/* Key Attributes */}
            <Card className="mb-6">
              <CardContent className="pt-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground mr-2">ID:</span>
                    <Badge variant="outline">{riskIndicator.unique_risk_id}</Badge>
                  </div>
                  {riskIndicator.category && (
                    <div>
                      <span className="text-xs text-muted-foreground mr-2">Category:</span>
                      <Badge className={getCategoryColor(riskIndicator.category)}>{riskIndicator.category}</Badge>
                    </div>
                  )}
                  {riskIndicator.aml_typology && (
                    <div>
                      <span className="text-xs text-muted-foreground mr-2">AML Typology:</span>
                      <Badge variant="secondary">{riskIndicator.aml_typology}</Badge>
                    </div>
                  )}
                  {riskIndicator.predicate_offence && (
                    <div>
                      <span className="text-xs text-muted-foreground mr-2">Predicate Offence:</span>
                      <Badge variant="outline">{riskIndicator.predicate_offence}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Link to={`/risk-indicators/${id}/edit`}>
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
                    {riskIndicator.description || (
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
                title="Use Cases"
                description="Business use cases that utilize this risk indicator"
                linkedEntities={linkedUseCases}
                availableEntities={availableUseCases}
                entityType="use-cases"
                onLink={handleLinkUseCases}
                onUnlink={handleUnlinkUseCase}
              />
              
              <RelationshipSection
                title="Features"
                description="Technical features associated with this risk indicator"
                linkedEntities={linkedFeatures}
                availableEntities={availableFeatures}
                entityType="features"
                onLink={handleLinkFeatures}
                onUnlink={handleUnlinkFeature}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskIndicatorForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Risk Indicator (Coming Soon)' : 'New Risk Indicator (Coming Soon)'}
          </h1>
          <Link to="/risk-indicators">
            <Button className="mt-4">Back to Risk Indicators</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const RiskIndicators = () => {
  return (
    <Routes>
      <Route path="/" element={<RiskIndicatorsList />} />
      <Route path="/new" element={<RiskIndicatorForm />} />
      <Route path="/:id" element={<RiskIndicatorDetail />} />
      <Route path="/:id/edit" element={<RiskIndicatorForm isEdit={true} />} />
    </Routes>
  );
};

export default RiskIndicators;

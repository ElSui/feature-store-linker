import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { Cpu, Plus, Edit, Trash2, ExternalLink, LoaderCircle, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';
import RelationshipSection from '@/components/RelationshipSection';
import { supabase } from '@/integrations/supabase/client';

// Define the type for our Feature based on the database schema
export type Feature = {
  id: string; // UUID from Supabase
  name: string;
  type: 'AI Model Feature' | 'Simple Rule' | 'Calculation' | 'Value' | 'Volume' | 'Ratio';
  description: string;
  logic_summary: string;
  required_columns: string[];
  is_pc: boolean;
  is_rb: boolean;
  unique_feature_id: string;
  category: string;
  lookback_period: string;
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

const FeaturesTable = ({ features, onDelete, onViewDetails }: { 
  features: Feature[]; 
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Context</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-sm">
                <Badge variant="outline">{feature.unique_feature_id}</Badge>
              </TableCell>
              <TableCell className="font-medium">{feature.name}</TableCell>
              <TableCell>
                {feature.category ? (
                  <Badge className={getCategoryColor(feature.category)}>{feature.category}</Badge>
                ) : (
                  <span className="text-gray-400">Uncategorized</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{feature.type}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {feature.is_pc && <Badge variant="secondary">PC</Badge>}
                  {feature.is_rb && <Badge variant="secondary">RB</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(feature.id)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Link to={`/features/${feature.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(feature.id)}
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

const FeaturesList = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('features')
        .select('*');

      if (error) {
        setError(error.message);
        console.error('Error fetching features:', error);
      } else {
        setFeatures(data as Feature[]);
      }
      setLoading(false);
    };

    fetchFeatures();
  }, []);

  const handleDelete = (id: string) => {
    // Note: We will implement the Supabase delete logic in a future step.
    alert(`(Placeholder) Are you sure you want to delete feature with ID: ${id}?`);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/features/${id}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'AI Model Feature':
      case 'Value':
        return 'bg-blue-500 text-white';
      case 'Simple Rule':
      case 'Rule':
        return 'bg-green-500 text-white';
      case 'Calculation':
      case 'Ratio':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-gray-600">Loading Features...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Features</h1>
            <p className="text-gray-600 mt-2">Manage all features from the central database</p>
          </div>
          <Link to="/features/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Feature
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
              <LayoutGrid className="w-4 h-4 mr-2" />
              Card
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="w-4 h-4 mr-2" />
              List
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Cpu className="w-8 h-8 text-purple-500" />
                    <div className="flex space-x-2">
                      <Link to={`/features/${feature.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(feature.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg pt-2">{feature.name}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{feature.unique_feature_id}</Badge>
                      <Badge className={getTypeColor(feature.type)}>{feature.type}</Badge>
                      {feature.is_pc && <Badge variant="secondary">PC</Badge>}
                      {feature.is_rb && <Badge variant="secondary">RB</Badge>}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="text-gray-600 text-sm mb-4 line-clamp-3">{feature.description}</div>
                  <Button
                    variant="outline"
                    className="w-full mt-auto"
                    onClick={() => handleViewDetails(feature.id)}
                  >
                    View Details
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <FeaturesTable 
            features={features}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>
    </div>
  );
};

const FeatureDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State variables for data and UI state
  const [feature, setFeature] = useState<Feature | null>(null);
  const [linkedRiskIndicators, setLinkedRiskIndicators] = useState<any[]>([]);
  const [availableRiskIndicators, setAvailableRiskIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatureData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);

      try {
        // Fetch the feature
        const { data: featureData, error: featureError } = await supabase
          .from('features')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (featureError) throw featureError;
        if (!featureData) {
          setError('Feature not found');
          setLoading(false);
          return;
        }

        setFeature(featureData as Feature);

        // Fetch linked risk indicators
        const { data: linkedRisks, error: linkedError } = await supabase
          .from('risk_feature_links')
          .select(`
            risk_indicators (
              id,
              name,
              description,
              category,
              aml_typology,
              predicate_offence,
              unique_risk_id
            )
          `)
          .eq('feature_id', id);

        if (linkedError) throw linkedError;

        const linkedRiskData = linkedRisks?.map(link => link.risk_indicators).filter(Boolean) || [];
        setLinkedRiskIndicators(linkedRiskData);

        // Fetch all risk indicators
        const { data: allRisks, error: allRisksError } = await supabase
          .from('risk_indicators')
          .select('*');

        if (allRisksError) throw allRisksError;

        // Calculate available (unlinked) risk indicators
        const linkedIds = linkedRiskData.map(risk => risk.id);
        const availableRisks = (allRisks || []).filter(risk => !linkedIds.includes(risk.id));
        setAvailableRiskIndicators(availableRisks);

      } catch (err: any) {
        console.error('Error fetching feature data:', err);
        setError(err.message || 'Failed to load feature data');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureData();
  }, [id]);

  const handleLinkRiskIndicators = async (riskIds: number[]) => {
    if (!id) return;

    try {
      // Insert new links in the risk_feature_links table
      const linksToInsert = riskIds.map(riskId => ({
        feature_id: id,
        risk_indicator_id: riskId.toString()
      }));

      const { error } = await supabase
        .from('risk_feature_links')
        .insert(linksToInsert);

      if (error) throw error;

      // Refetch data to update the UI
      const fetchUpdatedData = async () => {
        const { data: linkedRisks, error: linkedError } = await supabase
          .from('risk_feature_links')
          .select(`
            risk_indicators (
              id,
              name,
              description,
              category,
              aml_typology,
              predicate_offence,
              unique_risk_id
            )
          `)
          .eq('feature_id', id);

        if (!linkedError) {
          const linkedRiskData = linkedRisks?.map(link => link.risk_indicators).filter(Boolean) || [];
          setLinkedRiskIndicators(linkedRiskData);

          // Update available risks
          const linkedIds = linkedRiskData.map(risk => risk.id);
          setAvailableRiskIndicators(prev => prev.filter(risk => !linkedIds.includes(risk.id)));
        }
      };

      await fetchUpdatedData();
    } catch (err: any) {
      console.error('Error linking risk indicators:', err);
      alert('Failed to link risk indicators: ' + err.message);
    }
  };

  const handleUnlinkRiskIndicator = async (riskId: number) => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('risk_feature_links')
        .delete()
        .eq('feature_id', id)
        .eq('risk_indicator_id', riskId.toString());

      if (error) throw error;

      // Update state locally
      const unlinkedRisk = linkedRiskIndicators.find(risk => risk.id === riskId.toString());
      if (unlinkedRisk) {
        setLinkedRiskIndicators(prev => prev.filter(risk => risk.id !== riskId.toString()));
        setAvailableRiskIndicators(prev => [...prev, unlinkedRisk]);
      }
    } catch (err: any) {
      console.error('Error unlinking risk indicator:', err);
      alert('Failed to unlink risk indicator: ' + err.message);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'AI Model Feature':
        return 'default';
      case 'Simple Rule':
        return 'secondary';
      case 'Calculation':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-gray-600">Loading Feature Details...</p>
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

  if (!feature) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Feature not found</h1>
            <Link to="/features">
              <Button className="mt-4">Back to Features</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Features', href: '/features' },
    { label: feature.name, type: 'feature' as const }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{feature.name}</h1>
            <Link to={`/features/${feature.id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
          
          {/* Badge Group */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{feature.unique_feature_id}</Badge>
            {feature.category && (
              <Badge className={getCategoryColor(feature.category)}>
                {feature.category}
              </Badge>
            )}
            <Badge variant="outline">{feature.type}</Badge>
            {feature.is_pc && <Badge variant="secondary">PC</Badge>}
            {feature.is_rb && <Badge variant="secondary">RB</Badge>}
          </div>
        </div>

        {/* Two-column grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="mt-1 text-base">{feature.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Logic Summary</h3>
                  <p className="mt-1 text-base">{feature.logic_summary}</p>
                </div>
                
                {feature.required_columns && feature.required_columns.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Required Columns</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {feature.required_columns.map((column, index) => (
                        <Badge key={index} variant="secondary">{column}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Relationship Section */}
          <div className="lg:col-span-1">
            <RelationshipSection
              title="Risk Indicators"
              description="Risk indicators associated with this feature"
              linkedEntities={linkedRiskIndicators}
              availableEntities={availableRiskIndicators}
              entityType="risk-indicators"
              onLink={handleLinkRiskIndicators}
              onUnlink={handleUnlinkRiskIndicator}
              getBadgeInfo={(risk) => ({ text: risk.category || 'Uncategorized' })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: 'AI Model Feature' as 'AI Model Feature' | 'Simple Rule' | 'Calculation',
    description: '',
    logic_summary: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase form submission
    console.log('Form submission not yet implemented');
    navigate('/features');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/features" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Features
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Feature' : 'New Feature'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Feature' : 'Create New Feature'}</CardTitle>
            <CardDescription>
              {isEdit ? 'Update the feature information' : 'Fill in the details for the new feature'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Feature Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., High-Risk Jurisdiction Transaction Count"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'AI Model Feature' | 'Simple Rule' | 'Calculation'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="AI Model Feature">AI Model Feature</option>
                  <option value="Simple Rule">Simple Rule</option>
                  <option value="Calculation">Calculation</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the feature"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="logic_summary">Logic Summary</Label>
                <Textarea
                  id="logic_summary"
                  value={formData.logic_summary}
                  onChange={(e) => setFormData({...formData, logic_summary: e.target.value})}
                  placeholder="Explanation of how the feature logic works (include technology stack if applicable)"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/features')}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? 'Update Feature' : 'Create Feature'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <Routes>
      <Route path="/" element={<FeaturesList />} />
      <Route path="/new" element={<FeatureForm />} />
      <Route path="/:id" element={<FeatureDetail />} />
      <Route path="/:id/edit" element={<FeatureForm isEdit={true} />} />
    </Routes>
  );
};

export default Features;

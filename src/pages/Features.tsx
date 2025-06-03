import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Cpu, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dataStore } from '@/store/dataStore';
import Navigation from '@/components/Navigation';

const FeaturesList = () => {
  const features = dataStore.getFeatures();
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      dataStore.deleteFeature(id);
      navigate('/features', { replace: true });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'AI Model Feature':
        return 'bg-blue-500 text-white';
      case 'Simple Rule':
        return 'bg-green-500 text-white';
      case 'Calculation':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Features</h1>
            <p className="text-gray-600 mt-2">Manage AI models, rules and calculations</p>
          </div>
          <Link to="/features/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Feature
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.id} className="hover:shadow-lg transition-shadow">
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
                <CardTitle className="text-lg">{feature.name}</CardTitle>
                <CardDescription>
                  <Badge className={`mt-2 ${getTypeColor(feature.type)}`}>
                    {feature.type}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{feature.description}</p>
                <Link to={`/features/${feature.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

import Breadcrumb from '@/components/Breadcrumb';
import RelationshipSection from '@/components/RelationshipSection';

const FeatureDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const feature = dataStore.getFeature(Number(id));
  const linkedRiskIndicators = dataStore.getLinkedRiskIndicatorsForFeature(Number(id));
  
  const allRiskIndicators = dataStore.getRiskIndicators();
  const unlinkedRiskIndicators = allRiskIndicators.filter(risk => !linkedRiskIndicators.find(linked => linked.id === risk.id));

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

  const handleLinkRiskIndicators = (riskIds: number[]) => {
    riskIds.forEach(riskId => {
      dataStore.addRiskFeatureLink(riskId, feature.id);
    });
    navigate(`/features/${feature.id}`, { replace: true });
  };

  const handleUnlinkRiskIndicator = (riskId: number) => {
    dataStore.removeRiskFeatureLink(riskId, feature.id);
    navigate(`/features/${feature.id}`, { replace: true });
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

  const breadcrumbItems = [
    { label: 'Features', href: '/features' },
    { label: feature.name, type: 'feature' as const }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{feature.name}</h1>
              <Badge className={`mt-2 ${getTypeColor(feature.type)} text-white`}>
                {feature.type}
              </Badge>
            </div>
            <Link to={`/features/${feature.id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Feature Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Logic Summary</h3>
                  <p className="text-gray-600">{feature.logic_summary}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <RelationshipSection
              title="Linked Risk Indicators"
              description="Risk indicators associated with this feature"
              linkedEntities={linkedRiskIndicators}
              availableEntities={unlinkedRiskIndicators}
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
  const existingFeature = isEdit ? dataStore.getFeature(Number(id)) : null;

  const [formData, setFormData] = useState({
    name: existingFeature?.name || '',
    type: existingFeature?.type || 'AI Model Feature' as 'AI Model Feature' | 'Simple Rule' | 'Calculation',
    description: existingFeature?.description || '',
    logic_summary: existingFeature?.logic_summary || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && existingFeature) {
      dataStore.updateFeature(existingFeature.id, formData);
      navigate(`/features/${existingFeature.id}`);
    } else {
      const newFeature = dataStore.addFeature(formData);
      navigate(`/features/${newFeature.id}`);
    }
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
  const { id, action } = useParams<{ id?: string; action?: string }>();
  
  if (action === 'edit') {
    return <FeatureForm isEdit={true} />;
  }
  
  if (id === 'new') {
    return <FeatureForm />;
  }
  
  if (id) {
    return <FeatureDetail />;
  }
  
  return <FeaturesList />;
};

export default Features;

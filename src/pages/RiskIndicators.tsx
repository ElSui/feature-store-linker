import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dataStore } from '@/store/dataStore';
import Navigation from '@/components/Navigation';

const RiskIndicatorsList = () => {
  const riskIndicators = dataStore.getRiskIndicators();
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this risk indicator?')) {
      dataStore.deleteRiskIndicator(id);
      navigate('/risk-indicators', { replace: true });
    }
  };

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
                  <Badge variant="secondary" className="mt-2">{risk.category}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{risk.description}</p>
                <Link to={`/risk-indicators/${risk.id}`}>
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

const RiskIndicatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const riskIndicator = dataStore.getRiskIndicator(Number(id));
  const linkedUseCases = dataStore.getLinkedUseCasesForRiskIndicator(Number(id));
  const linkedFeatures = dataStore.getLinkedFeaturesForRiskIndicator(Number(id));
  
  const allUseCases = dataStore.getUseCases();
  const allFeatures = dataStore.getFeatures();
  const unlinkedUseCases = allUseCases.filter(uc => !linkedUseCases.find(linked => linked.id === uc.id));
  const unlinkedFeatures = allFeatures.filter(feature => !linkedFeatures.find(linked => linked.id === feature.id));

  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>('');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');

  if (!riskIndicator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Risk indicator not found</h1>
            <Link to="/risk-indicators">
              <Button className="mt-4">Back to Risk Indicators</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddUseCaseLink = () => {
    if (selectedUseCaseId) {
      dataStore.addUseCaseRiskLink(Number(selectedUseCaseId), riskIndicator.id);
      setSelectedUseCaseId('');
      navigate(`/risk-indicators/${riskIndicator.id}`, { replace: true });
    }
  };

  const handleAddFeatureLink = () => {
    if (selectedFeatureId) {
      dataStore.addRiskFeatureLink(riskIndicator.id, Number(selectedFeatureId));
      setSelectedFeatureId('');
      navigate(`/risk-indicators/${riskIndicator.id}`, { replace: true });
    }
  };

  const handleRemoveUseCaseLink = (useCaseId: number) => {
    dataStore.removeUseCaseRiskLink(useCaseId, riskIndicator.id);
    navigate(`/risk-indicators/${riskIndicator.id}`, { replace: true });
  };

  const handleRemoveFeatureLink = (featureId: number) => {
    dataStore.removeRiskFeatureLink(riskIndicator.id, featureId);
    navigate(`/risk-indicators/${riskIndicator.id}`, { replace: true });
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
        <div className="mb-6">
          <Link to="/risk-indicators" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Risk Indicators
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{riskIndicator.name}</h1>
              <Badge className="mt-2">{riskIndicator.category}</Badge>
            </div>
            <Link to={`/risk-indicators/${riskIndicator.id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Risk Indicator Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600 mt-2">{riskIndicator.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Linked Use Cases</CardTitle>
                <CardDescription>Use cases associated with this risk indicator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {linkedUseCases.map((useCase) => (
                    <div key={useCase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <Link to={`/use-cases/${useCase.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {useCase.name}
                        </Link>
                        <p className="text-sm text-gray-600">{useCase.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUseCaseLink(useCase.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {unlinkedUseCases.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <Label htmlFor="usecase-select">Add Use Case Link</Label>
                      <div className="flex gap-2 mt-2">
                        <select
                          id="usecase-select"
                          value={selectedUseCaseId}
                          onChange={(e) => setSelectedUseCaseId(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select a use case...</option>
                          {unlinkedUseCases.map((useCase) => (
                            <option key={useCase.id} value={useCase.id}>
                              {useCase.name}
                            </option>
                          ))}
                        </select>
                        <Button onClick={handleAddUseCaseLink} disabled={!selectedUseCaseId}>
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Linked Features</CardTitle>
                <CardDescription>Features (AI models, rules, calculations) associated with this risk indicator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {linkedFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <Link to={`/features/${feature.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {feature.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getTypeColor(feature.type)}`}>
                            {feature.type}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFeatureLink(feature.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {unlinkedFeatures.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <Label htmlFor="feature-select">Add Feature Link</Label>
                      <div className="flex gap-2 mt-2">
                        <select
                          id="feature-select"
                          value={selectedFeatureId}
                          onChange={(e) => setSelectedFeatureId(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select a feature...</option>
                          {unlinkedFeatures.map((feature) => (
                            <option key={feature.id} value={feature.id}>
                              {feature.name} ({feature.type})
                            </option>
                          ))}
                        </select>
                        <Button onClick={handleAddFeatureLink} disabled={!selectedFeatureId}>
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskIndicatorForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existingRisk = isEdit ? dataStore.getRiskIndicator(Number(id)) : null;

  const [formData, setFormData] = useState({
    name: existingRisk?.name || '',
    description: existingRisk?.description || '',
    category: existingRisk?.category || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && existingRisk) {
      dataStore.updateRiskIndicator(existingRisk.id, formData);
      navigate(`/risk-indicators/${existingRisk.id}`);
    } else {
      const newRisk = dataStore.addRiskIndicator(formData);
      navigate(`/risk-indicators/${newRisk.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/risk-indicators" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Risk Indicators
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Risk Indicator' : 'New Risk Indicator'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Risk Indicator' : 'Create New Risk Indicator'}</CardTitle>
            <CardDescription>
              {isEdit ? 'Update the risk indicator information' : 'Fill in the details for the new risk indicator'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Risk Indicator Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Transactions to/from High-Risk Jurisdictions"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g., Geographic, Velocity, Digital Assets"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the risk indicator"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/risk-indicators')}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? 'Update Risk Indicator' : 'Create Risk Indicator'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const RiskIndicators = () => {
  const { id, action } = useParams<{ id?: string; action?: string }>();
  
  if (action === 'edit') {
    return <RiskIndicatorForm isEdit={true} />;
  }
  
  if (id === 'new') {
    return <RiskIndicatorForm />;
  }
  
  if (id) {
    return <RiskIndicatorDetail />;
  }
  
  return <RiskIndicatorsList />;
};

export default RiskIndicators;

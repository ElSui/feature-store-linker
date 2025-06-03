
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Shield, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dataStore } from '@/store/dataStore';
import Navigation from '@/components/Navigation';

const ControlsList = () => {
  const controls = dataStore.getControls();
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this control?')) {
      dataStore.deleteControl(id);
      navigate('/controls', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Controls</h1>
            <p className="text-gray-600 mt-2">Manage features and rules for compliance</p>
          </div>
          <Link to="/controls/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Control
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {controls.map((control) => (
            <Card key={control.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Shield className="w-8 h-8 text-purple-500" />
                  <div className="flex space-x-2">
                    <Link to={`/controls/${control.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(control.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{control.name}</CardTitle>
                <CardDescription>
                  <Badge 
                    variant={control.type === 'Feature' ? 'default' : 'secondary'} 
                    className="mt-2"
                  >
                    {control.type}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{control.description}</p>
                <Link to={`/controls/${control.id}`}>
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

const ControlDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = dataStore.getControl(Number(id));
  const linkedRiskIndicators = dataStore.getLinkedRiskIndicatorsForControl(Number(id));
  
  const allRiskIndicators = dataStore.getRiskIndicators();
  const unlinkedRiskIndicators = allRiskIndicators.filter(risk => !linkedRiskIndicators.find(linked => linked.id === risk.id));

  const [selectedRiskId, setSelectedRiskId] = useState<string>('');

  if (!control) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Control not found</h1>
            <Link to="/controls">
              <Button className="mt-4">Back to Controls</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddRiskLink = () => {
    if (selectedRiskId) {
      dataStore.addRiskControlLink(Number(selectedRiskId), control.id);
      setSelectedRiskId('');
      navigate(`/controls/${control.id}`, { replace: true });
    }
  };

  const handleRemoveRiskLink = (riskId: number) => {
    dataStore.removeRiskControlLink(riskId, control.id);
    navigate(`/controls/${control.id}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/controls" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Controls
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{control.name}</h1>
              <Badge className="mt-2" variant={control.type === 'Feature' ? 'default' : 'secondary'}>
                {control.type}
              </Badge>
            </div>
            <Link to={`/controls/${control.id}/edit`}>
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
                <CardTitle>Control Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600">{control.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Logic Summary</h3>
                  <p className="text-gray-600">{control.logic_summary}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Linked Risk Indicators</CardTitle>
                <CardDescription>Risk indicators associated with this control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {linkedRiskIndicators.map((risk) => (
                    <div key={risk.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <Link to={`/risk-indicators/${risk.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {risk.name}
                        </Link>
                        <p className="text-sm text-gray-600">{risk.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRiskLink(risk.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {unlinkedRiskIndicators.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <Label htmlFor="risk-select">Add Risk Indicator Link</Label>
                      <div className="flex gap-2 mt-2">
                        <select
                          id="risk-select"
                          value={selectedRiskId}
                          onChange={(e) => setSelectedRiskId(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select a risk indicator...</option>
                          {unlinkedRiskIndicators.map((risk) => (
                            <option key={risk.id} value={risk.id}>
                              {risk.name}
                            </option>
                          ))}
                        </select>
                        <Button onClick={handleAddRiskLink} disabled={!selectedRiskId}>
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

const ControlForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existingControl = isEdit ? dataStore.getControl(Number(id)) : null;

  const [formData, setFormData] = useState({
    name: existingControl?.name || '',
    type: existingControl?.type || 'Feature' as 'Feature' | 'Rule',
    description: existingControl?.description || '',
    logic_summary: existingControl?.logic_summary || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && existingControl) {
      dataStore.updateControl(existingControl.id, formData);
      navigate(`/controls/${existingControl.id}`);
    } else {
      const newControl = dataStore.addControl(formData);
      navigate(`/controls/${newControl.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/controls" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Controls
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Control' : 'New Control'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Control' : 'Create New Control'}</CardTitle>
            <CardDescription>
              {isEdit ? 'Update the control information' : 'Fill in the details for the new control'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Control Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., High-Risk Jurisdiction Velocity Alert"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'Feature' | 'Rule'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Feature">Feature</option>
                  <option value="Rule">Rule</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the control"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="logic_summary">Logic Summary</Label>
                <Textarea
                  id="logic_summary"
                  value={formData.logic_summary}
                  onChange={(e) => setFormData({...formData, logic_summary: e.target.value})}
                  placeholder="Explanation of how the control logic works"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/controls')}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? 'Update Control' : 'Create Control'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Controls = () => {
  const { id, action } = useParams<{ id?: string; action?: string }>();
  
  if (action === 'edit') {
    return <ControlForm isEdit={true} />;
  }
  
  if (id === 'new') {
    return <ControlForm />;
  }
  
  if (id) {
    return <ControlDetail />;
  }
  
  return <ControlsList />;
};

export default Controls;

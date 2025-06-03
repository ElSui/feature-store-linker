
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Target, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dataStore } from '@/store/dataStore';
import Navigation from '@/components/Navigation';

const UseCasesList = () => {
  const useCases = dataStore.getUseCases();
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this use case?')) {
      dataStore.deleteUseCase(id);
      navigate('/use-cases', { replace: true });
    }
  };

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
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{useCase.description}</p>
                <Link to={`/use-cases/${useCase.id}`}>
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

const UseCaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const useCase = dataStore.getUseCase(Number(id));
  const linkedDocuments = dataStore.getLinkedDocumentsForUseCase(Number(id));
  const linkedRiskIndicators = dataStore.getLinkedRiskIndicatorsForUseCase(Number(id));
  
  const allDocuments = dataStore.getDocuments();
  const allRiskIndicators = dataStore.getRiskIndicators();
  const unlinkedDocuments = allDocuments.filter(doc => !linkedDocuments.find(linked => linked.id === doc.id));
  const unlinkedRiskIndicators = allRiskIndicators.filter(risk => !linkedRiskIndicators.find(linked => linked.id === risk.id));

  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [selectedRiskId, setSelectedRiskId] = useState<string>('');

  if (!useCase) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Use case not found</h1>
            <Link to="/use-cases">
              <Button className="mt-4">Back to Use Cases</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddDocumentLink = () => {
    if (selectedDocumentId) {
      dataStore.addDocumentUseCaseLink(Number(selectedDocumentId), useCase.id);
      setSelectedDocumentId('');
      navigate(`/use-cases/${useCase.id}`, { replace: true });
    }
  };

  const handleAddRiskLink = () => {
    if (selectedRiskId) {
      dataStore.addUseCaseRiskLink(useCase.id, Number(selectedRiskId));
      setSelectedRiskId('');
      navigate(`/use-cases/${useCase.id}`, { replace: true });
    }
  };

  const handleRemoveDocumentLink = (documentId: number) => {
    dataStore.removeDocumentUseCaseLink(documentId, useCase.id);
    navigate(`/use-cases/${useCase.id}`, { replace: true });
  };

  const handleRemoveRiskLink = (riskId: number) => {
    dataStore.removeUseCaseRiskLink(useCase.id, riskId);
    navigate(`/use-cases/${useCase.id}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/use-cases" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Use Cases
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{useCase.name}</h1>
            </div>
            <Link to={`/use-cases/${useCase.id}/edit`}>
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
                <CardTitle>Use Case Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600 mt-2">{useCase.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Linked Documents</CardTitle>
                <CardDescription>Regulatory documents associated with this use case</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {linkedDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <Link to={`/documents/${document.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {document.name}
                        </Link>
                        <p className="text-sm text-gray-600">{document.source} - {document.region}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDocumentLink(document.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {unlinkedDocuments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <Label htmlFor="document-select">Add Document Link</Label>
                      <div className="flex gap-2 mt-2">
                        <select
                          id="document-select"
                          value={selectedDocumentId}
                          onChange={(e) => setSelectedDocumentId(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select a document...</option>
                          {unlinkedDocuments.map((document) => (
                            <option key={document.id} value={document.id}>
                              {document.name}
                            </option>
                          ))}
                        </select>
                        <Button onClick={handleAddDocumentLink} disabled={!selectedDocumentId}>
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
                <CardTitle>Linked Risk Indicators</CardTitle>
                <CardDescription>Risk indicators associated with this use case</CardDescription>
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

const UseCaseForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existingUseCase = isEdit ? dataStore.getUseCase(Number(id)) : null;

  const [formData, setFormData] = useState({
    name: existingUseCase?.name || '',
    description: existingUseCase?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && existingUseCase) {
      dataStore.updateUseCase(existingUseCase.id, formData);
      navigate(`/use-cases/${existingUseCase.id}`);
    } else {
      const newUseCase = dataStore.addUseCase(formData);
      navigate(`/use-cases/${newUseCase.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/use-cases" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Use Cases
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Use Case' : 'New Use Case'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Use Case' : 'Create New Use Case'}</CardTitle>
            <CardDescription>
              {isEdit ? 'Update the use case information' : 'Fill in the details for the new use case'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Use Case Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Cross-Border Payments"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the use case"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/use-cases')}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? 'Update Use Case' : 'Create Use Case'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UseCases = () => {
  const { id, action } = useParams<{ id?: string; action?: string }>();
  
  if (action === 'edit') {
    return <UseCaseForm isEdit={true} />;
  }
  
  if (id === 'new') {
    return <UseCaseForm />;
  }
  
  if (id) {
    return <UseCaseDetail />;
  }
  
  return <UseCasesList />;
};

export default UseCases;

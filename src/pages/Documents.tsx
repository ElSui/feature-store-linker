
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dataStore, RegulatoryDocument } from '@/store/dataStore';
import Navigation from '@/components/Navigation';

const DocumentsList = () => {
  const documents = dataStore.getDocuments();
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      dataStore.deleteDocument(id);
      // Force re-render by navigating to same route
      navigate('/documents', { replace: true });
    }
  };

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
                    <Badge variant="secondary">{document.source}</Badge>
                    <Badge variant="outline">{document.region}</Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{document.summary}</p>
                <p className="text-xs text-gray-500 mb-4">Published: {document.publication_date}</p>
                <Link to={`/documents/${document.id}`}>
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

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const document = dataStore.getDocument(Number(id));
  const linkedUseCases = dataStore.getLinkedUseCasesForDocument(Number(id));
  const allUseCases = dataStore.getUseCases();
  const unlinkedUseCases = allUseCases.filter(uc => !linkedUseCases.find(linked => linked.id === uc.id));

  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>('');

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Document not found</h1>
            <Link to="/documents">
              <Button className="mt-4">Back to Documents</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddLink = () => {
    if (selectedUseCaseId) {
      dataStore.addDocumentUseCaseLink(document.id, Number(selectedUseCaseId));
      setSelectedUseCaseId('');
      // Force re-render
      navigate(`/documents/${document.id}`, { replace: true });
    }
  };

  const handleRemoveLink = (useCaseId: number) => {
    dataStore.removeDocumentUseCaseLink(document.id, useCaseId);
    navigate(`/documents/${document.id}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/documents" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Documents
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{document.name}</h1>
              <div className="flex gap-2 mt-2">
                <Badge>{document.source}</Badge>
                <Badge variant="outline">{document.region}</Badge>
              </div>
            </div>
            <Link to={`/documents/${document.id}/edit`}>
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
                <CardTitle>Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Publication Date</h3>
                  <p className="text-gray-600">{document.publication_date}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Summary</h3>
                  <p className="text-gray-600">{document.summary}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Linked Use Cases</CardTitle>
                <CardDescription>Use cases associated with this document</CardDescription>
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
                        onClick={() => handleRemoveLink(useCase.id)}
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
                        <Button onClick={handleAddLink} disabled={!selectedUseCaseId}>
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

const DocumentForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existingDocument = isEdit ? dataStore.getDocument(Number(id)) : null;

  const [formData, setFormData] = useState({
    name: existingDocument?.name || '',
    source: existingDocument?.source || '',
    region: existingDocument?.region || '',
    publication_date: existingDocument?.publication_date || '',
    summary: existingDocument?.summary || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && existingDocument) {
      dataStore.updateDocument(existingDocument.id, formData);
      navigate(`/documents/${existingDocument.id}`);
    } else {
      const newDocument = dataStore.addDocument(formData);
      navigate(`/documents/${newDocument.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/documents" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Documents
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Document' : 'New Document'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Document' : 'Create New Document'}</CardTitle>
            <CardDescription>
              {isEdit ? 'Update the document information' : 'Fill in the details for the new regulatory document'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Document Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., FATF Guidance on Digital Assets"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    placeholder="e.g., FATF"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    placeholder="e.g., Global, EU, Nigeria"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="publication_date">Publication Date</Label>
                <Input
                  id="publication_date"
                  type="date"
                  value={formData.publication_date}
                  onChange={(e) => setFormData({...formData, publication_date: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  placeholder="Brief description of the document content and purpose"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/documents')}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? 'Update Document' : 'Create Document'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Documents = () => {
  const { id, action } = useParams<{ id?: string; action?: string }>();
  
  if (action === 'edit') {
    return <DocumentForm isEdit={true} />;
  }
  
  if (id === 'new') {
    return <DocumentForm />;
  }
  
  if (id) {
    return <DocumentDetail />;
  }
  
  return <DocumentsList />;
};

export default Documents;

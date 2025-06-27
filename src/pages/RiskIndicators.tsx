import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { AlertTriangle, Plus, Edit, Trash2, ExternalLink, LoaderCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const RiskIndicatorsList = () => {
  const [riskIndicators, setRiskIndicators] = useState<RiskIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      </div>
    </div>
  );
};

const RiskIndicatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Risk Indicator Detail (Coming Soon)</h1>
          <p className="text-gray-600 mt-2">Risk Indicator ID: {id}</p>
          <Link to="/risk-indicators">
            <Button className="mt-4">Back to Risk Indicators</Button>
          </Link>
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

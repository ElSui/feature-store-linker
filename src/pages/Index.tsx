
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Target, AlertTriangle, Cpu, ArrowRight, Network, LoaderCircle, Compass, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [entityStats, setEntityStats] = useState({
    documents: 0,
    useCases: 0,
    riskIndicators: 0,
    features: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [documentsCount, useCasesCount, riskIndicatorsCount, featuresCount] = await Promise.all([
          supabase.from('regulatory_documents').select('id', { count: 'exact', head: true }),
          supabase.from('use_cases').select('id', { count: 'exact', head: true }),
          supabase.from('risk_indicators').select('id', { count: 'exact', head: true }),
          supabase.from('features').select('id', { count: 'exact', head: true })
        ]);

        setEntityStats({
          documents: documentsCount.count || 0,
          useCases: useCasesCount.count || 0,
          riskIndicators: riskIndicatorsCount.count || 0,
          features: featuresCount.count || 0
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const entities = [
    {
      name: 'Regulatory Documents',
      description: 'Centralized compliance documentation',
      icon: FileText,
      count: entityStats.documents,
      path: '/documents',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      name: 'Use Cases',
      description: 'Business scenarios & applications',
      icon: Target,
      count: entityStats.useCases,
      path: '/use-cases',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      name: 'Risk Indicators',
      description: 'Compliance risk assessment',
      icon: AlertTriangle,
      count: entityStats.riskIndicators,
      path: '/risk-indicators',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50'
    },
    {
      name: 'Features',
      description: 'AI models & business rules',
      icon: Cpu,
      count: entityStats.features,
      path: '/features',
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-800 bg-clip-text text-transparent">
                  Compliance Compass
                </h1>
                <p className="text-gray-600 mt-1 text-lg">Knowledge & Relationship Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/relationships">
                <Button variant="outline" className="border-purple-200 hover:bg-purple-50 text-purple-700">
                  <Network className="mr-2 h-4 w-4" />
                  View Graph
                </Button>
              </Link>
              <Button variant="outline" className="hover:bg-gray-50">
                Settings
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                <TrendingUp className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Manage regulatory documents, track compliance risks, and explore relationships 
            across your compliance framework.
          </p>
        </div>

        {/* Graph View Highlight */}
        <div className="mb-16 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-3xl p-8 border border-purple-200/50 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                <Network className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Relationship Graph
                </h3>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Visualize connections between documents, use cases, risks, and features 
                  in an interactive network view.
                </p>
                <Link to="/relationships">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg">
                    <Zap className="mr-2 h-5 w-5" />
                    Open Graph View
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Entity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {entities.map((entity, index) => {
            const IconComponent = entity.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-1 flex flex-col h-full">
                <CardHeader className="pb-4 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${entity.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-gray-900 block">
                        {loading ? (
                          <LoaderCircle className="w-8 h-8 animate-spin mx-auto" />
                        ) : (
                          entity.count
                        )}
                      </span>
                      <span className="text-sm text-gray-500 uppercase tracking-wide">Items</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2 text-gray-900">{entity.name}</CardTitle>
                  <CardDescription className="text-gray-600 text-base">{entity.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end pt-0">
                  <Link to={entity.path} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 shadow-lg group">
                      <span className="mr-2">Explore Collection</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/documents/new">
              <Button variant="outline" className="w-full justify-start h-14 text-left hover:bg-blue-50 border-blue-200 hover:border-blue-300 group">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mr-3 group-hover:shadow-md transition-shadow">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">New Document</span>
              </Button>
            </Link>
            <Link to="/use-cases/new">
              <Button variant="outline" className="w-full justify-start h-14 text-left hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300 group">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg mr-3 group-hover:shadow-md transition-shadow">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">New Use Case</span>
              </Button>
            </Link>
            <Link to="/risk-indicators/new">
              <Button variant="outline" className="w-full justify-start h-14 text-left hover:bg-amber-50 border-amber-200 hover:border-amber-300 group">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg mr-3 group-hover:shadow-md transition-shadow">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">New Risk Indicator</span>
              </Button>
            </Link>
            <Link to="/features/new">
              <Button variant="outline" className="w-full justify-start h-14 text-left hover:bg-purple-50 border-purple-200 hover:border-purple-300 group">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg mr-3 group-hover:shadow-md transition-shadow">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">New Feature</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-gray-900 font-medium">Database Connection</span>
              </div>
              <span className="text-sm text-gray-500 bg-white/70 px-3 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                <span className="text-gray-900 font-medium">Real-time Sync</span>
              </div>
              <span className="text-sm text-gray-500 bg-white/70 px-3 py-1 rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                <span className="text-gray-900 font-medium">Graph Visualization</span>
              </div>
              <span className="text-sm text-gray-500 bg-white/70 px-3 py-1 rounded-full">Ready</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

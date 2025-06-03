
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Target, AlertTriangle, Cpu, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const entityStats = {
    documents: 3,
    useCases: 3,
    riskIndicators: 5,
    features: 5
  };

  const entities = [
    {
      name: 'Regulatory Documents',
      description: 'Manage compliance documents and regulations',
      icon: FileText,
      count: entityStats.documents,
      path: '/documents',
      color: 'bg-blue-500'
    },
    {
      name: 'Use Cases',
      description: 'Define business use cases and scenarios',
      icon: Target,
      count: entityStats.useCases,
      path: '/use-cases',
      color: 'bg-emerald-500'
    },
    {
      name: 'Risk Indicators',
      description: 'Identify and categorize risk factors',
      icon: AlertTriangle,
      count: entityStats.riskIndicators,
      path: '/risk-indicators',
      color: 'bg-amber-500'
    },
    {
      name: 'Features',
      description: 'Manage AI models, rules and calculations',
      icon: Cpu,
      count: entityStats.features,
      path: '/features',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compliance Linker</h1>
              <p className="text-gray-600 mt-2">Manage regulatory relationships and compliance entities</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Settings</Button>
              <Button>Export Data</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
          <p className="text-gray-600 max-w-3xl">
            Welcome to the Compliance Linker Tool. Manage your regulatory documents, use cases, risk indicators, 
            and features while maintaining complex many-to-many relationships between entities.
          </p>
        </div>

        {/* Entity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {entities.map((entity, index) => {
            const IconComponent = entity.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${entity.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{entity.count}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2">{entity.name}</CardTitle>
                  <CardDescription className="mb-4">{entity.description}</CardDescription>
                  <Link to={entity.path}>
                    <Button className="w-full group">
                      Manage
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/documents/new">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                New Document
              </Button>
            </Link>
            <Link to="/use-cases/new">
              <Button variant="outline" className="w-full justify-start">
                <Target className="mr-2 h-4 w-4" />
                New Use Case
              </Button>
            </Link>
            <Link to="/risk-indicators/new">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                New Risk Indicator
              </Button>
            </Link>
            <Link to="/features/new">
              <Button variant="outline" className="w-full justify-start">
                <Cpu className="mr-2 h-4 w-4" />
                New Feature
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-900">New regulatory document added: "Guidance on Virtual Assets"</span>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-900">Use case "Cross-Border Payments" linked to 2 risk indicators</span>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-900">Feature "Structuring Detection Model" updated</span>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MultiSelect from './MultiSelect';

interface RelatedEntity {
  id: number;
  name: string;
  description?: string;
  category?: string;
  type?: string;
  source?: string;
  region?: string;
  unique_risk_id?: string;
}

interface RelationshipSectionProps {
  title: string;
  description: string;
  linkedEntities: RelatedEntity[];
  availableEntities: RelatedEntity[];
  entityType: 'documents' | 'use-cases' | 'risk-indicators' | 'features';
  onLink: (entityIds: number[]) => void;
  onUnlink: (entityId: number) => void;
  getBadgeInfo?: (entity: RelatedEntity) => { text: string; variant?: 'default' | 'secondary' | 'outline' };
}

const RelationshipSection: React.FC<RelationshipSectionProps> = ({
  title,
  description,
  linkedEntities,
  availableEntities,
  entityType,
  onLink,
  onUnlink,
  getBadgeInfo
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showLinkInterface, setShowLinkInterface] = useState(false);

  const handleConfirmLink = () => {
    if (selectedIds.length > 0) {
      onLink(selectedIds);
      setSelectedIds([]);
      setShowLinkInterface(false);
    }
  };

  const getEntityLink = (entity: RelatedEntity) => {
    return `/${entityType}/${entity.id}`;
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    
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

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">Linked {title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {availableEntities.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLinkInterface(!showLinkInterface)}
              className="ml-4 flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Link
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {linkedEntities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-sm text-muted-foreground mb-4">
              No {title.toLowerCase()} linked yet.
            </div>
            {availableEntities.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowLinkInterface(true)}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Link First {title.slice(0, -1)}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {linkedEntities.map((entity) => (
              <div 
                key={entity.id} 
                className="group flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors rounded-lg border border-gray-100"
              >
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={getEntityLink(entity)} 
                    className="block group/link"
                  >
                    <div className="font-medium text-gray-900 hover:text-primary transition-colors group-hover/link:underline mb-2">
                      {entity.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entity.category && (
                        <Badge className={getCategoryColor(entity.category)} variant="secondary">
                          {entity.category}
                        </Badge>
                      )}
                      {entity.unique_risk_id && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {entity.unique_risk_id}
                        </Badge>
                      )}
                    </div>
                  </Link>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUnlink(entity.id)}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {showLinkInterface && availableEntities.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Add {title}</h4>
              <MultiSelect
                options={availableEntities.map(entity => ({
                  id: entity.id,
                  name: entity.name,
                  description: entity.description
                }))}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onConfirm={handleConfirmLink}
                placeholder={`Select ${title.toLowerCase()}...`}
                label={`Add ${title}`}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RelationshipSection;

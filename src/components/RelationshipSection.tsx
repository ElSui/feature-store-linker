
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Linked {title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {availableEntities.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLinkInterface(!showLinkInterface)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Link
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-0">
        {linkedEntities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No {title.toLowerCase()} linked yet
          </div>
        ) : (
          <div className="space-y-0">
            {linkedEntities.map((entity, index) => (
              <div 
                key={entity.id} 
                className={`flex items-center justify-between p-3 hover:bg-muted/50 transition-colors ${
                  index !== linkedEntities.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex-1">
                  <Link 
                    to={getEntityLink(entity)} 
                    className="font-medium text-primary hover:underline block"
                  >
                    {entity.name}
                  </Link>
                  {entity.unique_risk_id && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {entity.unique_risk_id}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUnlink(entity.id)}
                  className="text-destructive hover:text-destructive/80 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {showLinkInterface && availableEntities.length > 0 && (
          <div className="mt-4 pt-4 border-t">
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
        )}
      </CardContent>
    </Card>
  );
};

export default RelationshipSection;

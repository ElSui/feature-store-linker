
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
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
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-sm">No {title.toLowerCase()} linked yet</div>
            {availableEntities.length > 0 && (
              <p className="text-xs mt-2">Use the "Link" button above to connect {title.toLowerCase()}</p>
            )}
          </div>
        ) : (
          <div className="space-y-0">
            {linkedEntities.map((entity, index) => (
              <div key={entity.id}>
                <div className="flex items-center justify-between py-4 group hover:bg-muted/50 transition-colors rounded-lg px-3 -mx-3">
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={getEntityLink(entity)} 
                      className="block"
                    >
                      <div className="font-medium text-gray-900 hover:text-primary transition-colors group-hover:underline">
                        {entity.name}
                      </div>
                      {entity.unique_risk_id && (
                        <Badge variant="outline" className="mt-2 text-xs font-mono">
                          {entity.unique_risk_id}
                        </Badge>
                      )}
                    </Link>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUnlink(entity.id)}
                    className="text-muted-foreground hover:text-destructive ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {index < linkedEntities.length - 1 && <Separator />}
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

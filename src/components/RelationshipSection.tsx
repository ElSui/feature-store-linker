
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MultiSelect from './MultiSelect';

interface RelatedEntity {
  id: number;
  name: string;
  description?: string;
  category?: string;
  type?: string;
  source?: string;
  region?: string;
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {availableEntities.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLinkInterface(!showLinkInterface)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Link {title}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {linkedEntities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {title.toLowerCase()} linked yet
            </div>
          ) : (
            linkedEntities.map((entity) => (
              <div key={entity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Link to={getEntityLink(entity)} className="font-medium text-blue-600 hover:text-blue-800">
                    {entity.name}
                  </Link>
                  {entity.description && (
                    <p className="text-sm text-gray-600 mt-1">{entity.description}</p>
                  )}
                  {getBadgeInfo && (
                    <div className="mt-2">
                      <Badge variant={getBadgeInfo(entity).variant || 'secondary'}>
                        {getBadgeInfo(entity).text}
                      </Badge>
                    </div>
                  )}
                  {entity.source && entity.region && (
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{entity.source}</Badge>
                      <Badge variant="outline">{entity.region}</Badge>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUnlink(entity.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipSection;

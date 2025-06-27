
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
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

      {/* Linked Entities List */}
      <div className="space-y-0">
        {linkedEntities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {title.toLowerCase()} linked yet
          </div>
        ) : (
          <div className="space-y-0">
            {linkedEntities.map((entity, index) => (
              <div 
                key={entity.id} 
                className={`flex items-center justify-between py-3 ${
                  index !== linkedEntities.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {entity.unique_risk_id && (
                    <Badge variant="outline">{entity.unique_risk_id}</Badge>
                  )}
                  <Link 
                    to={getEntityLink(entity)} 
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {entity.name}
                  </Link>
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
      </div>
    </div>
  );
};

export default RelationshipSection;

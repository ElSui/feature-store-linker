
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Option {
  id: number;
  name: string;
  description?: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  onConfirm: () => void;
  placeholder?: string;
  label?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedIds,
  onSelectionChange,
  onConfirm,
  placeholder = "Select items...",
  label = "Items"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const selectedOptions = options.filter(option => selectedIds.includes(option.id));

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map(option => (
            <Badge key={option.id} variant="secondary" className="flex items-center gap-1">
              {option.name}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-600" 
                onClick={() => toggleOption(option.id)}
              />
            </Badge>
          ))}
        </div>
      )}

      <div className="border rounded-md">
        <button
          type="button"
          className="w-full px-3 py-2 text-left bg-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length === 0 ? placeholder : `${selectedOptions.length} selected`}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500">No options available</div>
            ) : (
              options.map(option => (
                <div
                  key={option.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleOption(option.id)}
                >
                  <div className="flex items-center justify-center w-4 h-4 mr-3 border border-gray-300 rounded">
                    {selectedIds.includes(option.id) && (
                      <Check className="w-3 h-3 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{option.name}</div>
                    {option.description && (
                      <div className="text-sm text-gray-600">{option.description}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="flex gap-2 mt-2">
          <Button onClick={onConfirm} size="sm">
            Link Selected ({selectedIds.length})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

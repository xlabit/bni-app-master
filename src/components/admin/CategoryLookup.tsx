import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useActiveCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

interface CategoryLookupProps {
  value: string;
  onChange: (categoryName: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const CategoryLookup: React.FC<CategoryLookupProps> = ({
  value,
  onChange,
  placeholder = "Type to search categories...",
  disabled = false,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: categories = [] } = useActiveCategories();

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSearchTerm(categoryName);
    onChange(categoryName);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setSearchTerm(value);
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Small delay to allow for category selection
    setTimeout(() => {
      if (!value && searchTerm) {
        // If no exact match found, keep the typed value
        onChange(searchTerm);
      }
      setSearchTerm('');
    }, 150);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={isOpen ? searchTerm : value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error && "border-red-500")}
      />
      
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCategorySelect(category.name)}
              >
                <div className="font-medium">{category.name}</div>
                {category.description && (
                  <div className="text-sm text-gray-500">{category.description}</div>
                )}
              </div>
            ))
          ) : searchTerm ? (
            <div className="px-3 py-2 text-gray-500">
              No categories found. Press Enter to create "{searchTerm}"
            </div>
          ) : (
            <div className="px-3 py-2 text-gray-500">
              Start typing to search categories...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

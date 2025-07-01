
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage, deleteImage } from '@/utils/imageUpload';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "Click to upload image",
  accept = "image/jpeg,image/png,image/webp"
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    setIsUploading(true);
    try {
      // Delete existing image if present
      if (value) {
        await deleteImage(value);
      }
      
      const imageUrl = await uploadImage(file);
      onChange(imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        await deleteImage(value);
        onChange(undefined);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {value ? (
          <div className="space-y-2">
            <div className="relative">
              <img
                src={value}
                alt={label}
                className="max-w-full h-32 object-cover rounded mx-auto"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1"
                  onClick={handleRemove}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center truncate">{value}</p>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <Label htmlFor={`upload-${label}`} className="cursor-pointer">
                <div className="text-sm text-gray-600">{placeholder}</div>
                <Input
                  id={`upload-${label}`}
                  type="file"
                  accept={accept}
                  onChange={handleFileSelect}
                  disabled={disabled || isUploading}
                  className="hidden"
                />
              </Label>
            </div>
          </div>
        )}
        
        {!disabled && !value && (
          <div className="mt-2 text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => document.getElementById(`upload-${label}`)?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Choose File'}
            </Button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Supported formats: JPEG, PNG, WebP. Max size: 5MB
      </p>
    </div>
  );
};

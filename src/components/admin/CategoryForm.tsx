import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/hooks/useCategories';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  category?: Category;
  mode: 'create' | 'edit' | 'view';
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  mode
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      status: category?.status || 'active' as 'active' | 'inactive'
    }
  });

  React.useEffect(() => {
    if (category) {
      setValue('name', category.name);
      setValue('description', category.description || '');
      setValue('status', category.status);
    } else {
      reset();
    }
  }, [category, setValue, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const toggleStatus = () => {
    const currentStatus = watch('status');
    setValue('status', currentStatus === 'active' ? 'inactive' : 'active');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Add New Category'}
            {mode === 'edit' && 'Edit Category'}
            {mode === 'view' && 'Category Details'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              {...register('name', { 
                required: 'Category name is required',
                minLength: { value: 2, message: 'Category name must be at least 2 characters' }
              })}
              placeholder="Enter category name"
              disabled={mode === 'view'}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter category description (optional)"
              disabled={mode === 'view'}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            {mode === 'view' ? (
              <Badge variant={watch('status') === 'active' ? 'default' : 'secondary'}>
                {watch('status')}
              </Badge>
            ) : (
              <div className="flex gap-2">
                <Badge
                  variant={watch('status') === 'active' ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={toggleStatus}
                >
                  {watch('status')}
                </Badge>
                <span className="text-sm text-gray-500">Click to toggle</span>
              </div>
            )}
          </div>

          {mode === 'view' && category && (
            <div className="space-y-2">
              <Label>Created Date</Label>
              <p className="text-sm">{new Date(category.createdAt).toLocaleDateString()}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode !== 'view' && (
              <Button type="submit">
                {mode === 'create' ? 'Create Category' : 'Update Category'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
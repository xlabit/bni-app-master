
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Chapter } from '@/types';

interface ChapterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Chapter, 'id' | 'createdAt' | 'memberCount'>) => void;
  chapter?: Chapter;
  mode: 'create' | 'edit' | 'view';
}

export const ChapterForm: React.FC<ChapterFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  chapter,
  mode
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      name: chapter?.name || '',
      status: chapter?.status || 'active' as 'active' | 'inactive'
    }
  });

  React.useEffect(() => {
    if (chapter) {
      setValue('name', chapter.name);
      setValue('status', chapter.status);
    } else {
      reset();
    }
  }, [chapter, setValue, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const toggleStatus = () => {
    const currentStatus = chapter?.status || 'active';
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setValue('status', newStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Add New Chapter'}
            {mode === 'edit' && 'Edit Chapter'}
            {mode === 'view' && 'Chapter Details'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Chapter Name</Label>
            <Input
              id="name"
              {...register('name', { 
                required: 'Chapter name is required',
                minLength: { value: 2, message: 'Chapter name must be at least 2 characters' },
                maxLength: { value: 50, message: 'Chapter name must be less than 50 characters' }
              })}
              placeholder="Enter chapter name"
              disabled={mode === 'view'}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            {mode === 'view' ? (
              <Badge variant={chapter?.status === 'active' ? 'default' : 'secondary'}>
                {chapter?.status}
              </Badge>
            ) : (
              <div className="flex gap-2">
                <Badge
                  variant="default"
                  className="cursor-pointer"
                  onClick={toggleStatus}
                >
                  {chapter?.status || 'active'}
                </Badge>
                <span className="text-sm text-gray-500">Click to toggle</span>
              </div>
            )}
          </div>

          {mode === 'view' && chapter && (
            <div className="space-y-2">
              <Label>Created Date</Label>
              <p className="text-sm">{new Date(chapter.createdAt).toLocaleDateString()}</p>
            </div>
          )}

          {mode === 'view' && chapter && (
            <div className="space-y-2">
              <Label>Members</Label>
              <p className="text-sm font-semibold">{chapter.memberCount} members</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode !== 'view' && (
              <Button type="submit">
                {mode === 'create' ? 'Create Chapter' : 'Update Chapter'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

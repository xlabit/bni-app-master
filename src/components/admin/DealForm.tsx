
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './ImageUpload';
import { Deal } from '@/types';

interface DealFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Deal, 'id' | 'createdAt'>) => void;
  deal?: Deal;
  mode: 'create' | 'edit' | 'view';
}

export const DealForm: React.FC<DealFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  deal,
  mode
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      dealName: deal?.dealName || '',
      shortDescription: deal?.shortDescription || '',
      longDescription: deal?.longDescription || '',
      memberName: deal?.memberName || '',
      memberId: deal?.memberId || '',
      startDate: deal?.startDate || '',
      endDate: deal?.endDate || '',
      discountType: deal?.discountType || 'percentage' as 'flat' | 'percentage',
      discountValue: deal?.discountValue || 0,
      category: deal?.category || '',
      status: deal?.status || 'active' as 'active' | 'inactive',
      logoImageUrl: deal?.logoImageUrl || '',
      bannerImageUrl: deal?.bannerImageUrl || ''
    }
  });

  React.useEffect(() => {
    if (deal) {
      Object.keys(deal).forEach(key => {
        if (key !== 'specialRoleDiscount') {
          setValue(key as any, deal[key as keyof Deal]);
        }
      });
    } else {
      reset();
    }
  }, [deal, setValue, reset]);

  const handleFormSubmit = (data: any) => {
    // Validate dates
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      alert('End date must be after start date');
      return;
    }
    
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Add New Deal'}
            {mode === 'edit' && 'Edit Deal'}
            {mode === 'view' && 'Deal Details'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dealName">Deal Name</Label>
              <Input
                id="dealName"
                {...register('dealName', { 
                  required: 'Deal name is required',
                  minLength: { value: 3, message: 'Deal name must be at least 3 characters' }
                })}
                placeholder="Enter deal name"
                disabled={mode === 'view'}
              />
              {errors.dealName && <p className="text-sm text-red-600">{errors.dealName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                {...register('category', { required: 'Category is required' })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={mode === 'view'}
              >
                <option value="">Select category</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Services">Services</option>
                <option value="Retail">Retail</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              {...register('shortDescription', { 
                required: 'Short description is required',
                maxLength: { value: 100, message: 'Short description must be less than 100 characters' }
              })}
              placeholder="Brief description of the deal"
              disabled={mode === 'view'}
            />
            {errors.shortDescription && <p className="text-sm text-red-600">{errors.shortDescription.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              {...register('longDescription', { required: 'Long description is required' })}
              placeholder="Detailed description of the deal"
              disabled={mode === 'view'}
              rows={3}
            />
            {errors.longDescription && <p className="text-sm text-red-600">{errors.longDescription.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberName">Member Name</Label>
              <Input
                id="memberName"
                {...register('memberName', { required: 'Member name is required' })}
                placeholder="Enter member name"
                disabled={mode === 'view'}
              />
              {errors.memberName && <p className="text-sm text-red-600">{errors.memberName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberId">Member ID</Label>
              <Input
                id="memberId"
                {...register('memberId', { required: 'Member ID is required' })}
                placeholder="Enter member ID"
                disabled={mode === 'view'}
              />
              {errors.memberId && <p className="text-sm text-red-600">{errors.memberId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                disabled={mode === 'view'}
              />
              {errors.startDate && <p className="text-sm text-red-600">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                disabled={mode === 'view'}
              />
              {errors.endDate && <p className="text-sm text-red-600">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <select
                id="discountType"
                {...register('discountType')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={mode === 'view'}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input
                id="discountValue"
                type="number"
                min="0"
                step="0.01"
                {...register('discountValue', { 
                  required: 'Discount value is required',
                  min: { value: 0, message: 'Discount value must be positive' }
                })}
                placeholder={watch('discountType') === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                disabled={mode === 'view'}
              />
              {errors.discountValue && <p className="text-sm text-red-600">{errors.discountValue.message}</p>}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Deal Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                label="Logo/Small Image"
                value={watch('logoImageUrl')}
                onChange={(url) => setValue('logoImageUrl', url || '')}
                disabled={mode === 'view'}
                placeholder="Upload logo or small image for mobile app"
              />
              
              <ImageUpload
                label="Banner Image"
                value={watch('bannerImageUrl')}
                onChange={(url) => setValue('bannerImageUrl', url || '')}
                disabled={mode === 'view'}
                placeholder="Upload banner image for mobile app"
              />
            </div>
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

          {mode === 'view' && deal && (
            <div className="space-y-2">
              <Label>Created Date</Label>
              <p className="text-sm">{new Date(deal.createdAt).toLocaleDateString()}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode !== 'view' && (
              <Button type="submit">
                {mode === 'create' ? 'Create Deal' : 'Update Deal'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

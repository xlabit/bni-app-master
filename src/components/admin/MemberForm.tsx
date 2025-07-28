
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member } from '@/types';
import { useChapters } from '@/hooks/useChapters';

interface MemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Member, 'id' | 'joinDate'>) => void;
  member?: Member;
  mode: 'create' | 'edit' | 'view';
}

export const MemberForm: React.FC<MemberFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  member,
  mode
}) => {
  const { data: chapters = [] } = useChapters();
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      name: member?.name || '',
      email: member?.email || '',
      businessName: member?.businessName || '',
      phone: member?.phone || '',
      chapterName: member?.chapterName || '',
      membershipEndDate: member?.membershipEndDate || '',
      status: member?.status || 'active' as 'active' | 'inactive',
      memberRole: member?.memberRole || 'regular' as Member['memberRole'],
      keywords: member?.keywords || ''
    }
  });

  React.useEffect(() => {
    if (member) {
      Object.keys(member).forEach(key => {
        setValue(key as any, member[key as keyof Member]);
      });
    } else {
      reset();
    }
  }, [member, setValue, reset]);

  const handleFormSubmit = (data: any) => {
    // Validate chapter selection
    if (!data.chapterName) {
      alert('Please select a chapter');
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Add New Member'}
            {mode === 'edit' && 'Edit Member'}
            {mode === 'view' && 'Member Details'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name', { 
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                placeholder="Enter full name"
                disabled={mode === 'view'}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                })}
                placeholder="Enter email"
                disabled={mode === 'view'}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                {...register('businessName', { required: 'Business name is required' })}
                placeholder="Enter business name"
                disabled={mode === 'view'}
              />
              {errors.businessName && <p className="text-sm text-red-600">{errors.businessName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone', { 
                  required: 'Phone is required',
                  pattern: { value: /^[\d\s\-\+\(\)]+$/, message: 'Invalid phone format' }
                })}
                placeholder="Enter phone number"
                disabled={mode === 'view'}
              />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chapterName">Chapter</Label>
              {mode === 'view' ? (
                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                  {watch('chapterName')}
                </div>
              ) : (
                <Select
                  value={watch('chapterName')}
                  onValueChange={(value) => setValue('chapterName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.name}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.chapterName && <p className="text-sm text-red-600">{errors.chapterName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberRole">Member Role</Label>
              <select
                id="memberRole"
                {...register('memberRole')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={mode === 'view'}
              >
                <option value="regular">Regular</option>
                <option value="leadership">Leadership</option>
                <option value="ro">RO</option>
                <option value="green">Green</option>
                <option value="gold">Gold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membershipEndDate">Membership End Date</Label>
              <Input
                id="membershipEndDate"
                type="date"
                {...register('membershipEndDate', { required: 'Membership end date is required' })}
                disabled={mode === 'view'}
              />
              {errors.membershipEndDate && <p className="text-sm text-red-600">{errors.membershipEndDate.message}</p>}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Textarea
              id="keywords"
              {...register('keywords')}
              placeholder="Enter keywords related to this member (e.g., consulting, marketing, legal)"
              disabled={mode === 'view'}
              rows={2}
            />
          </div>

          {mode === 'view' && member && (
            <div className="space-y-2">
              <Label>Join Date</Label>
              <p className="text-sm">{new Date(member.joinDate).toLocaleDateString()}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode !== 'view' && (
              <Button type="submit">
                {mode === 'create' ? 'Create Member' : 'Update Member'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

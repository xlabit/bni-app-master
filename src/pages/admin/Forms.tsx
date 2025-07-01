
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Link, Eye, Copy, Edit, Trash2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useForms, useCreateForm, useUpdateForm, useDeleteForm, Form } from '@/hooks/useForms';

const Forms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState<Form | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const { data: forms = [], isLoading, error } = useForms();
  const createFormMutation = useCreateForm();
  const updateFormMutation = useUpdateForm();
  const deleteFormMutation = useDeleteForm();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'active' as 'active' | 'inactive',
      publicUrl: ''
    }
  });

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = () => {
    reset();
    setSelectedForm(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (form: Form) => {
    setSelectedForm(form);
    setFormMode('edit');
    setValue('title', form.title);
    setValue('description', form.description || '');
    setValue('status', form.status);
    setValue('publicUrl', form.publicUrl || '');
    setIsFormOpen(true);
  };

  const handleView = (form: Form) => {
    setSelectedForm(form);
    setFormMode('view');
    setValue('title', form.title);
    setValue('description', form.description || '');
    setValue('status', form.status);
    setValue('publicUrl', form.publicUrl || '');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        await deleteFormMutation.mutateAsync(id);
        toast({
          title: "Form deleted",
          description: "The form has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete form. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      if (formMode === 'create') {
        await createFormMutation.mutateAsync({
          title: data.title,
          description: data.description || null,
          status: data.status,
          publicUrl: data.publicUrl || null
        });
        toast({
          title: "Form created",
          description: "New form has been successfully created.",
        });
      } else if (formMode === 'edit' && selectedForm) {
        await updateFormMutation.mutateAsync({
          id: selectedForm.id,
          title: data.title,
          description: data.description || null,
          status: data.status,
          publicUrl: data.publicUrl || null
        });
        toast({
          title: "Form updated",
          description: "Form has been successfully updated.",
        });
      }
      setIsFormOpen(false);
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${formMode} form. Please try again.`,
        variant: "destructive",
      });
    }
  });

  const toggleStatus = async (id: string) => {
    const form = forms.find(f => f.id === id);
    if (!form) return;
    
    try {
      await updateFormMutation.mutateAsync({
        id,
        status: form.status === 'active' ? 'inactive' : 'active'
      });
      toast({
        title: "Status updated",
        description: `Form status changed to ${form.status === 'active' ? 'inactive' : 'active'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update form status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "Form URL has been copied to clipboard.",
    });
  };

  const toggleFormStatus = () => {
    const currentStatus = watch('status');
    setValue('status', currentStatus === 'active' ? 'inactive' : 'active');
  };

  if (error) {
    return (
      <DashboardLayout title="Forms Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600">Error loading forms</h3>
            <p className="text-gray-600">Please try refreshing the page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Forms Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search forms..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="w-4 h-4" />
            Create Form
          </Button>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Public URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Loading forms...
                  </TableCell>
                </TableRow>
              ) : filteredForms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No forms found matching your search.' : 'No forms available.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredForms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {form.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">{form.submissions}</span>
                        <span className="text-xs text-gray-500">responses</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={form.status === 'active' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(form.id)}
                      >
                        {form.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-xs">
                        <Link className="w-4 h-4 text-gray-400" />
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate flex-1">
                          {form.publicUrl || 'Not set'}
                        </code>
                        {form.publicUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyUrl(form.publicUrl!)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(form)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(form)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(form.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Info */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredForms.length} of {forms.length} forms</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>

        {/* Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {formMode === 'create' && 'Create New Form'}
                {formMode === 'edit' && 'Edit Form'}
                {formMode === 'view' && 'Form Details'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={onFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  {...register('title', { 
                    required: 'Form title is required',
                    minLength: { value: 2, message: 'Title must be at least 2 characters' }
                  })}
                  placeholder="Enter form title"
                  disabled={formMode === 'view'}
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter form description (optional)"
                  disabled={formMode === 'view'}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicUrl">Public URL</Label>
                <Input
                  id="publicUrl"
                  {...register('publicUrl')}
                  placeholder="https://example.com/forms/your-form"
                  disabled={formMode === 'view'}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                {formMode === 'view' ? (
                  <Badge variant={watch('status') === 'active' ? 'default' : 'secondary'}>
                    {watch('status')}
                  </Badge>
                ) : (
                  <div className="flex gap-2">
                    <Badge
                      variant={watch('status') === 'active' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={toggleFormStatus}
                    >
                      {watch('status')}
                    </Badge>
                    <span className="text-sm text-gray-500">Click to toggle</span>
                  </div>
                )}
              </div>

              {formMode === 'view' && selectedForm && (
                <>
                  <div className="space-y-2">
                    <Label>Submissions</Label>
                    <p className="text-sm font-semibold">{selectedForm.submissions} responses</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Created Date</Label>
                    <p className="text-sm">{new Date(selectedForm.createdAt).toLocaleDateString()}</p>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  {formMode === 'view' ? 'Close' : 'Cancel'}
                </Button>
                {formMode !== 'view' && (
                  <Button type="submit">
                    {formMode === 'create' ? 'Create Form' : 'Update Form'}
                  </Button>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Forms;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, Category } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Eye, Trash2 } from 'lucide-react';

export const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: categories = [], isLoading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { toast } = useToast();

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = () => {
    setSelectedCategory(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCategory.mutateAsync(id);
        toast({
          title: "Category deleted",
          description: "The category has been successfully deleted.",
        });
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: "Error",
          description: "Failed to delete category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormSubmit = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (formMode === 'create') {
        await createCategory.mutateAsync(data);
        toast({
          title: "Category created",
          description: "The category has been successfully created.",
        });
      } else if (formMode === 'edit' && selectedCategory) {
        await updateCategory.mutateAsync({ id: selectedCategory.id, ...data });
        toast({
          title: "Category updated",
          description: "The category has been successfully updated.",
        });
      }
    } catch (error) {
      console.error('Form submit error:', error);
      toast({
        title: "Error",
        description: `Failed to ${formMode} category. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    try {
      await updateCategory.mutateAsync({
        id,
        status: category.status === 'active' ? 'inactive' : 'active'
      });
      toast({
        title: "Status updated",
        description: `Category status changed to ${category.status === 'active' ? 'inactive' : 'active'}.`,
      });
    } catch (error) {
      console.error('Status toggle error:', error);
      toast({
        title: "Error",
        description: "Failed to update category status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
    <AdminLayout title="Categories">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading categories: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-gray-600">Manage deal categories for your business network.</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              Manage categories used for organizing deals and offers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading categories...</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-gray-600">
                          {category.description || 'No description'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={category.status === 'active' ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => toggleStatus(category.id)}
                          >
                            {category.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(category)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCategories.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          {searchTerm ? 'No categories found matching your search.' : 'No categories available.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <div>
                Showing {filteredCategories.length} of {categories.length} categories
              </div>
            </div>
          </CardContent>
        </Card>

        <CategoryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          category={selectedCategory}
          mode={formMode}
        />
      </div>
    </AdminLayout>
  );
};
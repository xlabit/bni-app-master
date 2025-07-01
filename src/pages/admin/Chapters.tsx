
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ChapterForm } from '@/components/admin/ChapterForm';
import { useToast } from '@/hooks/use-toast';
import { Chapter } from '@/types';
import { useChapters, useCreateChapter, useUpdateChapter, useDeleteChapter } from '@/hooks/useChapters';

const Chapters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const { data: chapters = [], isLoading, error } = useChapters();
  const createChapterMutation = useCreateChapter();
  const updateChapterMutation = useUpdateChapter();
  const deleteChapterMutation = useDeleteChapter();

  const filteredChapters = chapters.filter(chapter =>
    chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedChapter(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
      try {
        await deleteChapterMutation.mutateAsync(id);
        toast({
          title: "Chapter deleted",
          description: "The chapter has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete chapter. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormSubmit = async (data: Omit<Chapter, 'id' | 'createdAt' | 'memberCount'>) => {
    try {
      if (formMode === 'create') {
        await createChapterMutation.mutateAsync(data);
        toast({
          title: "Chapter created",
          description: "New chapter has been successfully created.",
        });
      } else if (formMode === 'edit' && selectedChapter) {
        await updateChapterMutation.mutateAsync({ id: selectedChapter.id, ...data });
        toast({
          title: "Chapter updated",
          description: "Chapter has been successfully updated.",
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${formMode} chapter. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string) => {
    const chapter = chapters.find(c => c.id === id);
    if (!chapter) return;
    
    try {
      await updateChapterMutation.mutateAsync({
        id,
        status: chapter.status === 'active' ? 'inactive' : 'active'
      });
      toast({
        title: "Status updated",
        description: `Chapter status changed to ${chapter.status === 'active' ? 'inactive' : 'active'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update chapter status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <DashboardLayout title="Chapters Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600">Error loading chapters</h3>
            <p className="text-gray-600">Please try refreshing the page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Chapters Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search chapters..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="w-4 h-4" />
            Add Chapter
          </Button>
        </div>

        {/* Chapters Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chapter Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Loading chapters...
                  </TableCell>
                </TableRow>
              ) : filteredChapters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No chapters found matching your search.' : 'No chapters available.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredChapters.map((chapter) => (
                  <TableRow key={chapter.id}>
                    <TableCell className="font-medium">{chapter.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{chapter.memberCount}</span>
                        <span className="text-sm text-gray-500">members</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={chapter.status === 'active' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(chapter.id)}
                      >
                        {chapter.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(chapter.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(chapter)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(chapter)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(chapter.id)}
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
          <span>Showing {filteredChapters.length} of {chapters.length} chapters</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>

        {/* Chapter Form Modal */}
        <ChapterForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          chapter={selectedChapter}
          mode={formMode}
        />
      </div>
    </DashboardLayout>
  );
};

export default Chapters;

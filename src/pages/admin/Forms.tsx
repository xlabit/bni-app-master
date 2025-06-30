
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Link, Eye, Copy, Edit, Trash2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

const Forms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [forms, setForms] = useState([
    {
      id: '1',
      title: 'Deal Submission Form',
      description: 'Form for members to submit new deal requests',
      submissions: 24,
      status: 'active',
      createdAt: '2024-01-15',
      publicUrl: 'https://example.com/forms/deal-submission'
    },
    {
      id: '2',
      title: 'Member Registration Form',
      description: 'Form for new member registration requests',
      submissions: 12,
      status: 'active',
      createdAt: '2024-01-10',
      publicUrl: 'https://example.com/forms/member-registration'
    },
    {
      id: '3',
      title: 'Chapter Feedback Form',
      description: 'Form for collecting chapter meeting feedback',
      submissions: 8,
      status: 'inactive',
      createdAt: '2024-01-05',
      publicUrl: 'https://example.com/forms/chapter-feedback'
    }
  ]);

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setForms(forms.filter(form => form.id !== id));
  };

  const toggleStatus = (id: string) => {
    setForms(forms.map(form =>
      form.id === id
        ? { ...form, status: form.status === 'active' ? 'inactive' : 'active' }
        : form
    ));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

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
          <Button className="gap-2">
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
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {form.description}
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
                        {form.publicUrl}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyUrl(form.publicUrl)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
              ))}
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
      </div>
    </DashboardLayout>
  );
};

export default Forms;

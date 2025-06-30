
import React from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Link, Eye, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Forms = () => {
  const mockForms = [
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
    }
  ];

  return (
    <DashboardLayout title="Forms Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Generated Forms</h2>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Form
          </Button>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockForms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                  </div>
                  <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
                    {form.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Submissions:</span>
                  <span className="font-semibold">{form.submissions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Link className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Public URL:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white px-2 py-1 rounded flex-1 truncate">
                      {form.publicUrl}
                    </code>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forms;

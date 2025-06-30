
import React from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockChapters } from '@/data/mockData';

const Chapters = () => {
  return (
    <DashboardLayout title="Chapters Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-gray-900">All Chapters</h2>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Chapter
          </Button>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockChapters.map((chapter) => (
            <Card key={chapter.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{chapter.name}</CardTitle>
                  <Badge variant={chapter.status === 'active' ? 'default' : 'secondary'}>
                    {chapter.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Members:</span>
                  <span className="font-semibold text-lg">{chapter.memberCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span>{new Date(chapter.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
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

export default Chapters;

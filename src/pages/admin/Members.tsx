
import React from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockMembers } from '@/data/mockData';

const Members = () => {
  return (
    <DashboardLayout title="Members Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search members..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-gray-600">{member.businessName}</p>
                    </div>
                  </div>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Chapter:</span>
                  <span className="font-medium">{member.chapterName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Role:</span>
                  <Badge variant="outline" className="capitalize">
                    {member.memberRole.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phone:</span>
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Expires:</span>
                  <span>{new Date(member.membershipEndDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Members;


import React, { useState } from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MemberForm } from '@/components/admin/MemberForm';
import { useToast } from '@/hooks/use-toast';
import { mockMembers } from '@/data/mockData';
import { Member } from '@/types';

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState(mockMembers);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.chapterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedMember(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (member: Member) => {
    setSelectedMember(member);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      setMembers(members.filter(member => member.id !== id));
      toast({
        title: "Member deleted",
        description: "The member has been successfully deleted.",
      });
    }
  };

  const handleFormSubmit = (data: Omit<Member, 'id' | 'joinDate'>) => {
    if (formMode === 'create') {
      const newMember: Member = {
        ...data,
        id: Date.now().toString(),
        joinDate: new Date().toISOString()
      };
      setMembers([...members, newMember]);
      toast({
        title: "Member created",
        description: "New member has been successfully created.",
      });
    } else if (formMode === 'edit' && selectedMember) {
      setMembers(members.map(member =>
        member.id === selectedMember.id
          ? { ...member, ...data }
          : member
      ));
      toast({
        title: "Member updated",
        description: "Member has been successfully updated.",
      });
    }
  };

  const toggleStatus = (id: string) => {
    setMembers(members.map(member =>
      member.id === id
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
    const member = members.find(m => m.id === id);
    const newStatus = member?.status === 'active' ? 'inactive' : 'active';
    toast({
      title: "Status updated",
      description: `Member status changed to ${newStatus}.`,
    });
  };

  const isExpiringSoon = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    return expiry < today;
  };

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No members found matching your search.' : 'No members available.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{member.businessName}</TableCell>
                    <TableCell>{member.chapterName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {member.memberRole.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={member.status === 'active' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(member.id)}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={`text-sm ${
                          isExpired(member.membershipEndDate) ? 'text-red-600 font-semibold' :
                          isExpiringSoon(member.membershipEndDate) ? 'text-orange-600 font-semibold' :
                          'text-gray-600'
                        }`}>
                          {new Date(member.membershipEndDate).toLocaleDateString()}
                        </span>
                        {isExpired(member.membershipEndDate) && (
                          <Badge variant="destructive" className="text-xs mt-1">Expired</Badge>
                        )}
                        {isExpiringSoon(member.membershipEndDate) && !isExpired(member.membershipEndDate) && (
                          <Badge variant="secondary" className="text-xs mt-1">Expiring Soon</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(member)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(member.id)}
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
          <span>Showing {filteredMembers.length} of {members.length} members</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>

        {/* Member Form Modal */}
        <MemberForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          member={selectedMember}
          mode={formMode}
        />
      </div>
    </DashboardLayout>
  );
};

export default Members;

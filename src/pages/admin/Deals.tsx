
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DealForm } from '@/components/admin/DealForm';
import { useToast } from '@/hooks/use-toast';
import { mockDeals } from '@/data/mockData';
import { Deal } from '@/types';

const Deals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deals, setDeals] = useState(mockDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const filteredDeals = deals.filter(deal =>
    deal.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedDeal(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (deal: Deal) => {
    setSelectedDeal(deal);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      setDeals(deals.filter(deal => deal.id !== id));
      toast({
        title: "Deal deleted",
        description: "The deal has been successfully deleted.",
      });
    }
  };

  const handleFormSubmit = (data: Omit<Deal, 'id' | 'createdAt'>) => {
    if (formMode === 'create') {
      const newDeal: Deal = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setDeals([...deals, newDeal]);
      toast({
        title: "Deal created",
        description: "New deal has been successfully created.",
      });
    } else if (formMode === 'edit' && selectedDeal) {
      setDeals(deals.map(deal =>
        deal.id === selectedDeal.id
          ? { ...deal, ...data }
          : deal
      ));
      toast({
        title: "Deal updated",
        description: "Deal has been successfully updated.",
      });
    }
  };

  const toggleStatus = (id: string) => {
    setDeals(deals.map(deal =>
      deal.id === id
        ? { ...deal, status: deal.status === 'active' ? 'inactive' : 'active' }
        : deal
    ));
    const deal = deals.find(d => d.id === id);
    const newStatus = deal?.status === 'active' ? 'inactive' : 'active';
    toast({
      title: "Status updated",
      description: `Deal status changed to ${newStatus}.`,
    });
  };

  const isExpiringSoon = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    return expiry < today;
  };

  return (
    <DashboardLayout title="Deals Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search deals..."
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
            Add Deal
          </Button>
        </div>

        {/* Deals Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No deals found matching your search.' : 'No deals available.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{deal.dealName}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {deal.shortDescription}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{deal.memberName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{deal.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600">
                        <Percent className="w-4 h-4" />
                        <span className="font-semibold">
                          {deal.discountType === 'percentage' ? `${deal.discountValue}%` : `$${deal.discountValue}`}
                        </span>
                        {deal.specialRoleDiscount && (
                          <span className="text-xs text-blue-600 ml-1">+Special</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span className={`${
                            isExpired(deal.endDate) ? 'text-red-600 font-semibold' :
                            isExpiringSoon(deal.endDate) ? 'text-orange-600 font-semibold' :
                            'text-gray-600'
                          }`}>
                            {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                          </span>
                          {isExpired(deal.endDate) && (
                            <Badge variant="destructive" className="text-xs mt-1">Expired</Badge>
                          )}
                          {isExpiringSoon(deal.endDate) && !isExpired(deal.endDate) && (
                            <Badge variant="secondary" className="text-xs mt-1">Expires Soon</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={deal.status === 'active' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(deal.id)}
                      >
                        {deal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(deal)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(deal)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(deal.id)}
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
          <span>Showing {filteredDeals.length} of {deals.length} deals</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>

        {/* Deal Form Modal */}
        <DealForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          deal={selectedDeal}
          mode={formMode}
        />
      </div>
    </DashboardLayout>
  );
};

export default Deals;

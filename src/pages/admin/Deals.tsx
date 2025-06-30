
import React from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Calendar, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDeals } from '@/data/mockData';

const Deals = () => {
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
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Deal
          </Button>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockDeals.map((deal) => (
            <Card key={deal.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{deal.dealName}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{deal.shortDescription}</p>
                  </div>
                  <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                    {deal.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Offered by:</span>
                  <span className="font-medium">{deal.memberName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <Badge variant="outline">{deal.category}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {deal.discountType === 'percentage' ? `${deal.discountValue}% OFF` : `$${deal.discountValue} OFF`}
                  </span>
                  {deal.specialRoleDiscount && (
                    <span className="text-xs text-gray-500">
                      + Special Role Discount
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 pt-2 border-t">
                  {deal.longDescription}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Deals;

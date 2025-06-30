
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Users, Building2, Tag, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { mockStats, mockDeals, mockMembers } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Members',
      value: mockStats.totalMembers,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Deals',
      value: mockStats.activeDeals,
      change: '+5%',
      changeType: 'positive' as const,
      icon: Tag,
      color: 'bg-green-500'
    },
    {
      title: 'Active Chapters',
      value: mockStats.activeChapters,
      change: '0%',
      changeType: 'neutral' as const,
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      title: 'Expiring Soon',
      value: mockStats.expiringDeals,
      change: '+2',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const categoryData = [
    { name: 'Business Services', value: 15, color: '#8884d8' },
    { name: 'Legal Services', value: 8, color: '#82ca9d' },
    { name: 'Food & Catering', value: 6, color: '#ffc658' },
    { name: 'Technology', value: 9, color: '#ff7300' },
    { name: 'Other', value: 10, color: '#0088fe' }
  ];

  const monthlyData = [
    { month: 'Jan', members: 120, deals: 25 },
    { month: 'Feb', members: 125, deals: 28 },
    { month: 'Mar', members: 130, deals: 32 },
    { month: 'Apr', members: 135, deals: 35 },
    { month: 'May', members: 140, deals: 40 },
    { month: 'Jun', members: 143, deals: 38 }
  ];

  const recentMembers = mockMembers.slice(0, 5);
  const recentDeals = mockDeals.slice(0, 3);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs flex items-center mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Members and deals over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="members" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="deals" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Deal Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Categories</CardTitle>
              <CardDescription>Distribution of deals by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Members */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Members</CardTitle>
              <CardDescription>Latest member registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{member.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.businessName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{member.chapterName}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        member.memberRole === 'leadership' ? 'bg-purple-100 text-purple-800' :
                        member.memberRole === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                        member.memberRole === 'ro' ? 'bg-blue-100 text-blue-800' :
                        member.memberRole === 'green' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.memberRole}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Deals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Deals</CardTitle>
              <CardDescription>Latest deals and offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDeals.map((deal) => (
                  <div key={deal.id} className="border-l-4 border-primary pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{deal.dealName}</p>
                        <p className="text-xs text-muted-foreground mb-1">{deal.shortDescription}</p>
                        <p className="text-xs text-muted-foreground">by {deal.memberName}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {deal.discountType === 'percentage' ? `${deal.discountValue}% off` : `$${deal.discountValue} off`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

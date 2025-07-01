
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Users, Building2, Tag, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useDashboardCharts } from '@/hooks/useDashboardCharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: chartsData, isLoading: chartsLoading } = useDashboardCharts();

  if (statsLoading || chartsLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: 'Total Members',
      value: stats?.totalMembers || 0,
      change: stats?.activeMembers ? `${Math.round((stats.activeMembers / stats.totalMembers) * 100)}% active` : '0% active',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Deals',
      value: stats?.activeDeals || 0,
      change: stats?.expiringDeals ? `${stats.expiringDeals} expiring soon` : '0 expiring soon',
      changeType: stats?.expiringDeals ? 'negative' as const : 'neutral' as const,
      icon: Tag,
      color: 'bg-green-500'
    },
    {
      title: 'Active Chapters',
      value: stats?.activeChapters || 0,
      change: stats?.totalChapters ? `${stats.totalChapters} total` : '0 total',
      changeType: 'neutral' as const,
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      title: 'Expiring Soon',
      value: stats?.expiringDeals || 0,
      change: 'Next 30 days',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
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
                      {stat.change}
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
                <LineChart data={chartsData?.monthlyTrends || []}>
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
                    data={chartsData?.categoryData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(chartsData?.categoryData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Chapter Members Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Members by Chapter</CardTitle>
            <CardDescription>Total and active members across chapters</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartsData?.chapterMemberData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="members" fill="#8884d8" name="Total Members" />
                <Bar dataKey="active" fill="#82ca9d" name="Active Members" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                {(chartsData?.recentMembers || []).map((member) => (
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
                {(chartsData?.recentDeals || []).map((deal) => (
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

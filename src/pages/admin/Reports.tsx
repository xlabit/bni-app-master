
import React from 'react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Reports = () => {
  const membersByChapter = [
    { name: 'Downtown', members: 45, active: 42 },
    { name: 'North Valley', members: 38, active: 35 },
    { name: 'East Side', members: 52, active: 48 },
    { name: 'West Hills', members: 41, active: 39 }
  ];

  const dealsByCategory = [
    { name: 'Restaurant', value: 25, color: '#8884d8' },
    { name: 'Services', value: 30, color: '#82ca9d' },
    { name: 'Retail', value: 20, color: '#ffc658' },
    { name: 'Health', value: 15, color: '#ff7300' },
    { name: 'Other', value: 10, color: '#00ff00' }
  ];

  const monthlyTrends = [
    { month: 'Jan', members: 150, deals: 75 },
    { month: 'Feb', members: 165, deals: 82 },
    { month: 'Mar', members: 170, deals: 90 },
    { month: 'Apr', members: 176, deals: 95 },
    { month: 'May', members: 180, deals: 100 },
    { month: 'Jun', members: 185, deals: 105 }
  ];

  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$125,480</div>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Deal Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">68%</div>
              <p className="text-xs text-gray-500">Average usage rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Member Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">84%</div>
              <p className="text-xs text-gray-500">Active participation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New Deals This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">23</div>
              <p className="text-xs text-gray-500">+5 from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Members by Chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={membersByChapter}>
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

          <Card>
            <CardHeader>
              <CardTitle>Deals by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dealsByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dealsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="#8884d8" name="Members" />
                <Line type="monotone" dataKey="deals" stroke="#82ca9d" name="Active Deals" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChapterMemberData {
  name: string;
  members: number;
  active: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyTrendData {
  month: string;
  members: number;
  deals: number;
}

export interface RecentMember {
  id: string;
  name: string;
  businessName: string;
  chapterName: string;
  memberRole: string;
  joinDate: string;
}

export interface RecentDeal {
  id: string;
  dealName: string;
  shortDescription: string;
  memberName: string;
  discountType: string;
  discountValue: number;
}

export const useDashboardCharts = () => {
  return useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: async () => {
      // Get members with chapter info
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (membersError) throw membersError;

      // Get deals with category info
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (dealsError) throw dealsError;

      // Get chapters for member distribution
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('*');
      
      if (chaptersError) throw chaptersError;

      // Calculate chapter member distribution
      const chapterMemberData: ChapterMemberData[] = chapters?.map(chapter => {
        const chapterMembers = members?.filter(m => m.chapter_name === chapter.name) || [];
        const activeMembers = chapterMembers.filter(m => m.status === 'active');
        return {
          name: chapter.name,
          members: chapterMembers.length,
          active: activeMembers.length
        };
      }) || [];

      // Calculate category distribution
      const categoryMap = new Map<string, number>();
      deals?.forEach(deal => {
        if (deal.status === 'active') {
          const count = categoryMap.get(deal.category) || 0;
          categoryMap.set(deal.category, count + 1);
        }
      });

      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe'];
      const categoryData: CategoryData[] = Array.from(categoryMap.entries()).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));

      // Generate monthly trends (last 6 months)
      const monthlyTrends: MonthlyTrendData[] = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthMembers = members?.filter(m => {
          const joinDate = new Date(m.join_date);
          return joinDate >= date && joinDate < nextMonth;
        }).length || 0;

        const monthDeals = deals?.filter(d => {
          const createdAt = new Date(d.created_at);
          return createdAt >= date && createdAt < nextMonth && d.status === 'active';
        }).length || 0;

        monthlyTrends.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          members: monthMembers,
          deals: monthDeals
        });
      }

      // Get recent members (last 5)
      const recentMembers: RecentMember[] = members?.slice(0, 5).map(m => ({
        id: m.id,
        name: m.name,
        businessName: m.business_name,
        chapterName: m.chapter_name,
        memberRole: m.member_role,
        joinDate: m.join_date
      })) || [];

      // Get recent deals (last 3)
      const recentDeals: RecentDeal[] = deals?.slice(0, 3).map(d => ({
        id: d.id,
        dealName: d.deal_name,
        shortDescription: d.short_description,
        memberName: d.member_name,
        discountType: d.discount_type,
        discountValue: d.discount_value
      })) || [];

      return {
        chapterMemberData,
        categoryData,
        monthlyTrends,
        recentMembers,
        recentDeals
      };
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

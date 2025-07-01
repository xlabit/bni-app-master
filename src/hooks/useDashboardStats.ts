
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  activeDeals: number;
  expiringDeals: number;
  activeChapters: number;
  totalChapters: number;
  activeForms: number;
  totalForms: number;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Get members stats
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('status');
      
      if (membersError) throw membersError;

      // Get deals stats
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('status, end_date');
      
      if (dealsError) throw dealsError;

      // Get chapters stats
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('status');
      
      if (chaptersError) throw chaptersError;

      // Get forms stats
      const { data: forms, error: formsError } = await supabase
        .from('forms')
        .select('status');
      
      if (formsError) throw formsError;

      // Calculate stats
      const totalMembers = members?.length || 0;
      const activeMembers = members?.filter(m => m.status === 'active').length || 0;
      const activeDeals = deals?.filter(d => d.status === 'active').length || 0;
      const activeChapters = chapters?.filter(c => c.status === 'active').length || 0;
      const totalChapters = chapters?.length || 0;
      const activeForms = forms?.filter(f => f.status === 'active').length || 0;
      const totalForms = forms?.length || 0;

      // Calculate expiring deals (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiringDeals = deals?.filter(d => {
        if (d.status !== 'active') return false;
        const endDate = new Date(d.end_date);
        return endDate <= thirtyDaysFromNow && endDate >= new Date();
      }).length || 0;

      return {
        totalMembers,
        activeMembers,
        activeDeals,
        expiringDeals,
        activeChapters,
        totalChapters,
        activeForms,
        totalForms
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

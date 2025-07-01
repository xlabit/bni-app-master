
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/types';

export const useDeals = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(deal => ({
        id: deal.id,
        dealName: deal.deal_name,
        shortDescription: deal.short_description,
        longDescription: deal.long_description,
        memberName: deal.member_name,
        memberId: deal.member_id || '',
        startDate: deal.start_date,
        endDate: deal.end_date,
        discountType: deal.discount_type as 'flat' | 'percentage',
        discountValue: Number(deal.discount_value),
        specialRoleDiscount: deal.special_role_discount ? {
          discountType: deal.special_discount_type as 'flat' | 'percentage',
          discountValue: Number(deal.special_discount_value)
        } : undefined,
        category: deal.category,
        status: deal.status as 'active' | 'inactive',
        createdAt: deal.created_at
      })) as Deal[];
    }
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Deal, 'id' | 'createdAt'>) => {
      const { data: deal, error } = await supabase
        .from('deals')
        .insert({
          deal_name: data.dealName,
          short_description: data.shortDescription,
          long_description: data.longDescription,
          member_name: data.memberName,
          member_id: data.memberId || null,
          start_date: data.startDate,
          end_date: data.endDate,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          special_role_discount: !!data.specialRoleDiscount,
          special_discount_type: data.specialRoleDiscount?.discountType || null,
          special_discount_value: data.specialRoleDiscount?.discountValue || null,
          category: data.category,
          status: data.status
        })
        .select()
        .single();
      
      if (error) throw error;
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Omit<Deal, 'id' | 'createdAt'>>) => {
      const { data: deal, error } = await supabase
        .from('deals')
        .update({
          deal_name: data.dealName,
          short_description: data.shortDescription,
          long_description: data.longDescription,
          member_name: data.memberName,
          member_id: data.memberId || null,
          start_date: data.startDate,
          end_date: data.endDate,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          special_role_discount: !!data.specialRoleDiscount,
          special_discount_type: data.specialRoleDiscount?.discountType || null,
          special_discount_value: data.specialRoleDiscount?.discountValue || null,
          category: data.category,
          status: data.status
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });
};

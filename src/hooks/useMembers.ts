import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/types';

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        businessName: member.business_name,
        chapterName: member.chapter_name,
        memberRole: member.member_role as Member['memberRole'],
        membershipEndDate: member.membership_end_date,
        status: member.status as 'active' | 'inactive',
        profileImage: member.profile_image,
        joinDate: member.join_date
      })) as Member[];
    }
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Member, 'id' | 'joinDate'>) => {
      console.log('Creating member with data:', data);
      
      const { data: member, error } = await supabase
        .from('members')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          business_name: data.businessName,
          chapter_name: data.chapterName,
          member_role: data.memberRole,
          membership_end_date: data.membershipEndDate,
          status: data.status,
          profile_image: data.profileImage
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating member:', error);
        throw error;
      }
      
      console.log('Member created successfully:', member);
      return member;
    },
    onSuccess: () => {
      console.log('Invalidating queries after member creation');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    }
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Omit<Member, 'id' | 'joinDate'>>) => {
      console.log('Updating member with id:', id, 'data:', data);
      
      const { data: member, error } = await supabase
        .from('members')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          business_name: data.businessName,
          chapter_name: data.chapterName,
          member_role: data.memberRole,
          membership_end_date: data.membershipEndDate,
          status: data.status,
          profile_image: data.profileImage
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating member:', error);
        throw error;
      }
      
      console.log('Member updated successfully:', member);
      return member;
    },
    onSuccess: () => {
      console.log('Invalidating queries after member update');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    }
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    }
  });
};

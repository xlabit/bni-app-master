
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/types';

export const useChapters = () => {
  return useQuery({
    queryKey: ['chapters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(chapter => ({
        id: chapter.id,
        name: chapter.name,
        status: chapter.status as 'active' | 'inactive',
        createdAt: chapter.created_at,
        memberCount: chapter.member_count
      })) as Chapter[];
    }
  });
};

export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Chapter, 'id' | 'createdAt' | 'memberCount'>) => {
      const { data: chapter, error } = await supabase
        .from('chapters')
        .insert({
          name: data.name,
          status: data.status
        })
        .select()
        .single();
      
      if (error) throw error;
      return chapter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    }
  });
};

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Omit<Chapter, 'id' | 'createdAt' | 'memberCount'>>) => {
      const { data: chapter, error } = await supabase
        .from('chapters')
        .update({
          name: data.name,
          status: data.status
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return chapter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    }
  });
};

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    }
  });
};

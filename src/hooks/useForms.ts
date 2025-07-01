
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Form {
  id: string;
  title: string;
  description: string | null;
  submissions: number;
  status: 'active' | 'inactive';
  publicUrl: string | null;
  createdAt: string;
}

export const useForms = () => {
  return useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(form => ({
        id: form.id,
        title: form.title,
        description: form.description,
        submissions: form.submissions,
        status: form.status as 'active' | 'inactive',
        publicUrl: form.public_url,
        createdAt: form.created_at
      })) as Form[];
    }
  });
};

export const useCreateForm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Form, 'id' | 'createdAt' | 'submissions'>) => {
      const { data: form, error } = await supabase
        .from('forms')
        .insert({
          title: data.title,
          description: data.description,
          status: data.status,
          public_url: data.publicUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      return form;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });
};

export const useUpdateForm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Omit<Form, 'id' | 'createdAt'>>) => {
      const { data: form, error } = await supabase
        .from('forms')
        .update({
          title: data.title,
          description: data.description,
          status: data.status,
          public_url: data.publicUrl,
          submissions: data.submissions
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return form;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });
};

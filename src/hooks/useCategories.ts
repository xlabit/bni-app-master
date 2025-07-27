import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status as 'active' | 'inactive',
        createdAt: category.created_at,
        updatedAt: category.updated_at
      })) as Category[];
    }
  });
};

export const useActiveCategories = () => {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status as 'active' | 'inactive',
        createdAt: category.created_at,
        updatedAt: category.updated_at
      })) as Category[];
    }
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data: category, error } = await supabase
        .from('categories')
        .insert({
          name: data.name,
          description: data.description,
          status: data.status
        })
        .select()
        .single();
      
      if (error) throw error;
      return category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const { data: category, error } = await supabase
        .from('categories')
        .update({
          name: data.name,
          description: data.description,
          status: data.status
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};
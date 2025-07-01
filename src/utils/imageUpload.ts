
import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (file: File, folder: string = 'deals'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('deal-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('deal-images')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const deleteImage = async (url: string): Promise<void> => {
  if (!url) return;
  
  try {
    const path = url.split('/').pop();
    if (path) {
      await supabase.storage
        .from('deal-images')
        .remove([path]);
    }
  } catch (error) {
    console.warn('Failed to delete image:', error);
  }
};

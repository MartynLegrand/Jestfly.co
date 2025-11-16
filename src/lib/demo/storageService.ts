
import { supabase } from "@/lib/supabase/client";

// Upload de arquivo de áudio para o storage
export const uploadDemoAudio = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `demos/${fileName}`;

  const { error } = await supabase.storage
    .from('audio')
    .upload(filePath, file);

  if (error) {
    console.error("Error uploading audio file:", error);
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from('audio')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

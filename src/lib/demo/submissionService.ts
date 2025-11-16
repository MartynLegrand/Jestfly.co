
import { supabase } from "@/lib/supabase/client";
import { DemoSubmission } from "@/types";

// Buscar todas as submissões
export const getAllDemoSubmissions = async (): Promise<DemoSubmission[]> => {
  const { data, error } = await supabase
    .from("demo_submissions")
    .select(`
      *,
      user:user_id(id, username, display_name, avatar_url),
      feedback:demo_feedback(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching demo submissions:", error);
    throw new Error(error.message);
  }

  return data || [];
};

// Buscar submissões do usuário atual
export const getUserDemoSubmissions = async (userId: string): Promise<DemoSubmission[]> => {
  const { data, error } = await supabase
    .from("demo_submissions")
    .select(`
      *,
      feedback:demo_feedback(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user demo submissions:", error);
    throw new Error(error.message);
  }

  return data || [];
};

// Buscar uma submissão específica
export const getDemoSubmission = async (id: string): Promise<DemoSubmission> => {
  const { data, error } = await supabase
    .from("demo_submissions")
    .select(`
      *,
      user:user_id(id, username, display_name, avatar_url),
      feedback:demo_feedback(
        *,
        reviewer:reviewer_id(id, username, display_name, avatar_url)
      ),
      categories:demo_submission_categories(
        category:category_id(*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching demo submission:", error);
    throw new Error(error.message);
  }

  // Transformar os dados aninhados para o formato esperado
  const submission = {
    ...data,
    categories: data.categories?.map((item: any) => item.category) || []
  };

  return submission;
};

// Criar uma nova submissão
export const createDemoSubmission = async (submission: Partial<DemoSubmission>, categoryIds?: string[]): Promise<DemoSubmission> => {
  // Primeiro, inserir a submissão
  const { data, error } = await supabase
    .from("demo_submissions")
    .insert([submission])
    .select()
    .single();

  if (error) {
    console.error("Error creating demo submission:", error);
    throw new Error(error.message);
  }

  // Se houver categorias, criar as relações
  if (categoryIds?.length && data.id) {
    const categoryRelations = categoryIds.map(categoryId => ({
      submission_id: data.id,
      category_id: categoryId
    }));

    const { error: relationError } = await supabase
      .from("demo_submission_categories")
      .insert(categoryRelations);

    if (relationError) {
      console.error("Error adding categories to submission:", relationError);
      // Não falha a operação principal, apenas loga o erro
    }
  }

  return data;
};

// Atualizar uma submissão existente
export const updateDemoSubmission = async (id: string, updates: Partial<DemoSubmission>, categoryIds?: string[]): Promise<DemoSubmission> => {
  // Primeiro, atualizar a submissão
  const { data, error } = await supabase
    .from("demo_submissions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating demo submission:", error);
    throw new Error(error.message);
  }

  // Se houver categorias, atualizar as relações
  if (categoryIds) {
    // Remover relações existentes
    const { error: deleteError } = await supabase
      .from("demo_submission_categories")
      .delete()
      .eq("submission_id", id);

    if (deleteError) {
      console.error("Error removing existing categories:", deleteError);
      // Não falha a operação principal
    }

    if (categoryIds.length > 0) {
      // Adicionar novas relações
      const categoryRelations = categoryIds.map(categoryId => ({
        submission_id: id,
        category_id: categoryId
      }));

      const { error: insertError } = await supabase
        .from("demo_submission_categories")
        .insert(categoryRelations);

      if (insertError) {
        console.error("Error adding categories to submission:", insertError);
        // Não falha a operação principal
      }
    }
  }

  return data;
};

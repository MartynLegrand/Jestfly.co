
/**
 * Service for managing demo categories in the application.
 * Provides functions to interact with demo categories in the database.
 */
import { supabase } from "@/lib/supabase/client";
import { DemoCategory } from "@/types";

/**
 * Fetches all active demo categories from the database.
 * Categories are sorted by name in ascending order.
 * 
 * @returns {Promise<DemoCategory[]>} Promise resolving to an array of demo categories
 * @throws {Error} If there's an error fetching the categories
 * 
 * @example
 * try {
 *   const categories = await getAllDemoCategories();
 *   console.log('Fetched categories:', categories);
 * } catch (error) {
 *   console.error('Failed to fetch categories:', error);
 * }
 */
export const getAllDemoCategories = async (): Promise<DemoCategory[]> => {
  const { data, error } = await supabase
    .from("demo_categories")
    .select()
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching demo categories:", error);
    throw new Error(error.message);
  }

  return data || [];
};

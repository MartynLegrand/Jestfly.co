
/**
 * Service for managing demo feedback in the application.
 * Provides functions to create and update feedback for demo submissions.
 */
import { supabase } from "@/lib/supabase/client";
import { DemoFeedback } from "@/types";

/**
 * Adds new feedback to a demo submission.
 * 
 * @param {Partial<DemoFeedback>} feedback - The feedback data to be added
 * @returns {Promise<DemoFeedback>} Promise resolving to the created feedback
 * @throws {Error} If there's an error creating the feedback
 * 
 * @example
 * const feedback = await addDemoFeedback({
 *   submission_id: 'demo-123',
 *   reviewer_id: 'user-456',
 *   rating: 5,
 *   comment: 'Great demo!',
 *   is_public: true
 * });
 */
export const addDemoFeedback = async (feedback: Partial<DemoFeedback>): Promise<DemoFeedback> => {
  const { data, error } = await supabase
    .from("demo_feedback")
    .insert([feedback])
    .select()
    .single();

  if (error) {
    console.error("Error adding demo feedback:", error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates existing feedback for a demo submission.
 * 
 * @param {string} id - The ID of the feedback to update
 * @param {Partial<DemoFeedback>} updates - The feedback data to be updated
 * @returns {Promise<DemoFeedback>} Promise resolving to the updated feedback
 * @throws {Error} If there's an error updating the feedback
 * 
 * @example
 * const updatedFeedback = await updateDemoFeedback('feedback-123', {
 *   rating: 4,
 *   is_public: false
 * });
 */
export const updateDemoFeedback = async (id: string, updates: Partial<DemoFeedback>): Promise<DemoFeedback> => {
  const { data, error } = await supabase
    .from("demo_feedback")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating demo feedback:", error);
    throw new Error(error.message);
  }

  return data;
};

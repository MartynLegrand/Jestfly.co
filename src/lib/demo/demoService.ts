
import { getAllDemoSubmissions, getUserDemoSubmissions, getDemoSubmission, createDemoSubmission, updateDemoSubmission } from './submissionService';
import { addDemoFeedback, updateDemoFeedback } from './feedbackService';
import { getAllDemoCategories } from './categoryService';
import { uploadDemoAudio } from './storageService';

// Re-export all functions for backward compatibility
export {
  getAllDemoSubmissions,
  getUserDemoSubmissions,
  getDemoSubmission,
  createDemoSubmission,
  updateDemoSubmission,
  addDemoFeedback,
  updateDemoFeedback,
  getAllDemoCategories,
  uploadDemoAudio
};

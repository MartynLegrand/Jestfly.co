
import { supabase } from "@/lib/supabase/client";

/**
 * Check if a storage bucket exists in Supabase
 * @param bucketName - The name of the bucket to check
 * @returns Promise<boolean> - Whether the bucket exists
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      console.error("Error checking if bucket exists:", error);
      return false;
    }
    return !!data;
  } catch (error) {
    console.error("Exception checking if bucket exists:", error);
    return false;
  }
};

/**
 * Create a new storage bucket in Supabase
 * @param bucketName - The name of the bucket to create
 * @param isPublic - Whether the bucket should be public
 * @returns Promise<boolean> - Whether the bucket was created successfully
 */
export const createBucket = async (
  bucketName: string,
  isPublic: boolean = false
): Promise<boolean> => {
  try {
    // Check if the bucket already exists
    const bucketExists = await checkBucketExists(bucketName);
    if (bucketExists) {
      console.log(`Bucket '${bucketName}' already exists`);
      return true;
    }

    // Create the bucket
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
    });

    if (error) {
      console.error("Error creating bucket:", error);
      return false;
    }

    console.log(`Successfully created bucket '${bucketName}'`);
    return true;
  } catch (error) {
    console.error("Exception creating bucket:", error);
    return false;
  }
};

/**
 * Ensure audio bucket exists for application
 * Call this at app initialization to ensure storage is ready
 */
export const ensureAudioBucketExists = async (): Promise<void> => {
  try {
    const bucketExists = await checkBucketExists('audio');
    
    if (!bucketExists) {
      await createBucket('audio', true); // Make it public so we can play the audio files
      console.log("Audio bucket created successfully");
    } else {
      console.log("Audio bucket already exists");
    }
  } catch (error) {
    console.error("Error ensuring audio bucket exists:", error);
  }
};

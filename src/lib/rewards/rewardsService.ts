
import { supabase } from '@/lib/supabase';
import { 
  RewardActivity, 
  UserReward, 
  Achievement, 
  UserAchievement,
  UserLevel,
  LevelDefinition,
  AirdropTask,
  AirdropSubmission,
  StakingPlan,
  UserStaking,
  AffiliateProgram
} from '@/types/rewards';

// Rewards Activities
export const getRewardActivities = async (): Promise<RewardActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('reward_activities')
      .select('*')
      .order('reward_amount', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reward activities:', error);
    return [];
  }
};

export const getUserRewards = async (userId: string): Promise<UserReward[]> => {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .select(`
        *,
        activity:reward_activities(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    return [];
  }
};

export const getUserUnclaimedRewards = async (userId: string): Promise<UserReward[]> => {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .select(`
        *,
        activity:reward_activities(*)
      `)
      .eq('user_id', userId)
      .eq('claimed', false)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching unclaimed rewards:', error);
    return [];
  }
};

export const claimReward = async (rewardId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('claim_user_reward', {
      p_reward_id: rewardId
    });
    
    if (error) throw error;
    return data.success || false;
  } catch (error) {
    console.error('Error claiming reward:', error);
    return false;
  }
};

// Achievements
export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('level', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
};

export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }
};

// User Levels
export const getUserLevel = async (userId: string): Promise<UserLevel | null> => {
  try {
    const { data, error } = await supabase
      .from('user_levels')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No level found, create a new level for the user
        const { data: newLevel, error: createError } = await supabase
          .from('user_levels')
          .insert([{ user_id: userId, level: 1, experience_points: 0 }])
          .select()
          .single();
          
        if (createError) throw createError;
        return newLevel;
      }
      throw error;
    }
    
    // Get level definition
    const { data: levelInfo, error: levelError } = await supabase
      .from('level_definitions')
      .select('*')
      .eq('level', data.level)
      .single();
      
    if (levelError) throw levelError;
    
    return { ...data, level_info: levelInfo };
  } catch (error) {
    console.error('Error fetching user level:', error);
    return null;
  }
};

export const getLevelDefinitions = async (): Promise<LevelDefinition[]> => {
  try {
    const { data, error } = await supabase
      .from('level_definitions')
      .select('*')
      .order('level', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching level definitions:', error);
    return [];
  }
};

// Airdrop Tasks
export const getAirdropTasks = async (): Promise<AirdropTask[]> => {
  try {
    const { data, error } = await supabase
      .from('airdrop_tasks')
      .select('*')
      .eq('is_active', true)
      .order('reward_amount', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching airdrop tasks:', error);
    return [];
  }
};

export const getUserAirdropSubmissions = async (userId: string): Promise<AirdropSubmission[]> => {
  try {
    const { data, error } = await supabase
      .from('airdrop_submissions')
      .select(`
        *,
        task:airdrop_tasks(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching airdrop submissions:', error);
    return [];
  }
};

export const submitAirdropTask = async (
  userId: string, 
  taskId: string, 
  proofUrl: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('airdrop_submissions')
      .insert([
        { 
          user_id: userId,
          task_id: taskId,
          proof_url: proofUrl,
          status: 'pending'
        }
      ]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting airdrop task:', error);
    return false;
  }
};

// Staking
export const getStakingPlans = async (): Promise<StakingPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('staking_plans')
      .select('*')
      .eq('is_active', true)
      .order('interest_rate', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching staking plans:', error);
    return [];
  }
};

export const getUserStakes = async (userId: string): Promise<UserStaking[]> => {
  try {
    const { data, error } = await supabase
      .from('user_staking')
      .select(`
        *,
        plan:staking_plans(*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user stakes:', error);
    return [];
  }
};

export const createStake = async (
  userId: string,
  planId: string,
  amount: number
): Promise<boolean> => {
  try {
    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('staking_plans')
      .select('*')
      .eq('id', planId)
      .single();
      
    if (planError) throw planError;
    
    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration_days);
    
    // Insert new stake
    const { error } = await supabase
      .from('user_staking')
      .insert([
        { 
          user_id: userId,
          plan_id: planId,
          amount: amount,
          end_date: endDate.toISOString(),
          is_active: true
        }
      ]);
      
    if (error) throw error;
    
    // Deduct JestCoins from wallet
    const { data: walletResult, error: walletError } = await supabase.rpc(
      'transfer_jestcoin',
      {
        sender_id: userId,
        receiver_id: userId,
        amount: -amount,
        description: `Staking ${plan.name} - ${plan.duration_days} days`
      }
    );
    
    if (walletError) throw walletError;
    
    return walletResult.success || false;
  } catch (error) {
    console.error('Error creating stake:', error);
    return false;
  }
};

// Affiliate Program
export const getUserReferrals = async (referrerId: string): Promise<AffiliateProgram[]> => {
  try {
    const { data, error } = await supabase
      .from('affiliate_program')
      .select(`
        *,
        referred_user:profiles!referred_id(username, display_name)
      `)
      .eq('referrer_id', referrerId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    return [];
  }
};

export const getUserReferralCode = async (userId: string): Promise<string> => {
  try {
    // Check if user already has a referral code
    const { data, error } = await supabase
      .from('affiliate_program')
      .select('referral_code')
      .eq('referrer_id', userId)
      .limit(1);
      
    if (error) throw error;
    
    if (data && data.length > 0 && data[0].referral_code) {
      return data[0].referral_code;
    }
    
    // Generate a new referral code
    const referralCode = `JEST${userId.substring(0, 6).toUpperCase()}`;
    
    // Store the referral code
    const { error: updateError } = await supabase
      .from('affiliate_program')
      .insert([
        {
          referrer_id: userId,
          referred_id: userId, // Placeholder, will be updated when used
          referral_code: referralCode,
          status: 'pending'
        }
      ]);
      
    if (updateError) throw updateError;
    
    return referralCode;
  } catch (error) {
    console.error('Error getting referral code:', error);
    return '';
  }
};

export const useReferralCode = async (
  referredUserId: string,
  referralCode: string
): Promise<boolean> => {
  try {
    // Find the referral code
    const { data, error } = await supabase
      .from('affiliate_program')
      .select('referrer_id, referral_code')
      .eq('referral_code', referralCode)
      .neq('referrer_id', referredUserId) // Can't refer yourself
      .single();
      
    if (error) throw error;
    
    // Create the referral relationship
    const { error: insertError } = await supabase
      .from('affiliate_program')
      .insert([
        {
          referrer_id: data.referrer_id,
          referred_id: referredUserId,
          referral_code: referralCode,
          status: 'completed',
          reward_amount: 25, // Default reward amount
          reward_claimed: false
        }
      ]);
      
    if (insertError) throw insertError;
    
    return true;
  } catch (error) {
    console.error('Error using referral code:', error);
    return false;
  }
};

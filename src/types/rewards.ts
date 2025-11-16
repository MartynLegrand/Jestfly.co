
// Reward system types
export interface RewardActivity {
  id: string;
  name: string;
  description: string;
  reward_amount: number;
  is_active: boolean;
  activity_type: string;
  required_count: number;
  cooldown_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  activity_id: string;
  amount: number;
  claimed: boolean;
  claimed_at?: string;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
  activity?: RewardActivity;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  reward_amount: number;
  level: number;
  requirement_type?: string;
  requirement_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  metadata?: any;
  achievement?: Achievement;
}

export interface UserLevel {
  id: string;
  user_id: string;
  level: number;
  experience_points: number;
  updated_at: string;
  level_info?: LevelDefinition;
}

export interface LevelDefinition {
  id: string;
  level: number;
  xp_required: number;
  reward_amount: number;
  benefits: {
    title: string;
    features: string[];
  };
  created_at: string;
}

export interface AirdropTask {
  id: string;
  name: string;
  description?: string;
  task_type: string;
  platform?: string;
  reward_amount: number;
  is_active: boolean;
  proof_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface AirdropSubmission {
  id: string;
  user_id: string;
  task_id: string;
  proof_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  reward_paid: boolean;
  created_at: string;
  task?: AirdropTask;
}

export interface StakingPlan {
  id: string;
  name: string;
  description?: string;
  duration_days: number;
  interest_rate: number;
  minimum_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStaking {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  start_date: string;
  end_date: string;
  interest_earned: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  plan?: StakingPlan;
}

export interface AffiliateProgram {
  id: string;
  referrer_id: string;
  referred_id: string;
  status: string;
  referral_code?: string;
  reward_amount: number;
  reward_claimed: boolean;
  created_at: string;
  updated_at: string;
  referred_user?: {
    username: string;
    display_name: string;
  };
}

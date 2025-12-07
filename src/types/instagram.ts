

export interface InstagramDataExport {
  profile: ProfileInfo | null;
  likes: LikesData;
  comments: CommentsData;
  followers: FollowersData;
  messages: MessagesData;
  stories: StoriesData;
  saved: SavedData;
  ads: AdsData;
  logins: LoginsData;
}

export interface ProfileInfo {
  username: string;
  fullName: string;
  joinDate: string;
  bio?: string;
  profilePicCount: number;
  profilePicture?: string; 
}

export interface LikesData {
  totalLikedPosts: number;
  totalLikedComments: number;
  topLikedAccounts: AccountCount[];
  likesByHour: number[];
  likesByDay: number[];
}

export interface CommentsData {
  totalComments: number;
  topCommentedAccounts: AccountCount[];
  commentWords: string[];
}

export interface FollowersData {
  followersCount: number;
  followingCount: number;
  recentFollowRequests: number;
  recentlyUnfollowed: number;
}

export interface MessagesData {
  totalMessagesSent: number;
  totalConversations: number;
  topConversations: AccountCount[];
  messagesByHour: number[];
}

export interface StoriesData {
  totalStoryLikes: number;
  topStoryAccounts: AccountCount[];
}

export interface SavedData {
  totalSavedPosts: number;
  topSavedAccounts: AccountCount[];
}

export interface AdsData {
  adsViewed: number;
  postsViewed: number;
  videosWatched: number;
}

export interface LoginsData {
  totalLogins: number;
  mostUsedDevice?: string;
  locations: string[];
}

export interface AccountCount {
  account: string;
  count: number;
}


export interface WrappedStats {
  year: number;
  profile: ProfileInfo | null;
  
  
  totalLikes: number;
  totalComments: number;
  totalStoryLikes: number;
  topEngagedAccounts: AccountCount[];
  
  
  totalMessages: number;
  totalConversations: number;
  topDMContacts: AccountCount[];
  chatPersonality: 'night-owl' | 'early-bird' | 'afternoon-chatter' | 'balanced';
  
  
  followers: number;
  following: number;
  netChange: number;
  socialRatio: 'popular' | 'explorer' | 'balanced';
  
  
  savedPosts: number;
  adsViewed: number;
  postsViewed: number;
  videosWatched: number;
  scrollScore: 'casual' | 'moderate' | 'doomscroller' | 'legendary';
  
  
  commentVibe: string;
  engagementLevel: 'lurker' | 'casual' | 'active' | 'power-user';
  
  
  peakHour: number;
  peakDay: string;
  totalLogins: number;
}


export type SlideType = 
  | 'intro'
  | 'profile'
  | 'engagement'
  | 'top-people'
  | 'dms'
  | 'saved'
  | 'followers'
  | 'algorithm'
  | 'personality'
  | 'finale';

export interface SlideConfig {
  type: SlideType;
  gradient: string;
  data: WrappedStats;
}

import JSZip from 'jszip';
import type { InstagramDataExport, AccountCount, WrappedStats } from '@/types/instagram';



const HYPE_WORDS_SET = new Set(['fire', '🔥', 'amazing', 'love', 'best', 'insane', 'crazy', 'dope', 'sick', 'goat', 'lit', 'legendary', 'epic']);
const FUNNY_WORDS_SET = new Set(['lol', 'lmao', '😂', 'haha', 'dead', 'crying', 'funny', 'bruh', 'rofl', 'omg', 'lmfao', '💀']);
const SUPPORT_WORDS_SET = new Set(['proud', 'congrats', 'happy', 'beautiful', 'gorgeous', '❤️', '🙌', 'queen', 'king', 'slay', 'yasss', 'stunning', '💖', '✨']);
const QUESTION_WORDS_SET = new Set(['why', 'what', 'how', 'when', 'where', 'who', '?', 'wait']);


const decodeInstagramString = (str: string): string => {
  if (!str) return str;
  try {
    
    const decoded = str.replace(/\\u00([0-9a-fA-F]{2})/g, (_, hex) => 
      String.fromCharCode(parseInt(hex, 16))
    );
    
    const bytes = new Uint8Array([...decoded].map(c => c.charCodeAt(0)));
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return str;
  }
};


const safeParseJSON = async (zip: JSZip, path: string): Promise<unknown | null> => {
  try {
    const file = zip.file(path);
    if (!file) return null;
    const content = await file.async('string');
    return JSON.parse(content);
  } catch {
    return null;
  }
};


const findFile = (zip: JSZip, patterns: string[]): JSZip.JSZipObject | null => {
  for (const pattern of patterns) {
    const regex = new RegExp(pattern, 'i');
    const found = Object.keys(zip.files).find(path => regex.test(path));
    if (found) return zip.file(found);
  }
  return null;
};


const parseTimestamp = (timestamp: number | string): Date => {
  if (typeof timestamp === 'number') {
    return new Date(timestamp * 1000);
  }
  return new Date(timestamp);
};


const isInYear = (timestamp: number | string, year: number): boolean => {
  const date = parseTimestamp(timestamp);
  return date.getFullYear() === year;
};


const extractUsername = (item: Record<string, unknown>): string | undefined => {
  
  if (item.title) {
    return decodeInstagramString(item.title);
  }
  
  
  if (item.string_list_data?.[0]) {
    const data = item.string_list_data[0];
    
    
    if (data.href) {
      const href = data.href;
      
      const profileMatch = href.match(/instagram\.com\/([^/?]+)\/?$/);
      if (profileMatch && !['reel', 'p', 'stories', 'tv'].includes(profileMatch[1])) {
        return profileMatch[1];
      }
    }
    
    
    if (data.value && !data.value.includes('/') && !data.value.includes('http')) {
      return decodeInstagramString(data.value);
    }
  }
  
  return undefined;
};


const countAccounts = (items: Record<string, unknown>[], yearFilter?: number): AccountCount[] => {
  const counts: Record<string, number> = {};
  
  items.forEach(item => {
    const timestamp = item.string_list_data?.[0]?.timestamp || item.timestamp;
    const account = extractUsername(item);
    
    if (!account) return;
    if (yearFilter && timestamp && !isInYear(timestamp, yearFilter)) return;
    
    counts[account] = (counts[account] || 0) + 1;
  });
  
  return Object.entries(counts)
    .map(([account, count]) => ({ account, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};


const getHourDistribution = (items: Record<string, unknown>[], yearFilter?: number): number[] => {
  const hours = new Array(24).fill(0);
  
  items.forEach(item => {
    const timestamp = item.string_list_data?.[0]?.timestamp || item.timestamp;
    if (!timestamp) return;
    if (yearFilter && !isInYear(timestamp, yearFilter)) return;
    
    const date = parseTimestamp(timestamp);
    hours[date.getHours()]++;
  });
  
  return hours;
};


export const parseInstagramExport = async (
  file: File,
  year: number,
  onProgress?: (progress: number, status: string) => void
): Promise<InstagramDataExport> => {
  onProgress?.(5, 'Unzipping your data...');
  
  const zip = await JSZip.loadAsync(file);
  const result: InstagramDataExport = {
    profile: null,
    likes: {
      totalLikedPosts: 0,
      totalLikedComments: 0,
      topLikedAccounts: [],
      likesByHour: new Array(24).fill(0),
      likesByDay: new Array(7).fill(0),
    },
    comments: {
      totalComments: 0,
      topCommentedAccounts: [],
      commentWords: [],
    },
    followers: {
      followersCount: 0,
      followingCount: 0,
      recentFollowRequests: 0,
      recentlyUnfollowed: 0,
    },
    messages: {
      totalMessagesSent: 0,
      totalConversations: 0,
      topConversations: [],
      messagesByHour: new Array(24).fill(0),
    },
    stories: {
      totalStoryLikes: 0,
      topStoryAccounts: [],
    },
    saved: {
      totalSavedPosts: 0,
      topSavedAccounts: [],
    },
    ads: {
      adsViewed: 0,
      postsViewed: 0,
      videosWatched: 0,
    },
    logins: {
      totalLogins: 0,
      locations: [],
    },
  };

  
  onProgress?.(15, 'Reading your profile...');
  const profilePaths = [
    'personal_information/personal_information/personal_information.json',
    'personal_information/personal_information.json',
    'account_information/personal_information.json',
    'personal_information.json'
  ];
  
  for (const path of profilePaths) {
    const profileData = await safeParseJSON(zip, path);
    if (profileData?.profile_user?.[0]) {
      const userData = profileData.profile_user[0].string_map_data;
      result.profile = {
        username: userData?.Username?.value || 'instagram_user',
        fullName: userData?.Name?.value || '',
        joinDate: userData?.['Date joined']?.value || '',
        bio: userData?.Bio?.value,
        profilePicCount: 0,
      };
      console.log(`✅ Profile loaded: ${result.profile.fullName} (@${result.profile.username})`);
      break;
    }
  }
  
  
  if (!result.profile) {
    const altProfilePath = 'personal_information/personal_information/instagram_profile_information.json';
    const altProfileData = await safeParseJSON(zip, altProfilePath);
    if (altProfileData?.profile_user?.[0]) {
      const userData = altProfileData.profile_user[0].string_map_data;
      result.profile = {
        username: userData?.Username?.value || 'instagram_user',
        fullName: userData?.Name?.value || '',
        joinDate: userData?.['Date joined']?.value || '',
        bio: userData?.Bio?.value,
        profilePicCount: 0,
      };
      console.log(`✅ Profile loaded from alt path: ${result.profile.fullName} (@${result.profile.username})`);
    }
  }
  
  
  if (result.profile) {
    
    const allFiles = Object.keys(zip.files);
    const mediaProfilePattern = /media\/profile\/\d+\/.*\.(jpg|jpeg|png)$/i;
    const mediaProfilePics = allFiles.filter(path => mediaProfilePattern.test(path));
    
    let foundPicture = false;
    
    
    if (mediaProfilePics.length > 0) {
      const picPath = mediaProfilePics[0]; 
      const picFile = zip.file(picPath);
      if (picFile) {
        try {
          const blob = await picFile.async('blob');
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          result.profile.profilePicture = dataUrl;
          console.log(`✅ Profile picture loaded from: ${picPath}`);
          foundPicture = true;
        } catch (err) {
          console.error(`Failed to load profile picture from ${picPath}:`, err);
        }
      }
    }
    
    
    if (!foundPicture) {
      const profilePicPattern = /(profile|avatar).*\.(jpg|jpeg|png)$/i;
      const potentialPics = allFiles.filter(path => profilePicPattern.test(path) && !path.includes('thread'));
      
      if (potentialPics.length > 0) {
        console.log(`Found potential profile pictures: ${potentialPics.join(', ')}`);
        const picPath = potentialPics[0];
        const picFile = zip.file(picPath);
        if (picFile) {
          try {
            const blob = await picFile.async('blob');
            const reader = new FileReader();
            const dataUrl = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            result.profile.profilePicture = dataUrl;
            console.log(`✅ Profile picture loaded from: ${picPath}`);
            foundPicture = true;
          } catch (err) {
            console.error(`Failed to load profile picture from ${picPath}:`, err);
          }
        }
      }
      
      if (!foundPicture) {
        console.warn('⚠️ No profile picture found in Instagram export. Camera emoji will be used as fallback.');
      }
    }
  }

  
  onProgress?.(25, 'Counting your likes...');
  const likedPostsPaths = [
    'your_instagram_activity/likes/liked_posts.json',
    'likes/liked_posts.json'
  ];
  
  for (const path of likedPostsPaths) {
    const likedPosts = await safeParseJSON(zip, path);
    if (likedPosts?.likes_media_likes) {
      const items = likedPosts.likes_media_likes;
      const yearFiltered = items.filter((item: Record<string, unknown>) => {
        const ts = (item.string_list_data as Record<string, unknown>[])?.[0]?.timestamp;
        return !ts || isInYear(ts as number, year);
      });
      result.likes.totalLikedPosts = yearFiltered.length;
      result.likes.topLikedAccounts = countAccounts(items, year);
      result.likes.likesByHour = getHourDistribution(items, year);
      break;
    }
  }

  
  const likedCommentsPaths = [
    'your_instagram_activity/likes/liked_comments.json',
    'likes/liked_comments.json'
  ];
  
  for (const path of likedCommentsPaths) {
    const likedComments = await safeParseJSON(zip, path);
    if (likedComments?.likes_comment_likes) {
      const items = likedComments.likes_comment_likes;
      result.likes.totalLikedComments = items.filter((item: Record<string, unknown>) => {
        const ts = (item.string_list_data as Record<string, unknown>[])?.[0]?.timestamp;
        return !ts || isInYear(ts as number, year);
      }).length;
      break;
    }
  }

  
  onProgress?.(35, 'Analyzing your comments...');
  const commentsPaths = [
    'your_instagram_activity/comments/post_comments_1.json',
    'comments/post_comments_1.json'
  ];
  
  for (const path of commentsPaths) {
    const commentsData = await safeParseJSON(zip, path);
    if (commentsData) {
      const items = Array.isArray(commentsData) ? commentsData : commentsData.comments_media_comments || [];
      result.comments.totalComments = items.filter((item: Record<string, unknown>) => {
        const ts = (item.string_list_data as Record<string, unknown>[])?.[0]?.timestamp || item.timestamp;
        return !ts || isInYear(ts as number, year);
      }).length;
      result.comments.topCommentedAccounts = countAccounts(items, year);
      
      
      const words: string[] = [];
      items.forEach((item: Record<string, unknown>) => {
        const text = (item.string_list_data as Record<string, unknown>[])?.[0]?.value || item.comment || '';
        words.push(...String(text).toLowerCase().split(/\s+/).filter((w: string) => w.length > 2));
      });
      result.comments.commentWords = words.slice(0, 100);
      break;
    }
  }

  
  onProgress?.(45, 'Checking your connections...');
  const followersPaths = [
    'connections/followers_and_following/followers_1.json',
    'followers_and_following/followers_1.json',
    'followers_and_following/followers.json',
    'connections/followers_and_following/followers.json'
  ];
  
  for (const path of followersPaths) {
    const followersData = await safeParseJSON(zip, path);
    if (followersData) {
      const items = Array.isArray(followersData) ? followersData : followersData.relationships_followers || [];
      result.followers.followersCount = items.length;
      console.log(`✅ Found ${items.length} followers from: ${path}`);
      break;
    }
  }

  const followingPaths = [
    'connections/followers_and_following/following.json',
    'followers_and_following/following.json',
    'connections/followers_and_following/following_1.json',
    'followers_and_following/following_1.json'
  ];
  
  for (const path of followingPaths) {
    const followingData = await safeParseJSON(zip, path);
    if (followingData) {
      const items = Array.isArray(followingData) ? followingData : followingData.relationships_following || [];
      result.followers.followingCount = items.length;
      console.log(`✅ Found ${items.length} following from: ${path}`);
      break;
    }
  }

  
  onProgress?.(55, 'Scanning your DMs...');
  const messageFiles = Object.keys(zip.files).filter(
    path => path.includes('your_instagram_activity/messages/inbox') && path.endsWith('message_1.json')
  );
  
  console.log(`📬 Found ${messageFiles.length} conversations to analyze`);
  
  let totalMessages = 0;
  const conversationCounts: Record<string, number> = {};
  const msgHours = new Array(24).fill(0);
  
  for (const msgPath of messageFiles) {
    const msgData = await safeParseJSON(zip, msgPath);
    if (msgData?.messages && msgData?.participants) {
      
      const allParticipants = (msgData.participants as Record<string, unknown>[])
        ?.filter((p: Record<string, unknown>) => p.name)
        .map((p: Record<string, unknown>) => decodeInstagramString(String(p.name))) || [];
      
      if (allParticipants.length === 0) continue;
      
      
      const isDM = allParticipants.length === 2;
      
      if (!isDM) {
        result.messages.totalConversations++; 
        continue; 
      }
      
      
      
      let currentUserName = allParticipants[1]; 
      
      
      if (result.profile?.fullName || result.profile?.username) {
        const profileName = result.profile.fullName || '';
        const profileUsername = result.profile.username || '';
        
        
        const matchingParticipant = allParticipants.find(p => 
          p === profileName || p === profileUsername || 
          (profileName && p.toLowerCase() === profileName.toLowerCase()) ||
          (profileUsername && p.toLowerCase() === profileUsername.toLowerCase())
        );
        
        if (matchingParticipant) {
          currentUserName = matchingParticipant;
        }
      }
      
      
      const otherPerson = allParticipants.find(p => p !== currentUserName) || allParticipants[0];
      const conversationName = msgData.title ? decodeInstagramString(msgData.title) : otherPerson;
      
      let convUserMessageCount = 0;
      let convTotalMessages = 0;
      
      (msgData.messages as Record<string, unknown>[]).forEach((msg: Record<string, unknown>) => {
        if (!msg.timestamp_ms) return;
        if (!isInYear(Number(msg.timestamp_ms) / 1000, year)) return;
        
        convTotalMessages++;
        const senderName = decodeInstagramString(String(msg.sender_name || ''));
        
        
        if (senderName === currentUserName) {
          totalMessages++;
          convUserMessageCount++;
          const date = new Date(msg.timestamp_ms);
          msgHours[date.getHours()]++;
        }
      });
      
      
      if (convUserMessageCount > 0) {
        conversationCounts[conversationName] = (conversationCounts[conversationName] || 0) + convUserMessageCount;
      }
    }
  }
  
  result.messages.totalMessagesSent = totalMessages;
  result.messages.totalConversations = Object.keys(conversationCounts).length;
  result.messages.topConversations = Object.entries(conversationCounts)
    .map(([account, count]) => ({ account, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  result.messages.messagesByHour = msgHours;

  
  onProgress?.(65, 'Looking at your story activity...');
  const storyPaths = [
    'your_instagram_activity/story_interactions/story_likes.json',
    'story_interactions/story_likes.json'
  ];
  
  for (const path of storyPaths) {
    const storyData = await safeParseJSON(zip, path);
    if (storyData?.story_activities_story_likes) {
      const items = storyData.story_activities_story_likes;
      result.stories.totalStoryLikes = items.filter((item: Record<string, unknown>) => {
        const ts = (item.string_list_data as Record<string, unknown>[])?.[0]?.timestamp;
        return !ts || isInYear(ts as number, year);
      }).length;
      result.stories.topStoryAccounts = countAccounts(items, year);
      break;
    }
  }

  
  onProgress?.(75, 'Checking your saved posts...');
  const savedPaths = [
    'your_instagram_activity/saved/saved_posts.json',
    'saved/saved_posts.json'
  ];
  
  for (const path of savedPaths) {
    const savedData = await safeParseJSON(zip, path);
    if (savedData?.saved_saved_media) {
      const items = savedData.saved_saved_media;
      result.saved.totalSavedPosts = items.filter((item: Record<string, unknown>) => {
        const ts = (item.string_list_data as Record<string, unknown>[])?.[0]?.timestamp;
        return !ts || isInYear(ts as number, year);
      }).length;
      result.saved.topSavedAccounts = countAccounts(items, year);
      break;
    }
  }

  
  onProgress?.(85, 'Measuring your scroll time...');
  const adsViewedPaths = [
    'ads_information/ads_and_topics/ads_viewed.json',
    'ads_and_topics/ads_viewed.json'
  ];
  
  for (const path of adsViewedPaths) {
    const adsData = await safeParseJSON(zip, path);
    if (adsData?.impressions_history_ads_seen) {
      result.ads.adsViewed = adsData.impressions_history_ads_seen.length;
      break;
    }
  }

  const postsViewedPaths = [
    'ads_information/ads_and_topics/posts_viewed.json',
    'ads_and_topics/posts_viewed.json'
  ];
  
  for (const path of postsViewedPaths) {
    const postsData = await safeParseJSON(zip, path);
    if (postsData?.impressions_history_posts_seen) {
      result.ads.postsViewed = postsData.impressions_history_posts_seen.length;
      break;
    }
  }

  const videosWatchedPaths = [
    'ads_information/ads_and_topics/videos_watched.json',
    'ads_and_topics/videos_watched.json'
  ];
  
  for (const path of videosWatchedPaths) {
    const videosData = await safeParseJSON(zip, path);
    if (videosData?.impressions_history_videos_watched) {
      result.ads.videosWatched = videosData.impressions_history_videos_watched.length;
      break;
    }
  }

  
  onProgress?.(95, 'Reviewing your logins...');
  const loginPaths = [
    'security_and_login_information/login_and_profile_creation/login_activity.json',
    'login_and_profile_creation/login_activity.json'
  ];
  
  for (const path of loginPaths) {
    const loginData = await safeParseJSON(zip, path);
    if (loginData?.account_history_login_history) {
      const items = loginData.account_history_login_history;
      result.logins.totalLogins = items.filter((item: Record<string, unknown>) => {
        const ts = (item.string_map_data as Record<string, unknown>)?.Time?.timestamp;
        return !ts || isInYear(ts as number, year);
      }).length;
      break;
    }
  }

  onProgress?.(100, 'Done!');
  return result;
};


export const computeWrappedStats = async (data: InstagramDataExport, year: number): Promise<WrappedStats> => {
  const followers = data.followers.followersCount;
  const following = data.followers.followingCount;

  
  const msgHours = data.messages.messagesByHour;
  const nightMessages = msgHours.slice(22, 24).reduce((a, b) => a + b, 0) + msgHours.slice(0, 5).reduce((a, b) => a + b, 0);
  const morningMessages = msgHours.slice(5, 12).reduce((a, b) => a + b, 0);
  const afternoonMessages = msgHours.slice(12, 18).reduce((a, b) => a + b, 0);
  const eveningMessages = msgHours.slice(18, 22).reduce((a, b) => a + b, 0);
  
  let chatPersonality: WrappedStats['chatPersonality'] = 'balanced';
  const totalDayMessages = nightMessages + morningMessages + afternoonMessages + eveningMessages;
  
  
  
  if (totalDayMessages > 0) {
    const nightRatio = nightMessages / totalDayMessages;
    const morningRatio = morningMessages / totalDayMessages;
    const afternoonRatio = afternoonMessages / totalDayMessages;
    
    
    const maxRatio = Math.max(nightRatio, morningRatio, afternoonRatio);
    
    if (maxRatio > 0.4) {
      if (nightRatio === maxRatio) chatPersonality = 'night-owl';
      else if (morningRatio === maxRatio) chatPersonality = 'early-bird';
      else if (afternoonRatio === maxRatio) chatPersonality = 'afternoon-chatter';
    }
  }

  
  let socialRatio: WrappedStats['socialRatio'] = 'balanced';
  if (followers > following * 1.5) socialRatio = 'popular';
  else if (following > followers * 1.5) socialRatio = 'explorer';

  
  const totalContent = data.ads.postsViewed + data.ads.videosWatched;
  let scrollScore: WrappedStats['scrollScore'] = 'casual';
  
  if (totalContent > 100000) scrollScore = 'legendary';
  else if (totalContent > 50000) scrollScore = 'doomscroller';
  else if (totalContent > 10000) scrollScore = 'moderate';

  
  const commonWords = data.comments.commentWords;
  
  
  let hypeCount = 0;
  let funnyCount = 0;
  let supportCount = 0;
  let questionCount = 0;
  
  
  for (const word of commonWords) {
    const lowerWord = word.toLowerCase();
    let matchedHype = false;
    let matchedFunny = false;
    let matchedSupport = false;
    let matchedQuestion = false;
    
    
    for (const keyword of HYPE_WORDS_SET) {
      if (!matchedHype && lowerWord.includes(keyword)) {
        hypeCount++;
        matchedHype = true;
        break;
      }
    }
    
    for (const keyword of FUNNY_WORDS_SET) {
      if (!matchedFunny && lowerWord.includes(keyword)) {
        funnyCount++;
        matchedFunny = true;
        break;
      }
    }
    
    for (const keyword of SUPPORT_WORDS_SET) {
      if (!matchedSupport && lowerWord.includes(keyword)) {
        supportCount++;
        matchedSupport = true;
        break;
      }
    }
    
    for (const keyword of QUESTION_WORDS_SET) {
      if (!matchedQuestion && lowerWord.includes(keyword)) {
        questionCount++;
        matchedQuestion = true;
        break;
      }
    }
  }
  
  let commentVibe = '💬 The Observer';
  const totalVibeWords = hypeCount + funnyCount + supportCount + questionCount;
  
  
  if (data.comments.totalComments > 5 && totalVibeWords > 0) {
    const maxCount = Math.max(hypeCount, funnyCount, supportCount, questionCount);
    
    if (maxCount === hypeCount && hypeCount > 0) commentVibe = '🔥 The Hype Machine';
    else if (maxCount === funnyCount && funnyCount > 0) commentVibe = '😂 The Meme Reactor';
    else if (maxCount === supportCount && supportCount > 0) commentVibe = '💖 The Cheerleader';
    else if (maxCount === questionCount && questionCount > 0) commentVibe = '🤔 The Curious One';
  }

  
  const totalEngagement = data.likes.totalLikedPosts + data.comments.totalComments + data.stories.totalStoryLikes;
  let engagementLevel: WrappedStats['engagementLevel'] = 'lurker';
  if (totalEngagement > 5000) engagementLevel = 'power-user';
  else if (totalEngagement > 1000) engagementLevel = 'active';
  else if (totalEngagement > 200) engagementLevel = 'casual';

  
  const likeHours = data.likes.likesByHour;
  const peakHour = likeHours.indexOf(Math.max(...likeHours));

  
  const allAccounts: Record<string, number> = {};
  [...data.likes.topLikedAccounts, ...data.comments.topCommentedAccounts, ...data.stories.topStoryAccounts].forEach(({ account, count }) => {
    allAccounts[account] = (allAccounts[account] || 0) + count;
  });
  const topEngagedAccounts = Object.entries(allAccounts)
    .map(([account, count]) => ({ account, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    year,
    profile: data.profile,
    totalLikes: data.likes.totalLikedPosts + data.likes.totalLikedComments,
    totalComments: data.comments.totalComments,
    totalStoryLikes: data.stories.totalStoryLikes,
    topEngagedAccounts,
    totalMessages: data.messages.totalMessagesSent,
    totalConversations: data.messages.totalConversations,
    topDMContacts: data.messages.topConversations,
    chatPersonality,
    followers,
    following,
    netChange: 0,
    socialRatio,
    savedPosts: data.saved.totalSavedPosts,
    adsViewed: data.ads.adsViewed,
    postsViewed: data.ads.postsViewed,
    videosWatched: data.ads.videosWatched,
    scrollScore,
    commentVibe,
    engagementLevel,
    peakHour,
    peakDay: 'Friday',
    totalLogins: data.logins.totalLogins,
  };
};

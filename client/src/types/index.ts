// Domain types for Engineer Hub. Shapes mirror the expected MongoDB documents
// (including _id, userId, createdAt, updatedAt) so they can be swapped for real
// API responses with no component changes.

export interface BaseDocument {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  token: string;
  refreshToken?: string;
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Confidence = 'Low' | 'Medium' | 'High';

export interface LearningTopic extends BaseDocument {
  topicName: string;
  category: string;
  description: string;
  difficulty: Difficulty;
  progress: number;
  confidence: Confidence;
  targetDate: string;
  lastUpdated: string;
}

export type CodingPlatform =
  | 'LeetCode'
  | 'Codeforces'
  | 'HackerRank'
  | 'GeeksforGeeks'
  | 'CodeChef';

export interface CodingProfile extends BaseDocument {
  platform: CodingPlatform;
  username: string;
  profileUrl: string;
}

export interface Note extends BaseDocument {
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';

export interface Project extends BaseDocument {
  projectName: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveDemo: string;
  status: ProjectStatus;
}

export interface Resume {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Research extends BaseDocument {
  title: string;
  category: string;
  company?: string;
  summary: string;
  content: string;
  tags: string[];
  source: string;
  isFavorite: boolean;
}

export type EventType = 'Study Session' | 'Revision' | 'Interview' | 'Coding Contest';

export interface CalendarEvent extends BaseDocument {
  title: string;
  type: EventType;
  date: string;
  time: string;
  description: string;
}

export interface Profile {
  _id: string;
  name: string;
  email: string;
  college: string;
  cgpa: number;
  skills: string[];
  github: string;
  linkedin: string;
  leetcode: string;
  codeforces: string;
  portfolio: string;
  avatarUrl?: string;
}

export interface Settings {
  theme: 'dark' | 'light';
}

export interface AnalyticsSummary {
  topicsCompleted: number;
  totalNotes: number;
  projectsAdded: number;
  connectedProfiles: number;
}

export interface Task extends BaseDocument {
  title: string;
  completed: boolean;
}

export interface ResearchCompany extends BaseDocument {
  companyName: string;
  logoUrl: string;
  industry: string;
  headquarters: string;
  ceo: string;
  foundedYear: number;
  website: string;
  products: string;
  techStack: string[];
  hiringStatus: string;
  news: Array<{
    title: string;
    summary: string;
    publishedDate: string;
    url: string;
  }>;
}

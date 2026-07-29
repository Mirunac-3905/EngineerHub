import type {
  CodingPlatform,
  EventType,
  ProjectStatus,
  ResearchCompany,
} from '@/types';

export const APP_NAME = 'Engineer Hub';
export const APP_TAGLINE = 'Prepare smarter. Land the offer.';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api';

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: 'LayoutDashboard' },
      { label: 'Analytics', to: '/analytics', icon: 'BarChart3' },
    ],
  },
  {
    label: 'Prepare',
    items: [
      { label: 'Learning', to: '/learning', icon: 'GraduationCap' },
      { label: 'Coding', to: '/coding', icon: 'Code2' },
      { label: 'Notes', to: '/notes', icon: 'StickyNote' },
      { label: 'Projects', to: '/projects', icon: 'FolderGit2' },
    ],
  },
  {
    label: 'Career',
    items: [
      { label: 'Resume', to: '/resume', icon: 'FileText' },
      { label: 'Research Hub', to: '/research', icon: 'Search' },
      { label: 'Calendar', to: '/calendar', icon: 'CalendarDays' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile', to: '/profile', icon: 'UserCircle2' },
      { label: 'Settings', to: '/settings', icon: 'Settings' },
    ],
  },
] as const;

export const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const;
export const CONFIDENCE_OPTIONS = ['Low', 'Medium', 'High'] as const;

export const CODING_PLATFORMS: {
  name: CodingPlatform;
  color: string;
  url: string;
}[] = [
  { name: 'LeetCode', color: '#FFA116', url: 'https://leetcode.com' },
  { name: 'Codeforces', color: '#1F8FFF', url: 'https://codeforces.com' },
  { name: 'HackerRank', color: '#00EA64', url: 'https://hackerrank.com' },
  { name: 'GeeksforGeeks', color: '#2F8D46', url: 'https://geeksforgeeks.org' },
  { name: 'CodeChef', color: '#5B4638', url: 'https://codechef.com' },
];

export const PROJECT_STATUS_OPTIONS = [
  'Planning',
  'In Progress',
  'Completed',
  'On Hold',
] as const;

export const EVENT_TYPE_OPTIONS = [
  'Study Session',
  'Revision',
  'Interview',
  'Coding Contest',
] as const;

export const CODING_PLATFORM_NAMES = CODING_PLATFORMS.map(
  (p) => p.name,
) as [CodingPlatform, ...CodingPlatform[]];

export const EVENT_TYPE_META: Record<EventType, { color: string; icon: keyof typeof import('lucide-react') }> = {
  'Study Session': { color: 'var(--chart-1)', icon: 'BookOpen' },
  Revision: { color: 'var(--chart-2)', icon: 'RefreshCw' },
  Interview: { color: 'var(--chart-4)', icon: 'Mic' },
  'Coding Contest': { color: 'var(--chart-3)', icon: 'Trophy' },
};

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { className: string; dot: string }
> = {
  Planning: {
    className: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  },
  'In Progress': {
    className: 'bg-primary/10 text-primary border-primary/30',
    dot: 'bg-primary',
  },
  Completed: {
    className: 'bg-success/10 text-success border-success/30',
    dot: 'bg-success',
  },
  'On Hold': {
    className: 'bg-warning/10 text-warning border-warning/30',
    dot: 'bg-warning',
  },
};

export const MOTIVATION_QUOTES = [
  {
    quote: 'The expert in anything was once a beginner.',
    author: 'Helen Hayes',
  },
  {
    quote: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
  },
  {
    quote: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
  },
  {
    quote: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
  },
  {
    quote: 'Simplicity is the soul of efficiency.',
    author: 'Austin Freeman',
  },
  {
    quote: 'Code is like humor. When you have to explain it, it is bad.',
    author: 'Cory House',
  },
  {
    quote: 'Programs must be written for people to read.',
    author: 'Harold Abelson',
  },
];

export const FEATURED_ENGINEERS = [
  {
    name: 'Linus Torvalds',
    role: 'Creator of Linux & Git',
    quote:
      'See, you not only have to be a good coder to create a system like Linux, you have to be a sneaky one too.',
    image:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
  },
  {
    name: 'Grace Hopper',
    role: 'Pioneer of Computer Science',
    quote:
      'The most dangerous phrase in the language is, "We have always done it this way."',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    name: 'Dennis Ritchie',
    role: 'Creator of C & Unix',
    quote: "The only way to learn a new programming language is by writing programs in it.",
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
  },
];

export const QUICK_ACTIONS = [
  {
    label: 'Continue Learning',
    description: 'Pick up where you left off',
    to: '/learning',
    icon: 'GraduationCap',
    accent: 'from-blue-500/20 to-blue-500/5',
  },
  {
    label: 'Research Company',
    description: 'Explore target employers',
    to: '/research',
    icon: 'Search',
    accent: 'from-purple-500/20 to-purple-500/5',
  },
  {
    label: 'Add Note',
    description: 'Capture a quick thought',
    to: '/notes',
    icon: 'StickyNote',
    accent: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    label: 'View Projects',
    description: 'Manage your portfolio',
    to: '/projects',
    icon: 'FolderGit2',
    accent: 'from-amber-500/20 to-amber-500/5',
  },
] as const;

export const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'Python',
  'Java',
  'C++',
  'SQL',
  'Git',
  'Docker',
  'AWS',
  'GraphQL',
  'Next.js',
  'TailwindCSS',
];

export const STUDY_CATEGORIES = [
  'Data Structures',
  'Algorithms',
  'System Design',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'OOP Concepts',
  'Web Development',
  'Aptitude',
  'Core Subjects',
];

// Sample company catalog for Research Hub search (minus user-scoped fields).
export const COMPANY_CATALOG: Omit<
  ResearchCompany,
  'userId' | 'notes' | 'createdAt' | 'updatedAt'
>[] = [
  {
    _id: 'cmp-google',
    companyName: 'Google',
    logoUrl:
      'https://logo.clearbit.com/google.com',
    industry: 'Technology · Search & Cloud',
    headquarters: 'Mountain View, California, USA',
    ceo: 'Sundar Pichai',
    foundedYear: 1998,
    website: 'https://about.google',
    products: 'Search, Android, Chrome, Workspace, Google Cloud, YouTube',
    techStack: ['C++', 'Java', 'Python', 'Go', 'Kubernetes', 'TensorFlow'],
    hiringStatus: 'Actively hiring — SWE, Backend, ML',
    news: [
      {
        title: 'Google expands cloud AI infrastructure',
        summary:
          'New TPU pods and AI-optimized regions roll out across multiple continents.',
        publishedDate: '2025-09-14',
        url: 'https://blog.google',
      },
      {
        title: 'Android 16 introduces on-device AI APIs',
        summary:
          'Developers get new on-device summarization and translation APIs.',
        publishedDate: '2025-08-30',
        url: 'https://blog.google',
      },
    ],
  },
  {
    _id: 'cmp-microsoft',
    companyName: 'Microsoft',
    logoUrl: 'https://logo.clearbit.com/microsoft.com',
    industry: 'Technology · Software & Cloud',
    headquarters: 'Redmond, Washington, USA',
    ceo: 'Satya Nadella',
    foundedYear: 1975,
    website: 'https://www.microsoft.com',
    products: 'Windows, Azure, Office 365, GitHub, LinkedIn, Xbox',
    techStack: ['C#', 'TypeScript', 'Rust', 'Azure', 'React', '.NET'],
    hiringStatus: 'Hiring — Cloud, Productivity, Gaming',
    news: [
      {
        title: 'Azure AI reaches new enterprise milestones',
        summary:
          'Copilot adoption accelerates across Fortune 500 organizations.',
        publishedDate: '2025-09-08',
        url: 'https://blogs.microsoft.com',
      },
    ],
  },
  {
    _id: 'cmp-amazon',
    companyName: 'Amazon',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    industry: 'E-commerce & Cloud Computing',
    headquarters: 'Seattle, Washington, USA',
    ceo: 'Andy Jassy',
    foundedYear: 1994,
    website: 'https://www.amazon.com',
    products: 'AWS, Prime, Kindle, Alexa, Amazon Retail',
    techStack: ['Java', 'C++', 'Python', 'AWS', 'DynamoDB', 'React'],
    hiringStatus: 'Open roles — SDE I/II, Support Engineers',
    news: [
      {
        title: 'AWS launches new serverless offerings',
        summary:
          'EventBridge and Lambda get performance and pricing upgrades.',
        publishedDate: '2025-09-02',
        url: 'https://aws.amazon.com/blogs',
      },
    ],
  },
  {
    _id: 'cmp-meta',
    companyName: 'Meta',
    logoUrl: 'https://logo.clearbit.com/meta.com',
    industry: 'Technology · Social & VR',
    headquarters: 'Menlo Park, California, USA',
    ceo: 'Mark Zuckerberg',
    foundedYear: 2004,
    website: 'https://about.meta.com',
    products: 'Facebook, Instagram, WhatsApp, Quest, Threads',
    techStack: ['React', 'Hack', 'Python', 'C++', 'PyTorch'],
    hiringStatus: 'Hiring — Infra, ML, Frontend',
    news: [
      {
        title: 'Meta open-sources new recommendation model',
        summary: 'A scalable retrieval architecture for billion-scale feeds.',
        publishedDate: '2025-08-22',
        url: 'https://research.meta.com',
      },
    ],
  },
  {
    _id: 'cmp-netflix',
    companyName: 'Netflix',
    logoUrl: 'https://logo.clearbit.com/netflix.com',
    industry: 'Streaming & Entertainment',
    headquarters: 'Los Gatos, California, USA',
    ceo: 'Ted Sarandos',
    foundedYear: 1997,
    website: 'https://www.netflix.com',
    products: 'Netflix Streaming, Studio Originals',
    techStack: ['Java', 'Node.js', 'React', 'AWS', 'Cassandra'],
    hiringStatus: 'Selective hiring — Backend, Streaming',
    news: [
      {
        title: 'Netflix refactors microservices routing',
        summary: 'A move to adaptive concurrency limits improves resilience.',
        publishedDate: '2025-07-18',
        url: 'https://netflixtechblog.com',
      },
    ],
  },
];

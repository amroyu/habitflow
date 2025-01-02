export type ResourceType = 'article' | 'video' | 'book' | 'tool' | 'course';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ResourceAuthor {
  id: string;
  name: string;
  avatar: string;
  credentials?: string[];
}

export interface ResourceHub {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  author: ResourceAuthor;
  thumbnail: string;
  tags: string[];
  likes: number;
  saves: number;
  dateAdded: string;
  readTime: string;
  difficulty: DifficultyLevel;
  isPremium: boolean;
}

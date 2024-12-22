export interface Goal {
  id: string;
  title: string;
  type: 'do' | 'dont';
  category: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

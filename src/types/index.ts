export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple-choice';
  options?: string[];
  required?: boolean;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, string | string[]>;
  submittedAt: string;
  submitterEmail?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface FormStats {
  totalResponses: number;
  questionStats: Record<string, {
    totalAnswers: number;
    optionCounts?: Record<string, number>;
    textAnswers?: string[];
  }>;
}
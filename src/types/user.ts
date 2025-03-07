export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider?: 'email' | 'google' | 'github';
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
} 
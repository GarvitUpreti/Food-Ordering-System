export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export enum Country {
  INDIA = 'INDIA',
  AMERICA = 'AMERICA',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  country: Country;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: Role;
  country: Country;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
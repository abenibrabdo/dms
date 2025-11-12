export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  roles?: string[];
  permissions?: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}


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
  mfaCode?: string;
}

export interface MfaVerifyInput {
  code: string;
}

export interface RequestPasswordResetInput {
  email: string;
}

export interface ConfirmPasswordResetInput {
  token: string;
  newPassword: string;
}


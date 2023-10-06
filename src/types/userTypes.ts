export default interface UserSignUpRequest {
  name?: string;
  email: string;
  password?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserForgotPasswordRequest {
  email: string;
}

export interface UserResetPasswordInfo {
  new_password: string;
  confirm_password: string;
}

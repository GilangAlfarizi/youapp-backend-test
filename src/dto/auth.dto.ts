export class RegisterUserDTO {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export class LoginUserDTO {
  email?: string;
  username?: string;
  password: string;
}

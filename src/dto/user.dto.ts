export class RegisterUser {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export class LoginUser {
  email?: string;
  username?: string;
  password: string;
}

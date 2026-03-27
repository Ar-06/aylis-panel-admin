export interface LoginUser {
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}

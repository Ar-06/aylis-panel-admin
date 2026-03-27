import type { AuthResponse, LoginUser } from "@/types/user.type";
import axiosAuth from "./axiosAuth";

export class ApiAuth {
  async loginRequest(user: LoginUser): Promise<AuthResponse> {
    const { data } = await axiosAuth.post<AuthResponse>("/login", user);
    return data;
  }

  async logoutRequest(): Promise<{ message: string }> {
    const { data } = await axiosAuth.post<{ message: string }>("/logout");
    return data;
  }

  async verifyTokenRequest(): Promise<AuthResponse> {
    const { data } = await axiosAuth.get<AuthResponse>("/verify");
    return data;
  }
}

export const apiAuth = new ApiAuth();

import { http } from '@/utils/httpClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function loginService(
  payload: LoginPayload
): Promise<LoginResponse> {
  return http.post<LoginResponse>('/login', payload, { requiresAuth: false });
}

export function saveToken(token: string) {
  if (!token) throw new Error("Usuário não autenticado");
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}
import { http } from '@/utils/httpClient';

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  role: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountPayload {
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export async function getMe(): Promise<User> {
  return http.get<User>('/auth/me');
}

export async function updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
  return http.put<User>(`/users/${userId}`, payload);
}

export async function changePassword(userId: string, payload: ChangePasswordPayload): Promise<void> {
  return http.patch(`/users/${userId}/change-password`, payload);
}

export async function deleteUser(userid: string, payload: DeleteAccountPayload): Promise<void> {
  return http.delete(`/users/${userid}`, { data: payload });
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  return http.post<{ message: string }>('/forgot-password', payload, { requiresAuth: false });
}

export async function register(payload: RegisterPayload): Promise<User> {
  return http.post<User>('/auth/signup', payload, { requiresAuth: false });
}
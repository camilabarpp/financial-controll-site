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

export async function getMe(): Promise<User> {
  return http.get<User>('/me');
}

export async function updateUser(data: UpdateUserPayload): Promise<User> {
  return http.patch<User>('/users/1', data);
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  return http.post('/users/change-password', payload);
}

export async function deleteUser(payload: DeleteAccountPayload): Promise<void> {
  return http.post('/users/delete-account', payload);
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  return http.post<{ message: string }>('/forgot-password', payload, { requiresAuth: false });
}
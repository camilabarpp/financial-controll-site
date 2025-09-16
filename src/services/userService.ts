export interface UpdateUserPayload {
  name?: string;
  email?: string;
  avatar?: string;
  password?: string;
}

export async function updateUser(token: string, data: UpdateUserPayload): Promise<User> {
  const response = await fetch(`${API_URL}/users/1`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error("Erro ao atualizar usuário");
  }
  return response.json();
}
// src/services/userService.ts

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  role: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getMe(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Não autenticado");
  }
  return response.json();
}

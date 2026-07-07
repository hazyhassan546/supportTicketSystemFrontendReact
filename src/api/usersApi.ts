import axiosInstance from './axiosInstance'

export type User = {
  id: number
  name: string
  email: string
  phone: string | null
  role_id: number
  department_id: number | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  role_name: string | null
  department_name: string | null
}

export type CreateUserPayload = {
  name: string
  email: string
  password: string
  phone?: string
  role_id?: number
  department_id?: number
}

export type UpdateUserPayload = {
  name?: string
  email?: string
  phone?: string
  role_id?: number
  department_id?: number
  status?: 'active' | 'inactive'
}

type UsersResponse = { data: User[] }
type UserResponse = { data: User }

const usersApi = {
  getUsers: () => axiosInstance.get<UsersResponse>('/users'),
  createUser: (payload: CreateUserPayload) =>
    axiosInstance.post<UserResponse>('/users', payload),
  updateUser: (id: number, payload: UpdateUserPayload) =>
    axiosInstance.put<UserResponse>(`/users/${id}`, payload),
  deleteUser: (id: number) => axiosInstance.delete(`/users/${id}`),
}

export default usersApi

import axiosInstance from './axiosInstance'

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

export type RegisterPayload = {
  name: string
  email: string
  phone: string
  department: string
  password: string
}

export type RegisterResponse = LoginResponse

const authApi = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<LoginResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    axiosInstance.post<RegisterResponse>('/auth/register', payload),

  logout: () => axiosInstance.post('/auth/logout'),

  getProfile: () => axiosInstance.get<LoginResponse['user']>('/auth/me'),
}

export default authApi

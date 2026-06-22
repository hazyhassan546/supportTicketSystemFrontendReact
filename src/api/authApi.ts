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

const authApi = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<LoginResponse>('/auth/login', payload),

  logout: () => axiosInstance.post('/auth/logout'),

  getProfile: () => axiosInstance.get<LoginResponse['user']>('/auth/me'),
}

export default authApi

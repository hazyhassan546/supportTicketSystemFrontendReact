import axiosInstance from './axiosInstance'

export type Department = {
  id: number
  name: string
  description: string
  manager_id: number | null
  email: string
  phone: string
  status: string
  created_at: string
  updated_at: string
  manager_name: string | null
}

export type Role = {
  id: number
  name: string
  description: string
  permissions: null
  status: string
  created_at: string
  updated_at: string
}

export type Priority = {
  id: number
  name: string
  level: number
  description: string
  color_code: string
  status: string
  created_at: string
}

export type TicketStatus = {
  id: number
  name: string
  description: string
  color_code: string
  is_final: number
  status: string
  created_at: string
}

export type Category = {
  id: number
  name: string
  description: string
  icon: string | null
  status: string
  created_at: string
  updated_at: string
}

export type AllLookups = {
  roles: Role[]
  priorities: Priority[]
  statuses: TicketStatus[]
  categories: Category[]
  departments: Department[]
}

type AllLookupsResponse = { data: AllLookups }
type DepartmentsResponse = { data: Department[] }

const lookupsApi = {
  getAll: () => axiosInstance.get<AllLookupsResponse>('/lookups/all'),
  getDepartments: () => axiosInstance.get<DepartmentsResponse>('/lookups/departments'),
}

export default lookupsApi

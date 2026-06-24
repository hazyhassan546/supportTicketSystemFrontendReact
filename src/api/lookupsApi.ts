import axiosInstance from './axiosInstance'

export type Department = {
  id: number
  name: string
  description: string
  email: string
  phone: string
  status: string
}

type DepartmentsResponse = {
  data: Department[]
}

const lookupsApi = {
  getDepartments: () =>
    axiosInstance.get<DepartmentsResponse>('/lookups/departments'),
}

export default lookupsApi

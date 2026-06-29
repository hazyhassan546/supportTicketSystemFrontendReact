import axiosInstance from './axiosInstance'

export type Ticket = {
  id: number
  user_id: number
  title: string
  description: string
  category_id: number
  priority_id: number
  status_id: number
  assigned_to: number | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  user_name: string
  user_email: string
  assigned_name: string | null
  role_name: string
  category_name: string
  priority_name: string
  status_name: string
}

export type CreateTicketPayload = {
  title: string
  description: string
  category_id: number
  priority_id: number
}

type TicketsResponse = { data: Ticket[] }
type CreateTicketResponse = { data: Ticket }

const ticketsApi = {
  getTickets: () => axiosInstance.get<TicketsResponse>('/tickets'),
  createTicket: (payload: CreateTicketPayload) =>
    axiosInstance.post<CreateTicketResponse>('/tickets', payload),
}

export default ticketsApi

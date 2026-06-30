import axiosInstance from './axiosInstance'

export type Ticket = {
  id: number
  user_id: number
  title: string
  description: string
  category_id: number
  priority_id: number
  status_id: number
  department_id: number | null
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
  department_id: number
  is_submitted: boolean
}

export type UpdateTicketPayload = CreateTicketPayload

type TicketsResponse = { data: Ticket[] }
type TicketResponse = { data: Ticket }

const ticketsApi = {
  getTickets: () => axiosInstance.get<TicketsResponse>('/tickets'),
  getTicketById: (id: number) => axiosInstance.get<TicketResponse>(`/tickets/${id}`),
  createTicket: (payload: CreateTicketPayload) =>
    axiosInstance.post<TicketResponse>('/tickets', payload),
  updateTicket: (id: number, payload: UpdateTicketPayload) =>
    axiosInstance.put<TicketResponse>(`/tickets/${id}`, payload),
  deleteTicket: (id: number) => axiosInstance.delete(`/tickets/${id}`),
  resolveTicket: (id: number, comment: string) =>
    axiosInstance.patch<TicketResponse>(`/tickets/${id}/resolve`, { comment }),
}

export default ticketsApi

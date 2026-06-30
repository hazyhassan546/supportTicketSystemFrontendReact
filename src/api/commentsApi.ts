import axiosInstance from "./axiosInstance";

export type Comment = {
  id: number;
  ticket_id: number;
  user_id: number;
  comment: string;
  created_at: string;
  updated_at: string;
  name: string;
  user_email: string;
};

type CommentsResponse = { data: Comment[] };
type CommentResponse = { data: Comment };

const commentsApi = {
  getComments: (ticketId: number) =>
    axiosInstance.get<CommentsResponse>(`/tickets/${ticketId}/comments`),
  postComment: (ticketId: number, comment: string) =>
    axiosInstance.post<CommentResponse>(`/tickets/${ticketId}/comments`, {
      comment: comment,
    }),
  deleteComment: (ticketId: number, commentId: number) =>
    axiosInstance.delete(`/tickets/comments/${commentId}`),
};

export default commentsApi;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketsApi from "../../api/ticketsApi";
import type { Ticket, CreateTicketPayload } from "../../api/ticketsApi";

type TicketsState = {
  tickets: Ticket[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
};

const initialState: TicketsState = {
  tickets: [],
  loading: false,
  submitting: false,
  error: null,
};

export const fetchTickets = createAsyncThunk<Ticket[]>(
  "tickets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketsApi.getTickets();
      return response.data.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to load tickets.";
      return rejectWithValue(message);
    }
  },
);

export const createTicketAction = createAsyncThunk<Ticket, CreateTicketPayload>(
  "tickets/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await ticketsApi.createTicket(payload);
      return response.data.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to create ticket.";
      return rejectWithValue(message);
    }
  },
);

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearTicketError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTicketAction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createTicketAction.fulfilled, (state, action) => {
        state.submitting = false;
        // state.tickets.unshift(action.payload);
      })
      .addCase(createTicketAction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTicketError } = ticketsSlice.actions;
export default ticketsSlice.reducer;

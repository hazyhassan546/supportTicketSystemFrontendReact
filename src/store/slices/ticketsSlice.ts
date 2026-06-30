import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketsApi from "../../api/ticketsApi";
import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
} from "../../api/ticketsApi";

type TicketsState = {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  loading: boolean;
  detailLoading: boolean;
  submitting: boolean;
  deleting: boolean;
  resolving: boolean;
  error: string | null;
};

const initialState: TicketsState = {
  tickets: [],
  selectedTicket: null,
  loading: false,
  detailLoading: false,
  submitting: false,
  deleting: false,
  resolving: false,
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

export const fetchTicketById = createAsyncThunk<Ticket, number>(
  "tickets/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await ticketsApi.getTicketById(id);
      return response.data.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to load ticket details.";
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

export const deleteTicketAction = createAsyncThunk<number, number>(
  "tickets/delete",
  async (id, { rejectWithValue }) => {
    try {
      await ticketsApi.deleteTicket(id);
      return id;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to delete ticket.";
      return rejectWithValue(message);
    }
  },
);

export const updateTicketAction = createAsyncThunk<
  Ticket,
  { id: number; payload: UpdateTicketPayload }
>("tickets/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await ticketsApi.updateTicket(id, payload);
    return response.data.success;
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } }).response?.data
        ?.message ?? "Failed to update ticket.";
    return rejectWithValue(message);
  }
});

export const resolveTicketAction = createAsyncThunk<
  Ticket,
  { id: number; comment: string }
>("tickets/resolve", async ({ id, comment }, { rejectWithValue }) => {
  try {
    const response = await ticketsApi.resolveTicket(id, comment);
    return response.data.data;
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } }).response?.data
        ?.message ?? "Failed to resolve ticket.";
    return rejectWithValue(message);
  }
});

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearTicketError(state) {
      state.error = null;
    },
    clearSelectedTicket(state) {
      state.selectedTicket = null;
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

      .addCase(fetchTicketById.pending, (state) => {
        state.detailLoading = true;
        state.selectedTicket = null;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createTicketAction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createTicketAction.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createTicketAction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })

      .addCase(updateTicketAction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateTicketAction.fulfilled, (state, action) => {
        state.submitting = false;
        const idx = state.tickets.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.tickets[idx] = action.payload;
        state.selectedTicket = action.payload;
      })
      .addCase(updateTicketAction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })

      .addCase(deleteTicketAction.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteTicketAction.fulfilled, (state, action) => {
        state.deleting = false;
        state.tickets = state.tickets.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTicketAction.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      })

      .addCase(resolveTicketAction.pending, (state) => {
        state.resolving = true;
        state.error = null;
      })
      .addCase(resolveTicketAction.fulfilled, (state, action) => {
        state.resolving = false;
        const idx = state.tickets.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.tickets[idx] = action.payload;
      })
      .addCase(resolveTicketAction.rejected, (state, action) => {
        state.resolving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTicketError, clearSelectedTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer;

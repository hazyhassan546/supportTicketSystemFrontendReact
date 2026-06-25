import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketsApi from "../../api/ticketsApi";
import type { Ticket } from "../../api/ticketsApi";

type TicketsState = {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
};

const initialState: TicketsState = {
  tickets: [],
  loading: false,
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

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
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
      });
  },
});

export default ticketsSlice.reducer;

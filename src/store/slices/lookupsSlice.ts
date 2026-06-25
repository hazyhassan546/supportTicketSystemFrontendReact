import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import lookupsApi from "../../api/lookupsApi";
import type { AllLookups } from "../../api/lookupsApi";

type LookupsState = {
  data: AllLookups | null;
  loading: boolean;
  error: string | null;
};

const initialState: LookupsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchLookups = createAsyncThunk<AllLookups>(
  "lookups/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await lookupsApi.getAll();
      return response.data.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to load lookup data.";
      return rejectWithValue(message);
    }
  },
);

const lookupsSlice = createSlice({
  name: "lookups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLookups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLookups.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLookups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default lookupsSlice.reducer;

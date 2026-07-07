import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usersApi from "../../api/usersApi";
import type { User, CreateUserPayload, UpdateUserPayload } from "../../api/usersApi";

type UsersState = {
  users: User[];
  loading: boolean;
  submitting: boolean;
  deleting: boolean;
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  loading: false,
  submitting: false,
  deleting: false,
  error: null,
};

const extractErrorMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } }).response?.data
    ?.message ?? fallback;

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersApi.getUsers();
      return response.data.data;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Failed to load users."));
    }
  },
);

export const createUserAction = createAsyncThunk<void, CreateUserPayload>(
  "users/create",
  async (payload, { rejectWithValue }) => {
    try {
      await usersApi.createUser(payload);
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Failed to create user."));
    }
  },
);

export const updateUserAction = createAsyncThunk<
  void,
  { id: number; payload: UpdateUserPayload }
>("users/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    await usersApi.updateUser(id, payload);
  } catch (err: unknown) {
    return rejectWithValue(extractErrorMessage(err, "Failed to update user."));
  }
});

export const deleteUserAction = createAsyncThunk<number, number>(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(id);
      return id;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Failed to delete user."));
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createUserAction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createUserAction.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createUserAction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })

      .addCase(updateUserAction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateUserAction.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateUserAction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })

      .addCase(deleteUserAction.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteUserAction.fulfilled, (state, action) => {
        state.deleting = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUserAction.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError } = usersSlice.actions;
export default usersSlice.reducer;

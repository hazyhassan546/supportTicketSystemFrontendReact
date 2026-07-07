import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useFormik } from "formik";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import {
  MasterLayout,
  AppText,
  AppInput,
  AppDropdown,
  AppButton,
  AppTable,
} from "../components/common";
import type { Column, DropdownOption } from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchUsers,
  createUserAction,
  updateUserAction,
  deleteUserAction,
  clearUserError,
} from "../store/slices/usersSlice";
import type { User } from "../api/usersApi";
import { createUserSchema, updateUserSchema } from "../schemas/authSchemas";

type DialogMode = "create" | "edit";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role_id: "",
  department_id: "",
  status: "active",
};

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser ? Number(currentUser.id) : null;
  const isAdmin = (currentUser?.role_name ?? "").toLowerCase() === "admin";

  const { users, loading, submitting, deleting, error } = useAppSelector(
    (state) => state.users,
  );
  const lookups = useAppSelector((state) => state.lookups.data);

  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    if (isAdmin) dispatch(fetchUsers());
  }, [dispatch, isAdmin]);

  const roleOptions: DropdownOption[] = useMemo(
    () =>
      (lookups?.roles ?? []).map((r) => ({
        label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
        value: String(r.id),
      })),
    [lookups],
  );

  const departmentOptions: DropdownOption[] = useMemo(
    () => [
      { label: "— None —", value: "" },
      ...(lookups?.departments ?? []).map((d) => ({
        label: d.name,
        value: String(d.id),
      })),
    ],
    [lookups],
  );

  const statusOptions: DropdownOption[] = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const formik = useFormik({
    initialValues: EMPTY_FORM,
    validationSchema: dialogMode === "edit" ? updateUserSchema : createUserSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      let result;
      if (dialogMode === "edit" && editingId !== null) {
        result = await dispatch(
          updateUserAction({
            id: editingId,
            payload: {
              name: values.name,
              email: values.email,
              phone: values.phone || undefined,
              role_id: Number(values.role_id),
              department_id: values.department_id
                ? Number(values.department_id)
                : undefined,
              status: values.status as "active" | "inactive",
            },
          }),
        );
      } else {
        result = await dispatch(
          createUserAction({
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone || undefined,
            role_id: values.role_id ? Number(values.role_id) : undefined,
            department_id: values.department_id
              ? Number(values.department_id)
              : undefined,
          }),
        );
      }

      if (
        createUserAction.fulfilled.match(result) ||
        updateUserAction.fulfilled.match(result)
      ) {
        setDialogMode(null);
        setEditingId(null);
        dispatch(fetchUsers());
      }
    },
  });

  const openCreateDialog = () => {
    formik.resetForm({ values: EMPTY_FORM });
    setEditingId(null);
    setDialogMode("create");
  };

  const openEditDialog = (row: User) => {
    formik.resetForm({
      values: {
        name: row.name,
        email: row.email,
        password: "",
        phone: row.phone ?? "",
        role_id: String(row.role_id),
        department_id: row.department_id ? String(row.department_id) : "",
        status: row.status,
      },
    });
    setEditingId(row.id);
    setDialogMode("edit");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setEditingId(null);
  };

  const handleToggleStatus = (row: User) => {
    const nextStatus = row.status === "active" ? "inactive" : "active";
    dispatch(updateUserAction({ id: row.id, payload: { status: nextStatus } })).then(
      (result) => {
        if (updateUserAction.fulfilled.match(result)) dispatch(fetchUsers());
      },
    );
  };

  const handleDeleteConfirm = async () => {
    if (confirmId == null) return;
    await dispatch(deleteUserAction(confirmId));
    setConfirmId(null);
  };

  const columns: Column<User>[] = useMemo(
    () => [
      { key: "id", label: "#", align: "center" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone", render: (row) => row.phone ?? "—" },
      {
        key: "role_name",
        label: "Role",
        render: (row) => (
          <Chip
            label={row.role_name ?? "—"}
            size="small"
            sx={{ textTransform: "capitalize" }}
          />
        ),
      },
      {
        key: "department_name",
        label: "Department",
        render: (row) => row.department_name ?? "—",
      },
      {
        key: "status",
        label: "Status",
        render: (row) => (
          <Chip
            label={row.status}
            size="small"
            color={row.status === "active" ? "success" : "default"}
            variant={row.status === "active" ? "filled" : "outlined"}
            sx={{ textTransform: "capitalize" }}
          />
        ),
      },
      {
        key: "created_at",
        label: "Created At",
        render: (row) =>
          new Date(row.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
      {
        key: "id",
        label: "Actions",
        align: "center",
        render: (row) => {
          const isSelf = currentUserId !== null && currentUserId === row.id;
          return (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
              <Tooltip title="Edit user">
                <IconButton
                  size="small"
                  onClick={() => openEditDialog(row)}
                  sx={{ color: "text.secondary" }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={
                  isSelf
                    ? "You cannot deactivate your own account"
                    : row.status === "active"
                      ? "Deactivate user"
                      : "Activate user"
                }
              >
                <span>
                  <IconButton
                    size="small"
                    disabled={isSelf}
                    onClick={() => handleToggleStatus(row)}
                    sx={{
                      color: row.status === "active" ? "success.main" : "text.disabled",
                    }}
                  >
                    {row.status === "active" ? (
                      <ToggleOnOutlinedIcon fontSize="small" />
                    ) : (
                      <ToggleOffOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={isSelf ? "You cannot delete your own account" : "Delete user"}>
                <span>
                  <IconButton
                    size="small"
                    disabled={isSelf}
                    onClick={() => setConfirmId(row.id)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [currentUserId, openEditDialog, handleToggleStatus],
  );

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MasterLayout>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AppText variant="h5" sx={{ fontWeight: 600 }}>
            Users
          </AppText>
          {!loading && (
            <Chip
              label={`${users.length} total`}
              size="small"
              sx={{ bgcolor: "grey.100", color: "text.secondary", fontWeight: 600 }}
            />
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Add User
        </Button>
      </Box>

      <AppText variant="body2" sx={{ color: "text.secondary", mb: 3, textAlign: "left" }}>
        Manage user accounts — add, edit, activate/deactivate, or remove users.
      </AppText>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => dispatch(clearUserError())}
        >
          {error}
        </Alert>
      )}

      <AppTable<User> columns={columns} rows={users} rowKey="id" loading={loading} />

      {/* ── Add / Edit dialog ── */}
      <Dialog
        open={dialogMode !== null}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dialogMode === "edit" ? "Edit User" : "Add User"}
        </DialogTitle>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
          >
            <AppInput
              label="Full Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <AppInput
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            {dialogMode !== "edit" && (
              <AppInput
                label="Password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            )}
            <AppInput
              label="Phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: dialogMode === "edit" ? 4 : 6 }}>
                <AppDropdown
                  label="Role"
                  name="role_id"
                  value={formik.values.role_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.role_id && Boolean(formik.errors.role_id)}
                  helperText={formik.touched.role_id ? formik.errors.role_id : undefined}
                  options={roleOptions}
                  disabled={!lookups}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: dialogMode === "edit" ? 4 : 6 }}>
                <AppDropdown
                  label="Department"
                  name="department_id"
                  value={formik.values.department_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.department_id && Boolean(formik.errors.department_id)
                  }
                  helperText={
                    formik.touched.department_id ? formik.errors.department_id : undefined
                  }
                  options={departmentOptions}
                  disabled={!lookups}
                />
              </Grid>
              {dialogMode === "edit" && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <AppDropdown
                    label="Status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    helperText={formik.touched.status ? formik.errors.status : undefined}
                    options={statusOptions}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={closeDialog}
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <AppButton
              type="submit"
              variant="contained"
              loading={submitting}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              {dialogMode === "edit" ? "Save Changes" : "Create User"}
            </AppButton>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmId(null)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </MasterLayout>
  );
}

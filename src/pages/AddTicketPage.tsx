import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import {
  MasterLayout,
  AppText,
  AppInput,
  AppDropdown,
  AppButton,
} from "../components/common";
import type { DropdownOption } from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import {
  createTicketAction,
  clearTicketError,
} from "../store/slices/ticketsSlice";
import { ticketSchema } from "../schemas/authSchemas";
import aiApi from "../api/aiApi";

export default function AddTicketPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { submitting, error } = useAppSelector((state) => state.tickets);
  const lookups = useAppSelector((state) => state.lookups.data);
  const submitModeRef = useRef(false); // false = draft, true = submitted
  const [improving, setImproving] = useState(false);
  const [improveError, setImproveError] = useState("");

  useEffect(() => {
    dispatch(clearTicketError());
  }, [dispatch]);

  const handleImproveDescription = async () => {
    const text = formik.values.description.trim();
    if (!text) return;
    setImproving(true);
    setImproveError("");
    try {
      const response = await aiApi.improveDescription(text);
      formik.setFieldValue("description", response.data.data.description);
    } catch {
      setImproveError("Failed to improve description. Please try again.");
    } finally {
      setImproving(false);
    }
  };

  const categoryOptions: DropdownOption[] = useMemo(
    () =>
      (lookups?.categories ?? []).map((c) => ({
        label: c.name,
        value: String(c.id),
      })),
    [lookups],
  );

  const priorityOptions: DropdownOption[] = useMemo(
    () =>
      (lookups?.priorities ?? []).map((p) => ({
        label: p.name,
        value: String(p.id),
      })),
    [lookups],
  );

  const departmentOptions: DropdownOption[] = useMemo(
    () =>
      (lookups?.departments ?? []).map((d) => ({
        label: d.name,
        value: String(d.id),
      })),
    [lookups],
  );

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category_id: "",
      priority_id: "",
      department_id: "",
    },
    validationSchema: ticketSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const result = await dispatch(
        createTicketAction({
          title: values.title,
          description: values.description,
          category_id: Number(values.category_id),
          priority_id: Number(values.priority_id),
          department_id: Number(values.department_id),
          is_submitted: submitModeRef.current,
        }),
      );
      if (createTicketAction.fulfilled.match(result)) {
        navigate("/tickets");
      }
    },
  });

  return (
    <MasterLayout>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <AppText variant="h5" sx={{ fontWeight: 600 }}>
          New Ticket
        </AppText>
      </Box>
      <AppText
        variant="body2"
        sx={{ color: "text.secondary", mb: 3, textAlign: "left" }}
      >
        Fill in the details below to submit a new support ticket.
      </AppText>

      <Divider sx={{ mb: 3 }} />

      <Paper
        variant="outlined"
        sx={{ maxWidth: 720, p: { xs: 3, sm: 4 }, borderRadius: 2 }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => dispatch(clearTicketError())}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <AppInput
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <AppInput
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={formik.touched.description && formik.errors.description}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={
                  improving ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <AutoFixHighOutlinedIcon fontSize="small" />
                  )
                }
                onClick={handleImproveDescription}
                disabled={improving || !formik.values.description.trim()}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                }}
              >
                {improving ? "Improving…" : "Improve using AI"}
              </Button>
              {improveError && (
                <Box sx={{ fontSize: "0.75rem", color: "error.main" }}>
                  {improveError}
                </Box>
              )}
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppDropdown
                label="Category"
                name="category_id"
                value={formik.values.category_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category_id &&
                  Boolean(formik.errors.category_id)
                }
                helperText={
                  formik.touched.category_id
                    ? formik.errors.category_id
                    : undefined
                }
                options={categoryOptions}
                disabled={!lookups}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppDropdown
                label="Priority"
                name="priority_id"
                value={formik.values.priority_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.priority_id &&
                  Boolean(formik.errors.priority_id)
                }
                helperText={
                  formik.touched.priority_id
                    ? formik.errors.priority_id
                    : undefined
                }
                options={priorityOptions}
                disabled={!lookups}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppDropdown
                label="Department"
                name="department_id"
                value={formik.values.department_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.department_id &&
                  Boolean(formik.errors.department_id)
                }
                helperText={
                  formik.touched.department_id
                    ? formik.errors.department_id
                    : undefined
                }
                options={departmentOptions}
                disabled={!lookups}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 1.5, pt: 1, flexWrap: "wrap" }}>
            <AppButton
              type="button"
              variant="contained"
              loading={submitting}
              onClick={() => {
                submitModeRef.current = true;
                formik.submitForm();
              }}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                px: 3,
              }}
            >
              Submit Ticket
            </AppButton>
            <AppButton
              type="button"
              variant="outlined"
              loading={submitting}
              onClick={() => {
                submitModeRef.current = false;
                formik.submitForm();
              }}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                px: 3,
              }}
            >
              Save as Draft
            </AppButton>
            <AppButton
              type="button"
              variant="text"
              onClick={() => navigate("/tickets")}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                px: 3,
              }}
            >
              Cancel
            </AppButton>
          </Box>
        </Box>
      </Paper>
    </MasterLayout>
  );
}

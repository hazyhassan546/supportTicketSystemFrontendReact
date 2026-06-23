import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, Box, Paper } from "@mui/material";
import { AppText, AppInput, AppButton } from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import { loginAction, clearError } from "../store/slices/authSlice";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      dispatch(clearError());
      dispatch(loginAction(values));
    },
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100"
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}
      >
        <AppText variant="h5" sx={{ fontWeight: 700, mb: 0.5, textAlign: "center" }}>
          {"Support Ticket System"}
        </AppText>
        <AppText variant="body2" sx={{ color: "text.secondary", textAlign: "center", mb: 3 }}>
          {"Sign in to your account"}
        </AppText>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => dispatch(clearError())}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <AppInput
            label="Email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            autoComplete="email"
            autoFocus
          />
          <AppInput
            label="Password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            autoComplete="current-password"
          />
          <AppButton
            type="submit"
            variant="contained"
            fullWidth
            loading={loading}
            sx={{ mt: 1 }}
          >
            {"Sign In"}
          </AppButton>
        </Box>
      </Paper>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import { useTheme } from "@mui/material/styles";
import { Alert, Box, Divider, Grid, Link, Paper } from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
  AppText,
  AppInput,
  AppButton,
  AppDropdown,
} from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import { registerAction, clearError } from "../store/slices/authSlice";
import { registerSchema } from "../schemas/authSchemas";
import { AppImages } from "../common/images";
import type { DropdownOption } from "../components/common";
import lookupsApi from "../api/lookupsApi";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { brand } = palette;

  const { loading, error, token } = useAppSelector((state) => state.auth);

  const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
    [],
  );
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  useEffect(() => {
    lookupsApi
      .getDepartments()
      .then((res) => {
        const options = res.data.data.map((d) => ({
          label: d.name,
          value: String(d.id),
        }));
        setDepartmentOptions(options);
      })
      .finally(() => setDepartmentsLoading(false));
  }, []);

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    validateOnChange: false,
    onSubmit: ({ name, email, phone, department, password }) => {
      dispatch(clearError());
      dispatch(
        registerAction({
          name,
          email,
          phone,
          department_id: department,
          password,
        }),
      );
    },
  });

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${AppImages.loginBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${brand.overlayStart} 0%, ${brand.overlayEnd} 100%)`,
          zIndex: 0,
        },
      }}
    >
      {/* ── Left panel: branding ── */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { xs: 260, md: "100vh" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 0 },
            gap: { xs: 1, md: 2 },
          }}
        >
          <Box
            component="img"
            src={AppImages.appLogo}
            alt="App Logo"
            sx={{
              width: { xs: 52, md: 80 },
              height: { xs: 52, md: 80 },
              filter: "brightness(0) invert(1)",
              mb: 1,
            }}
          />
          <AppText
            variant="h3"
            sx={{
              fontWeight: 800,
              color: brand.panelText,
              textAlign: "center",
              lineHeight: 1.2,
              fontSize: { xs: "1.6rem", sm: "2rem", md: "3rem" },
            }}
          >
            Support Ticket System
          </AppText>
          <AppText
            variant="body1"
            sx={{
              color: brand.panelTextMuted,
              textAlign: "center",
              maxWidth: 360,
              display: { xs: "none", sm: "block" },
            }}
          >
            Create your account and start managing tickets in minutes.
          </AppText>

          <Divider sx={{ width: 60, borderColor: brand.panelDivider, mt: 1 }} />

          <AppText
            variant="caption"
            sx={{ color: brand.panelTextFaint, textAlign: "center" }}
          >
            Powered by React · Redux · Material-UI
          </AppText>
        </Box>
      </Grid>

      {/* ── Right panel: register form ── */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 6 },
          py: { xs: 6, md: 0 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 720,
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              mx: "auto",
            }}
          >
            <PersonAddOutlinedIcon
              sx={{ color: "common.white", fontSize: 26 }}
            />
          </Box>

          <AppText
            variant="h5"
            sx={{ fontWeight: 700, textAlign: "center", mb: 0.5 }}
          >
            Create account
          </AppText>
          <AppText
            variant="body2"
            sx={{ color: "text.secondary", textAlign: "center", mb: 3 }}
          >
            Fill in the details below to get started
          </AppText>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 2 }}
              onClose={() => dispatch(clearError())}
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
            <Grid container spacing={2}>
              {/* Row 1: Name + Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppInput
                  label="Full name"
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  autoComplete="name"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppInput
                  label="Email address"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  autoComplete="email"
                />
              </Grid>

              {/* Row 2: Phone + Department */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppInput
                  label="Phone number"
                  type="tel"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  autoComplete="tel"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppDropdown
                  label="Department"
                  name="department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.department &&
                    Boolean(formik.errors.department)
                  }
                  helperText={
                    formik.touched.department
                      ? formik.errors.department
                      : undefined
                  }
                  options={departmentOptions}
                  disabled={departmentsLoading}
                />
              </Grid>

              {/* Row 3: Password + Confirm password */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppInput
                  label="Confirm password"
                  type="password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

            <AppButton
              type="submit"
              variant="contained"
              fullWidth
              loading={loading}
              size="large"
              sx={{
                borderRadius: 2,
                py: 1.2,
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Create Account
            </AppButton>

            <AppText
              variant="body2"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ color: "primary.main", fontWeight: 500 }}
              >
                Sign in
              </Link>
            </AppText>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

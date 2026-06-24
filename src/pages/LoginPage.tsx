import { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import { useTheme } from "@mui/material/styles";
import { Alert, Box, Divider, Grid, Link, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AppText, AppInput, AppButton } from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import { loginAction, clearError } from "../store/slices/authSlice";
import { loginSchema } from "../schemas/authSchemas";
import { AppImages } from "../common/images";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { brand } = palette;

  const { loading, error, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(clearError());
      dispatch(loginAction(values));
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
              display: { sm: "block" },
            }}
          >
            Manage, track and resolve customer issues — all in one place.
          </AppText>

          <Divider sx={{ width: 60, borderColor: brand.panelDivider, mt: 1 }} />

          <AppText
            variant="caption"
            sx={{ color: brand.panelTextFaint, textAlign: "center" }}
          >
            Powered by AI · React · Redux · Material-UI · Express · Node.js ·
            MySQL
          </AppText>
        </Box>
      </Grid>

      {/* ── Right panel: login form ── */}
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
            maxWidth: 420,
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
            <LockOutlinedIcon sx={{ color: "common.white", fontSize: 26 }} />
          </Box>

          <AppText
            variant="h5"
            sx={{ fontWeight: 700, textAlign: "center", mb: 0.5 }}
          >
            Welcome back
          </AppText>
          <AppText
            variant="body2"
            sx={{ color: "text.secondary", textAlign: "center", mb: 3 }}
          >
            Sign in to your account to continue
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

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
              <Link
                href="#"
                underline="hover"
                variant="body2"
                sx={{ color: "primary.main" }}
              >
                Forgot password?
              </Link>
            </Box>

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
              {"Sign In"}
            </AppButton>
            <AppText variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
              Don&apos;t have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                underline="hover"
                sx={{ color: "primary.main", fontWeight: 500 }}
              >
                Sign up
              </Link>
            </AppText>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Alert, Box, Grid, Paper } from "@mui/material";
import { AppText, AppInput, AppButton } from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import { loginAction, clearError } from "../store/slices/authSlice";
import { loginSchema } from "../schemas/authSchemas";
import { AppImages } from "../common/images";

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
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(clearError());
      dispatch(loginAction(values));
    },
  });

  return (
    <Box
      sx={{
        backgroundImage: `url(${AppImages.loginBackground})`,
        backgroundSize: "cover",
        backgroundColor: "grey.100",
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid
          size={{ xs: 12, sm: 12, md: 5 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img
            src={AppImages.appLogo}
            alt="App Logo"
            style={{ width: "120px", marginBottom: "20px" }}
          />
          <AppText
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              textAlign: "center",
              color: "white",
            }}
          >
            {"Support Ticket System"}
          </AppText>
          <AppText
            variant={"h6"}
            sx={{
              mb: 0.5,
              textAlign: "center",
              color: "white",
            }}
          >
            {"Powered by React, Redux, and Material-UI"}
          </AppText>
        </Grid>
        <Grid
          size={{ xs: 0, sm: 0, md: 1 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid white",
          }}
        ></Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 400,
              borderRadius: 2,
              backgroundColor: "rgba(253, 253, 253, 0.2)",
            }}
          >
            <AppText
              variant="h5"
              sx={{ fontWeight: 700, mb: 0.5, textAlign: "center" }}
            >
              {"Sign In"}
            </AppText>
            <AppText
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center", mb: 3 }}
            >
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
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
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
        </Grid>
      </Grid>
    </Box>
  );
}

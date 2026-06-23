import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Paper } from "@mui/material";
import { AppText, AppInput, AppButton } from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import { loginAction, clearError } from "../store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginAction({ email, password }));
  };

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
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <AppInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
          <AppInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

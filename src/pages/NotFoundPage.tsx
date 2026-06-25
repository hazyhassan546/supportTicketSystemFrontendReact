import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AppText } from "../components/common";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
        px: 3,
        textAlign: "center",
      }}
    >
      <AppText
        sx={{
          fontSize: { xs: "5rem", sm: "8rem" },
          fontWeight: 900,
          lineHeight: 1,
          color: "grey.200",
          letterSpacing: -4,
          mb: 1,
        }}
      >
        404
      </AppText>

      <AppText
        variant="h5"
        sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
      >
        Page not found
      </AppText>

      <AppText
        variant="body2"
        sx={{ color: "text.secondary", maxWidth: 340, mb: 4 }}
      >
        The page you're looking for doesn't exist or has been removed.
      </AppText>

      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Go back
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
}

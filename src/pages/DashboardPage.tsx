import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppText, AppTable } from "../components/common";
import type { Column } from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import { logoutAction } from "../store/slices/authSlice";

type TicketRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
};

const DEMO_ROWS: TicketRow[] = [
  { id: "1", title: "Unable to login", status: "Open", priority: "High", createdAt: "2026-06-20" },
  { id: "2", title: "Payment not processed", status: "In Progress", priority: "Critical", createdAt: "2026-06-21" },
  { id: "3", title: "UI glitch on mobile", status: "Resolved", priority: "Low", createdAt: "2026-06-22" },
];

const COLUMNS: Column<TicketRow>[] = [
  { key: "id", label: "#", align: "center" },
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "createdAt", label: "Created At" },
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <Box minHeight="100vh" bgcolor="grey.50">
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ gap: 2 }}>
          <AppText variant="h6" sx={{ fontWeight: 700, flexGrow: 1, color: "white" }}>
            Support Ticket System
          </AppText>
          <AppText variant="body2" sx={{ color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>
            {user?.name ?? user?.email ?? ""}
          </AppText>
          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box p={4}>
        <AppText variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          Dashboard
        </AppText>
        <AppText variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Welcome back{user?.name ? `, ${user.name}` : ""}. Here are your recent tickets.
        </AppText>

        <Divider sx={{ mb: 3 }} />

        <AppTable<TicketRow>
          columns={COLUMNS}
          rows={DEMO_ROWS}
          rowKey="id"
        />
      </Box>
    </Box>
  );
}

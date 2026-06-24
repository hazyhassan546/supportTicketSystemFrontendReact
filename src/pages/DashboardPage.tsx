import Divider from "@mui/material/Divider";
import { MasterLayout, AppText, AppTable } from "../components/common";
import type { Column } from "../components/common";
import { useAppSelector } from "../store";

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
  const user = useAppSelector((state) => state.auth.user);

  return (
    <MasterLayout>
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
    </MasterLayout>
  );
}

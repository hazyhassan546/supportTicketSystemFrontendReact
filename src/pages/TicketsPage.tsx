import { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { MasterLayout, AppText, AppTable } from "../components/common";
import type { Column } from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchTickets } from "../store/slices/ticketsSlice";
import type { Ticket } from "../api/ticketsApi";

export default function TicketsPage() {
  const dispatch = useAppDispatch();
  const { tickets, loading } = useAppSelector((state) => state.tickets);
  const lookups = useAppSelector((state) => state.lookups.data);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const priorityMap = useMemo(
    () =>
      Object.fromEntries(
        (lookups?.priorities ?? []).map((p) => [p.name, p.color_code]),
      ),
    [lookups],
  );

  const statusMap = useMemo(
    () =>
      Object.fromEntries(
        (lookups?.statuses ?? []).map((s) => [s.name, s.color_code]),
      ),
    [lookups],
  );

  const columns: Column<Ticket>[] = useMemo(
    () => [
      { key: "id", label: "#", align: "center" },
      { key: "title", label: "Title" },
      { key: "user_name", label: "Submitted By" },
      { key: "assigned_name", label: "Assigned To" },
      { key: "category_name", label: "Category" },
      {
        key: "priority_name",
        label: "Priority",
        render: (row) => {
          const color = priorityMap[row.priority_name];
          return (
            <Chip
              label={row.priority_name}
              size="small"
              sx={
                color
                  ? {
                      bgcolor: color,
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }
                  : { textTransform: "capitalize" }
              }
            />
          );
        },
      },
      {
        key: "status_name",
        label: "Status",
        render: (row) => {
          const color = statusMap[row.status_name];
          return (
            <Chip
              label={row.status_name.replace(/_/g, " ")}
              size="small"
              variant="outlined"
              sx={
                color
                  ? {
                      borderColor: color,
                      color,
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }
                  : { textTransform: "capitalize" }
              }
            />
          );
        },
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
    ],
    [priorityMap, statusMap],
  );

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
        <AppText variant="h5" sx={{ fontWeight: 600 }}>
          Tickets
        </AppText>
        {!loading && (
          <Chip
            label={`${tickets.length} total`}
            size="small"
            sx={{
              bgcolor: "grey.100",
              color: "text.secondary",
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <AppText
        variant="body2"
        sx={{ color: "text.secondary", mb: 3, textAlign: "left" }}
      >
        Browse and manage all support tickets in the system.
      </AppText>

      <Divider sx={{ mb: 3 }} />

      <AppTable<Ticket>
        columns={columns}
        rows={tickets}
        rowKey="id"
        loading={loading}
      />
    </MasterLayout>
  );
}

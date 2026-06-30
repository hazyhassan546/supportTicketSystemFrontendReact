import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { MasterLayout, AppText } from "../components/common";
import TicketComments from "../components/tickets/TicketComments";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchTicketById,
  clearSelectedTicket,
} from "../store/slices/ticketsSlice";

const FINAL_STATUSES = new Set(["resolved", "closed"]);

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
      <AppText
        variant="caption"
        sx={{
          color: "text.disabled",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </AppText>
      <Box sx={{ fontSize: "0.875rem", color: "text.primary" }}>{value}</Box>
    </Box>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    selectedTicket: ticket,
    detailLoading,
    error,
  } = useAppSelector((state) => state.tickets);
  const lookups = useAppSelector((state) => state.lookups.data);

  useEffect(() => {
    if (id) dispatch(fetchTicketById(Number(id)));
    return () => {
      dispatch(clearSelectedTicket());
    };
  }, [dispatch, id]);

  const priorityColor = lookups?.priorities.find(
    (p) => p.name === ticket?.priority_name,
  )?.color_code;
  const statusColor = lookups?.statuses.find(
    (s) => s.name === ticket?.status_name,
  )?.color_code;

  return (
    <MasterLayout>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/tickets")}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Back to Tickets
        </Button>
      </Box>

      {detailLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !detailLoading && (
        <AppText sx={{ color: "error.main", textAlign: "center", py: 6 }}>
          {error}
        </AppText>
      )}

      {ticket && !detailLoading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* ── Header card ── */}
          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <AppText
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textAlign: "left",
                    color: "text.disabled",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    mb: 0.5,
                  }}
                >
                  Ticket #{ticket.id}
                </AppText>
                <AppText
                  variant="h5"
                  sx={{ fontWeight: 700, lineHeight: 1.3, textAlign: "left" }}
                >
                  {ticket.title}
                </AppText>
              </Box>
              {/* <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                {priorityColor && (
                  <Chip
                    label={ticket.priority_name}
                    size="small"
                    sx={{ bgcolor: priorityColor, color: "#fff", fontWeight: 700, textTransform: "capitalize" }}
                  />
                )}
                {statusColor && (
                  <Chip
                    label={ticket.status_name.replace(/_/g, " ")}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: statusColor, color: statusColor, fontWeight: 700, textTransform: "capitalize" }}
                  />
                )}
              </Box> */}
            </Box>

            <Divider sx={{ my: 2 }} />

            <AppText
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
                textAlign: "left",
              }}
            >
              {ticket.description}
            </AppText>
          </Paper>

          {/* ── Details grid ── */}
          <Grid container spacing={2.5}>
            {/* People */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 2, height: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  <PersonOutlinedIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <AppText sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    People
                  </AppText>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <InfoRow
                    label="Submitted By"
                    value={
                      <Box>
                        <AppText sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                          {ticket.user_name}
                        </AppText>
                        <AppText
                          sx={{ fontSize: "0.78rem", color: "text.secondary" }}
                        >
                          {ticket.user_email}
                        </AppText>
                      </Box>
                    }
                  />
                  <InfoRow
                    label="Assigned To"
                    value={
                      <AppText sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                        {ticket.assigned_name ?? "Unassigned"}
                      </AppText>
                    }
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Classification */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 2, height: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  <SupportAgentOutlinedIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <AppText sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Classification
                  </AppText>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <InfoRow
                    label="Category"
                    value={
                      <AppText sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                        {ticket.category_name}
                      </AppText>
                    }
                  />
                  <InfoRow
                    label="Priority"
                    value={
                      priorityColor ? (
                        <Chip
                          label={ticket.priority_name}
                          size="small"
                          sx={{
                            bgcolor: priorityColor,
                            color: "#fff",
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        />
                      ) : (
                        <AppText sx={{ fontSize: "0.875rem" }}>
                          {ticket.priority_name}
                        </AppText>
                      )
                    }
                  />
                  <InfoRow
                    label="Status"
                    value={
                      statusColor ? (
                        <Chip
                          label={ticket.status_name.replace(/_/g, " ")}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: statusColor,
                            color: statusColor,
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        />
                      ) : (
                        <AppText sx={{ fontSize: "0.875rem" }}>
                          {ticket.status_name}
                        </AppText>
                      )
                    }
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Timeline */}
            <Grid size={{ xs: 12 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <AppText sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Timeline
                  </AppText>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <InfoRow
                      label="Created At"
                      value={formatDate(ticket.created_at)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <InfoRow
                      label="Last Updated"
                      value={formatDate(ticket.updated_at)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <InfoRow
                      label="Resolved At"
                      value={formatDate(ticket.resolved_at)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Comments */}
          <TicketComments
            ticketId={ticket.id}
            isReadOnly={FINAL_STATUSES.has(ticket.status_name)}
          />
        </Box>
      )}
    </MasterLayout>
  );
}

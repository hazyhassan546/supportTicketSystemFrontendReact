import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MasterLayout, AppText, AppTable } from "../components/common";
import type { Column } from "../components/common";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchTickets,
  deleteTicketAction,
  resolveTicketAction,
} from "../store/slices/ticketsSlice";
import type { Ticket } from "../api/ticketsApi";

const FINAL_STATUSES = new Set(["resolved", "closed"]);

export default function TicketsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tickets, loading, deleting, resolving } = useAppSelector(
    (state) => state.tickets,
  );
  const lookups = useAppSelector((state) => state.lookups.data);
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser ? Number(currentUser.id) : null;

  /* ── Delete dialog state ── */
  const [confirmId, setConfirmId] = useState<number | null>(null);

  /* ── Resolve dialog state ── */
  const [resolveId, setResolveId] = useState<number | null>(null);
  const [resolveComment, setResolveComment] = useState("");
  const [resolveCommentError, setResolveCommentError] = useState("");

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

  const handleDeleteConfirm = async () => {
    if (confirmId == null) return;
    await dispatch(deleteTicketAction(confirmId));
    setConfirmId(null);
  };

  const handleResolveOpen = (id: number) => {
    setResolveId(id);
    setResolveComment("");
    setResolveCommentError("");
  };

  const handleResolveConfirm = async () => {
    if (resolveId == null) return;
    if (!resolveComment.trim()) {
      setResolveCommentError("Please enter a resolution comment.");
      return;
    }
    const result = await dispatch(
      resolveTicketAction({ id: resolveId, comment: resolveComment.trim() }),
    );
    if (resolveTicketAction.fulfilled.match(result)) {
      setResolveId(null);
    }
  };

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
      {
        key: "id",
        label: "Actions",
        align: "center",
        render: (row) => {
          const isOwner =
            currentUserId !== null && currentUserId === row.user_id;

          const isAssigned =
            currentUserId !== null && currentUserId === row.assigned_to;
          const isFinal = FINAL_STATUSES.has(row.status_name);
          const isSubmitted = ["open"].includes(row.status_name);

          return (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
              <Tooltip title="View details">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/tickets/${row.id}`)}
                  sx={{ color: "primary.main" }}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {isOwner && !isFinal && !isSubmitted ? (
                <Tooltip title="Edit ticket">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/tickets/${row.id}/edit`)}
                    sx={{ color: "text.secondary" }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}

              {/* {(isOwner || isAssigned) && !isFinal && (
                <Tooltip title="Mark as resolved">
                  <IconButton
                    size="small"
                    onClick={() => handleResolveOpen(row.id)}
                    sx={{ color: "success.main" }}
                  >
                    <CheckCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )} */}

              {isOwner && !isFinal && (
                <Tooltip title="Delete ticket">
                  <IconButton
                    size="small"
                    onClick={() => setConfirmId(row.id)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        },
      },
    ],
    [priorityMap, statusMap, navigate, currentUserId],
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/tickets/new")}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Add Ticket
        </Button>
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

      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete ticket #{confirmId}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmId(null)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Resolve confirmation dialog ── */}
      <Dialog
        open={resolveId !== null}
        onClose={() => setResolveId(null)}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 440 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Mark as Resolved</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <DialogContentText>
            You are about to mark ticket #{resolveId} as resolved. Please
            provide a resolution comment explaining how the issue was addressed.
          </DialogContentText>
          <TextField
            label="Resolution comment"
            multiline
            rows={3}
            fullWidth
            value={resolveComment}
            onChange={(e) => {
              setResolveComment(e.target.value);
              if (e.target.value.trim()) setResolveCommentError("");
            }}
            error={Boolean(resolveCommentError)}
            helperText={resolveCommentError}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setResolveId(null)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResolveConfirm}
            variant="contained"
            color="success"
            disabled={resolving}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            {resolving ? "Resolving…" : "Mark as Resolved"}
          </Button>
        </DialogActions>
      </Dialog>
    </MasterLayout>
  );
}

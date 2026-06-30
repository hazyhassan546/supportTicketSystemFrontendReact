import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SendIcon from "@mui/icons-material/Send";
import { AppText } from "../common";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  fetchComments,
  postCommentAction,
  deleteCommentAction,
  clearComments,
} from "../../store/slices/commentsSlice";

type Props = {
  ticketId: number;
  isReadOnly: boolean;
};

function getInitials(name: string) {
  return (
    name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2) || "NA"
  );
}

export default function TicketComments({ ticketId, isReadOnly }: Props) {
  const dispatch = useAppDispatch();
  const { comments, loading, posting, deleting, error } = useAppSelector(
    (state) => state.comments,
  );
  const currentUser = useAppSelector((state) => state.auth.user);
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchComments(ticketId));
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, ticketId]);

  const handleDeleteConfirm = async () => {
    if (deleteId == null) return;
    const result = await dispatch(
      deleteCommentAction({ ticketId, commentId: deleteId }),
    );
    if (deleteCommentAction.fulfilled.match(result)) {
      setDeleteId(null);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      setContentError("Comment cannot be empty.");
      return;
    }
    const result = await dispatch(
      postCommentAction({ ticketId, comment: content.trim() }),
    );
    if (postCommentAction.fulfilled.match(result)) {
      setContent("");
      setContentError("");
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
        <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: "text.secondary" }} />
        <AppText sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
          Comments
        </AppText>
        {!loading && (
          <Box
            sx={{
              px: 1,
              py: 0.15,
              borderRadius: 10,
              bgcolor: "grey.100",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            {comments?.length}
          </Box>
        )}
      </Box>

      {/* List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : comments.length === 0 ? (
        <AppText
          sx={{
            color: "text.disabled",
            fontSize: "0.875rem",
            textAlign: "center",
            py: 3,
          }}
        >
          No comments yet. {!isReadOnly && "Be the first to leave one."}
        </AppText>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {comments?.map((c, idx) => (
            <Box key={c.id}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                  py: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    bgcolor: "primary.main",
                    flexShrink: 0,
                  }}
                >
                  {getInitials(c?.name)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 1,
                      flexWrap: "wrap",
                      mb: 0.5,
                    }}
                  >
                    <AppText sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                      {c?.name}
                    </AppText>
                    <AppText
                      sx={{ fontSize: "0.75rem", color: "text.disabled" }}
                    >
                      {new Date(c?.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </AppText>
                  </Box>
                  <AppText
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                      textAlign: "left",
                    }}
                  >
                    {c?.comment}
                  </AppText>
                </Box>

                {currentUser && Number(currentUser.id) === c.user_id && (
                  <Tooltip title="Delete comment">
                    <IconButton
                      size="small"
                      onClick={() => setDeleteId(c.id)}
                      sx={{ color: "error.main", flexShrink: 0, mt: 0.25 }}
                    >
                      <DeleteForeverOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              {idx < comments.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      )}

      {/* Compose */}
      {isReadOnly ? (
        <AppText
          sx={{
            color: "text.disabled",
            fontSize: "0.8rem",
            textAlign: "center",
            mt: comments.length > 0 ? 2.5 : 0,
            fontStyle: "italic",
          }}
        >
          This ticket is closed — no new comments can be added.
        </AppText>
      ) : (
        <>
          <Divider sx={{ mt: comments.length > 0 ? 0 : 1, mb: 2.5 }} />
          {error && (
            <AppText sx={{ color: "error.main", fontSize: "0.8rem", mb: 1.5 }}>
              {error}
            </AppText>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              placeholder="Write a comment…"
              multiline
              rows={3}
              fullWidth
              size="small"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (e.target.value.trim()) setContentError("");
              }}
              error={Boolean(contentError)}
              helperText={contentError}
              disabled={posting}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="small"
                endIcon={<SendIcon />}
                onClick={handlePost}
                disabled={posting}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                {posting ? "Posting…" : "Post Comment"}
              </Button>
            </Box>
          </Box>
        </>
      )}
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        slotProps={{ paper: { sx: { borderRadius: 3, minWidth: 340 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteId(null)}
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
    </Paper>
  );
}

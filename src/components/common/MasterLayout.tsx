import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useTheme, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { AppText } from "./index";
import { useAppDispatch, useAppSelector } from "../../store";
import { logoutAction } from "../../store/slices/authSlice";
import { AppImages } from "../../common/images";

/* ─── Constants ─────────────────────────────────────────────── */

const SIDEBAR_W = 260;

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", Icon: DashboardOutlinedIcon },
  { label: "Tickets", to: "/tickets", Icon: ConfirmationNumberOutlinedIcon },
  { label: "Users", to: "/users", Icon: PeopleOutlinedIcon },
  { label: "Reports", to: "/reports", Icon: BarChartOutlinedIcon },
  { label: "Settings", to: "/settings", Icon: SettingsOutlinedIcon },
];

const FOOTER_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Privacy Policy", to: "/policy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Contact Us", to: "/contact" },
];

const ROLE_CFG: Record<string, { label: string; color: string }> = {
  admin: { label: "Admin", color: "#d32f2f" },
  manager: { label: "Manager", color: "#ed6c02" },
  agent: { label: "Agent", color: "#1565c0" },
  user: { label: "User", color: "#2e7d32" },
};

/* ─── Sidebar content (shared by permanent + drawer) ────────── */

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { palette } = useTheme();
  const { brand } = palette;
  const location = useLocation();

  return (
    <Box
      sx={{
        width: SIDEBAR_W,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(160deg, ${brand.overlayStart} 0%, ${brand.overlayEnd} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* ── Brand ── */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha("#fff", 0.15),
                border: `1px solid ${brand.panelDivider}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={AppImages.appLogo}
                alt="logo"
                sx={{
                  width: 24,
                  height: 24,
                  filter: "brightness(0) invert(1)",
                }}
              />
            </Box>
            <Box>
              <AppText
                sx={{
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  color: brand.panelText,
                  lineHeight: 1.1,
                  letterSpacing: 0.3,
                }}
              >
                Support Desk
              </AppText>
              <AppText
                sx={{
                  fontSize: "0.67rem",
                  color: brand.panelTextFaint,
                  lineHeight: 1.2,
                }}
              >
                Ticket Platform
              </AppText>
            </Box>
          </Box>

          {/* close button — mobile only */}
          {onClose && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: brand.panelTextMuted, ml: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      <Divider sx={{ borderColor: brand.panelDivider, mx: 2 }} />

      {/* ── Navigation ── */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 2, px: 1.5 }}>
        <AppText
          sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: 1.5,
            color: brand.panelTextFaint,
            px: 1.5,
            mb: 1,
            display: "block",
            textTransform: "uppercase",
          }}
        >
          Main Menu
        </AppText>

        <List
          disablePadding
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          {NAV_ITEMS.map(({ label, to, Icon }) => {
            const active = location.pathname === to;
            return (
              <ListItemButton
                key={to}
                onClick={() => {
                  /* navigate via RouterLink below */
                }}
                component={RouterLink}
                to={to}
                selected={active}
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  gap: 0,
                  bgcolor: active ? alpha("#fff", 0.92) : "transparent",
                  "&:hover": {
                    bgcolor: active ? alpha("#fff", 0.92) : alpha("#fff", 0.08),
                  },
                  "&.Mui-selected": {
                    bgcolor: alpha("#fff", 0.92),
                    "&:hover": { bgcolor: alpha("#fff", 0.92) },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: active ? "primary.main" : brand.panelTextMuted,
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: active ? 700 : 500,
                    color: active ? "primary.main" : "#ffffff",
                  }}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: "0.875rem",
                      fontWeight: active ? 700 : 500,
                      color: active ? "primary.main" : "#ffffff",
                    },
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      flexShrink: 0,
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* ── Sidebar user card ── */}
      <Divider sx={{ borderColor: brand.panelDivider, mx: 2 }} />
      <SidebarUserCard />
    </Box>
  );
}

function SidebarUserCard() {
  const { palette } = useTheme();
  const { brand } = palette;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const roleKey = (user?.role ?? "user").toLowerCase();
  const roleCfg = ROLE_CFG[roleKey] ?? ROLE_CFG.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    dispatch(logoutAction()).then(() => navigate("/login", { replace: true }));
  };

  return (
    <IconButton
      sx={{
        mx: 2,
        my: 2,
        p: 1.5,
        borderRadius: 2.5,
        bgcolor: alpha("#fff", 0.08),
        border: `1px solid ${brand.panelDivider}`,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
      }}
      onClick={handleLogout}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppText
          sx={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: brand.panelText,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {"Logout"}
        </AppText>
      </Box>

      <Tooltip title="Sign out">
        <IconButton
          // onClick={handleLogout}
          size="small"
          sx={{
            color: brand.panelTextMuted,
            flexShrink: 0,
            "&:hover": { color: brand.panelText, bgcolor: alpha("#fff", 0.1) },
          }}
        >
          <LogoutIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </IconButton>
  );
}

/* ─── Main layout ────────────────────────────────────────────── */

type Props = { children: ReactNode };

export default function MasterLayout({ children }: Props) {
  const { palette } = useTheme();
  const { brand } = palette;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const roleKey = (user?.role ?? "user").toLowerCase();
  const roleCfg = ROLE_CFG[roleKey] ?? ROLE_CFG.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    setMenuAnchor(null);
    dispatch(logoutAction()).then(() => navigate("/login", { replace: true }));
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* ════════  PERMANENT SIDEBAR — desktop  ════════ */}
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_W,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: (t) => t.zIndex.drawer,
          boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
        }}
      >
        <SidebarContent />
      </Box>

      {/* ════════  DRAWER — mobile  ════════ */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: SIDEBAR_W, border: "none" },
        }}
      >
        <SidebarContent onClose={() => setDrawerOpen(false)} />
      </Drawer>

      {/* ════════  RIGHT COLUMN  ════════ */}
      <Box
        sx={{
          flex: 1,
          ml: { md: `${SIDEBAR_W}px` },
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* ── Top header ── */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            color: "text.primary",
            zIndex: (t) => t.zIndex.appBar,
          }}
        >
          <Toolbar
            sx={{
              px: { xs: 2, sm: 3 },
              minHeight: { xs: 60, sm: 64 },
              gap: 1.5,
            }}
          >
            {/* Hamburger — mobile */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              edge="start"
              sx={{ display: { md: "none" }, color: "text.secondary", mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Page identity */}
            <Box sx={{ flex: 1 }}>
              <AppText
                variant="h6"
                sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}
              >
                Support Desk
              </AppText>
              <AppText
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Ticket Management Platform
              </AppText>
            </Box>

            {/* Notification bell */}
            <Tooltip title="Notifications">
              <IconButton
                sx={{
                  bgcolor: "grey.100",
                  color: "text.secondary",
                  "&:hover": { bgcolor: "grey.200" },
                }}
              >
                <Badge badgeContent={3} color="error" max={9}>
                  <NotificationsNoneIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ my: 1.5 }} />

            {/* User pill */}
            <Tooltip title="Account">
              <Box
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.25,
                  py: 0.6,
                  borderRadius: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${brand.overlayStart}, ${brand.overlayEnd})`,
                    color: "#fff",
                  }}
                >
                  {initials}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <AppText
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.name ?? "User"}
                  </AppText>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.4,
                      px: 0.7,
                      py: 0.1,
                      borderRadius: 0.75,
                      bgcolor: alpha(roleCfg.color, 0.1),
                      border: `1px solid ${alpha(roleCfg.color, 0.25)}`,
                    }}
                  >
                    <ShieldOutlinedIcon
                      sx={{ fontSize: 9, color: roleCfg.color }}
                    />
                    <AppText
                      sx={{
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        color: roleCfg.color,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {roleCfg.label}
                    </AppText>
                  </Box>
                </Box>
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: 16,
                    color: "text.secondary",
                    transition: "transform 0.2s",
                    transform: menuOpen ? "rotate(180deg)" : "none",
                    display: { xs: "none", sm: "block" },
                  }}
                />
              </Box>
            </Tooltip>

            {/* Account dropdown */}
            <Menu
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={() => setMenuAnchor(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  elevation: 4,
                  sx: {
                    mt: 1,
                    minWidth: 230,
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "visible",
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: -6,
                      right: 20,
                      width: 11,
                      height: 11,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      transform: "rotate(45deg)",
                      borderBottom: "none",
                      borderRight: "none",
                    },
                  },
                },
              }}
            >
              {/* User summary */}
              <Box sx={{ px: 2, pt: 1.75, pb: 1.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    mb: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${brand.overlayStart}, ${brand.overlayEnd})`,
                      color: "#fff",
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Box>
                    <AppText
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {user?.name ?? "Unknown"}
                    </AppText>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.4,
                        px: 0.7,
                        py: 0.1,
                        mt: 0.3,
                        borderRadius: 0.75,
                        bgcolor: alpha(roleCfg.color, 0.1),
                        border: `1px solid ${alpha(roleCfg.color, 0.25)}`,
                      }}
                    >
                      <ShieldOutlinedIcon
                        sx={{ fontSize: 9, color: roleCfg.color }}
                      />
                      <AppText
                        sx={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          color: roleCfg.color,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {roleCfg.label}
                      </AppText>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <EmailOutlinedIcon
                    sx={{ fontSize: 12, color: "text.disabled" }}
                  />
                  <AppText
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.email ?? ""}
                  </AppText>
                </Box>
              </Box>

              <Divider />

              <MenuItem
                sx={{ py: 1.25, px: 2, gap: 1.5, my: 0.25 }}
                onClick={() => setMenuAnchor(null)}
              >
                <PersonOutlineIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
                <AppText sx={{ fontSize: "0.875rem" }}>My Profile</AppText>
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={handleLogout}
                sx={{ py: 1.25, px: 2, gap: 1.5, my: 0.25 }}
              >
                <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
                <AppText
                  sx={{
                    fontSize: "0.875rem",
                    color: "error.main",
                    fontWeight: 500,
                  }}
                >
                  Sign out
                </AppText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* ── Page content ── */}
        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Box>

        {/* ── Footer ── */}
        <Box
          component="footer"
          sx={{ bgcolor: "background.paper", mt: "auto" }}
        >
          {/* Accent rule */}
          {/* <Box
            sx={{
              height: 3,
              background: `linear-gradient(90deg, ${brand.overlayStart} 0%, ${brand.overlayEnd} 100%)`,
            }}
          /> */}

          {/* ── Brand (centered) ── */}
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.25,
                mb: 1.25,
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1.5,
                  background: `linear-gradient(135deg, ${brand.overlayStart}, ${brand.overlayEnd})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src={AppImages.appLogo}
                  alt="logo"
                  sx={{
                    width: 18,
                    height: 18,
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </Box>
              <AppText
                sx={{
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  letterSpacing: 0.3,
                }}
              >
                Support Desk
              </AppText>
            </Box>
            <AppText
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.75,
                maxWidth: 430,
              }}
            >
              Manage, track and resolve customer issues — all in one modern
              platform.
            </AppText>
          </Box> */}

          {/* Bottom bar */}
          <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <Box
              sx={{
                px: { xs: 3, sm: 4, md: 6 },
                py: 1.5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 0.75,
              }}
            >
              <AppText variant="caption" sx={{ color: "text.disabled" }}>
                © {new Date().getFullYear()} Support Desk · All rights reserved.
              </AppText>
              <AppText variant="caption" sx={{ color: "text.disabled" }}>
                Built with React · Redux Toolkit · Material-UI
              </AppText>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

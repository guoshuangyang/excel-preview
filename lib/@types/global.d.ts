declare global {
  type PermissionName =
    | "geolocation"
    | "notifications"
    | "persistent-storage"
    | "push"
    | "screen-wake-lock"
    | "xr-spatial-tracking"
    | "clipboard-read"
    | "clipboard-write"
    | "clipboard"
    | "local-fonts";
}

declare const queryLocalFonts: () => Promise | Array;

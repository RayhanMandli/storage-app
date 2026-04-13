import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 3200,
        style: {
          background: "rgba(24, 24, 27, 0.95)",
          color: "#f4f4f5",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "12px",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
        },
        success: {
          iconTheme: {
            primary: "#34d399",
            secondary: "#052e16",
          },
        },
        error: {
          iconTheme: {
            primary: "#fb7185",
            secondary: "#500724",
          },
        },
      }}
    />
  );
}

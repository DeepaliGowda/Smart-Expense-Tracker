"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2500,
        style: {
          borderRadius: "12px",
          background: "#0f172a",
          color: "#f8fafc"
        }
      }}
    />
  );
}

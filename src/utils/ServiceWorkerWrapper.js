"use client";
import styled from "@emotion/styled";
import { ButtonBase } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { RefreshIcon } from "@/assets/icons";

// Define the styling for the RefreshButton using Emotion Styled Components
const RefreshButton = styled(ButtonBase)(() => ({
  display: "flex",
  gap: "5px",
  borderRadius: "8px",
  padding: "6px 12px",
  fontSize: 13,
}));

const ServiceWorkerWrapper = ({ children }) => {
  const [waitingWorker, setWaitingWorker] = useState({});
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  // Define the refreshAction callback function
  const refreshAction = useCallback(
    (closeToast) => {
      const updateServiceWorker = () => {
        waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
        setNewVersionAvailable(true);
        window.location.reload();
      };

      return (
        <RefreshButton
          onClick={() => {
            updateServiceWorker();
            closeToast();
          }}
        >
          <span>Refrescar</span> <RefreshIcon />
        </RefreshButton>
      );
    },
    [waitingWorker]
  );

  // useEffect hook to handle service worker registration and version updates
  useEffect(() => {
    const onServiceWorkerUpdate = (registration) => {
      setWaitingWorker(registration && registration.waiting);
      setNewVersionAvailable(true);
    };

    // Register service worker on production environment
    if (process.env.NODE_ENV === "production") {
      console.info("Service Worker is registered in production mode");
      serviceWorkerRegistration.register({ onUpdate: onServiceWorkerUpdate });
    } else {
      console.info("Service Worker is disabled in development mode");
    }

    // Display toast notification for new version availability
    if (newVersionAvailable) {
      toast.warn("Una nueva versión fue lanzada", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        closeButton: refreshAction,
        style: { fontSize: 13, width: "max-content" },
      });
    }
  }, [newVersionAvailable, waitingWorker, refreshAction]);

  // Return the children wrapped by the ServiceWorkerWrapper
  return children;
};

export default ServiceWorkerWrapper;

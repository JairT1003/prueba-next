export const register = async ({ onUpdate }) => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // New version installed, call onUpdate function
              onUpdate && onUpdate(registration);
            }
          }
        });
      });
    } catch (error) {
      console.error("Error al registrar el Service Worker:", error);
    }
  }
};

export const unregister = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
    } catch (error) {
      console.error("Error al desregistrar el Service Worker:", error);
    }
  }
};

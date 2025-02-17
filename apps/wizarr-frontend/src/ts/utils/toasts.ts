import { useToast } from "vue-toastification";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";
import type { CommonOptions, PluginOptions, ToastContent, ToastID, ToastOptions } from "vue-toastification/dist/types/types";
import { getCurrentWindow } from "@tauri-apps/api/window";

// Toast state and permission tracking
let isForeground = true;
let permissionGranted = false;

// Initialize notification system and permissions
const initNotificationSystem = async () => {
    if (window.__TAURI__) {
        permissionGranted = await isPermissionGranted();

        if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === "granted";
        }

        const currentWindow = getCurrentWindow();

        // Monitor window focus and blur events
        currentWindow.onFocusChanged((focused) => {
            isForeground = focused.payload;
        });
    }
};

// Utility function to send Tauri notifications
const sendTauriNotification = (title: string, message: string) => {
    if (permissionGranted) {
        sendNotification({
            title,
            body: message,
        });
    } else {
        console.warn("Notification permission not granted.");
    }
};

// Generalized toast function
const createToast = (type: "info" | "success" | "error" | "warning" | "default") => {
    return (message: ToastContent, options?: ToastOptions) => {
        const toast = useToast();
        if (isForeground) {
            if (type === "default") {
                return toast(message, options as CommonOptions);
            } else {
                return toast[type](message, options as CommonOptions);
            }
        } else {
            sendTauriNotification(`Wizarr ${type.charAt(0).toUpperCase() + type.slice(1)}`, typeof message === "string" ? message : "Open Wizarr to view the message.");
        }
    };
};

// Exported toast functions
export const infoToast = createToast("info");
export const successToast = createToast("success");
export const errorToast = createToast("error");
export const warningToast = createToast("warning");
export const defaultToast = createToast("default");

// Toast management functions
export const clearToasts = () => {
    const toast = useToast();
    toast.clear();
};

export const updateDefaultOptions = (options: PluginOptions) => {
    const toast = useToast();
    toast.updateDefaults(options);
};

export const dismissToast = (id: ToastID) => {
    const toast = useToast();
    toast.dismiss(id);
};

export const updateToast = (id: ToastID, content: ToastContent, options?: ToastOptions) => {
    const toast = useToast();
    toast.update(id, { content, options });
};

// Initialize the system
initNotificationSystem();

export default {
    info: infoToast,
    success: successToast,
    error: errorToast,
    warning: warningToast,
    default: defaultToast,
    clear: clearToasts,
    updateDefaults: updateDefaultOptions,
    dismiss: dismissToast,
    update: updateToast,
};

export declare type Toasts = {
    info: typeof infoToast;
    success: typeof successToast;
    error: typeof errorToast;
    warning: typeof warningToast;
    default: typeof defaultToast;
};

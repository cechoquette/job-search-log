const { contextBridge, ipcRenderer } = require("electron");
import type { Activity } from "./activity.js";

contextBridge.exposeInMainWorld("jobSearchLog", {
    saveActivity: (activity: Activity) => {
        return ipcRenderer.invoke("save-activity", activity);
    }
});
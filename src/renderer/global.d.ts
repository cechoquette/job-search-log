import type { Activity } from "../activity.js";

declare global {
    interface Window {
        jobSearchLog: {
            saveActivity: (activity: Activity) => Promise<void>;
        };
    }
}

export {};
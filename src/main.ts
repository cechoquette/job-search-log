import {app, BrowserWindow, ipcMain} from "electron";
import {fileURLToPath} from "node:url";
import * as path from "node:path";
import {initializeDatabase, saveActivity} from "./database.js";
import type {DatabaseSync} from "node:sqlite";
import type {Activity} from "./activity.js";

let database: DatabaseSync;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow(): void{
    const window = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs")
        }
    });
    window.loadFile(path.join(__dirname, "..", "static", "index.html")
    );
}

app.whenReady().then(() => {
    const databasePath = path.join(
        app.getPath("userData"),
        "job-search-log.db"
    );

    database = initializeDatabase(databasePath);

    ipcMain.handle("save-activity", (_event, activity: Activity) => {
        saveActivity(database, activity);
    });

    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin"){
        app.quit();
    }
});
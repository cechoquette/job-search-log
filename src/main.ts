import {app, BrowserWindow, ipcMain, Menu, dialog, shell} from "electron";
import {fileURLToPath} from "node:url";
import * as path from "node:path";
import {initializeDatabase, saveActivity, getAllActivities} from "./database.js";
import type {DatabaseSync} from "node:sqlite";
import type {Activity} from "./activity.js";
import {buildActivitiesWorkbook} from "./exporter.js";
import ExcelJS from "exceljs";
import {WebPageArchiveService} from "./webPageArchiveService.js";

let database: DatabaseSync;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webPageArchiveService = new WebPageArchiveService();

const today = new Date();

const dateForFileName = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2,"0")
].join("-");

const menu = Menu.buildFromTemplate([
    {
        label: "File",
        submenu: [
            {
                label: "Export activities to Excel",
                accelerator: "CmdCtrl+Shift+E",
                click: async () => {
                    const exportFilePath = await exportActivities();

                    await dialog.showMessageBox({
                        type: "info",
                        message: "Export complete",
                        detail: `Saved to:\n${exportFilePath}`,
                    });
                },
            },
            {
                label: "Open webpage archive folder",
                click: async () => {
                    const archiveFolderPath = path.join(
                        app.getPath("userData"),
                        "saved-pages"
                    );

                    await shell.openPath(archiveFolderPath);
                }
            },
            {type:"separator"},
            {role:"quit"},
        ],
    },
]);

Menu.setApplicationMenu(menu);

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

    ipcMain.handle("export-activities", async (_event) => {
        return exportActivities();
    });

    ipcMain.handle("archive-page", async (_event, url: string) => {
        return webPageArchiveService.archivePage(url);
    });

    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin"){
        app.quit();
    }
});

async function exportActivities(): Promise<string> {
    const activities: Activity[] = getAllActivities(database);

    const workbook: ExcelJS.Workbook = buildActivitiesWorkbook(activities);

    const exportFilePath = path.join(
        app.getPath("downloads"),
        `job-search-log-${dateForFileName}.xlsx`
    );

    await workbook.xlsx.writeFile(exportFilePath);

    return exportFilePath;
}
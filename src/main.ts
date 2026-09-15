import {app, BrowserWindow} from "electron";
import {fileURLToPath} from "node:url";
import * as path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow(): void{
    const window = new BrowserWindow({
        width: 600,
        height: 500
    });
    window.loadFile(path.join(__dirname, "..", "static", "index.html")
    );
}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin"){
        app.quit();
    }
});
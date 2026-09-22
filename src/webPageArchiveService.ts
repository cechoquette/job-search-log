import {app, BrowserWindow} from "electron";
import path from "node:path";
import {mkdir} from "node:fs/promises"


export interface ArchivedPage{
    originalUrl: string;
    savedFilePath: string;
}

export class WebPageArchiveService{
    async archivePage(url: string): Promise<ArchivedPage>{
        const pageUrl = new URL(url);

        if (pageUrl.protocol !== "https:" && pageUrl.protocol !== "http:"){
            throw new Error("Only HTTP and HTTPS webpages can be archived.");
        }

        const archiveFolderName = this.createArchiveFolderName(pageUrl);
        const archiveDirectory = path.join(
            app.getPath("userData"),
            "saved-pages",
            archiveFolderName
        );

        await mkdir(archiveDirectory, {recursive: true});

        const savedFilePath = path.join(archiveDirectory, "page.html");

        const archiveWindow = new BrowserWindow({
            show: false,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false
            }
        });

        try {
            await archiveWindow.loadURL(url);
            await archiveWindow.webContents.savePage(
                savedFilePath,
                "HTMLComplete"
            );

            return {
                originalUrl: url,
                savedFilePath
            };
        } finally {
            archiveWindow.destroy();
        }
    }

    private createArchiveFolderName(pageUrl:URL): string {
        const timestamp = new Date()
            .toISOString()
            .replaceAll(":", "-")
            .replace(".", "-");

        const safeHostName = pageUrl.hostname.replaceAll(/[^a-z0-9]/gi, "-");

        return `${timestamp}-${safeHostName}`;
    }
}
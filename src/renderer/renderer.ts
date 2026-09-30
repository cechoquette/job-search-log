import type {Activity} from "../activity.js";

let durationMinutes: number = 30;

const durationDisplay = document.getElementById("duration-display");
const durationUp = document.getElementById("duration-up");
const durationDown = document.getElementById("duration-down");

const date = document.getElementById("date") as HTMLInputElement;
const description = document.getElementById("description") as HTMLInputElement;
const url = document.getElementById("url") as HTMLInputElement;
const category = document.getElementById("category") as HTMLSelectElement;
const archivePageCheckbox = document.getElementById("archive-page") as HTMLInputElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;

function convertMinutesToHrs(value: number): string {
    let hour: number = Math.floor(value / 60);
    let minutes: number = value % 60;

    return hour + "H" + minutes.toString().padStart(2, "0");
}

durationUp?.addEventListener("click", () => {
    durationMinutes += 15;
    durationDisplay!.textContent = convertMinutesToHrs(durationMinutes);
});

durationDown?.addEventListener("click", () => {
    if (durationMinutes >= 15) {
        durationMinutes -= 15;

        durationDisplay!.textContent = convertMinutesToHrs(durationMinutes);
    }
});

saveButton?.addEventListener("click", async () => {
    const activity: Activity = {
        date: date.value,
        description: description.value,
        duration: durationMinutes,
        url: url.value,
        category: category.value
    }

    const shouldArchivePage = archivePageCheckbox.checked;

    console.log(activity);

    try {
        await window.jobSearchLog.saveActivity(activity);
        if(shouldArchivePage && activity.url && activity.url.trim() !== "") {
            try {
                await window.jobSearchLog.archivePage(activity.url);
                saveButton.textContent = "Saved and archived ✓";
            } catch(error){
                console.error(error);
                saveButton.textContent = "Saved; archive failed";
            }
        } else {
            saveButton.textContent = "Saved ✓";
            setTimeout(() => {
                saveButton.textContent = "Save Activity";
            }, 2000);
        }
    } catch (error) {
        console.error(error);
        saveButton.textContent = "Save failed";
    } finally {
        setTimeout(() => {
            saveButton.textContent = "Save Activity";
        }, 2000);
    }
});
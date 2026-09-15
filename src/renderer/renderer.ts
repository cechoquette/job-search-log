import type {Activity} from "../activity.js";

let durationMinutes: number = 30;

const durationDisplay = document.getElementById("duration-display");
const durationUp = document.getElementById("duration-up");
const durationDown = document.getElementById("duration-down");

const date = document.getElementById("date") as HTMLInputElement;
const description = document.getElementById("description") as HTMLInputElement;
const url = document.getElementById("url") as HTMLInputElement;
const category = document.getElementById("category") as HTMLSelectElement;

const saveButton = document.getElementById("save");

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

saveButton?.addEventListener("click", () => {
    const activity: Activity = {
        date: date.value,
        description: description.value,
        duration: durationMinutes,
        url: url.value,
        category: category.value

    }

    console.log(activity);
});
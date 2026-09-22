import type {Activity} from "./activity.js";
import ExcelJS from "exceljs";

export function buildActivitiesWorkbook(activities: Activity[]): ExcelJS.Workbook {

    const workbook = new ExcelJS.Workbook;
    const worksheet = workbook.addWorksheet("Activities");

    worksheet.addRow([
        "Date",
        "Activity",
        "Duration (minutes)",
        "URL",
        "Category"
    ]);

    for(const activity of activities) {
        worksheet.addRow([
            activity.date,
            activity.description,
            activity.duration,
            activity.url,
            activity.category
        ]);
    }
    return workbook;
}

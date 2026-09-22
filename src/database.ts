import {DatabaseSync, type StatementSync} from "node:sqlite";
import type {Activity} from "./activity.js";

export function initializeDatabase(databasePath: string): DatabaseSync {
    const database = new DatabaseSync(databasePath);

    database.exec(`
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            description TEXT NOT NULL,
            duration INTEGER,
            url TEXT,
            category TEXT NOT NULL
        )
    `);

    return database;
}

export function saveActivity(
    database: DatabaseSync,
    activity: Activity): void{

    const statement: StatementSync = database.prepare(`
        INSERT INTO activities
            (date, description, duration, url, category)
        VALUES
            (?, ?, ?, ?, ?)
        `);

    statement.run(
        activity.date,
        activity.description,
        activity.duration ?? null,
        activity.url ?? null,
        activity.category
    );

}

export function getAllActivities(
    database: DatabaseSync): Activity[]{

    const statement: StatementSync = database.prepare( `
        SELECT date, description, duration, url, category
        FROM activities
        ORDER BY date ASC, id ASC
    `);

    return statement.all() as unknown as Activity[];

}

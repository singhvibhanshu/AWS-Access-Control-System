import * as fs from "fs-extra";
import { parse } from "csv-parse";

export interface CsvRow {
    [key: string]: string;
}

export async function readCsvFile(filePath: string): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
        const results: CsvRow[] = [];
        
        if (!fs.existsSync(filePath)) {
            reject(new Error(`CSV file not found: ${filePath}`));
            return;
        }
        
        fs.createReadStream(filePath)
            .pipe(parse({
                columns: true,
                skip_empty_lines: true,
                trim: true
            }))
            .on('data', (row: CsvRow) => {
                results.push(row);
            })
            .on('end', () => {
                console.log(`Successfully read ${results.length} rows from ${filePath}`);
                resolve(results);
            })
            .on('error', (error: Error) => {
                console.error(`Error reading CSV file ${filePath}:`, error);
                reject(error);
            });
    });
}

export function validateUserPermissions(data: CsvRow[]): boolean {
    const requiredFields = ['email', 'permission'];
    const validPermissions = ['admin', 'moderator', 'reviewer', 'viewer'];
    
    for (const row of data) {
        // Check required fields
        for (const field of requiredFields) {
            if (!row[field]) {
                console.error(`Missing required field '${field}' in row:`, row);
                return false;
            }
        }
        
        // Check valid permission
        if (!validPermissions.includes(row.permission)) {
            console.error(`Invalid permission '${row.permission}' in row:`, row);
            return false;
        }
        
        // Check email format (basic validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.email)) {
            console.error(`Invalid email format '${row.email}' in row:`, row);
            return false;
        }
    }
    
    return true;
}

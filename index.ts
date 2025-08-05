import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs-extra";
import { parse } from "csv-parse/sync";

// Types for our data structures
interface UserPermission {
    email: string;
    permission: string;
}

interface UserRepository {
    email: string;
    repository: string;
}

interface UserRepoPermission {
    email: string;
    repository: string;
    permission: string;
}

// CSV reading function using synchronous csv-parse
function readCSV<T>(filePath: string): T[] {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
    } catch (error) {
        console.error(`Error reading CSV file ${filePath}: ${error}`);
        throw error;
    }
}

// Rest of your infrastructure code...
// [Keep your existing permission mapping and AWS resource creation code]

try {
    // Read CSV files synchronously
    const userPermissions = readCSV<UserPermission>('user_permissions.csv');
    const userRepositories = readCSV<UserRepository>('user_repos.csv');
    
    // Continue with your existing infrastructure setup...
    
} catch (error) {
    console.error("Error during infrastructure setup:", error);
    process.exit(1);
}
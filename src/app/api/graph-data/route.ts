import {NextResponse} from "next/server";

export interface DataPoint {
    timestamp: string;
    value: number;
}

export type ApiResponse = DataPoint[];

export async function GET() {
    return NextResponse.json({message: "Endpoint up and running"});
}
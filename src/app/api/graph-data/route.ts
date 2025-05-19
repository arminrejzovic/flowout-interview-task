import {NextResponse} from "next/server";

export interface DataPoint {
    timestamp: string;
    value: number;
}

export type ApiResponse = DataPoint[];

export async function GET() {
    // sleep for 1.2 seconds to see the loading state for longer
    await new Promise(resolve => setTimeout(resolve, 1200));

    const randomData = Array(7).keys().toArray().map(i => {
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - (6 - i));

        const value = Math.floor(Math.random() * 100);
        return {
            timestamp: timestamp.toISOString(),
            value: value,
        };
    });

    return NextResponse.json(randomData);
}
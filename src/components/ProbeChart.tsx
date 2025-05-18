"use client";

import {Bar, BarChart, Rectangle, Tooltip,} from "recharts";
import {useId, useState} from "react";
import {BarRectangleItem} from "recharts/types/cartesian/Bar";

interface DataPoint {
    timestamp: string;
    value: number;
}
type ApiResponse = DataPoint[];

const dummyData: DataPoint[] = [
    {
        timestamp: "2021-01-01T00:00:00.000Z",
        value: 100,
    },
    {
        timestamp: "2021-01-02T00:00:00.000Z",
        value: 80,
    },
    {
        timestamp: "2021-01-03T00:00:00.000Z",
        value: 33,
    },
    {
        timestamp: "2021-01-04T00:00:00.000Z",
        value: 52,
    },
    {
        timestamp: "2021-01-05T00:00:00.000Z",
        value: 69,
    },
    {
        timestamp: "2021-01-06T00:00:00.000Z",
        value: 42,
    },
    {
        timestamp: "2021-01-07T00:00:00.000Z",
        value: 93,
    }
];

function generateData(): ApiResponse {
    const today = new Date();
    // array from 1 to 7
    const randomData = Array(7).keys().toArray().map(i => {
        const timestamp = new Date(today.setDate(today.getDate() - i));
        const value = Math.floor(Math.random() * 100);
        return {
            timestamp: timestamp.toISOString(),
            value: value,
        };
    });
    console.log(randomData);
    return randomData;
}

function BarGradient(props: BarRectangleItem) {
    const id = useId();
    const gradientId = `gradient-${id}`;

    return (
        <>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#4add55"/>
                    <stop offset="100%" stopColor="#baf3bf"/>
                </linearGradient>
            </defs>

            <rect
                x={props.x}
                width={props.width}
                height={props.height}
                y={props.y}
                rx={8}
                ry={8}
                fill={`url(#${gradientId})`}
                stroke={"#43bf4d"}
                strokeWidth={1.5}
            />
        </>
    );
}


function ProbeChart() {
    const [data, setData] = useState<ApiResponse>(dummyData);
    const id = useId();
    const gradientId = `gradient-${id}`;

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 m-4">
            <div className="flex w-full justify-between items-start">
                <div>
                    <h1 className="text-2xl font-medium mb-2">Total customers <span>tooltip</span></h1>
                    <p className={"text-6xl font-medium mb-4"}>524</p>
                </div>
                <div>
                    <button>refresh</button>
                </div>
            </div>

            <BarChart id={"justachart"} width={500} height={200} data={data}>
                <Tooltip cursor={false}/>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#4dde59"/>
                        <stop offset="100%" stopColor="#c4ffc9"/>
                    </linearGradient>
                </defs>
                <Bar shape={<BarGradient/>}  dataKey={"value"} />
            </BarChart>
            <div className="bg-gray-200 w-full h-0.5 my-4"/>
            <div className={"flex w-full justify-between items-center"}>
                <p>Oct 2 - Oct 8, 2023</p>
                <button className={"bg-purple-600 p-2 text-center capitalize cursor-pointer"} onClick={() => setData(generateData())}>Load Dummy Data</button>
            </div>
        </div>
    );
}

export default ProbeChart;
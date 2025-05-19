"use client";

import { ReactNode, useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import { BarRectangleItem } from "recharts/types/cartesian/Bar";
import { ArrowDownRight, ArrowUpRight, CloudAlert, EqualApproximately, InfoIcon, RefreshCw } from "lucide-react";
import { ApiResponse } from "@/app/api/graph-data/route";
import SimpleTooltip from "@/components/SimpleTooltip";

async function fetchGraphData(): Promise<ApiResponse> {
    return await fetch("/api/graph-data").then(res => res.json());
}

function QueryStateWrapper({isFetching, isError, fetchingFallback, errorFallback, children}: {isFetching: boolean, isError: boolean, fetchingFallback: ReactNode, errorFallback: ReactNode, children: ReactNode}) {
    if (isFetching) {
        return fetchingFallback;
    } else if (isError) {
        return errorFallback;
    } else {
        return children;
    }
}

function GraphErrorFallback() {
    return (
        <div className="h-1/2 w-full flex flex-col items-center justify-center gap-2">
            <CloudAlert className="text-red-500" size={144}/>
            <p className="text-red-500">Error fetching data. Please try again.</p>
        </div>
    )
}

function formatDateRange(startIso?: string, endIso?: string): string {
    if(!startIso || !endIso) return "";

    const start = new Date(startIso);
    const end = new Date(endIso);

    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();

    const startFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    });

    const endFormatter = new Intl.DateTimeFormat('en-US', {
        month: sameMonth ? undefined : 'short',
        day: 'numeric',
        year: sameYear ? undefined : 'numeric',
    });

    return `${startFormatter.format(start)} – ${endFormatter.format(end)}${sameYear ? `, ${start.getFullYear()}` : ''}`;
}

function calculateChange(previousTotal?: number, currentTotal?: number): number {
    if(!previousTotal || !currentTotal) return 0;

    return Math.round((currentTotal - previousTotal) / previousTotal * 100);
}

function ChangeIndicator({change}: {change: number}) {
    if (change == 0) {
        return (
            <div className={"flex items-center gap-2 bg-yellow-300 rounded-md px-2 py-1 text-yellow-600"}>
                <p className={"text-sm font-medium sm:text-xl"}>{change}%</p>
                <EqualApproximately/>
            </div>
        )
    }
    if(change < 0) {
        return (
            <div className={"flex items-center gap-2 bg-red-300 rounded-md px-2 py-1 text-red-600"}>
                <p className={"text-sm font-medium sm:text-xl"}>{change}%</p>
                <ArrowDownRight/>
            </div>
        )
    }

    return (
        <div className={"flex items-center gap-2 bg-[#ddf7df] rounded-md px-2 py-1 text-[#319e3b]"}>
            <p className={"text-sm font-medium sm:text-xl"}>+{change}%</p>
            <ArrowUpRight/>
        </div>
    )
}

function GraphTooltip({active, payload}: {active: boolean | undefined, payload: any, label: string}) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    if (active && payload && payload.length) {
        return (
            <div className="bg-white border-2 rounded-lg p-2 text-black">
                <p className="label">{`${payload[0].value}`}</p>
                <p className="label">{`${formatter.format(new Date(payload[0].payload.timestamp))}`}</p>
            </div>
        );
    }

    return null;
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

function CustomerChart() {
    const id = useId();
    const { data, isFetching, refetch, isError } = useQuery({
        queryKey: ["graph-data"],
        queryFn: fetchGraphData,
    });

    const [previousTotal, setPreviousTotal] = useState(0);

    const total = data?.reduce((acc, curr) => acc + curr.value, 0);
    const startDate = data?.[0]?.timestamp;
    const endDate = data?.[data?.length - 1]?.timestamp;

    const change = calculateChange(previousTotal, total);

    return (
        <div className="bg-white w-full min-w-xs max-w-xl aspect-[1.4] rounded-2xl shadow-lg p-6 pb-4">
            <div className={"flex w-full justify-between items-center lg:mb-2"}>
                <div className={"flex items-center justify-center gap-4"}>
                    <p className="text-lg md:text-3xl font-medium">Total customers</p>
                    <SimpleTooltip text={"Number of customers in the last 7 days."} classes={"rounded-md py-0.5 px-1 bg-[#f2f5f8]"}>
                        <InfoIcon className="text-[#8b8f98]"/>
                    </SimpleTooltip>
                </div>
                <button disabled={isFetching} className={"outline-2 outline-gray-200 rounded-md py-0.5 px-1 hover:bg-gray-100 cursor-pointer"} onClick={() => {
                    setPreviousTotal(total ?? 0);
                    refetch();
                }}>
                    <RefreshCw className="text-[#8b8f98]"/>
                </button>
            </div>

            <QueryStateWrapper isFetching={isFetching} isError={isError} fetchingFallback={<div className={"h-[2.5rem] md:h-[72px] w-1/3 animate-pulse bg-gray-200 mb-4"}/>} errorFallback={<p className={"text-6xl font-medium mb-4 text-red-500 opacity-50"}>-</p>}>
                <p className={"text-[2.5rem] md:text-7xl font-medium mb-4"}>{total}</p>
            </QueryStateWrapper>

            <QueryStateWrapper
                isFetching={isFetching}
                isError={isError}
                fetchingFallback={<div className={"h-2/5 w-full animate-pulse bg-gray-200"}/>}
                errorFallback={<GraphErrorFallback/>}
            >
                <ResponsiveContainer width="100%" height={"40%"}>
                    <BarChart
                        id={id}
                        data={data}
                        margin={{right: 0, left: 0, top: 0, bottom: 4}}
                    >
                        <Tooltip
                            cursor={false}
                            content={({ payload, label, active }) => {
                                return <GraphTooltip active={active} payload={payload} label={label}/>;
                            }}
                        />
                        <Bar shape={<BarGradient/>}  dataKey={"value"} />
                    </BarChart>
                </ResponsiveContainer>
            </QueryStateWrapper>

            <hr className="border-t-2 border-gray-200 my-4 md:my-6" />
            <div className={"flex w-full justify-between items-center"}>
                <QueryStateWrapper
                    isFetching={isFetching}
                    isError={isError}
                    fetchingFallback={<div className={"h-4 md:h-6 w-1/2 animate-pulse bg-gray-200"}/>}
                    errorFallback={<p className={"text-base md:text-2xl text-red-500 opacity-50"}>n/a - n/a</p>}
                >
                    <p className={"text-base md:text-2xl text-gray-400"}>
                        {formatDateRange(startDate, endDate)}
                    </p>
                </QueryStateWrapper>
                <ChangeIndicator change={change}/>
            </div>
        </div>
    );
}

export default CustomerChart;
"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import moment from "moment";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Pin, Activity } from "lucide-react";

interface Rate {
    id: string;
    rate: number;
    month: string;
    createdAt: string;
    user: { name: string | null };
}

export default function ConvertionPage() {
    const [rates, setRates] = useState<Rate[]>([]);
    const [currentRate, setCurrentRate] = useState<Rate | null>(null);
    const [newRate, setNewRate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = useState("");

    const fetchRates = async () => {
        setLoading(true);
        try {
            const [currentRes, allRes] = await Promise.all([
                fetch("/api/conversion-rates?current=true"),
                fetch("/api/conversion-rates"),
            ]);
            if (!currentRes.ok || !allRes.ok) throw new Error("Failed to fetch rates");
            const currentData = await currentRes.json();
            const allData = await allRes.json();
            setCurrentRate(currentData);
            setRates(allData);
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newRate) return;
        try {
            const response = await fetch("/api/conversion-rates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rate: parseFloat(newRate), month: new Date() }),
            });
            if (!response.ok) throw new Error("Failed to update rate");
            setNewRate("");
            fetchRates();
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("An unknown error occurred");
        }
    };

    // --- Stats calculation by month (daily highest) ---
    const stats = useMemo(() => {
        if (rates.length === 0)
            return { highest: 0, lowest: 0, average: 0, highestDate: "", lowestDate: "" };

        const dailyMaxMap: Record<string, Rate> = {};
        rates.forEach((r) => {
            const day = moment(r.month).format("YYYY-MM-DD");
            if (!dailyMaxMap[day] || r.rate > dailyMaxMap[day].rate) {
                dailyMaxMap[day] = r;
            }
        });

        const dailyRates = Object.values(dailyMaxMap);

        let highestRate = dailyRates[0].rate;
        let lowestRate = dailyRates[0].rate;
        let highestDate = dailyRates[0].month;
        let lowestDate = dailyRates[0].month;

        const rateValues = dailyRates.map((r) => {
            if (r.rate > highestRate) {
                highestRate = r.rate;
                highestDate = r.month;
            }
            if (r.rate < lowestRate) {
                lowestRate = r.rate;
                lowestDate = r.month;
            }
            return r.rate;
        });

        const average =
            rateValues.reduce((sum, val) => sum + val, 0) / rateValues.length;

        return {
            highest: highestRate,
            lowest: lowestRate,
            average: parseFloat(average.toFixed(3)),
            highestDate,
            lowestDate,
        };
    }, [rates]);

    // --- Chart: last 25 changes, skipping consecutive duplicates ---
    const chartData = useMemo(() => {
        const data: { date: string; rate: number }[] = [];
        let prevRate: number | null = null;

        const last25 = rates.slice(-25);
        last25.forEach((r) => {
            if (prevRate === null || prevRate !== r.rate) {
                data.push({ date: moment(r.createdAt).format("YYYY-MM-DD"), rate: r.rate });
                prevRate = r.rate;
            }
        });

        return data;
    }, [rates]);

    const columns: ColumnDef<Rate>[] = [
        { header: "Date", accessorFn: (row) => moment(row.month).format("ll"), id: "date" },
        { header: "Rate", accessorKey: "rate" },
        { header: "Updated By", accessorFn: (row) => row.user.name || "Unknown", id: "updatedBy" },
    ];

    const table = useReactTable({
        data: rates,
        columns,
        state: { globalFilter },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId)?.toString().toLowerCase() ?? "";
            return value.includes(filterValue.toLowerCase());
        },
    });

    if (loading)
        return (
            <div className="flex flex-col h-full min-h-[calc(100vh-10rem)] w-full items-center justify-center gap-4">
                <MoonLoader color="#414c65" size={50} />
                <p className="text-gray-700 text-lg font-medium animate-pulse">
                    Loading, please wait...
                </p>
            </div>
        );

    if (error) return <p className="text-red-500 text-center font-medium">{error}</p>;

    return (
        <div className="flex-1 space-y-6 p-6 md:p-10">
            {/* Stats Cards */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {/* Current Conversion Rate */}
                {currentRate && (
                    <Card className="bg-white shadow-sm border p-3 hover:shadow-md transition">
                        <CardHeader className="flex items-center gap-2 px-1">
                            <Pin className="w-5 h-5 text-yellow-500" />
                            <div>
                                <CardTitle className="text-sm font-semibold">Current Rate</CardTitle>
                                <p className="text-[0.65rem] text-muted-foreground mt-0.5">Latest conversion</p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2">
                            <p className="text-xl sm:text-2xl font-bold">{currentRate.rate.toFixed(3)}</p>
                            <p className="text-[0.65rem] text-muted-foreground mt-1 sm:mt-0 text-right">
                                Updated by <strong>{currentRate.user.name}</strong> <br />
                                {moment(currentRate.createdAt).format("LL")}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Highest Rate */}
                <Card className="bg-white shadow-sm border p-3 hover:shadow-md transition">
                    <CardHeader className="flex items-center gap-2 px-1">
                        <ArrowUpRight className="w-5 h-5 text-blue-500" />
                        <div>
                            <CardTitle className="text-sm font-semibold">Highest Rate</CardTitle>
                            <p className="text-[0.65rem] text-muted-foreground mt-0.5">Daily maximum</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2">
                        <p className="text-xl sm:text-2xl font-bold">{stats.highest.toFixed(3)}</p>
                        <p className="text-[0.65rem] text-muted-foreground mt-1 sm:mt-0 text-right">
                            on {moment(stats.highestDate).format("LL")}
                        </p>
                    </CardContent>
                </Card>

                {/* Lowest Rate */}
                <Card className="bg-white shadow-sm border p-3 hover:shadow-md transition">
                    <CardHeader className="flex items-center gap-2 px-1">
                        <ArrowDownRight className="w-5 h-5 text-red-500" />
                        <div>
                            <CardTitle className="text-sm font-semibold">Lowest Rate</CardTitle>
                            <p className="text-[0.65rem] text-muted-foreground mt-0.5">Daily minimum</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2">
                        <p className="text-xl sm:text-2xl font-bold">{stats.lowest.toFixed(3)}</p>
                        <p className="text-[0.65rem] text-muted-foreground mt-1 sm:mt-0 text-right">
                            on {moment(stats.lowestDate).format("LL")}
                        </p>
                    </CardContent>
                </Card>

                {/* Average Rate */}
                <Card className="bg-white shadow-sm border p-3 hover:shadow-md transition">
                    <CardHeader className="flex items-center gap-2 px-1">
                        <Activity className="w-5 h-5 text-purple-500" />
                        <div>
                            <CardTitle className="text-sm font-semibold">Average Rate</CardTitle>
                            <p className="text-[0.65rem] text-muted-foreground mt-0.5">Daily trend average</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2">
                        <p className="text-xl sm:text-2xl font-bold">{stats.average.toFixed(3)}</p>
                        <span className="px-2 py-0.5 rounded text-[0.65rem] font-medium bg-gray-100 text-gray-800 text-center mt-1 sm:mt-0">
                            Stable
                        </span>
                    </CardContent>
                </Card>
            </div>



            {/* Trend Chart */}
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle>Conversion Rate Trend (Last 25 Changes)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis
                                domain={[
                                    Math.min(...chartData.map((r) => r.rate)) - 0.5,
                                    Math.max(...chartData.map((r) => r.rate)) + 0.5,
                                ]}
                                tickFormatter={(v) => v.toFixed(3)}
                            />
                            <Tooltip formatter={(value: number) => value.toFixed(3)} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#2b3c73"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Current Rate */}
            {currentRate && (
                <Card className="w-full bg-white shadow-md border">
                    <CardHeader>
                        <CardTitle>Current Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <p className="text-2xl font-bold">{currentRate.rate.toFixed(3)}</p>
                        <p className="text-sm text-muted-foreground">
                            Last updated by <strong>{currentRate.user.name}</strong> on{" "}
                            {moment(currentRate.createdAt).format("LL")}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Update Rate Form */}
            <Card className="w-full bg-white shadow-md border">
                <CardHeader>
                    <CardTitle>Update Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row sm:items-center gap-2"
                    >
                        <Input
                            type="number"
                            step="0.001"
                            value={newRate}
                            onChange={(e) => setNewRate(e.target.value)}
                            placeholder="Enter new rate"
                            className="max-w-xs"
                        />
                        <Button type="submit">Update Rate</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Rate History Table */}
            <Card className="w-full bg-white shadow-md border">
                <CardHeader>
                    <CardTitle>Conversion Rate History</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto space-y-2">
                    <Input
                        type="text"
                        placeholder="Search by user or rate..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm mb-4"
                    />
                    <table className="w-full min-w-max border">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="text-left px-4 py-2 border-b"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="text-center py-4 text-gray-500"
                                    >
                                        No records found
                                    </td>
                                </tr>
                            )}
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-2 border-b"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-2">
                        <div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="ml-2"
                            >
                                Next
                            </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

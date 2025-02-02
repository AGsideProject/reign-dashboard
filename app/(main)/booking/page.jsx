"use client";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useId, useState } from "react";
import columns from "@/components/booking/columns";
import fetchGlobal from "@/lib/fetch-data";
import PaginationControls from "@/components/booking/pagination-controls";
import FilterBook from "@/components/booking/filter-book";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import useDeviceType from "@/hooks/use-device";
import { formatDateV1 } from "@/lib/format-date";
import RowActions from "@/components/booking/options";

export default function Component() {
  const id = useId();
  // Initialize state
  const [data, setData] = useState([]);
  const [filterdData, setFilterdData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [search, setSearch] = useState("");
  const [curStat, setCurStat] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([
    {
      id: "contact_name",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  useEffect(() => {
    fetchGlobal("/v1/booking").then((res) => {
      setData(res);
      setFilterdData(res);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (curStat) {
      const arr = [...data];
      const temp = arr.filter((item) => item.status === curStat);
      setFilterdData(temp);
    }
  }, [curStat]);

  const device = useDeviceType();

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Booking</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-5">
        {/* //! TABLE VIEW */}
        {(device === "tablet" || device === "desktop") && (
          <div>
            <h1 className="text-2xl">Booking Overview</h1>
            <p className="text-sm" style={{ margin: "0 !important" }}>
              Review details of the selected model's booking, including client
              info, schedule, and notes.
            </p>

            <div className="mb-5 mt-11">
              <FilterBook table={table} data={data} setData={setData} />
            </div>

            <div className="overflow-x-auto w-full rounded-lg border border-border bg-background mb-5">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent"
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            style={{ width: `${header.getSize()}px` }}
                            className="h-11"
                          >
                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                              <div
                                className={cn(
                                  header.column.getCanSort() &&
                                    "flex h-full cursor-pointer select-none items-center justify-between gap-2"
                                )}
                                onClick={header.column.getToggleSortingHandler()}
                                onKeyDown={(e) => {
                                  // Enhanced keyboard handling for sorting
                                  if (
                                    header.column.getCanSort() &&
                                    (e.key === "Enter" || e.key === " ")
                                  ) {
                                    e.preventDefault();
                                    header.column.getToggleSortingHandler()?.(
                                      e
                                    );
                                  }
                                }}
                                tabIndex={
                                  header.column.getCanSort() ? 0 : undefined
                                }
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: (
                                    <ChevronUp
                                      className="shrink-0 opacity-60"
                                      size={16}
                                      strokeWidth={2}
                                      aria-hidden="true"
                                    />
                                  ),
                                  desc: (
                                    <ChevronDown
                                      className="shrink-0 opacity-60"
                                      size={16}
                                      strokeWidth={2}
                                      aria-hidden="true"
                                    />
                                  ),
                                }[header.column.getIsSorted()] ?? null}
                              </div>
                            ) : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody
                  style={{
                    display: isLoading ? "" : "none",
                  }}
                >
                  {[...Array(10)].map((_, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-transparent">
                      {columns.map((_column, colIndex) => (
                        <td key={colIndex} className="py-4">
                          <div className="animate-pulse rounded-md bg-muted h-6 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </TableBody>

                <TableBody
                  style={{
                    display: isLoading ? "none" : "",
                  }}
                >
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="last:py-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No booking requests have been made yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <PaginationControls id={id} table={table} />
          </div>
        )}
        {/* //! TABLE VIEW */}

        {/* //! CARD VIEW */}
        {(device === "mobile" || device === "mobile-landscape") && (
          <div>
            {/* Sticky Navigation */}
            <div className="sticky top-1 z-10 bg-white p-2 shadow-lg rounded-md border border-gray-100">
              <Input
                placeholder="Search by Name..."
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Select className="">
                <SelectTrigger className="w-[150px] mt-2">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Option</SelectLabel>
                    {["incoming", "process", "reject", "done"].map(
                      (item, index) => (
                        <SelectItem
                          key={`option-${index}`}
                          onClick={() => setCurStat(item)}
                          value={item}
                        >
                          {item}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Cards Grid */}
            <div
              className={`grid ${
                device === "mobile" ? "grid-cols-1" : "grid-cols-2"
              }  gap-2 p-2 pb-20`}
            >
              {filterdData
                ?.filter((item) => item?.contact_name?.includes(search))
                .map((book, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{book.contact_name}</CardTitle>
                        <CardDescription>{book.email}</CardDescription>
                      </div>
                      <Badge variant="outline" className="gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${
                            book.status === "incoming"
                              ? "bg-yellow-500"
                              : book.status === "process"
                              ? "bg-blue-500"
                              : book.status === "reject"
                              ? "bg-red-500"
                              : book.status === "done"
                              ? "bg-green-500"
                              : ""
                          }`}
                          aria-hidden="true"
                        />
                        <span style={{ textTransform: "capitalize" }}>
                          {book.status}
                        </span>
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <p>Booking hour</p>
                          <p>{book.booking_hour}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p>Shoot date</p>
                          <p>{formatDateV1(book.shoot_date)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p>Changed by</p>
                          <p>{book?.User?.full_name || "-"}</p>
                        </div>
                        <div className="flex items-center justify-end">
                          <RowActions data={book} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {/* //! pagination */}
              <div
                className={`${
                  device === "mobile" ? "col-span-1" : "col-span-2"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mt-5">
                  <p
                    className="grow text-sm text-muted-foreground"
                    aria-live="polite"
                  >
                    Page <span className="text-foreground">1</span> of{" "}
                    <span className="text-foreground">10</span>
                  </p>
                  <Pagination className="w-auto">
                    <PaginationContent className="gap-3">
                      <PaginationItem>
                        <Button
                          variant="outline"
                          className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                          asChild
                        >
                          <a>Previous</a>
                        </Button>
                      </PaginationItem>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                          asChild
                        >
                          <a>Next</a>
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* //! CARD VIEW */}
      </div>
    </SidebarInset>
  );
}

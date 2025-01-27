"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  SquareChartGantt,
  Trash,
  Waypoints,
  CircleAlert,
  GitPullRequestClosed,
  CheckCheck,
} from "lucide-react";
import { formatDateV1, formatDateV2 } from "@/lib/format-date";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import fetchGlobal from "@/lib/fetch-data";

// Custom filter function for multi-column searching
const multiColumnFilterFn = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn = (row, columnId, filterValue) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId);
  return filterValue.includes(status);
};

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "contact_name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("contact_name")}</div>
    ),
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      let color = "blue";
      const status = row.getValue("status");
      return <Badge variant={status}>{status}</Badge>;
    },
    filterFn: statusFilterFn,
  },
  {
    header: "Booking Hour",
    accessorKey: "booking_hour",
  },
  {
    header: "Shoot Date",
    accessorKey: "shoot_date",
    size: 100,
    cell: ({ row }) => <div>{formatDateV1(row.getValue("shoot_date"))}</div>,
  },
  {
    header: "PIC",
    accessorKey: "User",
    size: 100,
    cell: ({ row }) => {
      const pic = row.getValue("User") || {};
      return <div>{pic.name || "-"}</div>;
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];

export default columns;

function RowActions({ row }) {
  console.log(row, "<<row");

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const status = row.getValue("status");

  const handleClickSelect = (event, type) => {
    event.preventDefault();
    setAction(type);
    setOpenDialog(true);
    setIsDropdownOpen(false);
  };

  const handleClickButton = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const bookingId = row.original.id;
      let endpoint;
      let options;
      setLoading(true);
      if (action === "delete") {
        endpoint = `/v1/booking/${bookingId}`;
        options = {
          method: "DELETE",
        };
      } else {
        endpoint = `/v1/booking/${bookingId}/status`;
        options = {
          method: "PATCH",
          body: JSON.stringify({ status: action }),
        };
      }

      const result = await fetchGlobal(endpoint, options, true);
      setLoading(false);
      setOpenDialog(false);
      console.log("Success:", result);
    } catch (error) {
      setLoading(false);
      setError(error?.message || "Some thing when wrong");
    }
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Edit item"
            >
              <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(event) => handleClickSelect(event, "detail")}
            >
              <span>View Detail</span>
              <DropdownMenuShortcut>
                <SquareChartGantt size="12px" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {status === "ongoing" && (
              <DropdownMenuItem
                className="focus:text-blue-500"
                onSelect={(event) => handleClickSelect(event, "process")}
              >
                <span>Process</span>
                <DropdownMenuShortcut>
                  <Waypoints size="12px" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
            {status === "process" && (
              <DropdownMenuItem
                className="focus:text-green-600"
                onSelect={(event) => handleClickSelect(event, "done")}
              >
                <span>Done</span>
                <DropdownMenuShortcut>
                  <CheckCheck size="12px" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
            {status !== "done" && (
              <DropdownMenuItem
                className="focus:text-destructive"
                onSelect={(event) => handleClickSelect(event, "reject")}
              >
                <span>Reject</span>
                <DropdownMenuShortcut>
                  <GitPullRequestClosed size="12px" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(event) => handleClickSelect(event, "delete")}
          >
            <span>Delete</span>
            <DropdownMenuShortcut>
              <Trash size="12px" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AlertDialog */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            {action === "delete" && (
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                aria-hidden="true"
              >
                <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
              </div>
            )}
            <AlertDialogHeader>
              <AlertDialogTitle>
                {(action === "delete" || action === "reject") &&
                  "Are you absolutely sure?"}
                {action !== "delete" && action !== "reject" && (
                  <span>
                    <b className="capitalize">{action}</b> Booking from:{" "}
                    {row.getValue("contact_name")}
                  </span>
                )}
              </AlertDialogTitle>
              {action !== "detail" && (
                <AlertDialogDescription>
                  {(action === "delete" || action === "reject") && (
                    <>
                      This action cannot be undone. This will permanently{" "}
                      <span className="text-destructive">{action}</span>{" "}
                      <span className="font-bold">
                        {row.getValue("contact_name")}'s
                      </span>{" "}
                      booking.
                    </>
                  )}
                  {(action === "process" || action === "done") && (
                    <>
                      This action will update the status booking to{" "}
                      <span
                        className={
                          action === "done" ? "text-green-500" : "text-blue-500"
                        }
                      >
                        {action}
                      </span>
                    </>
                  )}
                </AlertDialogDescription>
              )}
              {action === "detail" && (
                <div className="grid gap-2.5 mt-6 mb-6 text-sm">
                  <div className="flex">
                    <div className="w-32 flex justify-between font-bold">
                      Subject<span>:</span>
                    </div>
                    <div className="flex-1 pl-2">
                      The booking for{" "}
                      <span className="font-bold">
                        {row.getValue("contact_name")}
                      </span>{" "}
                      from the brand{" "}
                      <span className="font-bold">
                        {row?.original?.brand_name}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 flex justify-between font-bold">
                      Shoot Details<span>:</span>
                    </div>
                    <div className="flex-1 pl-2">
                      Scheduled for a{" "}
                      <span className="font-bold">
                        {row?.original?.booking_hour}
                      </span>{" "}
                      shoot on{" "}
                      <span className="font-bold">
                        {formatDateV2(row?.original?.shoot_date)}
                      </span>
                      , with the desired model{" "}
                      <span className="font-bold">
                        {row?.original?.desired_model}
                      </span>
                      .
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 flex justify-between font-bold">
                      Usage<span>:</span>
                    </div>
                    <div className="flex-1 pl-2">
                      The images will be used for{" "}
                      <span className="font-bold">{row?.original?.usages}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 flex justify-between font-bold">
                      Contact Information<span>:</span>
                    </div>
                    <div className="flex-1 pl-2">
                      <span className="font-bold">
                        {row?.original?.contact_name.split(" ")[0]}
                      </span>{" "}
                      can be contacted via WhatsApp at{" "}
                      <span className="font-bold">
                        {row?.original?.wa_number}
                      </span>{" "}
                      or email at{" "}
                      <span className="font-bold">{row?.original?.email}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 flex justify-between font-bold">
                      Status<span>:</span>
                    </div>
                    <div className="flex-1 pl-2">
                      The current status of the booking is{" "}
                      <span className="font-bold capitalize">{status}</span>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogHeader>
          </div>
          {error && (
            <p className="text-destructive text-end text-xs">{error}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpenDialog(false);
                setError("");
              }}
            >
              Cancel
            </AlertDialogCancel>

            {action !== "detail" && (
              <AlertDialogAction onClick={handleClickButton}>
                <span className="capitalize">
                  {loading ? "loading..." : action}
                </span>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

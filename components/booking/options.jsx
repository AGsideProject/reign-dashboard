"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
import { formatDateV2 } from "@/lib/format-date";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import fetchGlobal from "@/lib/fetch-data";

const RowActions = ({ data, row = {} }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const status = data.status;

  const handleClickSelect = (event, type) => {
    event.preventDefault();
    setAction(type);
    setOpenDialog(true);
    setIsDropdownOpen(false);
  };

  const handleClickButton = async (e) => {
    e.preventDefault();
    setError("");
    if (loading) return;
    try {
      const bookingId = data.id;
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
      if (result) {
        setLoading(false);
        setOpenDialog(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
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
            {status === "incoming" && (
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
          {status !== "done" && <DropdownMenuSeparator />}
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
                    {data.contact_name}
                  </span>
                )}
              </AlertDialogTitle>
              {action !== "detail" && (
                <AlertDialogDescription>
                  {(action === "delete" || action === "reject") && (
                    <>
                      This action cannot be undone. This will permanently{" "}
                      <span className="text-destructive">{action}</span>{" "}
                      <span className="font-bold">{data.contact_name}'s</span>{" "}
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
                      <span className="font-bold">{data.contact_name}</span>{" "}
                      from the brand{" "}
                      <span className="font-bold">{data.brand_name}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 flex justify-between font-bold">
                      Shoot Details<span>:</span>
                    </div>
                    <div className="flex-1 pl-2">
                      Scheduled for a{" "}
                      <span className="font-bold">{data.booking_hour}</span>{" "}
                      shoot on{" "}
                      <span className="font-bold">
                        {formatDateV2(data.shoot_date)}
                      </span>
                      , with the desired model{" "}
                      <span className="font-bold">{data.desired_model}</span>.
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 flex justify-between font-bold">
                      Usage<span>:</span>
                    </div>
                    <div className="flex-1 pl-2">
                      The images will be used for{" "}
                      <span className="font-bold">{data.usages}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 flex justify-between font-bold">
                      Contact Information<span>:</span>
                    </div>
                    <div className="flex-1 pl-2">
                      <span className="font-bold">
                        {data.contact_name.split(" ")[0]}
                      </span>{" "}
                      can be contacted via WhatsApp at{" "}
                      <span className="font-bold">{data.wa_number}</span> or
                      email at <span className="font-bold">{data.email}</span>
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
};

export default RowActions;

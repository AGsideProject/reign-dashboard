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
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";

const AlertComponentDeleteUser = ({
  openDialog,
  setOpenDialog,
  handleClick,
  isLoading,
  error,
  setError,
}) => {
  const handleClose = () => {
    setOpenDialog(false);
    setError("");
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={handleClose}>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this account? All this account
              access will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        {error && (
          <div className="text-destructive text-end text-sm">{error}</div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            {isLoading ? "Loading..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertComponentDeleteUser;

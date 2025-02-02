import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import fetchGlobal from "@/lib/fetch-data";
import { useToast } from "@/hooks/use-toast";

const InstagramSycModal = ({
  openDialog,
  setOpenDialog,
  data,
  reFetch,
  isReplace,
}) => {
  const { toast } = useToast();
  // Initialize state
  const [error, setError] = useState("error bang");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleClose = () => {
    if (!loading) setOpenDialog(false);
    setError("");
  };

  // handle sycn ig
  const handleSyncInstagram = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetchGlobal(
        "/v1/model/instgaram/synchronize",
        {
          method: "POST",
          body: JSON.stringify({
            model_id: data.model_id,
            username: data.username,
          }),
        },
        true
      );

      if (response.status == 200) {
        setLoading(false);
        setOpenDialog(false);
        toast({
          title: "Get instagram posts success",
          description: "instagram assets now available on models page",
          variant: "default",
          className: "bg-emerald-50 text-black",
        });
        reFetch();
      }
    } catch (error) {
      console.error("Error Sync Instagram model:", error);
      setLoading(false);
      toast({
        title: "Filed to synchronize posts",
        description:
          "It may because the model's username does not exist or is private",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let interval;
    if (loading) {
      setTimer(0);
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <Dialog open={openDialog} onOpenChange={handleClose}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-start mb-2">
              Sync <i>@{data.username}</i> instagram posts to {data.slug}
            </DialogTitle>
            <DialogDescription className="sm:text-start">
              {isReplace ? (
                <>
                  The current instagram assets not empty! by press{" "}
                  <b>Sycn Anyway</b> the action, you will <b>srapping</b> new{" "}
                  <b>instagram</b> posts of{" "}
                  <b className="text-black">'{data.username}'</b> account, and
                  you will lost the previous posts. this action{" "}
                  <span className="text-red-600">cannot be undone</span>.
                </>
              ) : (
                <>
                  Retrieve Instagram posts from the{" "}
                  <b className="text-black">'{data.username}'</b> account.
                  Ensure that the username is accurate and currently the account
                  is set to public.
                </>
              )}
            </DialogDescription>
            {loading && (
              <div className="pt-3">
                <div className="flex flex-col border-[1px] border-gray-300 rounded-md px-2 py-1 text-[11px] leading-[13px] w-[50%] text-gray-600">
                  <b>Attention:</b>
                  <p>Sync is in progress. This may take a while.</p>
                  <p>
                    It usually takes around <b>1 minute</b>. Please{" "}
                    <b> do not close</b> this tab.
                  </p>
                </div>
              </div>
            )}
          </DialogHeader>
        </div>
        <div className="flex justify-end flex-col items-end">
          <div>
            <Button
              disabled={loading}
              onClick={handleSyncInstagram}
              className={
                isReplace ? "hover:text-red-500" : "hover:text-purple-700"
              }
            >
              {loading
                ? `Syncing... (${timer}s)`
                : isReplace
                ? "Sycn Anyway"
                : "Sync Now"}
            </Button>
            {loading && <div className="loaderV4" />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default InstagramSycModal;

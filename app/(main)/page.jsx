"use client";
import { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  BetweenVerticalStart,
  Flame,
  Focus,
  Fullscreen,
  HandCoins,
  Library,
  LibraryBig,
  Loader2,
  Send,
  SquareLibrary,
  Trash2,
  Trophy,
} from "lucide-react";
import fetchGlobal from "@/lib/fetch-data";
import { useToast } from "@/hooks/use-toast";
import { formatDateV1 } from "@/lib/format-date";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { toast } = useToast();
  const inputRef = useRef(null);
  // Initialize state
  const [dataStat, setDataStat] = useState();
  const [dataModel, setDataModel] = useState();
  const [dataBooks, setDataBooks] = useState();
  const [image, setImage] = useState("");
  const [imageInit, setImageInit] = useState("");
  const [error, setError] = useState("");
  const [fileImage, setFileImage] = useState();
  const [loading, setLoading] = useState(false);
  const [curIdx, setCurIdx] = useState(1);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFileImage(file);
      setImage(imageUrl);
    }
  };

  const resetImage = () => {
    setFileImage("");
    setImage("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const fetchImage = () => {
    fetchGlobal("/v1/assets/landingpage").then((res) => {
      setImageInit(`${process.env.NEXT_PUBLIC_API_BASE_URL}${res?.img_url}`);
      setCurIdx(res.id);
    });
  };

  const handleUploadNewCover = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("image_file", fileImage);
    formData.append("type", "landingpage");
    formData.append("order", 1);
    formData.append("model_id", 0);
    formData.append("orientation", "landscape");
    formData.append("status", "active");

    try {
      await fetchGlobal(
        `/v1/assets/admin/${curIdx}`,
        {
          method: "PUT",
          body: formData,
          contentType: "form-data",
        },
        true
      );

      setLoading(false);
      fetchImage();
      toast({
        title: "New Cover LP Updated",
        description: "Update successfull! look new landing page cover",
        variant: "default",
        className: "bg-emerald-50 text-black",
      });

      setTimeout(() => {
        resetImage();
      }, 1500);
    } catch (error) {
      setLoading(false);
      setError(error?.message || "Some thing when wrong");
    }
  };

  useEffect(() => {
    fetchGlobal("/v1/model/admin/stat").then((res) => {
      setDataStat(res.statistics);
      setDataBooks(res.recentBookings);
      setDataModel(res.topModel);
    });

    fetchImage();
  }, []);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {!dataStat && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <div className="h-[300px] rounded-xl bg-muted/50" />
            <div className="h-[300px] rounded-xl bg-muted/50" />
            <div className="h-[300px] rounded-xl bg-muted/50" />
            <div className="h-[300px] rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      )}

      {dataStat && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
            <div
              className="bg-white rounded-xl min-h-[300px] pt-5 px-3 flex flex-col items-center shadow-xl"
              onClick={() => router.push("/models")}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-[#bebebe] flex items-center justify-center ">
                <Trophy />
              </div>
              <p className="text-center text-white mb-3 mt-3 font-medium">
                Top Popular Model
              </p>

              {dataModel?.map((model, idx) => (
                <div
                  key={idx + "model"}
                  className="flex items-center relative mb-6 w-full"
                >
                  <p className="h-11 w-11 absolute bg-white flex justify-center items-center">
                    {idx + 1}
                  </p>
                  <p className="bg-white py-1 pl-5 flex-1 h-8 ml-8 flex justify-between items-center pr-2">
                    {model.name} {idx == 0 && <Flame color="red" />}
                  </p>
                  <p className="bg-white py-1 px-3 h-8 ml-2">
                    {model.totalBook}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="bg-white shadow-xl rounded-xl py-5 px-3 items-center flex flex-col relative"
              onClick={() => router.push("/booking")}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-[#bebebe] flex items-center justify-center shadow-xl mb-4">
                <BetweenVerticalStart />
              </div>
              <p className="text-5xl font-bold">{dataStat.incoming}</p>
              <p className="text-gray-600 mt-2">Incoming Boooking</p>

              {dataBooks?.incoming && dataBooks.incoming && (
                <p className="bg-[#bebebe] text-[11px] px-2 py-1 rounded-lg mt-1 mb-3">
                  {formatDateV1(dataBooks?.incoming[0]?.updatedAt)}
                </p>
              )}

              {dataBooks?.incoming.map((book, idx) => (
                <div
                  key={idx + "incoming"}
                  className="flex items-center w-full mt-2"
                >
                  <p className=" bg-muted/50 px-3 text-gray-700 rounded-lg text-[12px]">
                    {book.contact_name}
                  </p>
                </div>
              ))}

              {dataBooks?.incoming && dataBooks.incoming.length > 1 && (
                <div className="flex items-center w-full mt-2">
                  <p className=" bg-muted/50 px-3 text-gray-700 rounded-lg text-[12px]">
                    ....
                  </p>
                </div>
              )}
            </div>

            <div
              className="bg-white shadow-xl rounded-xl py-5 px-3 items-center flex flex-col relative"
              onClick={() => router.push("/booking")}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-[#bebebe] flex items-center justify-center shadow-xl mb-4">
                <Focus />
              </div>
              <p className="text-5xl font-bold">{dataStat.process}</p>
              <p className="text-gray-600 mt-2">On Progress</p>

              {dataBooks?.process && dataBooks.process && (
                <p className="bg-[#bebebe] text-[11px] px-2 py-1 rounded-lg mt-1 mb-3">
                  {formatDateV1(dataBooks?.process[0]?.updatedAt)}
                </p>
              )}

              {dataBooks?.process.map((book, idx) => (
                <div
                  key={idx + "process"}
                  className="flex items-center w-full mt-2"
                >
                  <p className=" bg-muted/50 px-3 text-gray-700 rounded-lg text-[12px]">
                    {book.contact_name}
                  </p>
                </div>
              ))}

              {dataBooks?.process && dataBooks.process.length > 1 && (
                <div className="flex items-center w-full mt-2">
                  <p className=" bg-muted/50 px-3 text-gray-700 rounded-lg text-[12px]">
                    ....
                  </p>
                </div>
              )}

              {/* <div className="absolute bottom-5 right-5">
                <LibraryBig />
              </div> */}
            </div>

            <div
              className="bg-white shadow-xl rounded-xl py-5 px-3 items-center flex flex-col relative"
              onClick={() => router.push("/booking")}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-[#bebebe] flex items-center justify-center shadow-xl mb-4">
                <HandCoins />
              </div>
              <p className="text-5xl font-bold">{dataStat.done}</p>
              <p className="text-gray-600 mt-2">Completed Shoot</p>
              <p className="bg-[#bebebe] text-[11px] px-2 py-1 rounded-lg mt-1 mb-3 text-center">
                {new Date().getFullYear()}
              </p>

              {dataBooks?.done.map((book, idx) => (
                <div
                  key={idx + "done"}
                  className="flex items-center w-full mt-2"
                >
                  <p className=" bg-muted/50 px-3 text-gray-700 rounded-lg text-[12px]">
                    {book.contact_name}
                  </p>
                </div>
              ))}

              {dataBooks?.done && dataBooks.done.length > 1 && (
                <div className="flex items-center w-full mt-2">
                  <p className=" bg-muted/50 px-3 text-gray-700 rounded-lg text-[12px]">
                    ....
                  </p>
                </div>
              )}

              {/* <div className="absolute bottom-5 right-5">
                <SquareLibrary />
              </div> */}
            </div>
          </div>

          <p className="text-xs text-destructive">{error}</p>

          {/* Image */}
          <div className="w-full aspect-[16/9] rounded-xl bg-muted overflow-hidden relative shadow-xl">
            {(imageInit || image) && (
              <img
                src={image || imageInit}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-xl"
              />
            )}

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              name="image_file"
              className="hidden"
              ref={inputRef}
              onChange={handleImageChange}
            />

            <button
              htmlFor="imageUpload"
              onClick={() =>
                fileImage
                  ? handleUploadNewCover()
                  : document.getElementById("imageUpload").click()
              }
              className="absolute top-5 right-5 bg-white p-2 rounded-full shadow-md"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : fileImage ? (
                <Send />
              ) : (
                <Fullscreen />
              )}
            </button>

            {fileImage && !loading && (
              <button
                onClick={resetImage}
                className="absolute top-[75px] right-5 bg-white p-2 rounded-full shadow-md"
              >
                <Trash2 color="red" />
              </button>
            )}
          </div>
          <p className="mt-5 mb-2 text-sm text-gray-500">
            COPYRIGHT © {new Date().getFullYear()} REIGN
          </p>
        </div>
      )}
    </SidebarInset>
  );
};

export default Dashboard;

"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Archive,
  BookDashed,
  Loader2,
  MoreHorizontal,
  PlusIcon,
  SaveAll,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import fetchGlobal from "@/lib/fetch-data";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import InstagramSycModal from "@/components/modelDialog/instagram-sinc-modal";
import reignLogo from "@/public/images/reignLogo.jpg";

export default function ModelDetailPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [tabsValue, setTabsValue] = useState("carousel");
  const [loading, setLoading] = useState(false);
  const [imagesUpdate, setImagesUpdate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [curPortrait, setCurPortrait] = useState(0);

  const model = searchParams.get("model");
  const model_id = searchParams.get("id");
  const username = searchParams.get("ig_username");

  const tabs = ["carousel", "polaroid", "instagram"];

  //! untuk handle dropdown menu di setiap photo
  const [openStates, setOpenStates] = useState({});

  const handleOpenChange = (index, isOpen) => {
    setOpenStates((prev) => ({
      ...prev,
      [index]: isOpen,
    }));
  };
  const [assetSheet, setAssetSheet] = useState(false);
  //! untuk handle dropdown menu di setiap photo

  //! ini state buat isi options pas change photo position manual
  const [photoPositionOptions, setPhotoPositionOptions] = useState([]);

  //! INI STATE DAN FUNCTION BUAT HANDLE ADD PHOTOS PORTRAIT DAN LANDSCAPE

  const [selectedPhotosPortrait, setSelectedPhotosPortrait] = useState([]);
  const [selectedPhotosLandscape, setSelectedPhotosLandscape] = useState([]);
  const [isExeeded, setIsExeeded] = useState(false);

  useEffect(() => {
    const merge = [...selectedPhotosLandscape, ...selectedPhotosPortrait];
    const filterPhoto = merge.filter((item) => item.file.size > 10_000_000);
    setIsExeeded(filterPhoto.length > 0);
  }, [selectedPhotosPortrait, selectedPhotosLandscape]);
  const handlePhotoSelectionPortrait = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => {
      return {
        file,
        preview: URL.createObjectURL(file),
      };
    });

    setSelectedPhotosPortrait((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };
  const handleDeletePhotoPortrait = (index) => {
    setSelectedPhotosPortrait((prevPhotos) =>
      prevPhotos.filter((_, i) => i !== index)
    );
  };

  const handlePhotoSelectionLandscape = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => {
      return {
        file,
        preview: URL.createObjectURL(file),
      };
    });

    setSelectedPhotosLandscape((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDeletePhotoLandscape = (index) => {
    setSelectedPhotosLandscape((prevPhotos) =>
      prevPhotos.filter((_, i) => i !== index)
    );
  };

  const handleAssetsSheetChange = (isOpen) => {
    setAssetSheet(isOpen);
    if (!isOpen) {
      setSelectedPhotosLandscape([]);
      setSelectedPhotosPortrait([]);
      setIsExeeded(false);
    }
  };
  //! INI STTE DAN FUNCTION BUAT HANDLE ADD PHOTOS PORTRAIT DAN LANDSCAPE

  const [uploadCount, setUploadCount] = useState(0);

  const handleSubmitAssets = async (e) => {
    let successCount = 0;
    let failureCount = 0; // To track failed uploads
    const totalUploads =
      selectedPhotosPortrait.length + selectedPhotosLandscape.length; // Total uploads

    e.preventDefault();
    setLoading(true); // Set loading to true when starting the uploads

    const dataPortrait = selectedPhotosPortrait.map((item) => {
      return {
        image_file: item.file,
        type: tabsValue === "carousel" ? "carousel" : "polaroid",
        model_id: Number(model_id),
        orientation: "portrait",
        status: "active",
      };
    });

    const dataLandscape = selectedPhotosLandscape.map((item) => {
      return {
        image_file: item.file,
        type: tabsValue === "carousel" ? "carousel" : "polaroid",
        model_id: Number(model_id),
        orientation: "landscape",
        status: "active",
      };
    });

    const mergeData = [...dataPortrait, ...dataLandscape];

    for (const data of mergeData) {
      const formData = new FormData();
      formData.append("image_file", data.image_file);
      formData.append("type", data.type);
      formData.append("model_id", data.model_id);
      formData.append("orientation", data.orientation);
      formData.append("status", data.status);

      try {
        const dataGlobal = await fetchGlobal(
          "/v1/assets/admin",
          {
            method: "POST",
            body: formData,
            contentType: "form-data",
          },
          true
        );

        successCount++;
        setUploadCount(successCount);
      } catch (error) {
        console.error("Upload failed: ", error);
        failureCount++;
      }

      if (successCount + failureCount === totalUploads) {
        setLoading(false); // Set loading to false when all uploads are finished
        setAssetSheet(false);
        setSelectedPhotosLandscape([]);
        setSelectedPhotosPortrait([]);
        fetchModelAsset();
        setUploadCount(0);
        if (successCount === totalUploads) {
          toast({
            title: "Photo Frenzy Complete! 📸",
            description:
              "Boom! All your photos are up and ready to rock. Consider this gallery officially live!",
            variant: "default",
          });
          // Single success toast if all uploads succeed
        } else if (failureCount === totalUploads) {
          toast({
            title: "Upload Malfunction! 🤖",
            description:
              "The upload robot had a glitch. Your photos decided to take a break. Refresh and let's try again!",
            variant: "destructive",
          });
          // Single error toast if all uploads fail
        } else {
          toast({
            title: "Uploads Complete!",
            description: `${successCount} photos are in, ${failureCount} need another go.`,
          });
          // Mixed result toast
        }
      }
    }
  };

  const [changeOrderDialog, setChangeOrderDialog] = useState(false);

  //! function to handle bulk position update
  async function saveFinalPhotosPosition() {
    const body = filteredAsset.map((item, index) => {
      return {
        id: item.id,
        order: item.order,
      };
    });

    setLoading(true);
    try {
      await fetchGlobal(
        "/v1/assets/admin/bulk-order",
        {
          method: "PATCH",
          body: JSON.stringify({ assets: body }),
        },
        true
      );

      setLoading(false);
      toast({
        title: "Photos in Perfect Position! 📸✨",
        description:
          "Success! Your photos are now perfectly arranged like a well-organized gallery. Sit back, relax, and enjoy the view!",
        variant: "default",
      });

      fetchModelAsset();
    } catch (error) {
      console.error("Error saving changes", error);
      setLoading(false);

      toast({
        title: "Photos Gone Wild! 🏃‍♂️",
        description:
          "Oops! We tried to organize your photos, but they've escaped the system and are running wild. Try again, and let's tame them!",
        variant: "destructive",
      });
    }
  }

  const [currentImagePosition, setCurrentImagePosition] = useState({
    assetId: 0,
    currenctOrder: 0,
  });

  //! function untuk handle photo position manual
  const handleChangePhotoPosition = (item, index) => {
    setChangeOrderDialog(true);
    setCurrentImagePosition({
      assetId: item.id,
      currenctOrder: Number(index + 1),
    });
  };

  const [newPhotoPosition, setNewPhotoPosition] = useState("");

  //! change position photo manual
  const handleSubmitChangePosition = async (e) => {
    e.preventDefault();

    const bodyTest = filteredAsset[newPhotoPosition - 1].order;

    setLoading(true);
    try {
      await fetchGlobal(
        `/v1/assets/admin/${currentImagePosition.assetId}/order`,
        { method: "PATCH", body: JSON.stringify({ order: Number(bodyTest) }) },
        true
      );

      toast({
        title: "Photos in Perfect Position! 📸✨",
        description:
          "Success! Your photos are now perfectly arranged like a well-organized gallery. Sit back, relax, and enjoy the view!",
      });

      setLoading(false);
      fetchModelAsset();
      setNewPhotoPosition("");
      // setFormData(initialForm);
    } catch (error) {
      console.error("Error saving changes", error);
      setLoading(false);
      fetchModelAsset();
      setNewPhotoPosition("");
      toast({
        title: "Photos Gone Wild! 🏃‍♂️",
        description:
          "Oops! We tried to organize your photos, but they've escaped the system and are running wild. Try again, and let's tame them!",
        variant: "destructive",
      });
    }
    setChangeOrderDialog(false);
  };

  //! =========================== REIGN API ===========================
  const [modelAssetList, setModelAssetList] = useState({});
  const [filteredAsset, setFilteredAsset] = useState();

  useEffect(() => {
    fetchModelAsset();
  }, []);

  //! useEffect untuk filter asset based on tabs
  useEffect(() => {
    if (tabsValue === "carousel") {
      const temp = modelAssetList?.carousel?.filter(
        (item) => item.status === "active"
      );
      const tempv2 =
        modelAssetList?.carousel?.filter(
          (item) => item.status === "active" && item.orientation === "portrait"
        ) || [];
      setFilteredAsset(temp);
      setCurPortrait(tempv2.length);
    } else if (tabsValue === "polaroid") {
      setFilteredAsset(
        modelAssetList?.polaroid?.filter((item) => item.status === "active")
      );
    } else if (tabsValue === "instagram") {
      setFilteredAsset(
        modelAssetList?.instagram?.filter((item) => item.status === "active")
      );
    } else if (tabsValue === "archive-carousel") {
      setFilteredAsset(
        modelAssetList?.carousel?.filter((item) => item.status === "inactive")
      );
    } else if (tabsValue === "archive-polaroid") {
      setFilteredAsset(
        modelAssetList?.polaroid?.filter((item) => item.status === "inactive")
      );
    } else if (tabsValue === "archive-instagram") {
      setFilteredAsset(
        modelAssetList?.instagram?.filter((item) => item.status === "inactive")
      );
    }

    setImagesUpdate(false);
  }, [tabsValue, modelAssetList]);

  //! useEffect buat watch options pas manual change photo position
  useEffect(() => {
    if (tabsValue === "carousel") {
      const options = filteredAsset?.map((item, index) => {
        let _index = index + 1;
        return {
          value: _index.toString(),
        };
      });

      setPhotoPositionOptions(options || []);
    } else if (tabsValue === "polaroid") {
      const options = filteredAsset?.map((item, index) => {
        let _index = index + 1;
        return {
          value: _index.toString(),
        };
      });

      setPhotoPositionOptions(options || []);
    }
  }, [currentImagePosition]);

  //! INI FUNCTION BARU BUAT DRAG IMAGE
  const dragImage_reignApi = useRef(0);
  const draggedOverImage_reignApi = useRef(0);
  const [draggingStyle_reignApi, setDraggingStyle_reignApi] = useState({
    display: "none",
  });

  function handleSortImage_reignApi() {
    const imageClone = [...filteredAsset];
    const temp = imageClone[dragImage_reignApi.current];
    imageClone[dragImage_reignApi.current] =
      imageClone[draggedOverImage_reignApi.current];
    imageClone[draggedOverImage_reignApi.current] = temp;

    const updatedImage = imageClone.map((image, index) => ({
      ...image,
      order: index + 1,
    }));

    setFilteredAsset(updatedImage);
    setDraggingStyle_reignApi({ display: "none" }); // Hide the ghost element
    setImagesUpdate(true); //! flaggin untuk tombol save latest sort
  }

  //! function untuk fetch model asset
  const fetchModelAsset = async () => {
    setLoading(true);
    try {
      const dataGlobal = await fetchGlobal(`/v1/assets/admin/${model_id}`);

      setModelAssetList(dataGlobal);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Mission: Fetch Image - FAILED 🎬",
        description:
          "We sent out a request for the model's asset, but it never made it back. We suspect foul play... or just bad internet!",
        variant: "destructive",
      });
    }
  };

  //! function untuk update status asset
  const handleStatusChange = async (status, id) => {
    let newStatus = status === "active" ? "inactive" : "active";
    try {
      const _formBody = new URLSearchParams();
      _formBody.append("status", newStatus);

      await fetchGlobal(
        `/v1/assets/admin/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        },
        true
      );

      toast({
        title:
          newStatus === "active"
            ? "Lights, Camera, Action! 🎥"
            : "Going Incognito 🕶️",
        description:
          newStatus === "active"
            ? "The model photo is now live and ready to steal the spotlight!"
            : "This model asset just vanished from the public eye. Shhh... it's top secret now!",
        variant: "default",
      });
      fetchModelAsset();
    } catch (error) {
      console.error("Error saving changes", error);
      toast({
        title: "Asset Update? More Like Asset Oops! 😬",
        description:
          "We tried updating the model's photo, but it's playing hard to get. Try again, or maybe bribe it with a filter!",
        variant: "destructive",
      });

      fetchModelAsset();
    }
  };

  const [deleteDialogAsset, setDeleteDialogAsset] = useState(false);
  const [assetId, setAssetId] = useState(0);

  //! handle sebelum delete
  const handleDeleteAsset = (asset) => {
    setDeleteDialogAsset(true);
    setAssetId(asset.id);
  };

  //! function delete asset ke db
  const deleteAsset = async () => {
    try {
      setLoading(true);

      await fetchGlobal(
        `/v1/assets/admin/${assetId}`,
        {
          method: "DELETE",
        },
        true
      );

      toast({
        title: "Buh-Bye! 👋",
        description: "That asset off to the digital afterlife.",
        variant: "default", // You can use "destructive" for error messages
        className: "bg-emerald-50 text-black",
      });
      setLoading(false);
      // fetchReignModels();
      fetchModelAsset();
      setDeleteDialogAsset(false);
      setAssetId(0);
      // setFormData(initialForm);
    } catch (error) {
      console.error("Error deleting model:", error);
      toast({
        title: "Asset Says NOPE! 🚫",
        description:
          "We tried deleting it, but it fought back. This one's got a survival instinct! Try again?",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/models">Models</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink>Assets</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{model}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="first-letter:uppercase">
                    {tabsValue}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Tabs
            defaultValue={tabsValue}
            className="mt-2"
            onValueChange={(value) => setTabsValue(value)}
            value={tabsValue}
          >
            <div className="flex justify-between mb-1">
              <TabsList>
                <TabsTrigger
                  value="carousel"
                  onClick={() => setTabsValue("carousel")}
                >
                  Carousel
                </TabsTrigger>
                <TabsTrigger
                  value="polaroid"
                  onClick={() => setTabsValue("polaroid")}
                >
                  Polaroid
                </TabsTrigger>
                <TabsTrigger
                  value="instagram"
                  onClick={() => setTabsValue("instagram")}
                >
                  Instagram
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center">
                {imagesUpdate && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="mr-2"
                          onClick={saveFinalPhotosPosition}
                          disabled={loading}
                        >
                          {loading && <Loader2 className="animate-spin" />}
                          <SaveAll />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 rounded-xl px-3 py-1 mb-3 text-white text-sm">
                        <p>Save</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="mr-2"
                        onClick={() => setTabsValue(`archive-${tabsValue}`)}
                      >
                        <Archive />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 rounded-xl px-3 py-1 mb-3 text-white text-sm">
                      <p>Archive</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {tabsValue === "instagram" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="mr-2 hover:text-red-500"
                          onClick={() => setOpenModal(true)}
                        >
                          <Activity />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 rounded-xl px-3 py-1 mb-3 text-white text-sm">
                        <p>Sync instagram posts</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {tabsValue !== "instagram" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleAssetsSheetChange}
                        >
                          <PlusIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 rounded-xl px-3 py-1 mb-3 text-white text-sm">
                        <p>Add assets</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <p
              className={`${
                curPortrait % 2 !== 0 && tabsValue === "carousel"
                  ? "bg-red-500"
                  : "bg-white"
              } mb-1 text-white py-1 text-sm text-center`}
            >
              For a better display, do not upload an odd number of 'portrait'
              assets. | <b>Current Portrait: {curPortrait}</b>
            </p>

            <TabsContent value={tabsValue}>
              <div className="relative">
                {filteredAsset && !filteredAsset.length && !loading && (
                  <div className="text-center flex w-full justify-center gap-2 h-[50vh] items-center">
                    <p className="text-gray-500">no {tabsValue} data</p>{" "}
                    <BookDashed color="grey" />
                  </div>
                )}

                <div className="grid auto-rows-min gap-2 grid-cols-3 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
                  {/* //! ini yang paling baru draggable */}

                  {filteredAsset &&
                    filteredAsset?.map((item, index) => (
                      <div
                        className="bg-muted/50 shadow-lg border border-gray-100"
                        key={index}
                        draggable={tabs.includes(tabsValue)}
                        onDragStart={() => {
                          if (tabs.includes(tabsValue)) {
                            dragImage_reignApi.current = index;
                          }
                        }}
                        onDragEnter={() => {
                          if (tabs.includes(tabsValue)) {
                            draggedOverImage_reignApi.current = index;
                          }
                        }}
                        onDragEnd={(e) => {
                          if (tabs.includes(tabsValue)) {
                            handleSortImage_reignApi(e);
                          }
                        }}
                        onDragOver={(e) => {
                          if (tabs.includes(tabsValue)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <div className="aspect-square relative m-2">
                          {/* Placeholder image */}
                          <Image
                            src={reignLogo}
                            alt="reign models"
                            fill={true}
                            placeholder="blur"
                            className="object-cover"
                            style={{ zIndex: 1 }}
                          />
                          {/* Real Image */}
                          <Image
                            src={`${item.img_url}?${Date.now()}`}
                            alt="asset image"
                            fill={true}
                            priority
                            className="object-cover "
                            style={{ zIndex: 2 }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between min-h-min pb-1 mx-2">
                          <span className="text-xs font-semibold">
                            {item.orientation === "portrait" ? "P" : "L"}
                          </span>

                          <DropdownMenu
                            open={openStates[index] || false}
                            onOpenChange={(isOpen) =>
                              handleOpenChange(index, isOpen)
                            }
                          >
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[200px]"
                            >
                              <DropdownMenuLabel>Options</DropdownMenuLabel>
                              <DropdownMenuGroup>
                                {(tabsValue === "polaroid" ||
                                  tabsValue === "carousel") && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleChangePhotoPosition(item, index)
                                    }
                                  >
                                    Change position
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(item.status, item.id)
                                  }
                                >
                                  {item.status === "active"
                                    ? "Archive"
                                    : "Show"}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteAsset(item)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  {/* //! ini yang paling baru draggable */}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* //! add carousel photos */}
        <Sheet open={assetSheet} onOpenChange={handleAssetsSheetChange}>
          <SheetContent className="md:max-w-full ">
            <SheetHeader>
              <SheetTitle className="first-letter:uppercase">
                {tabsValue}
              </SheetTitle>
            </SheetHeader>
            <SheetDescription>
              The uploaded photo must not exceed 10MB in size. Larger files will
              not be accepted.
              <br />
              {isExeeded && (
                <span className="text-red-500">
                  Some photos exceed the maximum allowed size of 10MB. Please
                  reduce the file size or choose a different image.
                </span>
              )}
            </SheetDescription>

            <form
              onSubmit={handleSubmitAssets}
              className="overflow-y-auto max-h-[100vh] pb-52"
            >
              <div className="grid grid-cols-2 gap-4 py-4 px-2">
                {/* Portrait Section */}
                <div>
                  <Label
                    htmlFor="portrait"
                    className="block mb-2 text-sm font-medium"
                  >
                    Portrait ({selectedPhotosPortrait.length})
                  </Label>
                  <Input
                    id="portrait"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelectionPortrait}
                    className="block w-full text-sm border rounded-lg cursor-pointer"
                  />
                  {selectedPhotosPortrait.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {selectedPhotosPortrait.map((photo, index) => (
                        <div key={index} className="relative rounded-sm border">
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 rounded-full w-6 h-6"
                            onClick={() => handleDeletePhotoPortrait(index)}
                          >
                            <X />
                          </Button>
                          <img
                            src={photo.preview}
                            alt={`Preview ${index + 1}`}
                            className={`object-cover aspect-[3/4] rounded-sm ${
                              photo?.file?.size > 10000000
                                ? "border-red-500 border-2"
                                : "border-none"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Landscape Section */}
                <div>
                  <Label
                    htmlFor="landscape"
                    className="block mb-2 text-sm font-medium"
                  >
                    Landscape ({selectedPhotosLandscape.length})
                  </Label>
                  <Input
                    id="landscape"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelectionLandscape}
                    className="block w-full text-sm border rounded-lg cursor-pointer"
                  />
                  {selectedPhotosLandscape.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {selectedPhotosLandscape.map((photo, index) => (
                        <div
                          key={index}
                          className="relative bg-muted/50 rounded-sm"
                        >
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 rounded-full w-6 h-6"
                            onClick={() => handleDeletePhotoLandscape(index)}
                          >
                            <X />
                          </Button>
                          <img
                            src={photo.preview}
                            alt={`Preview ${index + 1}`}
                            className={`object-cover aspect-video rounded-sm ${
                              photo?.file?.size > 10000000
                                ? "border-red-500 border-2"
                                : "border-none"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              Uploaded: {uploadCount} /{" "}
              {selectedPhotosPortrait.length + selectedPhotosLandscape.length}
              <SheetFooter>
                {!isExeeded && (
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="animate-spin" />}
                    Save photos
                  </Button>
                )}
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
        {/* //! add carousel photos */}

        {/* //! dialog change photo position */}
        <Dialog open={changeOrderDialog} onOpenChange={setChangeOrderDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change photo position</DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>
            <form onSubmit={handleSubmitChangePosition}>
              <div className="grid grid-cols-2 gap-4 py-4">
                {/* Current Position */}
                <div className="">
                  <Label htmlFor="currentPosition" className="text-right">
                    Current position
                  </Label>
                  <Input
                    id="currentPosition"
                    value={currentImagePosition.currenctOrder}
                    disabled
                    className="col-span-3"
                  />
                </div>
                {/* Change Position */}
                <div className="">
                  <Label htmlFor="username" className="text-right">
                    Change position to
                  </Label>
                  <Select
                    onValueChange={setNewPhotoPosition}
                    value={newPhotoPosition}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={"Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      {photoPositionOptions.map((item, index) => (
                        <SelectItem
                          value={item.value}
                          key={index}
                          disabled={
                            Number(item.value) ===
                            Number(currentImagePosition.currenctOrder)
                          }
                        >
                          {item.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Save Button */}
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* //! dialog change photo position */}

        {/* //! Dialog delete model */}
        <AlertDialog
          open={deleteDialogAsset}
          onOpenChange={setDeleteDialogAsset}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                model and remove your model data from the server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <Button
                variant="destructive"
                type="button"
                disabled={loading}
                onClick={deleteAsset}
              >
                {loading && <Loader2 className="animate-spin" />}
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* //! Dialog delete model */}
      </SidebarInset>

      {/* Sycn modal */}
      <InstagramSycModal
        openDialog={openModal}
        setOpenDialog={setOpenModal}
        data={{ model_id: model_id, username: username, slug: model }}
        reFetch={fetchModelAsset}
        isReplace={modelAssetList && modelAssetList.instagram}
      />
    </>
  );
}

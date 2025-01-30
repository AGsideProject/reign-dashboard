"use client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Archive,
  Loader2,
  LucideSave,
  MoreHorizontal,
  Plus,
  PlusCircle,
  PlusIcon,
  Save,
  SaveAll,
  SaveIcon,
  Trash,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import Image from "next/image";
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
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
const accToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwYjY2OWYyLWYyZjAtNDBhMi1iZTA3LTBjNzVhNWM1ZjgxYiIsImVtYWlsIjoiYWxkb21hcmNlbGlubzAxQGdtYWlsLmNvbSIsImlhdCI6MTczODIzOTQ2MywiZXhwIjoxNzM4MjQzMDYzfQ.EBOxBiLNDtgyzvvjuKmdxpPlkRQlQHDgK-0sNgaVfXA";

const url = "https://reign-service.onrender.com";

export default function Page() {
  const { toast } = useToast();
  const [tabsValue, setTabsValue] = useState("carousel");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [images, setImages] = useState([]);
  const [domLoaded, setDomLoaded] = useState(false);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [imagesUpdate, setImagesUpdate] = useState(false);

  const model = searchParams.get("model");
  const model_id = searchParams.get("id");
  //! untuk handle dropdown menu di setiap photo
  const [openStates, setOpenStates] = useState({});

  const handleOpenChange = (index, isOpen) => {
    setOpenStates((prev) => ({
      ...prev,
      [index]: isOpen, // Track the open state for each index
    }));
  };
  const [assetSheet, setAssetSheet] = useState(false);
  //! untuk handle dropdown menu di setiap photo

  //! INI FUNCTION BARU BUAT DRAG IMAGE
  const dragImage = useRef(0);
  const draggedOverImage = useRef(0);
  const [draggingStyle, setDraggingStyle] = useState({ display: "none" });

  function handleSortImage() {
    const imageClone = [...images];
    const temp = imageClone[dragImage.current];
    imageClone[dragImage.current] = imageClone[draggedOverImage.current];
    imageClone[draggedOverImage.current] = temp;

    const updatedImage = imageClone.map((image, index) => ({
      ...image,
      order: index + 1,
    }));

    setImages(updatedImage);
    setDraggingStyle({ display: "none" }); // Hide the ghost element
    // setImagesUpdate(true);
  }

  function handleDragStart(index, event) {
    dragImage.current = index;
    const ghostElement = document.createElement("div");
    ghostElement.style.width = "0px";
    ghostElement.style.height = "0px";
    event.dataTransfer.setDragImage(ghostElement, 0, 0);

    setDraggingStyle({
      display: "block",
      position: "fixed",
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
      width: "50px",
      height: "50px",
      pointerEvents: "none",
      zIndex: 9999,
      transform: "translate(-50%, -50%)",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f3f4f6",
      overflow: "hidden",
    });
  }

  const handleDrag = useCallback(
    throttle((event) => {
      setDraggingStyle((prev) => ({
        ...prev,
        top: `${event.clientY}px`,
        left: `${event.clientX}px`,
      }));
    }, 100), // Adjust the throttle delay (100ms is reasonable for smoothness)
    []
  );
  //! INI FUNCTION BARU BUAT DRAG IMAGE

  const [photoPositionOptions, setPhotoPositionOptions] = useState([]);

  //! data static
  // useEffect(() => {
  //   setDomLoaded(true);
  //   const data = [
  //     {
  //       url: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1498982261566-1c28c9cf4c02?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1467632499275-7a693a761056?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1515511624704-b8916dcc30ea?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1543096222-72de739f7917?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1541519481457-763224276691?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1465145498025-928c7a71cab9?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1536180931879-fd2d652efddc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1594843310428-7eb6729555e9?q=80&w=2839&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1729116283190-518c3b8c1d1f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1701351382146-035bd68cdb6d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       url: "https://images.unsplash.com/photo-1639676994754-d3488a9e491a?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //   ];

  //   // setImages([
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1498982261566-1c28c9cf4c02?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1467632499275-7a693a761056?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1515511624704-b8916dcc30ea?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1543096222-72de739f7917?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1541519481457-763224276691?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1465145498025-928c7a71cab9?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1536180931879-fd2d652efddc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1594843310428-7eb6729555e9?q=80&w=2839&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1729116283190-518c3b8c1d1f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1701351382146-035bd68cdb6d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   //   {
  //   //     url: "https://images.unsplash.com/photo-1639676994754-d3488a9e491a?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   //   },
  //   // ]);

  //   const updatedImages = data.map((item, index) => {
  //     return { ...item, id: index + 1, order: index + 1 };
  //   });

  //   // const photosOptions = updatedImages.map((item, index) => {
  //   //   return {
  //   //     value: item.order.toString(),
  //   //   };
  //   // });
  //   // setPhotoPositionOptions(photosOptions);
  //   setImages(updatedImages);
  //   setPositions(new Array(14).fill({ x: 0, y: 0 }));
  //   // setImagesUpdate(false);
  // }, []);

  //! INI STTE DAN FUNCTION BUAT HANDLE ADD PHOTOS PORTRAIT DAN LANDSCAPE
  //! data static

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
    const filterPhoto = files.filter((item) => item.size > 10_000_000);
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
    //! submit ke server
    let successCount = 0;
    e.preventDefault();
    const dataPortrait = selectedPhotosPortrait.map((item, index) => {
      return {
        // id: index + 1, //! gak usah di kirim
        image_file: item.file,
        // order: index + 1, //! gak usah di kirim
        type: tabsValue === "carousel" ? "carousel" : "polaroid",
        model_id: Number(model_id),
        orientation: "portrait",
        status: "active",
      };
    });
    const dataLandscape = selectedPhotosLandscape.map((item, index) => {
      return {
        // id: index + 1, //! gak usah di kirim
        image_file: item.file,
        // order: index + 1, //! gak usah di kirim
        type: tabsValue === "carousel" ? "carousel" : "polaroid",
        model_id: Number(model_id),
        orientation: "landscape",
        status: "active",
      };
    });

    console.log({ dataPortrait, dataLandscape });

    const mergeData = [...dataPortrait, ...dataLandscape];
    console.log(mergeData, "< mergeData");
    console.log(mergeData[0].image_file.size, "<");

    for (const data of mergeData) {
      const formData = new FormData();
      formData.append("image_file", data.image_file);
      formData.append("type", data.type);
      formData.append("model_id", data.model_id);
      formData.append("orientation", data.orientation);
      formData.append("status", data.status);

      try {
        const res = await fetch(`${url}/v1/assets/admin`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accToken}`,
          },
          body: formData,
        });
        console.log(res, "<res>");

        const dat = await res.json();
        console.log(dat, "<dat>");

        successCount++;
        setUploadCount(successCount);
        console.log("Uploaded: ", data);
      } catch (error) {
        console.error("Upload failed: ", error);
      }

      // await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // console.log(selectedPhotosPortrait.map((photo) => photo.file));
    // console.log(tabsValue);
  };

  const [changeOrderDialog, setChangeOrderDialog] = useState(false);
  async function saveFinalPhotosPosition() {
    console.log(filteredAsset, "final sebelum di submit DB");
    const body = filteredAsset.map((item, index) => {
      return {
        id: item.id,
        order: item.order,
      };
    });
    console.log(body, "< body sebelom dikirim");
    try {
      const response = await fetch(`${url}/v1/assets/admin/bulk-order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accToken}`,
        },
        body: JSON.stringify({ assets: body }),
      });

      console.log(response, "< res");

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data, "< data");

      toast({
        title: "KEGANTI BRO",
        description: "DESKRIPSI BERHASIL",
        variant: "default",
      });

      // fetchReignModels();
      fetchModelAsset();
      // setNewPhotoPosition("");
      // setFormData(initialForm);
    } catch (error) {
      console.error("Error saving changes", error);

      // toast({
      //   title: "Wardrobe Malfunction! 🚨",
      //   description:
      //     "Oops! Looks like the fashion police rejected this one. Try again!",
      //   variant: "destructive",
      // });

      // fetchReignModels();
      // setFormData(initialForm);
    }
  }

  const [currentImagePosition, setCurrentImagePosition] = useState({
    assetId: 0,
    currenctOrder: 0,
  });
  const handleChangePhotoPosition = (item, index) => {
    setChangeOrderDialog(true);
    console.log(index, "<");
    console.log(item);
    // setCurrentImagePosition({ assetId: item.id, currenctOrder: item.order });
    setCurrentImagePosition({
      assetId: item.id,
      currenctOrder: Number(index + 1),
    });
  };

  const [newPhotoPosition, setNewPhotoPosition] = useState("");
  console.log(newPhotoPosition, "<newPhotoPosition");

  const handleSubmitChangePosition = async (e) => {
    e.preventDefault();
    console.log({ newPhotoPosition, currentImagePosition });

    console.log(filteredAsset);
    const bodyTest = filteredAsset[newPhotoPosition - 1].order;
    console.log(bodyTest);
    try {
      const response = await fetch(
        `${url}/v1/assets/admin/${currentImagePosition.assetId}/order`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accToken}`,
          },
          body: JSON.stringify({ order: Number(bodyTest) }),
        }
      );

      console.log(response, "< res");

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data, "< data");

      // toast({
      //   title:
      //     newStatus === "active"
      //       ? "It's Show Time! 🎬"
      //       : "Taking a Beauty Nap 😴",
      //   description:
      //     newStatus === "active"
      //       ? "The model is now live and ready to slay the runway!"
      //       : "Poof! This model is now hidden from the public eye.",
      //   variant: "default",
      // });

      // fetchReignModels();
      fetchModelAsset();
      setNewPhotoPosition("");
      // setFormData(initialForm);
    } catch (error) {
      console.error("Error saving changes", error);

      // toast({
      //   title: "Wardrobe Malfunction! 🚨",
      //   description:
      //     "Oops! Looks like the fashion police rejected this one. Try again!",
      //   variant: "destructive",
      // });

      // fetchReignModels();
      // setFormData(initialForm);
    }
    setChangeOrderDialog(false);
  };

  //! =========================== REIGN API ===========================
  const [modelAssetList, setModelAssetList] = useState([]);
  const [filteredAsset, setFilteredAsset] = useState(modelAssetList);

  useEffect(() => {
    fetchModelAsset();
  }, []);

  useEffect(() => {
    if (tabsValue === "carousel") {
      setFilteredAsset(
        modelAssetList?.carousel?.filter(
          (item) => item.type === "carousel" && item.status === "active"
        )
      );
    } else if (tabsValue === "polaroid") {
      setFilteredAsset(
        modelAssetList?.polaroid?.filter(
          (item) => item.type === "polaroid" && item.status === "active"
        )
      );
    } else if (tabsValue === "archive-carousel") {
      setFilteredAsset(
        modelAssetList?.carousel?.filter(
          (item) => item.type === "carousel" && item.status === "inactive"
        )
      );
    } else if (tabsValue === "archive-polaroid") {
      setFilteredAsset(
        modelAssetList?.polaroid?.filter(
          (item) => item.type === "polaroid" && item.status === "inactive"
        )
      );
    }

    setImagesUpdate(false);
  }, [tabsValue, modelAssetList]); // Include modelList in dependencies

  useEffect(() => {
    console.log(currentImagePosition, "< currentImagePosition");

    if (tabsValue === "carousel") {
      const options = filteredAsset?.map((item, index) => {
        let _index = index + 1;
        return {
          value: _index.toString(),
        };
      });

      // const options = filteredAsset.filter(
      //   (item) => item.order != currentImagePosition
      // );
      console.log(options, "<options");

      setPhotoPositionOptions(options);
    } else if (tabsValue === "polaroid") {
      const options = filteredAsset?.map((item, index) => {
        let _index = index + 1;
        return {
          value: _index.toString(),
        };
      });

      // const options = filteredAsset.filter(
      //   (item) => item.order != currentImagePosition
      // );
      console.log(options, "<options");

      setPhotoPositionOptions(options);
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

  function handleDragStart_reignApi(index, event) {
    dragImage_reignApi.current = index;
    const ghostElement = document.createElement("div");
    ghostElement.style.width = "0px";
    ghostElement.style.height = "0px";
    event.dataTransfer.setDragImage(ghostElement, 0, 0);

    setDraggingStyle_reignApi({
      display: "block",
      position: "fixed",
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
      width: "50px",
      height: "50px",
      pointerEvents: "none",
      zIndex: 9999,
      transform: "translate(-50%, -50%)",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f3f4f6",
      overflow: "hidden",
    });
  }

  const handleDrag_reignApi = useCallback(
    throttle((event) => {
      setDraggingStyle_reignApi((prev) => ({
        ...prev,
        top: `${event.clientY}px`,
        left: `${event.clientX}px`,
      }));
    }, 100), // Adjust the throttle delay (100ms is reasonable for smoothness)
    []
  );
  //! INI FUNCTION BARU BUAT DRAG IMAGE

  const fetchModelAsset = async () => {
    try {
      const response = await fetch(`${url}/v1/assets/admin/${model_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accToken}`,
        },
      });
      const data = await response.json();
      console.log(data, "< model asset data");
      // setModelList(data.data);
      setModelAssetList(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (status, id) => {
    console.log(status, id);
    let newStatus = status === "active" ? "inactive" : "active";
    console.log(newStatus);
    try {
      const _formBody = new URLSearchParams();
      _formBody.append("status", newStatus);

      const response = await fetch(`${url}/v1/assets/admin/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accToken}`,
        },
        body: _formBody.toString(), // Correctly formatted body
      });

      console.log(response, "< res");

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      toast({
        title:
          newStatus === "active"
            ? "It's Show Time! 🎬"
            : "Taking a Beauty Nap 😴",
        description:
          newStatus === "active"
            ? "The model is now live and ready to slay the runway!"
            : "Poof! This model is now hidden from the public eye.",
        variant: "default",
      });
      // fetchReignModels();
      fetchModelAsset();
      // setFormData(initialForm);
    } catch (error) {
      console.error("Error saving changes", error);

      toast({
        title: "Wardrobe Malfunction! 🚨",
        description:
          "Oops! Looks like the fashion police rejected this one. Try again!",
        variant: "destructive",
      });

      fetchReignModels();
      setFormData(initialForm);
    }
  };

  // console.log(filteredAsset);
  console.log(isExeeded, "< isEx");

  const [deleteDialogAsset, setDeleteDialogAsset] = useState(false);
  const [assetId, setAssetId] = useState(0);
  const handleDeleteAsset = (asset) => {
    console.log(asset);
    setDeleteDialogAsset(true);
    setAssetId(asset.id);
  };
  const deleteAsset = async () => {
    try {
      setLoading(true);
      // const id = formData.id;
      const response = await fetch(`${url}/v1/assets/admin/${assetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data, "< data");
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
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Models</BreadcrumbLink>
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
          defaultValue={"static"}
          className="mt-2"
          onValueChange={(value) => setTabsValue(value)}
          value={tabsValue}
        >
          <div className="flex justify-between mb-10">
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
            </TabsList>

            {tabsValue === "carousel" || tabsValue === "archive-carousel" ? (
              <div className="flex items-center">
                {imagesUpdate && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="mr-2"
                    onClick={saveFinalPhotosPosition}
                  >
                    <SaveAll />
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="mr-2"
                  onClick={() => setTabsValue("archive-carousel")}
                >
                  <Archive />
                </Button>

                <Button
                  // className="rounded-full"
                  size="icon"
                  variant="outline"
                  onClick={handleAssetsSheetChange}
                >
                  <PlusIcon />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                {imagesUpdate && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="mr-2"
                    onClick={saveFinalPhotosPosition}
                  >
                    <SaveAll />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-2"
                  onClick={() => setTabsValue("archive-polaroid")}
                >
                  <Archive />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleAssetsSheetChange}
                >
                  <PlusIcon />
                </Button>
              </div>
            )}
          </div>

          {/* //! content static */}
          {/* <TabsContent value="static">
            <div className="relative">
              <div
                className="absolute pointer-events-none"
                style={draggingStyle}
              >
                <img
                  src={images[dragImage.current]?.url}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="grid auto-rows-min gap-2 grid-cols-3 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
                {images.map((item, index) => (
                  <div
                    className="bg-muted/50 rounded-t-xl"
                    key={index}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(index, e)}
                    onDrag={(e) => handleDrag(e)}
                    onDragEnter={() => (draggedOverImage.current = index)}
                    onDragEnd={handleSortImage}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <img
                      src={item.url}
                      className="object-cover aspect-square rounded-t-xl"
                    />
                    <div className="flex items-center justify-between mx-1 min-h-min">
                      <span
                        className="size-1.5 rounded-full bg-emerald-500 ml-3"
                        aria-hidden="true"
                      ></span>

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
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => console.log(item)}>
                              Test data
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangePhotoPosition(item, index)
                              }
                            >
                              Change position
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => console.log("Show")}
                            >
                              Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => console.log("Hide")}
                            >
                              Archive
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
           
              </div>
            </div>
          </TabsContent> */}
          {/* //! content static */}

          <TabsContent value={tabsValue}>
            <div className="relative">
              {/* <div
                className="absolute pointer-events-none"
                style={draggingStyle_reignApi}
              >
                <img
                  src={filteredAsset[dragImage_reignApi.current]?.img_url}
                  className="object-cover w-full h-full"
                />
              </div> */}
              <div className="grid auto-rows-min gap-2 grid-cols-3 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
                {/* //! ini yang paling baru draggable */}
                {filteredAsset?.map((item, index) => (
                  <div
                    className="bg-muted/50 shadow-lg border border-gray-100"
                    key={index}
                    // draggable={true}
                    // onDragStart={(e) => handleDragStart_reignApi(index, e)}
                    // onDrag={(e) => handleDrag_reignApi(e)}
                    // onDragEnter={() =>
                    //   (draggedOverImage_reignApi.current = index)
                    // }
                    // onDragEnd={handleSortImage_reignApi}
                    // onDragOver={(e) => e.preventDefault()}

                    // onDragStart={() => (dragImage_reignApi.current = index)}
                    // onDragEnter={() =>
                    //   (draggedOverImage_reignApi.current = index)
                    // }
                    // onDragEnd={handleSortImage_reignApi}
                    // onDragOver={(e) => e.preventDefault()}

                    draggable={
                      tabsValue === "polaroid" || tabsValue === "carousel"
                    }
                    onDragStart={() => {
                      if (
                        tabsValue === "polaroid" ||
                        tabsValue === "carousel"
                      ) {
                        dragImage_reignApi.current = index;
                      }
                    }}
                    onDragEnter={() => {
                      if (
                        tabsValue === "polaroid" ||
                        tabsValue === "carousel"
                      ) {
                        draggedOverImage_reignApi.current = index;
                      }
                    }}
                    onDragEnd={(e) => {
                      if (
                        tabsValue === "polaroid" ||
                        tabsValue === "carousel"
                      ) {
                        handleSortImage_reignApi(e);
                      }
                    }}
                    onDragOver={(e) => {
                      if (
                        tabsValue === "polaroid" ||
                        tabsValue === "carousel"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <img
                      src={item.img_url}
                      className="object-cover aspect-square p-2"
                    />
                    <div className="flex items-center justify-between min-h-min pb-1 mx-2">
                      <span className="text-xs font-semibold">
                        {item.orientation === "portrait" ? "P" : "L"}
                      </span>
                      <span className="text-xs font-semibold">
                        O :{item.order}
                      </span>
                      <span className="text-xs font-semibold">
                        id :{item.id}
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
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => console.log(item)}>
                              Test data
                            </DropdownMenuItem>
                            {(tabsValue === "polaroid" ||
                              tabsValue === "carousel") && (
                              <DropdownMenuItem
                                // onClick={() => console.log(item)}
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
                              {item.status === "active" ? "Archive" : "Show"}
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
              {!isExeeded && <Button type="submit">Save photos</Button>}
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
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* //! dialog change photo position */}

      {/* //! Dialog delete model */}
      <AlertDialog open={deleteDialogAsset} onOpenChange={setDeleteDialogAsset}>
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
  );
}

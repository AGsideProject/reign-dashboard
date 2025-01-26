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
import Image from "next/image";

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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODM4NGUzLTY4OTAtODAwMy05YTNiLThjNjBjMmEyMTA1YSIsImVtYWlsIjoiYWxkb21hcmNlbGlubzAxQGdtYWlsLmNvbSIsImlhdCI6MTczNzg4OTM5NSwiZXhwIjoxNzM3ODkyOTk1fQ.xEz9FBR3r5a2ZZw2E-a5g3-g2rIQ1HSb062Y9M6NEmA";

const url = "https://reign-service.onrender.com";

export default function Page() {
  const [tabsValue, setTabsValue] = useState("carousel");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [images, setImages] = useState([]);
  const [domLoaded, setDomLoaded] = useState(false);
  const [positions, setPositions] = useState([]);

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
  const [carouselSheet, setCarouselSheet] = useState(false);
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
    setImagesUpdate(true);
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

  useEffect(() => {
    setDomLoaded(true);
    const data = [
      {
        url: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1498982261566-1c28c9cf4c02?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1467632499275-7a693a761056?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1515511624704-b8916dcc30ea?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1543096222-72de739f7917?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1541519481457-763224276691?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1465145498025-928c7a71cab9?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1536180931879-fd2d652efddc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1594843310428-7eb6729555e9?q=80&w=2839&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1729116283190-518c3b8c1d1f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1701351382146-035bd68cdb6d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        url: "https://images.unsplash.com/photo-1639676994754-d3488a9e491a?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ];

    // setImages([
    //   {
    //     url: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1498982261566-1c28c9cf4c02?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1467632499275-7a693a761056?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1515511624704-b8916dcc30ea?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1543096222-72de739f7917?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1541519481457-763224276691?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1465145498025-928c7a71cab9?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1536180931879-fd2d652efddc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1594843310428-7eb6729555e9?q=80&w=2839&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1729116283190-518c3b8c1d1f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1701351382146-035bd68cdb6d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    //   {
    //     url: "https://images.unsplash.com/photo-1639676994754-d3488a9e491a?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   },
    // ]);

    const updatedImages = data.map((item, index) => {
      return { ...item, id: index + 1, order: index + 1 };
    });

    const photosOptions = updatedImages.map((item, index) => {
      return {
        value: item.order.toString(),
      };
    });
    setPhotoPositionOptions(photosOptions);
    setImages(updatedImages);
    setPositions(new Array(14).fill({ x: 0, y: 0 }));
    setImagesUpdate(false);
  }, []);

  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handlePhotoSelection = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => {
      return {
        file,
        preview: URL.createObjectURL(file),
      };
    });

    setSelectedPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDeletePhoto = (index) => {
    setSelectedPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleSubmitAssets = (e) => {
    //! submit ke server
    e.preventDefault();
    const carouselData = selectedPhotos.map((item, index) => {
      return {
        id: index + 1,
        image_file: item.file,
        order: index + 1,
        type: tabsValue,
      };
    });

    console.log(carouselData);
    // console.log(selectedPhotos.map((photo) => photo.file));
    // console.log(tabsValue);
  };

  const [changeOrderDialog, setChangeOrderDialog] = useState(false);
  function saveFinalPhotosPosition() {
    console.log(images);
  }

  const [currentImagePosition, setCurrentImagePosition] = useState(0);
  const handleChangePhotoPosition = (item) => {
    setChangeOrderDialog(true);
    console.log(item);
    setCurrentImagePosition(item.order);
  };

  const [newPhotoPosition, setNewPhotoPosition] = useState("");
  console.log(newPhotoPosition, "<newPhotoPosition");

  const handleSubmitChangePosition = (e) => {
    e.preventDefault();
    console.log({ newPhotoPosition, currentImagePosition });
  };

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchModelAsset();
  }, []);
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
          <div className="flex justify-between mb-10">
            <TabsList>
              <TabsTrigger
                value="carousel"
                onClick={() => setTabsValue("carousel")}
              >
                Carousel
              </TabsTrigger>
              <TabsTrigger
                value="polaroids"
                onClick={() => setTabsValue("polaroids")}
              >
                Polaroids
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
                  onClick={() => setCarouselSheet(true)}
                >
                  <PlusIcon />
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-3"
                  onClick={() => setTabsValue("archive-polaroids")}
                >
                  <Archive />
                </Button>
                <Button className="rounded-full" size="icon" variant="outline">
                  <PlusIcon />
                </Button>
              </div>
            )}
          </div>
          {/* <Separator className="my-5" /> */}

          <TabsContent value="carousel">
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
                {/* //! ini yang paling baru draggable */}
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
                              // onClick={() => console.log(item)}
                              onClick={() => handleChangePhotoPosition(item)}
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
                {/* //! ini yang paling baru draggable */}
                {/* <div className="aspect-square bg-red-300 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1536180931879-fd2d652efddc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="model name"
                    layout="fill"
                    objectFit="cover"
                    priority
                    placeholder="blur"
                    blurDataURL="https://images.unsplash.com/photo-1536180931879-fd2d652efddc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </div> */}
                {/* //! ini yang ke 2 */}
                {/* {images.map((item, index) => (
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
                    <div className="flex items-center justify-between mx-1">
                      <Badge variant="outline" className="gap-1.5">
                        <span
                          className="size-1.5 rounded-full bg-emerald-500"
                          aria-hidden="true"
                        ></span>
                        Active
                      </Badge>
                      <DropdownMenu
                        open={openStates[index] || false} // Open only for the specific index
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
                ))} */}
                {/* //! ini yang ke 2 */}
              </div>
            </div>
            {/* //! INI OGNYA */}

            {/* <div className="grid auto-rows-min gap-2 grid-cols-3 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
              {images.map((item, index) => (
                <div
                  className="bg-muted/50 rounded-xl"
                  key={index}
                  draggable={true}
                  onDragStart={() => (dragImage.current = index)}
                  onDragEnter={() => (draggedOverImage.current = index)}
                  onDragEnd={handleSortImage}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <img
                    src={item.url}
                    className="object-cover aspect-square rounded-xl"
                  />
                </div>
              ))}
            </div> */}
            {/* //! INI OGNYA */}
          </TabsContent>
          <TabsContent value="polaroids">
            List polaroids photos.
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                className="aspect-square bg-blue-300"
              />
            </div>
          </TabsContent>
          <TabsContent value="archive-carousel">
            List archive carousel.
          </TabsContent>
          <TabsContent value="archive-polaroids">
            List archive polaroids.
          </TabsContent>
        </Tabs>
      </div>
      {/* //! add carousel photos */}
      <Sheet open={carouselSheet} onOpenChange={setCarouselSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Carousel</SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleSubmitAssets}
            className="overflow-auto max-h-[100vh] pb-52"
          >
            <div className="grid gap-4 grid-cols-3 py-4 px-2">
              <div className="col-span-3">
                <Label
                  htmlFor="picture"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select photos ({selectedPhotos.length} selected)
                </Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelection}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>
              <Separator className="col-span-3" />

              {selectedPhotos.length > 0 && (
                <div className="col-span-3 grid grid-cols-3 gap-4">
                  {selectedPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative bg-muted/50 rounded-xl"
                    >
                      <div className="absolute -top-2 -right-2">
                        <Button
                          size="icon"
                          variant="destructive"
                          className="rounded-full w-6 h-6"
                          onClick={() => handleDeletePhoto(index)}
                        >
                          <X />
                        </Button>
                      </div>

                      <img
                        src={photo.preview}
                        alt={`Preview ${index + 1}`}
                        className="object-cover aspect-square rounded-xl"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <SheetFooter>
              <Button type="submit">Save photos</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      {/* //! add carousel photos */}
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
                  value={currentImagePosition}
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
                      <SelectItem value={item.value} key={index}>
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
    </SidebarInset>
  );
}

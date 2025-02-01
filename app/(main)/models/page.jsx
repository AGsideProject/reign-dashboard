"use client";

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
import // DropdownMenu,
// DropdownMenuContent,
// DropdownMenuItem,
// DropdownMenuSeparator,
// DropdownMenuTrigger,
"@/components/ui/dropdown-menu";
import { columns } from "./columns";
import { DataTable } from "./dataTable";
import { use, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/components/ui/use-toast";

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

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, MoreHorizontal } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import reignLogo from "@/public/images/reignLogo.jpg";
import fetchGlobal from "@/lib/fetch-data";
import useDeviceType from "@/hooks/use-device";

const accToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwYjY2OWYyLWYyZjAtNDBhMi1iZTA3LTBjNzVhNWM1ZjgxYiIsImVtYWlsIjoiYWxkb21hcmNlbGlubzAxQGdtYWlsLmNvbSIsImlhdCI6MTczODI0OTQ5NSwiZXhwIjoxNzM4MjUzMDk1fQ.f2qFE-QvOjI9jbiEjLlZq0YeDBj9YRlx42g7JAsXN5I";

const url = "https://reign-service.onrender.com";

export default function Page() {
  const device = useDeviceType();
  const { toast } = useToast();
  const router = useRouter();
  const initialAssets = {
    image_file: null,
    type: null,
    order: null,
    model_id: null,
  };
  const [tabsValue, setTabsValue] = useState("all");
  const [assets, setAssets] = useState([]);
  const [data, setData] = useState([]);
  const [modelSheet, setModelSheet] = useState(false);
  const [assetsSheet, setAssetsSheet] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDropDownCard, setOpenDropDownCard] = useState(false);
  const handleOpenChangeDropDown = (index, isOpen) => {
    setOpenDropDownCard((prev) => ({
      ...prev,
      [index]: isOpen,
    }));
  };
  const [modelList, setModelList] = useState([]);

  const initialForm = {
    id: "",
    name: "",
    slug: "",
    height: "",
    bust: "",
    waist: "",
    hips: "",
    shoeSize: "",
    hair: "",
    eyes: "",
    gender: "",
    cover_img: null,
  };

  const [formData, setFormData] = useState(initialForm);

  //! untuk handle sheet model
  const handleSheetChange = (isOpen) => {
    setModelSheet(isOpen);
    if (!isOpen) {
      setFormData(initialForm);
    }
  };

  //! untuk handle form
  const handleChange = (e) => {
    const { id, value, type, files } = e.target || {};

    setFormData((prevData) => ({
      ...prevData,
      [id]:
        type === "file" ? files[0] : type === "number" ? Number(value) : value,
    }));

    if (type === "file") {
      setPreviewCoverImage(URL.createObjectURL(files[0]));
    }
  };

  //! untuk handle gender change
  const handleGenderChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: value,
    }));
  };

  //! untuk handle post add / update ke db
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.id) {
      console.log("update");
      try {
        setLoading(true);

        const id = formData.id;
        const _formData = new FormData();
        _formData.append("name", formData.name);
        _formData.append("slug", formData.slug);
        _formData.append("bust", formData.bust);
        _formData.append("hight", formData.height);
        _formData.append("waist", formData.waist);
        _formData.append("hips", formData.hips);
        _formData.append("shoe_size", formData.shoeSize);
        _formData.append("hair", formData.hair);
        _formData.append("eyes", formData.eyes);
        _formData.append("cover_img", formData.cover_img);
        _formData.append("user_id", "6771edda-8cd4-8003-8f83-3c1a76660611");
        _formData.append("gender", formData.gender);
        // _formData.append("status", "active");

        console.log(_formData, "< _formData");

        const dataGlobal = await fetchGlobal(
          `/v1/model/admin/${id}`,
          {
            method: "PUT",
            body: _formData,
            contentType: "form-data",
          },
          true
        );

        console.log(dataGlobal, "< dataGlobal");

        // const response = await fetch(
        //   `https://reign-service.onrender.com/v1/model/admin/${id}`,
        //   {
        //     method: "PUT",
        //     headers: {
        //       Authorization: `Bearer ${accToken}`,
        //     },
        //     body: _formData,
        //   }
        // );

        // console.log(response, "< res");

        // if (!response.ok) {
        //   throw new Error(`Error: ${response.statusText}`);
        // }

        toast({
          title: "Strike a Pose! 📸",
          description: "Update successfull! Time to strike a pose!",
          variant: "default", // You can use "destructive" for error messages
          className: "bg-emerald-50 text-black",
        });

        setLoading(false);
        fetchReignModels();
        setFormData(initialForm);
        setModelSheet(false);
      } catch (error) {
        console.error("Error saving changes", error);
        // toast.error("Failed to save changes. Please try again.");
        setLoading(false);
        fetchReignModels();
        setFormData(initialForm);
        setModelSheet(false);
        toast({
          title: "Wardrobe Malfunction! 🚨",
          description:
            "Oops! Looks like the fashion police rejected this one. Try again!",
          variant: "destructive",
        });
      }
    } else {
      console.log("add");
      try {
        console.log("Form Data:", formData);
        setLoading(true);
        const _formData = new FormData();
        _formData.append("name", formData.name);
        _formData.append("slug", formData.slug);
        _formData.append("bust", formData.bust);
        _formData.append("hight", formData.height);
        _formData.append("waist", formData.waist);
        _formData.append("hips", formData.hips);
        _formData.append("shoe_size", formData.shoeSize);
        _formData.append("hair", formData.hair);
        _formData.append("eyes", formData.eyes);
        _formData.append("cover_img", formData.cover_img);
        _formData.append("user_id", "6771edda-8cd4-8003-8f83-3c1a76660611");
        _formData.append("gender", formData.gender);
        _formData.append("status", "active");

        console.log(_formData, "< _formData");

        const dataGlobal = await fetchGlobal(
          "/v1/model/admin",
          {
            method: "POST",
            body: _formData,
            contentType: "form-data",
          },
          true
        );

        console.log(dataGlobal, "< dataGlobal");
        // const response = await fetch(
        //   "https://reign-service.onrender.com/v1/model/admin",
        //   {
        //     method: "POST",
        //     headers: {
        //       Authorization: `Bearer ${accToken}`,
        //     },
        //     body: _formData,
        //   }
        // );

        // console.log(response, "< res");

        // if (!response.ok) {
        //   throw new Error(`Error: ${response.statusText}`);
        // }

        toast({
          title: "Strike a Pose! 📸",
          description: "Added successfull! Time to strike a pose!",
          variant: "default", // You can use "destructive" for error messages
          className: "bg-emerald-50 text-black",
        });

        setLoading(false);
        fetchReignModels();
        setFormData(initialForm);
        setModelSheet(false);
      } catch (error) {
        console.error("Error saving changes", error);
        // toast.error("Failed to save changes. Please try again.");
        setLoading(false);
        fetchReignModels();
        setFormData(initialForm);
        setModelSheet(false);
        toast({
          title: "Wardrobe Malfunction! 🚨",
          description:
            "Oops! Looks like the fashion police rejected this one. Try again!",
          variant: "destructive",
        });
      }
    }
  };

  //! untuk handle model status
  const handleStatusChange = async (status, id) => {
    console.log(status, id);
    let newStatus = status === "active" ? "inactive" : "active";

    try {
      // const _formBody = new URLSearchParams();
      // _formBody.append("status", newStatus);

      const dataGlobal = await fetchGlobal(
        `/v1/model/admin/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        },
        true
      );

      console.log(dataGlobal, "< dataGlobal");

      // const response = await fetch(
      //   `https://reign-service.onrender.com/v1/model/admin/${id}/status`,
      //   {
      //     method: "PATCH",
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded",
      //       Authorization: `Bearer ${accToken}`,
      //     },
      //     body: _formBody.toString(), // Correctly formatted body
      //   }
      // );

      // console.log(response, "< res");

      // if (!response.ok) {
      //   throw new Error(`Error: ${response.statusText}`);
      // }

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
    } catch (error) {
      console.error("Error saving changes", error);

      toast({
        title: "Wardrobe Malfunction! 🚨",
        description:
          "Oops! Looks like the fashion police rejected this one. Try again!",
        variant: "destructive",
      });

      // fetchReignModels();
      // setFormData(initialForm);
    }
    fetchReignModels();
    setFormData(initialForm);
  };

  //! untuk handle fetch all model
  const fetchReignModels = async () => {
    setLoading(true);
    try {
      const dataGLobal = await fetchGlobal("/v1/model/admin/list");

      // console.log(dataGLobal, "< dataGlobal");

      // const response = await fetch(
      //   "https://reign-service.onrender.com/v1/model/admin/list",
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //       "Access-Control-Allow-Origin": "*",
      //       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      //       "Access-Control-Allow-Headers": "Content-Type, Authorization",
      //       Authorization: `Bearer ${accToken}`,
      //     },
      //   }
      // );
      // const data = await response.json();
      // setModelList(data.data);
      // console.log(data, "< models reign data");
      setModelList(dataGLobal);
      setLoading(false);
    } catch (error) {
      console.log(error, "<error");
      toast({
        title: "Models Are Playing Hide and Seek 🏃",
        description:
          "We tried to fetch them, but they’re REALLY good at hiding. If you see them, tell them to come back to work!",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReignModels();
  }, []);

  //! untuk handle edit model, aktif saat image di pencet
  const handleEditModel = (model) => {
    const dataEdit = {
      id: model.id,
      name: model.name || "no data",
      slug: model.slug || "no data",
      height: model.hight || 0,
      bust: model.bust || 0,
      waist: model.waist || 0,
      hips: model.hips || 0,
      shoeSize: model.shoe_size || 0,
      hair: model.hair || "no data",
      eyes: model.eyes || "no data",
      gender: model.gender || "no data",
      cover_img: model.cover_img || null,
    };
    setFormData(dataEdit);
    setPreviewCoverImage(model.cover_img);
    setModelSheet(true);
  };

  //! untuk handle add model
  const handleAddModel = () => {
    setFormData(initialForm);
    setModelSheet(true);
    setPreviewCoverImage(null);
  };

  //! untuk handle delete model
  const handleDeleteModel = (model) => {
    setDeleteDialog(true);
    setFormData({ ...model });
  };

  //! untuk handle delete ke db
  const deleteModel = async () => {
    try {
      setLoading(true);
      const id = formData.id;

      const dataGlobal = await fetchGlobal(
        `/v1/model/admin/${id}`,
        {
          method: "DELETE",
        },
        true
      );

      console.log(dataGlobal, "<dataGlobal delete");
      // const response = await fetch(`${url}/v1/model/admin/${id}`, {
      //   method: "DELETE",
      //   headers: {
      //     Authorization: `Bearer ${accToken}`,
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error(`Error: ${response.statusText}`);
      // }

      // const data = await response.json();
      // console.log(data, "< data");
      toast({
        title: "Buh-Bye! 👋",
        description:
          "That model's off to the digital afterlife. We'll miss you! 💔",
        variant: "default", // You can use "destructive" for error messages
        className: "bg-emerald-100 text-black",
      });
      setLoading(false);
      fetchReignModels();
      setDeleteDialog(false);
      setFormData(initialForm);
    } catch (error) {
      console.error("Error deleting model:", error);

      toast({
        title: "Model Says NOPE! 🚫",
        description:
          "We tried deleting it, but it fought back. This one's got a survival instinct! Try again?",
        variant: "destructive",
      });
      setLoading(false);
      setDeleteDialog(false);
      setFormData(initialForm);
    }
  };

  console.log(formData, "< formData");
  // useEffect(() => {
  //   console.log(tabsValue, "keganti");
  //   const filterData = modelList.filter((item) => item.gender === tabsValue);
  //   setModelList(filterData);
  // }, [tabsValue]);

  const [filteredModels, setFilteredModels] = useState(modelList);

  useEffect(() => {
    console.log(tabsValue, "keganti");

    if (tabsValue === "all") {
      setFilteredModels(modelList);
    } else {
      setFilteredModels(modelList.filter((item) => item.gender === tabsValue));
    }
  }, [tabsValue, modelList]); // Include modelList in dependencies
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Models</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Button
          variant="outline"
          className="ml-auto mr-5"
          onClick={handleAddModel}
        >
          Add Model
        </Button>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Tabs
          defaultValue={tabsValue}
          className="mt-2"
          onValueChange={(value) => setTabsValue(value)}
          value={tabsValue}
        >
          <TabsList>
            <TabsTrigger value="all" onClick={() => setTabsValue("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="male" onClick={() => setTabsValue("male")}>
              Male
            </TabsTrigger>
            <TabsTrigger value="female" onClick={() => setTabsValue("female")}>
              Female
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tabsValue}>
            {loading && <p>LOADING</p>}

            <div
              className={`grid ${
                device === "mobile" ? "grid-cols-2" : "grid-cols-3"
              } p-2 gap-5 md:grid-cols-3 md:p-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-9`}
            >
              {filteredModels?.map((model, index) => (
                <div
                  className="bg-white shadow-lg border border-gray-50 aspect-[3/4.5] flex flex-col justify-between gap-0"
                  key={index}
                >
                  <div>
                    <div
                      className="p-2 md:p-3 cursor-pointer"
                      onClick={() => handleEditModel(model)}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={reignLogo}
                          alt="reign models"
                          // sizes="(max-width: 768px) 100vw, 33vw"
                          fill={true}
                          // priority
                          placeholder="blur"
                          style={{ objectFit: "cover" }}
                        />
                        <Image
                          src={model.cover_img}
                          alt={model.name}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          fill={true}
                          priority
                          placeholder="blur"
                          blurDataURL={model.cover_img}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <p className="text-xs sm:text-sm xl:text-base first-letter:uppercase">
                        {model.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mx-2 mb-1">
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className={`size-1.5 rounded-full ${
                          model.status === "active"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                        aria-hidden="true"
                      ></span>
                      <span className="first-letter:uppercase">
                        {model.status}
                      </span>
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/models/assets?model=${model.slug}&id=${model.id}`
                              )
                            }
                          >
                            Assets
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(model.status, model.id)
                            }
                          >
                            {model.status === "active" ? "Hide" : "Show"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log(model)}>
                            Test data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteModel(model)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* //! Model sheet */}
      <Sheet open={modelSheet} onOpenChange={handleSheetChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Model Details</SheetTitle>
            <SheetDescription>
              Make changes to your model here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={handleSubmit}
            className="overflow-auto max-h-[100vh] pb-52"
          >
            <div className="grid gap-4 grid-cols-2 py-4">
              <div>
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-left">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-left">
                  Height
                </Label>
                <Input
                  id="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="col-span-3"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="bust" className="text-left">
                  Bust
                </Label>
                <Input
                  id="bust"
                  value={formData.bust}
                  onChange={handleChange}
                  className="col-span-3"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="waist" className="text-left">
                  Waist
                </Label>
                <Input
                  id="waist"
                  value={formData.waist}
                  onChange={handleChange}
                  className="col-span-3"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="hips" className="text-left">
                  Hips
                </Label>
                <Input
                  id="hips"
                  value={formData.hips}
                  onChange={handleChange}
                  className="col-span-3"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="shoeSize" className="text-left">
                  Shoe size
                </Label>
                <Input
                  id="shoeSize"
                  value={formData.shoeSize}
                  onChange={handleChange}
                  className="col-span-3"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="hair" className="text-left">
                  Hair
                </Label>
                <Input
                  id="hair"
                  value={formData.hair}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="eyes" className="text-left">
                  Eyes
                </Label>
                <Input
                  id="eyes"
                  value={formData.eyes}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-left">
                  Gender
                </Label>
                <Select
                  onValueChange={handleGenderChange}
                  value={formData.gender}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={"Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"male"}>Male</SelectItem>
                    <SelectItem value={"female"}>Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="cover_img" className="text-left">
                  Cover image
                </Label>
                <Input
                  id="cover_img"
                  type="file"
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="">
                <img
                  className="aspect-square object-cover"
                  src={previewCoverImage}
                  alt=""
                />
              </div>

              {/* //! image */}
              {/* <div className="col-span-2">
                <Button type="button" onClick={addAssests}>
                  Add
                </Button>
              </div> */}
              {/* {assets.map((item, index) => (
                <>
                  <div className="">
                    <Label htmlFor="cover_img" className="text-left">
                      Image type
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select image type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="carousel">Carousel</SelectItem>
                          <SelectItem value="polaroid">polaroid</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Separator className="my-3" />
                    <Label htmlFor="cover_img" className="text-left">
                      Cover image
                    </Label>
                    <Input
                      id="cover_img"
                      type="file"
                      onChange={handleChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className=" p-5 md:p-3">
                    <img
                      className="aspect-square object-cover"
                      src={previewCoverImage}
                      alt=""
                    />
                  </div>
                </>
              ))} */}
            </div>
            <SheetFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Save changes
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      {/* //! Model sheet */}

      {/* //! Dialog delete model */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
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
            {/* <AlertDialogAction type="button" onClick={() => deleteModel()}>
              Continue
            </AlertDialogAction> */}
            <Button
              type="button"
              disabled={loading}
              onClick={deleteModel}
              variant="destructive"
            >
              {loading && <Loader2 className="animate-spin" />}
              DELETE
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* //! Dialog delete model */}
    </SidebarInset>
  );
}

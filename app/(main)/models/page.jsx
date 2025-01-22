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
import { useEffect, useState } from "react";

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
import { MoreHorizontal } from "lucide-react";
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

const labels = [
  "feature",
  "bug",
  "enhancement",
  "documentation",
  "design",
  "question",
  "maintenance",
];

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const initialAssets = {
    image_file: null,
    type: null,
    order: null,
    model_id: null,
  };
  const [assets, setAssets] = useState([]);
  const [data, setData] = useState([]);
  const [modelSheet, setModelSheet] = useState(false);
  const [assetsSheet, setAssetsSheet] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);
  const [label, setLabel] = useState("feature");
  const [open, setOpen] = useState(false);

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
    cover_img: null,
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]:
        type === "file" ? files[0] : type === "number" ? Number(value) : value,
    }));
    if (type === "file") {
      setPreviewCoverImage(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.id) {
      console.log("update");
      try {
        console.log("Form Data:", formData);
        // toast.success("Changes saved successfully!");
        setFormData(initialForm);
        setModelSheet(false);
      } catch (error) {
        console.error("Error saving changes", error);
        // toast.error("Failed to save changes. Please try again.");
      }
    } else {
      console.log("add");
      try {
        console.log("Form Data:", formData);
        // toast.success("Changes saved successfully!");
        setFormData(initialForm);
        setModelSheet(false);
      } catch (error) {
        console.error("Error saving changes", error);
        // toast.error("Failed to save changes. Please try again.");
      }
    }
  };

  function getData() {
    // Fetch data from your API here.
    return setData(
      new Array(10).fill(null).map((item, index) => ({
        id: index + 1,
        FirstName: "First name",
        LastName: "Last name",
        ShowcaseName: "Showcase name",
        DateOfBirth: "Date of birth",
        Height: "Height",
        BustChest: "BustChest",
        Waist: "Waist",
        Hips: "Hips",
        Shoes: "Shoes",
        Eyes: "Eyes",
        Hair: "Hair",
        Piercings: "Piercings",
        BraSize: "BraSize",
        SuitSize: "SuitSize",
        DressSize: "DressSize",
        Ethnicity: "Ethnicity",
        // height: "162cm",
        // amount: Math.random() * 1000,
        // status: "pending",
        // email: `${Math.random().toString(36).substring(2, 10)}@example.com`,
      }))
    );
  }

  useEffect(() => {
    getData();
  }, []);

  const handleEditModel = () => {
    setFormData({ ...formData, id: 1 });
    setModelSheet(true);
  };

  const handleAddModel = () => {
    setFormData(initialForm);
    setModelSheet(true);
  };

  const handleAddAsset = () => {
    setAssets([
      ...assets,
      {
        order: assets.length + 1,
        image_file: null,
        type: "carousel",
        model_id: 1,
      },
    ]);
  };

  const handleInputChange = (index, key, value) => {
    const newAssets = [...assets];
    newAssets[index][key] = value;
    setAssets(newAssets);
  };

  const handleFileChange = (index, file) => {
    handleInputChange(index, "image_file", file);
  };

  const handleSubmitAssets = (event) => {
    event.preventDefault();
    const expectedOutput = [assets];
    console.log(expectedOutput);
  };

  console.log(formData, "< formData");
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
        <div
          className="grid grid-cols-2 p-2 gap-5 md:grid-cols-3 md:p-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-9"
          // className="grid grid-flow-col auto-cols-max md:auto-cols-min"
        >
          {/* //! CARD COMPONENT */}
          <div className="bg-white shadow-lg border border-gray-50 aspect-[3/4.5] flex flex-col justify-between gap-0">
            <div>
              {/* //! MODEL IMAGE */}
              <div
                className="p-2 md:p-3 cursor-pointer"
                onClick={handleEditModel}
              >
                <img
                  className="aspect-square object-cover"
                  src="https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
              </div>
              {/* //! MODEL IMAGE */}
              <div className="flex justify-center">
                <p className="text-xs sm:text-sm xl:text-base">Model Name</p>
              </div>
            </div>

            <div className="flex items-center justify-between mx-2 mb-1">
              <div className="bg-green-700 rounded-full h-2 w-2"></div>
              {/* <Badge variant="outline">Active</Badge> */}
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      // onClick={() => setAssetsSheet(true)}
                      onClick={() => router.push("/models/assets?model=test")}
                    >
                      Assets
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Show")}>
                      Show
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Hide")}>
                      Hide
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem>Set due date...</DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setDeleteDialog(true)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* //! CARD COMPONENT */}
        </div>
      </div>

      {/* //! Model sheet */}
      <Sheet open={modelSheet} onOpenChange={setModelSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Model Details</SheetTitle>
            {/* <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription> */}
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
              <Button type="submit">Save changes</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      {/* //! Model sheet */}

      {/* //! Asset sheet */}
      <Sheet open={assetsSheet} onOpenChange={setAssetsSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Assetes</SheetTitle>
            {/* <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription> */}
          </SheetHeader>
          <form
            onSubmit={handleSubmitAssets}
            className="overflow-auto max-h-[100vh] pb-52"
          >
            <div className="grid gap-4 grid-cols-2 py-4">
              {/* //! image */}
              <div className="col-span-2">
                <Button type="button" onClick={handleAddAsset}>
                  Add
                </Button>
              </div>
              {assets.map((item, index) => (
                <div key={index} className="col-span-2">
                  <div className="flex gap-2">
                    <div>
                      <Label
                        htmlFor={`image_type_${index}`}
                        className="text-left"
                      >
                        Image type
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange(index, "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select image type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="carousel">Carousel</SelectItem>
                            <SelectItem value="polaroid">Polaroid</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor={`cover_img_${index}`}
                        className="text-left"
                      >
                        Cover image
                      </Label>
                      <Input
                        id={`cover_img_${index}`}
                        type="file"
                        onChange={(e) =>
                          handleFileChange(index, e.target.files[0])
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>

                  <div className="p-5 md:p-3">
                    {item.image_file && (
                      <img
                        className="aspect-square object-cover"
                        src={URL.createObjectURL(item.image_file)}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      {/* //! Asset sheet */}

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
            <AlertDialogAction onClick={() => console.log("DELETE")}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* //! Dialog delete model */}
    </SidebarInset>
  );
}
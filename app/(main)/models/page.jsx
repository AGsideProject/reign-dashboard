"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BookDashed,
  FileImage,
  Glasses,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import reignLogo from "@/public/images/reignLogo.jpg";
import fetchGlobal from "@/lib/fetch-data";
import useDeviceType from "@/hooks/use-device";

export default function Page() {
  const device = useDeviceType();
  const { toast } = useToast();
  const router = useRouter();

  const [tabsValue, setTabsValue] = useState("all");
  const [modelSheet, setModelSheet] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modelList, setModelList] = useState();

  const initialForm = {
    id: "",
    name: "",
    slug: "",
    ig_username: "",
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
      try {
        setLoading(true);

        const id = formData.id;
        const _formData = new FormData();
        _formData.append("name", formData.name);
        _formData.append("slug", formData.slug);
        _formData.append("bust", formData.bust);
        _formData.append("ig_username", formData.ig_username);
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

        const dataGlobal = await fetchGlobal(
          `/v1/model/admin/${id}`,
          {
            method: "PUT",
            body: _formData,
            contentType: "form-data",
          },
          true
        );

        toast({
          title: "Strike a Pose! 📸",
          description: "Update successfull! Time to strike a pose!",
          variant: "default",
          className: "bg-emerald-50 text-black",
        });

        setLoading(false);
        fetchReignModels();
        setFormData(initialForm);
        setModelSheet(false);
      } catch (error) {
        console.error("Error saving changes", error);
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
      try {
        setLoading(true);
        const _formData = new FormData();
        _formData.append("name", formData.name);
        _formData.append("slug", formData.slug);
        _formData.append("ig_username", formData.ig_username);
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

        const dataGlobal = await fetchGlobal(
          "/v1/model/admin",
          {
            method: "POST",
            body: _formData,
            contentType: "form-data",
          },
          true
        );

        toast({
          title: "Strike a Pose! 📸",
          description: "Added successfull! Time to strike a pose!",
          variant: "default",
          className: "bg-emerald-50 text-black",
        });

        setLoading(false);
        fetchReignModels();
        setFormData(initialForm);
        setModelSheet(false);
      } catch (error) {
        console.error("Error saving changes", error);
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
    let newStatus = status === "active" ? "inactive" : "active";

    try {
      await fetchGlobal(
        `/v1/model/admin/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        },
        true
      );

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
    }
    fetchReignModels();
    setFormData(initialForm);
  };

  //! untuk handle fetch all model
  const fetchReignModels = async () => {
    setLoading(true);
    try {
      const dataGLobal = await fetchGlobal("/v1/model/admin/list");

      setModelList(dataGLobal);
      setLoading(false);
    } catch (error) {
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
      ig_username: model.ig_username || "no data",
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

      await fetchGlobal(
        `/v1/model/admin/${id}`,
        {
          method: "DELETE",
        },
        true
      );

      toast({
        title: "Buh-Bye! 👋",
        description:
          "That model's off to the digital afterlife. We'll miss you! 💔",
        variant: "default",
        className: "bg-emerald-100 text-black",
      });
      setLoading(false);
      fetchReignModels();
      setDeleteDialog(false);
      setFormData(initialForm);
    } catch (error) {
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

  const [filteredModels, setFilteredModels] = useState(modelList);

  useEffect(() => {
    if (tabsValue === "all") {
      setFilteredModels(modelList);
    } else {
      setFilteredModels(modelList.filter((item) => item.gender === tabsValue));
    }
  }, [tabsValue, modelList]);

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
            {loading && (
              <div
                className={`grid ${
                  device === "mobile" ? "grid-cols-2" : "grid-cols-3"
                } p-2 gap-5 md:grid-cols-3 md:p-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-9`}
              >
                {[...Array(5)].map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="flex items-center justify-center aspect-[3/4.5] bg-gray-300 rounded-sm lg:w-[209px] lg:h-[314px] dark:bg-gray-700"
                  >
                    <FileImage color="grey" size="25px" />
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredModels && !filteredModels.length && (
              <div className="text-center flex w-full justify-center gap-2 items-center h-[50vh]">
                <Glasses color="gray" size={19} />
                <p className="text-gray-500">No models data</p>{" "}
              </div>
            )}

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
                                `/models/assets?model=${model.slug}&id=${
                                  model.id
                                }&ig_username=${model.ig_username || ""}`
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
            <div className="grid gap-4 grid-cols-2 py-4 px-[1px]">
              <div>
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
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
                  placeholder="jane-doe"
                  value={formData.slug}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-left">
                  Instagram
                </Label>
                <Input
                  id="ig_username"
                  placeholder="janedoe"
                  value={formData.ig_username}
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
                  placeholder="175"
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
                  placeholder="85"
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
                  placeholder="60"
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
                  placeholder="90"
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
                  placeholder="39"
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
                  placeholder="Brown"
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
                  placeholder="Green"
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
                  placeholder="Female"
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

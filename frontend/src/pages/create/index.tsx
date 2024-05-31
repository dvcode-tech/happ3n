import { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import path from "path";

import {
  LuMapPin,
  LuUserCheck2,
  LuArrowUpToLine,
  LuPenLine,
  LuUploadCloud,
  LuImage,
  LuLoader,
} from "react-icons/lu";

import slugify from "react-slugify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodNullableType, date, z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDialog } from "@/components/ui/file-dialog";
import { useRestActor } from "@bundly/ares-react";
import { toast } from "@/components/ui/use-toast";
import { useHappenContext } from "@/context/HappenContext";
import { useRouter } from "next/router";

const formSchema = z.object({
  name: z.string().refine((value) => value !== "", {
    message: "This is required",
  }),
  slug: z.string(),
  start_at: z.string(),
  end_at: z.string(),
  location_type: z.string().refine((value) => value !== "", {
    message: "This is required",
  }),
  location: z.string().refine((value) => value !== "", {
    message: "This is required",
  }),
  required_approval: z.boolean(),
  capacity: z.string().refine((value) => value !== "", {
    message: "This is required",
  }),
  banner: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
  type: z.string(),
  description: z.string().refine((value) => value !== "", {
    message: "This is required",
  }),
});

const Create: NextPage = () => {
  const router = useRouter();
  const { backend, ctxAccount, isAuthenticated } = useHappenContext();
  const [locationValue, setLocationValue] = useState(
    "Offline Location or Virtual Link",
  );
  const [descriptionValue, setDescriptionValue] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(0);
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [submittingLoading, setSubmittingLoading] = useState(false);

  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };

  const dialogClose = () => {
    document.getElementById("closeDialog")?.click();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      name: "",
      slug: "",
      start_at: "",
      end_at: "",
      location: "",
      required_approval: false,
      capacity: "",
      banner: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmittingLoading(true);

      let banner_url = "https://i.imgur.com/XkHp9zo.png";

      const handleUpload = async () => {
        // @ts-ignore
        if (!values.banner?.[0]) return null;
        const file = (values.banner as unknown as any)[0];

        const reference = (
          new Date().getTime().toString(36) +
          Math.random().toString(36).slice(2)
        ).toLowerCase();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              filename: `${reference}${path.extname(file.name)}`,
              contents: (reader.result as any)?.split(",")[1],
            });
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      };

      const bannerRessult = await handleUpload();

      if (bannerRessult) {
        const imagePost = await backend.post(
          "/upload",
          { file: bannerRessult },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        banner_url = (imagePost.data as any)?.data;
      }

      const slug = slugify(values.name);

      const locationData = {
        type: values.location_type,
        location: values.location,
      };

      const locationJson = JSON.stringify(locationData);

      const data = {
        type: Number(type),
        banner: banner_url,
        name: values.name,
        slug: slug,
        start_at: Number(new Date(startAt).getTime()),
        end_at: Number(new Date(endAt).getTime()),
        location: locationJson,
        required_approval: approvalStatus,
        capacity: Number(capacity),
        description: descriptionValue,
      };

      console.log(data);

      const eventPost = await backend.post("/event/create", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        variant: "default",
        title: "Success",
        description: (eventPost.data as any)?.message,
        duration: 2000,
      });

      router.push(`/event/manage?q=${slug}`);
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e?.message || e?.data?.message,
        duration: 1000,
      });
    } finally {
      setSubmittingLoading(false);
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[#131517] from-10% via-[#00071C] via-50% to-[#00071C] to-90% bg-fixed">
      <Header />
      <Navbar />
      <section className="mx-auto max-w-[950px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex h-full flex-col gap-5 p-4 md:flex-row lg:gap-8"
          >
            <FormItem>
              <div className="flex flex-row gap-1.5">
                <FormControl>
                  <FileDialog
                    size="h-80"
                    setValue={form.setValue}
                    name="banner"
                    maxFiles={1}
                    maxSize={1024 * 1024 * 0.8}
                    accept={{ "image/*": [] }}
                    isUploading={false}
                    disabled={false}
                  >
                    <Button
                      variant="outline"
                      className="relative flex aspect-[1/1] h-[358px] flex-col items-center justify-center rounded-xl bg-[url('/assets/placeholder/placeholder_banner.png')] bg-cover bg-no-repeat md:h-[280px] lg:h-[330px]"
                    >
                      <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white hover:text-gray-700">
                        <LuImage className="h-5 w-5" />
                      </div>
                    </Button>
                  </FileDialog>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>

            <div className="flex flex-1 flex-col space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex h-full flex-1">
                        <Select
                          onValueChange={(e) => {
                            field.onChange;
                            console.log(e);
                            setType(e);
                          }}
                        >
                          <SelectTrigger className="h-9 max-w-[150px] dark:bg-[#FFFFFF14] dark:text-[#FFFFFFA3]">
                            <SelectValue
                              placeholder="Public"
                              defaultValue={type}
                            />
                          </SelectTrigger>
                          <SelectContent className="max-w-[280px] p-2 dark:bg-[#232331] dark:text-[#FFFFFFA3]">
                            <SelectGroup>
                              <SelectItem
                                className="flex items-start justify-start text-left text-[14px] text-white"
                                value="0"
                              >
                                Public
                                {/* <p className="text-[#FFFFFF80]">
                                  Shown on your calendar and eligible to be
                                  featured.
                                </p> */}
                              </SelectItem>
                              <SelectItem
                                className="text-[14px] text-white"
                                value="1"
                              >
                                Private
                                {/* <p className="text-[#FFFFFF80]">
                                  Unlisted. Only people with the link can
                                  register.
                                </p> */}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Eventname */}
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="flex h-10 w-full rounded-md border border-none bg-transparent px-0 py-2 text-[40px] font-semibold text-[#FFFFFFA3] ring-offset-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent active:bg-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-none dark:bg-transparent dark:ring-offset-transparent dark:placeholder:text-[#939597] dark:focus-visible:ring-transparent"
                          placeholder="Event Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row justify-between gap-1 rounded-md border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                <div className="relative w-full">
                  <div className="absolute top-5 hidden h-8 border-l-[1px] border-dashed border-[#5F6062] md:block"></div>
                  <div className="absolute -left-[5.8px] top-[5px] hidden h-3 w-3 rounded-full bg-[#5F6062] md:block"></div>
                  <div className="absolute -left-[5.8px] bottom-[5px] hidden h-3 w-3 rounded-full border border-[#5F6062] md:block"></div>

                  <div className="flex w-full flex-1 justify-between">
                    <div className="ml-6 hidden flex-col justify-between gap-1 md:flex dark:text-[#FFFFFFA3]">
                      <div>Start</div>
                      <div>End</div>
                    </div>
                    <div className="flex w-full flex-col gap-1 md:w-[221px]">
                      <div className="grid w-full grid-cols-1 gap-1">
                        <FormField
                          control={form.control}
                          name="start_at"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between gap-4">
                                <div className="block text-[#FFFFFFA3] md:hidden">
                                  Start
                                </div>
                                <FormControl>
                                  <input
                                    defaultValue={new Date().toISOString()}
                                    type="datetime-local"
                                    className="w-[267px] rounded-lg px-4 py-1 md:rounded-sm dark:bg-[#FFFFFF14] dark:text-[#FFFFFF]"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                      setStartAt(e.target.value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="end_at"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between gap-4">
                                <div className="block text-[#FFFFFFA3] md:hidden">
                                  End
                                </div>
                                <FormControl>
                                  <input
                                    defaultValue={new Date().toISOString()}
                                    type="datetime-local"
                                    className="w-[267px] rounded-lg px-4 py-1 md:rounded-sm dark:bg-[#FFFFFF14] dark:text-[#FFFFFF]"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                      setEndAt(e.target.value);
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 rounded-md  border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                <div className="flex gap-2 text-gray-300">
                  <LuMapPin className="text-lg" />
                  <div className="flex flex-col">
                    <h3>Add Event Location</h3>
                    <p className="text-[12px]">
                      Offline Location or Virtual Link
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-1 flex-col gap-2 md:flex-row">
                  <FormField
                    control={form.control}
                    name="location_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-1">
                            <Select
                              onValueChange={(e) => {
                                field.onChange(e);
                                setLocationValue(e);
                              }}
                            >
                              <SelectTrigger className="h-9 rounded-sm dark:bg-[#FFFFFF14]  dark:text-[#FFFFFFA3]">
                                <SelectValue
                                  placeholder="Select Offline or Virtual"
                                  {...field}
                                />
                              </SelectTrigger>
                              <SelectContent className="max-w-[280px] p-2 dark:bg-[#232331] dark:text-[#FFFFFFA3]">
                                <SelectGroup>
                                  <SelectLabel>
                                    Offline Location or Virtual Link
                                  </SelectLabel>
                                  <SelectItem
                                    className="text-[14px] text-white"
                                    value="OFFLINE"
                                  >
                                    Offline Location
                                  </SelectItem>
                                  <SelectItem
                                    className="text-[14px] text-white"
                                    value="VIRTUAL"
                                  >
                                    Virtual Link
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-1 flex-col">
                        <FormControl>
                          <div className="flex h-full w-full flex-1">
                            <input
                              placeholder="Enter Offline Location or Virtual Link"
                              className="w-full rounded-sm px-4 py-1 text-[14px] dark:bg-[#FFFFFF14] dark:text-[#FFFFFFA3]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Dialog>
                        <div className="flex flex-col gap-1 border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                          <DialogTrigger>
                            <div className="flex gap-2 text-gray-300">
                              <LuMapPin className="min-w-[25px]" />
                              <div className="flex flex-col items-start">
                                <h3>Add Description</h3>
                                <p className="line-clamp-1 text-left text-[12px]">
                                  {descriptionValue}
                                </p>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="border border-[#333537]/30 bg-transparent p-0">
                            <DialogHeader className="space-y-0">
                              <DialogTitle className="rounded-t-lg bg-[#333537] p-4 text-[17px] text-white">
                                Event Description
                              </DialogTitle>
                              <DialogDescription className="bg-[#131517] p-4">
                                <Textarea
                                  className="h-[200px] resize-none bg-[#131517] text-[16px] outline-none placeholder:font-semibold placeholder:text-[#4c4d4f]"
                                  placeholder="Who should come? What's the event about?"
                                  {...field}
                                />
                              </DialogDescription>
                              <div className="flex w-full flex-1 items-center justify-end gap-2 rounded-b-lg bg-[#333537] px-4 py-2">
                                <Button
                                  onClick={() => {
                                    setDescriptionValue(field.value);
                                    dialogClose();
                                  }}
                                >
                                  Done
                                </Button>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </div>
                      </Dialog>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <div className="text-[14px] text-[#FFFFFFA3]">
                  Event Options
                </div>
                <div className="flex flex-col gap-1 rounded-md  border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                  <FormField
                    control={form.control}
                    name="required_approval"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex w-full items-center justify-between border-b border-gray-600/30">
                          <div className="flex items-center gap-2 py-2 text-gray-300 ">
                            <LuUserCheck2 className="min-w-[25px]" />
                            <div className="flex flex-col items-start">
                              <h3>Require Approval</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <FormControl>
                              <Switch
                                onCheckedChange={(e) => {
                                  field.onChange(e);
                                  console.log(e);

                                  if (e) {
                                    setApprovalStatus(1);
                                    console.log(1);
                                  } else {
                                    console.log(0);
                                    setApprovalStatus(0);
                                  }
                                }}
                              />
                            </FormControl>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <Dialog>
                          <DialogTrigger className="flex w-full flex-1">
                            <div className="flex w-full flex-1 items-center justify-between">
                              <div className="flex items-center gap-2 py-2 text-gray-300">
                                <LuArrowUpToLine className="min-w-[25px]" />
                                <div className="flex flex-col items-start">
                                  <h3>Capacity</h3>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                {Number(capacity) <= 0 ? "" : capacity}{" "}
                                <LuPenLine />
                              </div>
                            </div>
                          </DialogTrigger>
                          <FormMessage />
                          <DialogContent className="max-w-[340px] overflow-hidden rounded-3xl bg-black/60 p-0">
                            <DialogHeader className="space-y-0">
                              <DialogDescription className="flex flex-col gap-2 bg-[#1D2025]/40 px-4 pt-5 backdrop-blur-md">
                                <div className="text-white">
                                  <div className="mb-[8px] text-[20px]">
                                    Max Capacity
                                  </div>
                                  <p className="text-[#FFFFFFC9]">
                                    Auto-close registration when the capacity is
                                    reached. Only approved guests count toward
                                    the cap.
                                  </p>
                                  <h3 className="mt-[8px] pt-[4px] font-bold">
                                    Capacity
                                  </h3>
                                </div>
                                <FormControl>
                                  <Input
                                    defaultValue={"50"}
                                    className="text-white outline-none"
                                    {...field}
                                  />
                                </FormControl>
                              </DialogDescription>
                              <div className="flex w-full flex-1 items-center gap-2 rounded-b-lg bg-[#1D2025]/40 px-4 py-5">
                                <Button
                                  onClick={() => {
                                    setCapacity(field.value);
                                    dialogClose();
                                  }}
                                  className="w-full"
                                >
                                  Set Limit
                                </Button>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {!submittingLoading && (
                <Button type="submit" className="flex w-full flex-1">
                  Create Event
                </Button>
              )}
              {submittingLoading && (
                <LuLoader className="mx-auto mt-4 h-6 w-6 animate-spin text-white" />
              )}
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default Create;

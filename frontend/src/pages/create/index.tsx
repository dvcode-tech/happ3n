import { NextPage } from "next";
import { useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

import {
  LuMapPin,
  LuUserCheck2,
  LuArrowUpToLine,
  LuPenLine,
  LuUploadCloud,
  LuImage,
} from "react-icons/lu";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const formSchema = z.object({
  status: z.string(),
  banner: z.string(),
  eventName: z.string(),
  startDate: z.string(),
  startTime: z.string(),
  endDate: z.string(),
  endTime: z.string(),
  location: z.string(),
  locationLink: z.string(),
  description: z.string(),
  require_approval: z.string(),
});

const Create: NextPage = () => {
  const [locationValue, setLocationValue] = useState(
    "Offline Location or Virtual Link",
  );
  const [descriptionValue, setDescriptionValue] = useState("");

  const dialogClose = () => {
    document.getElementById("closeDialog")?.click();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      banner: "",
      eventName: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
      locationLink: "",
      description: "",
      require_approval: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        eventName: values.eventName,
      };
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[#131517] from-10% via-[#00071C] via-50% to-[#00071C] to-90% bg-fixed">
      <Header />
      <Navbar />
      <section className="mx-auto max-w-[950px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col gap-5 p-4 md:flex-row lg:gap-8"
          >
            <FormItem>
              <div className="flex flex-row gap-1.5">
                <FormControl>
                  <FileDialog
                    setValue={form.setValue}
                    name="banner"
                    maxFiles={1}
                    maxSize={1024 * 1024 * 10}
                    accept={{ "image/*": [] }}
                    isUploading={false}
                    disabled={false}
                  >
                    <Button
                      variant="outline"
                      className="relative flex aspect-[1/1] h-[358px] flex-col items-center justify-center rounded-xl bg-[url('/assets/placeholder/placeholder-event.png')] bg-cover bg-no-repeat md:h-[280px] lg:h-[330px]"
                    >
                      <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white">
                        <LuImage className="h-5 w-5" />
                      </div>
                    </Button>
                  </FileDialog>
                </FormControl>
              </div>
            </FormItem>

            <div className="flex flex-1 flex-col space-y-4">
              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex h-full flex-1">
                        <Select>
                          <SelectTrigger className="h-9 max-w-[101px] dark:bg-[#FFFFFF14] dark:text-[#FFFFFFA3]">
                            <SelectValue placeholder="Public" />
                          </SelectTrigger>
                          <SelectContent className="max-w-[280px] p-2 dark:bg-[#232331] dark:text-[#FFFFFFA3]">
                            <SelectGroup>
                              <SelectItem
                                className="text-[14px] text-white"
                                value="public"
                              >
                                Public
                                <p className="text-[#FFFFFF80]">
                                  Shown on your calendar and eligible to be
                                  featured.
                                </p>
                              </SelectItem>
                              <SelectItem
                                className="text-[14px] text-white"
                                value="create"
                              >
                                Private
                                <p className="text-[#FFFFFF80]">
                                  Unlisted. Only people with the link can
                                  register.
                                </p>
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              /> */}

              <div>
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          className="bg-transparent text-[28px] font-semibold text-[#FFFFFFA3] outline-none focus:ring-transparent lg:text-[40px]"
                          placeholder="Event Name"
                          {...field}
                        />
                      </FormControl>
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
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <input
                                  defaultValue={
                                    new Date().toISOString().split("T")[0]
                                  }
                                  type="date"
                                  className="rounded-sm px-1 py-1 dark:bg-[#FFFFFF14] dark:text-[#FFFFFFA3]"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <input
                                  type="time"
                                  className="rounded-sm px-1 py-1 dark:bg-[#FFFFFF14] dark:text-[#FFFFFFA3]"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-1">
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <input
                                  defaultValue={
                                    new Date().toISOString().split("T")[0]
                                  }
                                  type="date"
                                  className="rounded-sm px-1 py-1 dark:bg-[#FFFFFF14] dark:text-[#FFFFFFA3]"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <input
                                  type="time"
                                  className="rounded-sm px-1 py-1 dark:bg-[#FFFFFF14] dark:text-[#FFFFFFA3]"
                                  {...field}
                                />
                              </FormControl>
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

                <div className="flex flex-1 flex-col gap-2 md:flex-row">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex h-full flex-1">
                            <Select
                              onValueChange={(e) => {
                                field.onChange(e);
                                setLocationValue(e);
                              }}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="h-9 rounded-sm dark:bg-[#FFFFFF14]  dark:text-[#FFFFFFA3]">
                                <SelectValue
                                  placeholder="Offline Location"
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
                                    value="Offline Location"
                                  >
                                    Offline Location
                                  </SelectItem>
                                  <SelectItem
                                    className="text-[14px] text-white"
                                    value="Virtual Link"
                                  >
                                    Virtual Link
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="locationLink"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-1">
                        <FormControl>
                          <div className="flex h-full w-full flex-1">
                            <input
                              placeholder={locationValue}
                              className="w-full rounded-sm px-4 py-1 text-[14px] dark:bg-[#FFFFFF14] dark:text-[#FFFFFFA3]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Dialog>
                        <div className="flex flex-col gap-1 rounded-md  border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                          <DialogTrigger>
                            <div className="flex gap-2 text-gray-300">
                              <LuMapPin className="min-w-[25px]" />
                              <div className="flex flex-col items-start">
                                <h3>Add Description</h3>
                                <p className="line-clamp-1 text-left text-[12px]">
                                  {}
                                </p>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="rounded-3xl border border-[#333537]/30 p-0">
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
                                <Button onClick={() => dialogClose()}>
                                  Done
                                </Button>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </div>
                      </Dialog>
                    </FormControl>
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
                    name="require_approval"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex w-full items-center justify-between border-b border-gray-600/30">
                            <div className="flex items-center gap-2 py-2 text-gray-300 ">
                              <LuUserCheck2 className="min-w-[25px]" />
                              <div className="flex flex-col items-start">
                                <h3>Require Approval</h3>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Switch {...field} />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
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
                                  Unlimited <LuPenLine />
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-[340px] overflow-hidden rounded-3xl bg-black/60 p-0">
                              <DialogHeader className="space-y-0">
                                <DialogDescription className="flex flex-col gap-2 bg-[#1D2025]/40 px-4 pt-5 backdrop-blur-md">
                                  <div className="text-white">
                                    <div className="mb-[8px] text-[20px]">
                                      Max Capacity
                                    </div>
                                    <p className="text-[#FFFFFFC9]">
                                      Auto-close registration when the capacity
                                      is reached. Only approved guests count
                                      toward the cap.
                                    </p>
                                    <h3 className="mt-[8px] pt-[4px] font-bold">
                                      Capacity
                                    </h3>
                                  </div>
                                  <Input
                                    defaultValue={"50"}
                                    className="text-white outline-none"
                                  />
                                </DialogDescription>
                                <div className="flex w-full flex-1 items-center gap-2 rounded-b-lg bg-[#1D2025]/40 px-4 py-5">
                                  <Button className="w-full">Set Limit</Button>
                                  <Button className="w-full dark:bg-[#2F3136] dark:text-white">
                                    Remove Limit
                                  </Button>
                                </div>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="flex w-full flex-1">
                Create Event
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default Create;

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import clsx from "clsx";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import TimeInput from "./TimeInput";
import toast from "react-hot-toast";
import fetchToken from "@/lib/auth";

type AcceptedFile = {
  file: File;
  preview: string;
};

const FormSchema = z.object({
  title: z.string().min(1, { message: "Required" }),
  body: z.string().min(1, { message: "Required" }),
  target: z.string({
    required_error: "Please select an email to display.",
  }),
});

const UpdateBroadcastMessage = ({ notification, refetch }: any) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      target: notification?.target || "",
    },
  });
  const [imageUrl, setImageUrl] = React.useState<AcceptedFile[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [dobError, setDobError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reasonError, setReasonError] = useState("");
  const trimmedTime = selectedTime.replace(/AM|PM|undefined/, "").trim();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (notification) {
      // Populate form fields
      form.reset({
        title: notification?.title,
        body: notification?.body,
      });

      // Populate date
      if (notification?.created_at) {
        const date = new Date(notification?.created_at).toLocaleString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
        setSelectedDate(new Date(date));
      }

      // Populate time
      if (notification?.created_at) {
        const time = new Date(notification?.created_at).toLocaleString(
          "en-GB",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }
        );
        setSelectedTime(time);
      }

      // Populate image
      if (notification?.attachment) {
        setImageUrl([
          {
            file: null as unknown as File, // Placeholder since the file is not available
            preview: notification.attachment,
          },
        ]);
      }
    }
  }, [notification, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    if (selectedDate) {
      const dateString = selectedDate?.toISOString().split("T")[0];

      const formData = new FormData();
      formData.append("title", data?.title);
      formData.append("body", data?.body);
      formData.append("date", dateString);
      formData.append("time", trimmedTime);
      formData.append("target", data?.target);

      if (imageUrl.length > 0 && imageUrl[0].file) {
        // If a new file is added, append it
        formData.append("attachment", imageUrl[0].file);
      } else {
        ("");
      }

      const token = await fetchToken();
      const headers = {
        Authorization: `Bearer ${token?.data?.token}`,
        Accept: "application/json",
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/anoucements/${notification?.id}/update`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      const resdata = await res.json();
      if (resdata?.status == "success") {
        setIsLoading(false);
        toast.success("Success");
        refetch();
      }
      if (resdata?.status == "error") {
        setIsLoading(false);
        toast.error("Error Occured");
      }
    }
  };

  const {
    getRootProps: getImage2RootProps,
    getInputProps: getImage2InputProps,
  } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setImageUrl(
        acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }))
      );
    },
    onDropRejected: (fileRejections) => {
      const invalidFiles = fileRejections.filter((fileRejection) => {
        if (fileRejection.file.size > 2000000) {
          return true;
        }
        if (!fileRejection.file.type.startsWith("image/")) {
          return true;
        }
        return false;
      });
      if (invalidFiles.length > 0) {
        alert(
          "Invalid format. Image must be of type jpg, jpeg, png, gif, svg or webp."
        );
      }
    },
  });

  const removeFile = (
    setFileFunction: React.Dispatch<React.SetStateAction<AcceptedFile[]>>,
    fileToRemove: AcceptedFile
  ) => {
    setFileFunction((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {" "}
          <div className="grid gap-4 m-1">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter a concise title for the notification"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Write the message you want to send"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem className="">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <SelectTrigger className="py-6">
                          <SelectValue
                            className="text-gray-400"
                            placeholder="Select target audience"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="agent">Connector</SelectItem>
                        <SelectItem value="passenger">Passenger</SelectItem>
                        {/* <SelectItem value="specific">Specific</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-2">
              <FormItem>
                <FormLabel htmlFor="dateInput">Select a date:</FormLabel>

                <div className="border border-gray-200 p-2 rounded-lg flex flex-col">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="YYYY-MM-DD"
                    id="dateInput"
                    className="date-picker-input border-none w-full outline-none h-6 pl-3 text-base py-4 placeholder:text-sm"
                  />
                </div>
              </FormItem>
              {!dobError ? <FormMessage /> : ""}
              {dobError ? (
                <FormMessage className="mt-2 text-red-500">
                  {dobError}
                </FormMessage>
              ) : (
                ""
              )}
            </div>

            <div>
              <FormItem>
                <FormLabel>Choose time</FormLabel>
                <div className="border border-gray-300 pt-2 rounded-lg flex flex-col w-full">
                  <TimeInput value={trimmedTime} onChange={setSelectedTime} />
                </div>
              </FormItem>
            </div>

            <div className="grid gap-2">
              <FormItem>
                <FormLabel>Attachment(optional)</FormLabel>

                <div
                  {...getImage2RootProps()}
                  className={clsx(
                    "dropzone cursor-pointer rounded-lg h-[250px] w-full border-2 border-[#CCD2D5] "
                  )}
                >
                  <input {...getImage2InputProps()} />
                  {imageUrl.length > 0 ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imageUrl[0].preview}
                        alt="Uploaded image 2"
                        layout="fill"
                        objectFit="cover"
                      />
                      <button
                        onClick={() => removeFile(setImageUrl, imageUrl[0])}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <div className="">
                      <div className="p-20 flex flex-col my-auto gap-y-5 text-center">
                        <div className="cursor-pointer">
                          <div className="font-semibold text-base">
                            Attach a photo
                          </div>
                        </div>
                        <div className="relative w-10 h-10 mx-auto">
                          <Image src={"/add.svg"} alt="" fill />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </FormItem>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[--primary] hover:bg-[--primary-btn] text-white py-2 px-4 rounded-md"
            >
              {isLoading ? "Loading..." : "Send Notification"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateBroadcastMessage;

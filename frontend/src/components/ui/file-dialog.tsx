/* eslint-disable @next/next/no-img-element */
import * as React from "react";

import {
  useDropzone,
  type Accept,
  type FileRejection,
  type FileWithPath,
} from "react-dropzone";
import type {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";

import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LuTrash, LuUploadCloud, LuX } from "react-icons/lu";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

interface FileDialogProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.HTMLAttributes<HTMLDivElement> {
  name: TName;
  setValue: UseFormSetValue<TFieldValues>;
  accept?: Accept;
  maxSize?: number;
  maxFiles?: number;
  // files: FileWithPreview[] | null;
  // setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>;
  isUploading?: boolean;
  disabled?: boolean;
  showSelected?: boolean;
  size?: string;
}

export function FileDialog<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/*": [],
    "file/*": [],
  },
  maxSize = 1024 * 1024 * 1,
  maxFiles = 1,
  isUploading = false,
  disabled = false,
  className,
  children,
  size = "md:h-72 lg:h-80 h-96",
  showSelected = true,
  ...props
}: FileDialogProps<TFieldValues>) {
  const [files, setFiles] = useState<FileWithPreview[] | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setFiles((prev) => [...(prev ?? []), fileWithPreview]);
      });

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === "file-too-large") {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `File is too large. Max size is ${formatBytes(maxSize)}`,
              duration: 1000,
            });
            return;
          }
          errors[0]?.message &&
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: errors[0].message,
              duration: 1000,
            });
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxSize, setFiles],
  );

  // Register files to react-hook-form
  useEffect(() => {
    setValue(name, files as PathValue<TFieldValues, Path<TFieldValues>>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
    disabled,
  });

  // Revoke preview url when component unmounts
  useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showSelected && files?.length ? (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div className="relative" key={file.preview}>
              <div
                onClick={() => {
                  if (!files) return;
                  setFiles(files.filter((_, j) => j !== i));
                }}
                className="absolute bottom-2 right-2 flex cursor-pointer flex-col items-center justify-center rounded-md !border-dashed bg-black/50 p-1 transition-all duration-300 hover:bg-red-500/50"
              >
                <LuTrash className="h-4 w-4 text-red-500" aria-hidden="true" />
                <span className="sr-only">Remove</span>
              </div>
              <object
                data={file.preview}
                className={`checkers-bg items-center justify-center rounded-md object-scale-down md:rounded-xl ${size}`}
                type={file.type}
              />
            </div>
          ))}
        </div>
      ) : null}
      <Dialog>
        {(files === null || files.length < maxFiles) && (
          <DialogTrigger asChild>{children}</DialogTrigger>
        )}
        <DialogContent className="z-[999] bg-[#1F1E21]/60 px-5 py-3 backdrop-blur-md sm:max-w-[480px]">
          <p className="text-muted-foreground absolute left-1/2 top-4 -translate-x-1/2 text-base font-medium text-white">
            Choose Image
          </p>
          {(files === null || files?.length < maxFiles) && (
            <>
              <div
                {...getRootProps()}
                className={cn(
                  "border-muted-foreground/25 hover:bg-muted/25 group relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border border-dashed border-[#474548] bg-[#28272A] px-5 py-2.5 text-center transition",
                  "ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isDragActive && "border-muted-foreground/50",
                  disabled && "pointer-events-none opacity-60",
                  className,
                )}
                {...props}
              >
                <input {...getInputProps()} />
                {isUploading ? (
                  <div className="group grid w-full place-items-center gap-1 sm:px-10">
                    {/* <LuUploadCloud
                      className="text-muted-foreground h-9 w-9 animate-pulse"
                      aria-hidden="true"
                    /> */}
                  </div>
                ) : isDragActive ? (
                  <div className="text-muted-foreground grid place-items-center gap-2 sm:px-5">
                    {/* <LuUploadCloud
                      className={cn(
                        "h-8 w-8",
                        isDragActive && "animate-bounce",
                      )}
                      aria-hidden="true"
                    /> */}
                    <p className="text-base font-medium">Drop the file here</p>
                  </div>
                ) : (
                  <div className="grid place-items-center gap-1 sm:px-5">
                    {/* <LuUploadCloud
                      className="text-muted-foreground h-8 w-8"
                      aria-hidden="true"
                    /> */}
                    <p className="text-muted-foreground mt-2 text-base font-medium text-[#FFFFFFC9]">
                      Drag & drop or click here to upload.
                    </p>
                    <p className="text-sm text-[#FFFFFF80]">
                      Please upload file with size less than{" "}
                      {formatBytes(maxSize)}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-center text-[12px] uppercase text-[#FFFFFF80]">
                The ideal aspect ratio is 1:1
              </p>
            </>
          )}

          {files?.length ? (
            <div className="mt-6 grid max-h-[40vh] shrink-0 gap-5 overflow-y-auto text-[#FFFFFF80]">
              {files?.map((file, i) => (
                <FileCard
                  key={file.preview}
                  i={i}
                  files={files}
                  setFiles={setFiles}
                  file={file}
                />
              ))}
            </div>
          ) : null}
          {files?.length ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2.5 w-full text-[#FFFFFF80] dark:bg-[#FFFFFF14]"
              onClick={() => setFiles(null)}
            >
              <LuTrash className="mr-2 h-4 w-4" aria-hidden="true" />
              Remove All
              <span className="sr-only">Remove all</span>
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

interface FileCardProps {
  i: number;
  file: FileWithPreview;
  files: FileWithPreview[] | null;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>;
}

function FileCard({ i, file, files, setFiles }: FileCardProps) {
  const dialogClose = () => {
    document.getElementById("closeDialog")?.click();
  };
  return (
    <div className="relative flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <object
          data={file.preview}
          className="checkers-bg h-10 w-10 shrink-0 rounded-md object-contain"
          type={file.type}
        />
        <div className="flex flex-col">
          <p className="text-muted-foreground line-clamp-1 max-w-xs truncate text-sm font-medium">
            {file.name}
          </p>
          <p className="text-xs text-slate-500">
            {(file.size / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7 text-[#FFFFFF80] dark:bg-[#FFFFFF14]"
          onClick={() => {
            // if (!files) return;
            // setFiles(files.filter((_, j) => j !== i));
            dialogClose();
          }}
        >
          <LuX className="h-4 w-4" aria-hidden="true" />
          {/* <span className="sr-only">Remove file</span> */}
        </Button>
      </div>
    </div>
  );
}

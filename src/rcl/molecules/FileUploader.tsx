"use client"

import { FolderAdd, WarningAltFilled } from "@carbon/icons-react";
import cn from "classnames";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

import Card from '@/rcl/atoms/Card'
import LoadingDots from '@/rcl/atoms/LoadingDots'

interface Props {
  onDrop: (files: File[]) => void
}

const TelepacDropZone = ({onDrop}: Props) => {

  const { t } = useTranslation();

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setStatus("loading");
    onDrop(acceptedFiles)
  }, [onDrop])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  });

  return (
    <Card className={cn("h-64")}>
      <div
        className="w-full h-full p-4 transform border-4 border-dashed rounded-lg flex-center hover:cursor-pointer transition-transform hover:scale-[101%]"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <FolderAdd className="text-gray-500" />
          {isDragActive ? (
            <p>{t("telepac.dropHere", "Drop the file here...")}</p>
          ) : status === "loading" ? (
            <LoadingDots />
          ) : status === "error" ? (
            <p>
              <WarningAltFilled className="inline mr-2 -mt-1 text-yellow-600" />
              {t(
                "telepac.dropzoneError",
                "There was an error processing your file. Please check that it has the right format and try again."
              )}
            </p>
          ) : (
            <p>
              {t(
                "telepac.dropzone",
                "Drag and drop the zip file here, or click to select on your computer."
              )}
            </p>
          )}
          <span className="font-mono text-gray-500">.zip</span>
        </div>
      </div>
    </Card>
  );
};

export default TelepacDropZone;

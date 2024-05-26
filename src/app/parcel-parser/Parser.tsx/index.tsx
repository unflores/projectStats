"use client"

import FileUploader from "@/rcl/molecules/FileUploader"
import { useCallback } from "react"

const Parser = () => {
    // const postTelepacParcels = useFarmerPostTelepacParcels();
  // const onDrop = useCallback(
  //   async (files: File[]) => {
  //     if (!files || !files.length) {
  //       throw new ApplicationError("error.unknown");
  //     }
  //     setStatus("loading");
  //     const formData = new FormData();
  //     formData.append("file", files[0], files[0].name);
  //     try {
  //       await postTelepacParcels(exploitationId, formData);
  //       setStatus("idle");
  //       router.push(`/farmers/exploitations/${exploitationId}/parcels`);
  //     } catch (error) {
  //       setStatus("error");
  //     }
  //   },
  //   [exploitationId, postTelepacParcels, router]
  // );

  // const onDrop =  (files: File[]) => {
  //   console.log(files)
  // }
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)
  }, [])


  return (
    <FileUploader onDrop={onDrop}/>
  )
}

export default Parser;

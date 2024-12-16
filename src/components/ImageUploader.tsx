import React, { FC, ReactNode, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import Modal from "./BlurryBackModal/Modal";

type ImageFile = {
  file: File;
  url: string;
};

interface ImageProp {
  setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  classname: string;
  trigger: ReactNode;
  multiple: boolean;
  onImageChange?: () => void;
}

const ImageUploader: FC<ImageProp> = ({
  setImages,
  trigger,
  classname,
  multiple,
  onImageChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;

    if (files) {
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      const newImages = Array.from(files)
        .filter((file) => validImageTypes.includes(file.type))
        .map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }));

      if (newImages.length > 0) {
        setSelectedImage(newImages[0]); // Open the first image in the modal
        setCropModalOpen(true);
      }
    }
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area): void => {
    setCroppedAreaPixels(croppedAreaPixels); // Save the cropped area for processing
  };

  const saveCroppedImage = (): void => {
    if (!selectedImage || !croppedAreaPixels) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.src = selectedImage.url;

    img.onload = () => {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      if (ctx) {
        ctx.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], selectedImage.file.name, {
              type: selectedImage.file.type,
            });

            const croppedUrl = URL.createObjectURL(croppedFile);

            // Save the cropped image
            setImages((prev: any) => [
              { file: croppedFile, url: croppedUrl },
              ...prev,
            ]);

            if (onImageChange) {
              onImageChange();
            }

            setCropModalOpen(false);
            setSelectedImage(null);
          }
        });
      }
    };
  };

  return (
    <div>
      <label htmlFor="fileInput" className={classname}>
        {trigger}
        <input
          type="file"
          id="fileInput"
          multiple={multiple}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>

      {cropModalOpen && selectedImage && (
        <Modal
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          className="relative p-10"
        >
          <div className="cropper-container relative h-[400px] w-full ">
            <Cropper
              image={selectedImage.url}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="mt-[20px] flex justify-between">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <div className="flex flex-col lg:flex-row gap-4">
              <button
                onClick={saveCroppedImage}
                className="bg-zinc-800 px-6 rounded py-1 text-white text-sm"
              >
                Save
              </button>
              <button className="text-sm" onClick={() => setCropModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ImageUploader;

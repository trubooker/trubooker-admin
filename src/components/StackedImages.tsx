import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";

interface StackedImagesProps {
  images: {
    profile_picture: string;
  }[];
  limit?: number ; 
}

const StackedImages: React.FC<StackedImagesProps> = ({ images, limit }) => {
  const displayedImages = limit ? images.slice(0, limit) : images.slice(0, 5);
  return (
    <div className="flex items-center relative">
      {displayedImages.map((image, index) => (
        <div
          key={index}
          className={`relative -ml-4 border-4 border-white rounded-full shadow-md`}
          style={{ zIndex: images.length + index }}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={image.profile_picture} />
            <AvatarFallback>
              <IoPersonOutline />
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  );
};

export default StackedImages;

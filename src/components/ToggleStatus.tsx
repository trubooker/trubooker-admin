import React, { FC } from "react";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";

interface Props {
  toggle: () => void;
  loading: boolean;
  status: string;
}
const ToggleStatus: FC<Props> = ({ toggle, status, loading }) => {
  const handleToggle = () => {
    toggle();
  };
  return (
    <div>
      <div className="px-8 pb-8 text-center">
        <Image
          src={"/warn.svg"}
          alt=""
          width={50}
          height={50}
          className="mx-auto mb-3"
        />
        <h2 className="font-bold text-xl mb-4">Are you sure?</h2>
        <p className="text-gray-600 mt-4">
          Going ahead will {status === "inactive" ? "activate" : "deactivate"}{" "}
          your account and {status === "inactive" ? "grant" : "restrict"} access
          to your profile and all associated data.
        </p>
      </div>
      <div className="flex items-center justify-between gap-x-5 p-6 ">
        <DialogClose className="w-full">
          <Button
            variant="outline"
            className="font-semibold lg:py-6 lg:px-6 w-full"
          >
            No
          </Button>
        </DialogClose>
        <DialogClose className="w-full">
          <Button
            variant="outline"
            disabled={loading}
            className="font-semibold bg-[--primary] w-full hover:bg-[--primary-btn] hover:text-white text-white lg:py-6 lg:px-6"
            onClick={handleToggle}
          >
            Yes
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};

export default ToggleStatus;

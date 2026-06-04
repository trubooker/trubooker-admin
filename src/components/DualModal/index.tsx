"use client";

import {
  FC,
  ReactNode,
  useState,
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
``;
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface ModalCloseProps {
  onModalClose?: () => void;
}

interface Props {
  trigger: ReactNode;
  title: string;
  description: string;
  content: ReactNode;
  classname?: string;
  onClose?: () => void;
}

export const Modal: FC<Props> = ({
  trigger,
  title,
  description,
  content,
  classname,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsMobile();

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const enhancedContent = isValidElement(content)
    ? cloneElement(content as ReactElement<ModalCloseProps>, {
        onModalClose: handleClose,
      })
    : content;

  if (!isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="">
            <ScrollArea className="max-h-[500px] pt-2 overflow-y-auto">
              {enhancedContent}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            <DialogClose className={`w-full ${classname}`}>
              <Button
                className="w-full bg-[--danger] hover:bg-[--danger-btn] text-white"
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="capitalize">{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="px-5 pt-2 max-h-[500px] overflow-y-auto">
          {enhancedContent}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose
            asChild
            className="bg-[--danger] hover:bg-[--danger-btn] text-white"
          >
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

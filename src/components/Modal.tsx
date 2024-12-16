import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FC, ReactNode } from "react";

interface Props {
  trigger: ReactNode;
  title: string;
  description: string;
  content: ReactNode;
}

export const Modal: FC<Props> = ({ trigger, title, description, content }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{content}</div>
      </DialogContent>
    </Dialog>
  );
};

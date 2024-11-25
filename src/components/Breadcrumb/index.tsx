import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";

interface Props {
  content1: string;
  content2: string;
  classname: string;
}

const Breadcrumbs: React.FC<Props> = ({ content1, content2, classname }) => {
  const router = useRouter();
  return (
    <Breadcrumb className={`${classname}`}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="cursor-pointer" onClick={router.back}>
            {content1}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage className="text-xl">{content2}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;

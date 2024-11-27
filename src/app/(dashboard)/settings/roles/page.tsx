import StackedImages from "@/components/StackedImages";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import RolesTable from "@/components/Settings/Roles/RolesTable";
import { roles } from "@/constants";
import { Modal } from "@/components/DualModal";
import { RolePermissions } from "@/components/RolePermissions";

const Roles = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-bold text-lg">Roles & permission</div>
        <span className="flex gap-x-2">
          <Modal
            trigger={
              <Button
                variant={"outline"}
                size={"sm"}
                className="bg-[--primary] text-white hover:text-white hover:bg-[--primary-btn]"
              >
                <FaPlus /> Add Role
              </Button>
            }
            title={"Add New Role"}
            description={"Set role permissions"}
            content={<RolePermissions />}
          />
        </span>
      </div>
      <div className="w-full mb-5 lg:mb-8">
        <div className="grid grid-rows-1 lg:grid-rows-none gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {roles?.map((tot: any, index: number) => (
            <Card key={index} className={`w-full border-none my-auto bg-white`}>
              <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center">
                <div className="grid grid-cols-2">
                  <div className="flex flex-col items-start gap-y-3 me-auto">
                    <span className="text-sm text-black font-normal">
                      Total {tot?.users} Users
                    </span>
                    <span className="text-lg font-bold text-black">
                      {tot?.role}
                    </span>
                    <Modal
                      trigger={
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          className="text-xs text-blue-500 hover:text-blue-500 cursor-pointer font-medium"
                        >
                          Edit Role
                        </Button>
                      }
                      title={"Edit Role"}
                      description={"Set role permissions"}
                      content={<RolePermissions id={tot?.id} />}
                    />
                  </div>
                  <div className="flex ms-auto gap-x-3 text-black items-center">
                    <StackedImages images={tot?.images} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <RolesTable />
    </div>
  );
};

export default Roles;

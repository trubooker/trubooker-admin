"use client";

import StackedImages from "@/components/StackedImages";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import RolesTable from "@/components/Settings/Roles/RolesTable";
import { roles } from "@/constants";
import { Modal } from "@/components/DualModal";
import { EditRoles } from "@/components/Settings/Roles/EditRoles";
import {
  useGetPermissionsByIdQuery,
  useGetPermissionsQuery,
  useGetRolesByIdQuery,
  useGetRolesQuery,
  useGroupUserByRolesQuery,
} from "@/redux/services/Slices/settings/rolesApiSlice";
import { AddStaffRoles } from "@/components/Settings/Roles/AddStaffRoles";
import { formatSnakeCase } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const Roles = () => {
  const {
    data,
    isLoading: roleLoading,
    isFetching: roleFetching,
  } = useGetRolesQuery(null);
  const role = data?.data;
  console.log("roles: ", role);

  const {
    data: rolesById,
    isLoading: roleByIdLoading,
    isFetching: roleByIdFetching,
  } = useGetRolesByIdQuery(1);
  console.log("rolesById: ", rolesById);

  const {
    data: permissions,
    isLoading: permissionsLoading,
    isFetching: permissionsFetching,
  } = useGetPermissionsQuery(null);
  console.log("permissions: ", permissions);

  const {
    data: groupUsers,
    isLoading: groupUsersLoading,
    isFetching: groupUsersFetching,
  } = useGroupUserByRolesQuery(null);
  console.log("groupUsers: ", groupUsers);

  const {
    data: permissionsById,
    isLoading: permissionsByIdLoading,
    isFetching: permissionsByIdFetching,
  } = useGetPermissionsByIdQuery(1);
  console.log("permissionsById: ", permissionsById);

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
                <FaPlus /> Add Member to Role
              </Button>
            }
            title={"Add Staff to Role"}
            description={"Set role permissions"}
            content={<AddStaffRoles />}
          />
        </span>
      </div>
      <div className="w-full mb-5 lg:mb-8">
        {groupUsersLoading || groupUsersFetching ? (
          <div className="w-full grid lg:grid-cols-3 grid-cols-1 pt-5  mt-5 gap-8">
            {[1, 2, 3].map((i) => (
              <div className="w-full rounded-md" key={i}>
                <div className="flex flex-col space-y-3">
                  <Skeleton className="bg-gray-200 h-[125px] w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-rows-1 lg:grid-rows-none gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {groupUsers?.data?.map((tot: any, index: number) => (
              <Card
                key={index}
                className={`w-full border-none my-auto bg-white`}
              >
                <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center">
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col items-start gap-y-3 me-auto">
                      <span className="text-sm text-black font-normal">
                        Total {tot?.users?.length} User(s)
                      </span>
                      <span className="text-lg font-bold text-black capitalize">
                        {formatSnakeCase(String(tot?.role) || "")}
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
                        content={<EditRoles id={tot?.id} />}
                      />
                    </div>
                    <div className="flex ms-auto gap-x-3 text-black items-center">
                      <StackedImages images={tot?.users} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <RolesTable />
    </div>
  );
};

export default Roles;

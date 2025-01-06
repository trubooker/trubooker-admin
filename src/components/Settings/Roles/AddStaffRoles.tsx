"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatSnakeCase } from "@/lib/utils";
import {
  useGetUsersByRoleQuery,
  useAssignRoleToUserMutation,
} from "@/redux/services/Slices/settings/rolesApiSlice";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

export function AddStaffRoles({ role }: { role: [] }) {
  const FormSchema = z.object({
    name: z.string().min(1, { message: "Required Field" }),
    role: z.string().min(1, { message: "Role is required" }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const [userSearch, setUserSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ name: "", id: "" });
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Debounced function to update the search query
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1); // Reset to first page on new search
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(userSearch);
    return () => {
      debouncedSearch.cancel();
    };
  }, [userSearch, debouncedSearch]);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch users based on the query and page
  const {
    data,
    isLoading: userByRoleLoading,
    isFetching: userByRoleFetching,
  } = useGetUsersByRoleQuery({ page, search: searchQuery });

  const usersByRole = data?.data || [];
  const totalPages = data?.meta?.total_pages || 1;

  const handleSelectUser = (user: any) => {
    setSelectedUser({ name: user.first_name, id: user.id });
    form.setValue("name", user.first_name);
    setUserSearch(`${user.first_name} ${user.last_name}`);
    setShowDropdown(false);
  };

  const handleLoadMore = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const [assign, { isLoading }] = useAssignRoleToUserMutation();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = {
      user_id: selectedUser.id,
      role: data.role,
    };
    await assign(formData)
      .unwrap()
      .then((res) => {
        toast.success("Successful");
      })
      .catch((res) => {
        toast.error("Error occured");
      });
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6 max-w-screen h-full lg:max-w-full"
        >
          <div className="grid gap-2 text-gray-500">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="m-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        placeholder="Search Staff name, or email"
                        value={userSearch}
                        onChange={(e) => {
                          setUserSearch(e.target.value);
                          setShowDropdown(true);
                        }}
                        className="py-6"
                        onFocus={() => setShowDropdown(true)}
                      />
                    </div>
                  </FormControl>

                  {showDropdown && (
                    <div
                      className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md max-h-32 overflow-auto mt-2 w-96"
                      ref={dropdownRef}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {userByRoleLoading || userByRoleFetching ? (
                        <div className="w-full grid grid-cols-1 p-3 gap-2">
                          {[1, 2].map((i) => (
                            <div className="w-full rounded-md" key={i}>
                              <Skeleton className="bg-gray-200 h-8 w-full rounded-xl" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        usersByRole.map((user: any) => (
                          <>
                            <div
                              key={user.id}
                              onClick={() => handleSelectUser(user)}
                              className="p-2 cursor-pointer hover:bg-gray-200"
                            >
                              {user.first_name} {user.last_name}
                            </div>
                            <Separator />
                          </>
                        ))
                      )}

                      {usersByRole.length === 0 && !userByRoleFetching && (
                        <div className="p-2 text-gray-500">No User found</div>
                      )}
                      {page < totalPages && (
                        <div
                          onClick={handleLoadMore}
                          className="p-2 text-blue-500 cursor-pointer hover:underline"
                        >
                          Load More...
                        </div>
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="m-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <SelectTrigger className="py-6">
                        <SelectValue
                          className="text-gray-400"
                          placeholder="Enter role"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {role
                        ?.filter(
                          (category: any) =>
                            category?.name !== "driver" &&
                            category?.name !== "agent" &&
                            category?.name !== "passenger"
                        )
                        .map((category: any, i: number) => (
                          <SelectItem
                            key={i}
                            value={category?.name}
                            className="capitalize"
                          >
                            {formatSnakeCase(category?.name)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-[--primary] hover:bg-[--primary-btn] hover:text-white"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

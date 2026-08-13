"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { debounce } from "lodash";
import toast from "react-hot-toast";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import { formatSnakeCase } from "@/lib/utils";

import {
  useGetUsersByRoleQuery,
  useAssignRoleToUserMutation,
} from "@/redux/services/Slices/settings/rolesApiSlice";


// ===============================
// Types
// ===============================

type Role = {
  id?: string;
  name: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
};

type AddStaffRolesProps = {
  role: Role[];
  onModalClose?: () => void;
};


// ===============================
// Component
// ===============================

export function AddStaffRoles({
  role,
  onModalClose,
}: AddStaffRolesProps) {
  // ===============================
  // Form Schema
  // ===============================

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: "Please select a user",
    }),

    role: z.string().min(1, {
      message: "Role is required",
    }),
  });

  type FormValues = z.infer<typeof FormSchema>;

  // ===============================
  // Form
  // ===============================

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      role: "",
    },
  });

  // ===============================
  // State
  // ===============================

  const [userSearch, setUserSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    id: string;
  }>({
    name: "",
    id: "",
  });

  const [page, setPage] = useState(1);

  const dropdownRef = useRef<HTMLDivElement | null>(null);


  // ===============================
  // Debounced Search
  // ===============================

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        const trimmedQuery = query.trim();

        console.log("SEARCH QUERY:", trimmedQuery);

        setSearchQuery(trimmedQuery);
        setPage(1);
      }, 500),
    []
  );


  useEffect(() => {
    debouncedSearch(userSearch);

    return () => {
      debouncedSearch.cancel();
    };
  }, [userSearch, debouncedSearch]);


  // ===============================
  // Close Dropdown On Outside Click
  // ===============================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  // ===============================
  // Get Users
  // ===============================

  const {
    data,
    isLoading: userByRoleLoading,
    isFetching: userByRoleFetching,
  } = useGetUsersByRoleQuery({
    page,
    search: searchQuery,
  });


  const usersByRole: User[] =
    data?.result?.data || [];


  // IMPORTANT:
  // Backend returns pageCount, not totalPages.
  const totalPages =
    data?.result?.meta?.pageCount || 1;


  const hasNextPage =
    Boolean(data?.result?.meta?.nextPage);


  console.log(
    "ADD STAFF ROLE DATA:",
    data
  );


  // ===============================
  // Select User
  // ===============================

  const handleSelectUser = (user: User) => {
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim();

    setSelectedUser({
      name: fullName,
      id: user.id,
    });

    form.setValue(
      "name",
      fullName,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    setUserSearch(fullName);

    setShowDropdown(false);
  };


  // ===============================
  // Search Input Change
  // ===============================

  const handleSearchChange = (
    value: string
  ) => {
    setUserSearch(value);

    // If the user starts typing again,
    // remove the previous selection.
    if (
      selectedUser.id &&
      value !== selectedUser.name
    ) {
      setSelectedUser({
        name: "",
        id: "",
      });

      form.setValue("name", "");
    }

    setShowDropdown(true);
  };


  // ===============================
  // Load More
  // ===============================

  const handleLoadMore = () => {
    if (
      hasNextPage &&
      page < totalPages &&
      !userByRoleFetching
    ) {
      setPage((prev) => prev + 1);
    }
  };


  // ===============================
  // Assign Role Mutation
  // ===============================

  const [
    assign,
    { isLoading: isAssigning },
  ] = useAssignRoleToUserMutation();


  // ===============================
  // Submit
  // ===============================

  const onSubmit = async (
  values: FormValues
) => {
  if (!selectedUser.id) {
    toast.error("Please select a user");
    return;
  }

  if (!values.role) {
    toast.error("Please select a role");
    return;
  }

  const payload = {
    userId: selectedUser.id,
    roleId: values.role,
  };

  console.log("ASSIGN ROLE PAYLOAD:", payload);

  try {
    await assign(payload).unwrap();

    toast.success("Role assigned successfully");

    form.reset();

    setSelectedUser({
      name: "",
      id: "",
    });

    setUserSearch("");
    setSearchQuery("");
    setShowDropdown(false);

    onModalClose?.();
  } catch (error: any) {
    console.error("ASSIGN ROLE ERROR:", error);

    const errors = error?.data?.errors;

    if (Array.isArray(errors)) {
      const message = errors
        .map((err: any) => {
          if (typeof err === "string") {
            return err;
          }

          if (err?.constraints) {
            return Object.values(
              err.constraints
            ).join(", ");
          }

          return err?.message || "Invalid field";
        })
        .join("\n");

      toast.error(
        message || "Invalid request"
      );
    } else {
      toast.error(
        error?.data?.message ||
          "Error assigning role"
      );
    }
  }
};


  // ===============================
  // Render
  // ===============================

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-5"
      >

        {/* ============================
            USER SEARCH
        ============================ */}

        <FormField
          control={form.control}
          name="name"
          render={() => (
            <FormItem className="relative">

              <FormLabel>
                Name
              </FormLabel>

              <FormControl>
                <Input
                  id="name"
                  type="text"
                  placeholder="Search staff name or email"
                  value={userSearch}
                  onChange={(e) =>
                    handleSearchChange(
                      e.target.value
                    )
                  }
                  onFocus={() =>
                    setShowDropdown(true)
                  }
                  className="py-6"
                  autoComplete="off"
                />
              </FormControl>


              {/* ============================
                  USER DROPDOWN
              ============================ */}

              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-auto rounded-md border border-gray-300 bg-white shadow-md"
                  onMouseDown={(e) =>
                    e.stopPropagation()
                  }
                >

                  {/* Loading */}

                  {(
                    userByRoleLoading ||
                    userByRoleFetching
                  ) ? (
                    <div className="grid w-full gap-2 p-3">

                      {[1, 2, 3].map(
                        (item) => (
                          <div
                            className="w-full rounded-md"
                            key={item}
                          >
                            <Skeleton className="h-10 w-full rounded-xl bg-gray-200" />
                          </div>
                        )
                      )}

                    </div>
                  ) : usersByRole.length > 0 ? (

                    <>

                      {/* Users */}

                      {usersByRole.map(
                        (user) => {
                          const fullName =
                            `${user.firstName || ""} ${user.lastName || ""}`.trim();

                          return (
                            <React.Fragment
                              key={user.id}
                            >

                              <div
                                onClick={() =>
                                  handleSelectUser(
                                    user
                                  )
                                }
                                className="cursor-pointer p-3 transition hover:bg-gray-100"
                              >

                                <p className="font-medium text-gray-900">
                                  {fullName ||
                                    "Unknown User"}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {user.email}
                                </p>

                              </div>

                              <Separator />

                            </React.Fragment>
                          );
                        }
                      )}


                      {/* Load More */}

                      {hasNextPage && (
                        <div
                          onClick={
                            handleLoadMore
                          }
                          className="cursor-pointer p-3 text-center text-sm font-medium text-blue-600 hover:bg-gray-100"
                        >
                          {userByRoleFetching
                            ? "Loading..."
                            : "Load More..."}
                        </div>
                      )}

                    </>
                  ) : (

                    /* No User */

                    <div className="p-4 text-center text-sm text-gray-500">
                      No user found
                    </div>

                  )}

                </div>
              )}

              <FormMessage />

            </FormItem>
          )}
        />


        {/* ============================
            ROLE
        ============================ */}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Role
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={
                  field.onChange
                }
              >

                <FormControl>

                  <SelectTrigger className="py-6">

                    <SelectValue
                      placeholder="Select role"
                    />

                  </SelectTrigger>

                </FormControl>


                <SelectContent>

                  {role
                    ?.filter(
                      (category) =>
                        category?.name !==
                          "driver" &&
                        category?.name !==
                          "agent" &&
                        category?.name !==
                          "passenger"
                    )
                    .map(
                      (
                        category,
                        index
                      ) => (
                       <SelectItem
                          key={category.id || index}
                          value={category.id!}
                          className="capitalize"
                        >
                          {formatSnakeCase(category.name)}
                        </SelectItem>
                      )
                    )}

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />


        {/* ============================
            SUBMIT BUTTON
        ============================ */}

        <Button
          type="submit"
          disabled={
            isAssigning ||
            !selectedUser.id
          }
          className="w-full bg-[--primary] text-white hover:bg-[--primary-btn] hover:text-white"
        >

          {isAssigning
            ? "Assigning..."
            : "Send"}

        </Button>

      </form>
    </Form>
  );
}

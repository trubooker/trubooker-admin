// import React from "react";

// const Broadcast = () => {
//   return <div>Broadcast</div>;
// };

// export default Broadcast;

"use client";

import React from "react";
import {
  useGetAnnouncementsQuery,
  useGetSystemSettingsQuery,
} from "@/redux/services/Slices/settings/referralProgramApiSlice";
import { useRouter } from "next/navigation";
import { formatSnakeCase } from "@/lib/utils";
import { Separator } from "../ui/separator";
import Spinner from "../Spinner";

const Broadcast = () => {
  const {
    isLoading: loading,
    data: userData,
    isFetching,
  } = useGetSystemSettingsQuery(null);

  const { data, isLoading } = useGetAnnouncementsQuery(null);
  const router = useRouter();
  console.log("SystemSettings", userData);
  console.log(data);

  const SystemSettingsListData = userData?.data;

  return (
    <div className="lg:w-8/12 w-full px-4 pt-4 bg-white rounded-xl shadow-sm">
      {/* <h2 className="text-2xl font-bold mb-5">System Settings</h2> */}
      {SystemSettingsListData?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {SystemSettingsListData?.map((setting: any) => (
            <>
              <div key={setting.id} className="p-4">
                <h3 className="text-lg font-semibold">
                  {formatSnakeCase(setting.key)}
                </h3>
                <div className="mt-2">
                  {Object.entries(setting.value).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-1"
                    >
                      <span className="font-medium">
                        {formatSnakeCase(
                          key === "agent_earning_percentage"
                            ? "Connector Earning Percentage"
                            : key
                        )}
                        :
                      </span>
                      <span className="text-gray-600 capitalize">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          ))}
        </div>
      ) : (
        <>
          {loading || isFetching ? (
            <Spinner />
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-400">No system settings found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Broadcast;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

interface Props {
  data: {
    activeTrips: { data: any[]; meta: any } | any[];  // it's returning array not number
    upcoming_trips: { data: any[]; meta: any } | any[];
    completed_trips: { data: any[]; meta: any } | any[];
    cancelled_trips: { data: any[]; meta: any } | any[];
  };
  loading: boolean;
}
const Overview: React.FC<Props> = ({ data, loading }) => {
    const getCount = (val: any): number => {
    if (!val) return 0;
    if (Array.isArray(val)) return val.length;
    if (val?.data && Array.isArray(val.data)) return val.data.length;
    if (typeof val === 'number') return val;
    return 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Trip Overview</CardTitle>
        <CardDescription>Total amount of trips today</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <div className="my-5 space-y-6">
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Active Trips:</span>
              <span className="font-medium text-sm">
               {loading ? <Skeleton className="h-4 w-[50px] bg-gray-200" /> : getCount(data?.activeTrips)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Upcoming Trips:</span>
              <span className="font-medium text-sm">
              {loading ? <Skeleton className="h-4 w-[50px] bg-gray-200" /> : getCount(data?.upcoming_trips)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Completed:</span>
              <span className="font-medium text-sm">
                            {loading ? <Skeleton className="h-4 w-[50px] bg-gray-200" /> : getCount(data?.completed_trips)}

              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Cancelled:</span>
              <span className="font-medium text-sm">
                  {loading ? <Skeleton className="h-4 w-[50px] bg-gray-200" /> : getCount(data?.cancelled_trips)}

              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Overview;

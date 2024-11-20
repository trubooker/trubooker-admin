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
    active_trips: number;
    upcoming_trips: number;
    completed_trips: number;
    cancelled_trips: number;
  };
  loading: boolean;
}
const Overview: React.FC<Props> = ({ data, loading }) => {
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
                {loading ? (
                  <Skeleton className="h-4 w-[50px] bg-gray-200" />
                ) : (
                  data?.active_trips
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Upcoming Trips:</span>
              <span className="font-medium text-sm">
                {loading ? (
                  <Skeleton className="h-4 w-[50px] bg-gray-200" />
                ) : (
                  data?.upcoming_trips
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Completed:</span>
              <span className="font-medium text-sm">
                {loading ? (
                  <Skeleton className="h-4 w-[50px] bg-gray-200" />
                ) : (
                  data?.completed_trips
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Cancelled:</span>
              <span className="font-medium text-sm">
                {loading ? (
                  <Skeleton className="h-4 w-[50px] bg-gray-200" />
                ) : (
                  data?.cancelled_trips
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Overview;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Overview = () => {
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
              <span className="font-medium text-sm">60,000</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Upcoming Trips:</span>
              <span className="font-medium text-sm">50,000</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Completed:</span>
              <span className="font-medium text-sm">60,000</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-sm">Cancelled:</span>
              <span className="font-medium text-sm">60,000</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Overview;

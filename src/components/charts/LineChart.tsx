"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FC } from "react";
import CountUp from "react-countup";

interface Props {
  chartConfig: ChartConfig;
  graph_data: any[];
  total_revenue: number;
}

export const LineChartDisplay: FC<Props> = ({
  chartConfig,
  total_revenue,
  graph_data,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-3">
            <CardTitle className="text-xl">Total Revenue</CardTitle>
            <CardDescription className="text-xs">
              Earnings for the Week
            </CardDescription>
          </div>
          <span className="text-xl">
            <CountUp end={total_revenue} prefix="₦ " />
          </span>
        </div>
      </CardHeader>
      <CardContent className="">
        <ChartContainer className="p-0 m-0" config={chartConfig}>
          <AreaChart
            className="m-0 p-0 h-[400px]"
            accessibilityLayer
            data={graph_data}
            margin={{
              bottom: 10, // Add bottom margin to create space between the x-axis and the chart
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              interval={0} 
              tickFormatter={(value) => value.slice(0, 3)}
              padding={{ left: 0, right: 20 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
              padding={{ top: 20 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="50%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

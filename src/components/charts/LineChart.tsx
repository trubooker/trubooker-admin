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

interface Props {
  chartConfig: ChartConfig;
  chartData: any[];
}

export const LineChartDisplay: FC<Props> = ({ chartConfig, chartData }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-3">
            <CardTitle className="text-xl">Total Revenue</CardTitle>
            <CardDescription className="text-xs">
              Earnings for the Month
            </CardDescription>
          </div>
          <span className="text-xl">$300,000,000</span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="p-0 m-0" config={chartConfig}>
          <AreaChart
            className="m-0 p-0"
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
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
              dataKey="desktop"
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

"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { IoPersonOutline } from "react-icons/io5";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import ReferralProgram from "@/components/Settings/ReferralProgram";
import PriceControl from "@/components/Settings/serviceFare";
import WelcomeCoupon from "@/components/Settings/WelcomeCoupon";
import CouponGenerator from "@/components/Settings/CouponGenerator";
import CouponList from "@/components/Settings/CouponList";
import {
  useGetReferralProgramsQuery,
  useGetSystemSettingsQuery,
} from "@/redux/services/Slices/settings/referralProgramApiSlice";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Filter, 
  Search, 
  BarChart3, 
  Users, 
  Ticket, 
  CheckCircle, 
  Clock, 
  Gift,
  TrendingUp,
  FileText,
  Sparkles,
  Target,
  Calendar,
  Percent
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Icons for stats cards
import {
  ChartBarIcon,
  UserGroupIcon,
  TicketIcon,
  CheckCircleIcon,
  ClockIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";

const ReferralProgramPage = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [couponFilter, setCouponFilter] = useState("all");
  const router = useRouter();

  const {
    data: info,
    isLoading: loading,
    isFetching,
    refetch: refetchReferralData,
  } = useGetReferralProgramsQuery(null);
  const { data: systemSettingsData, refetch: refetchSettings } = useGetSystemSettingsQuery(null);

  const price_control = systemSettingsData?.data?.filter(
    (setting: { key: string }) => setting.key === "price_control"
  )[0];

  const refProgram = systemSettingsData?.data?.filter(
    (setting: { key: string }) => setting.key === "referral_program"
  )[0];

  const totalPages = info?.data?.referral_performance?.meta?.last_page;
  const revenue = info?.data;
  const ReferralProgramListData = info?.data?.referral_performance?.data;
  
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  // Refresh all data
  const handleRefreshData = () => {
    refetchReferralData();
    refetchSettings();
  };

  // Stats cards data with icons
  const statsCards = [
    {
      title: "Performance Count",
      value: revenue?.performance_count || 0,
      bgColor: "bg-[--primary]",
      icon: <ChartBarIcon className="h-7 w-7 text-white" />,
      loading: loading,
    },
    {
      title: "Total Active Referrals",
      value: revenue?.total_active_referrals || 0,
      bgColor: "bg-[--primary-orange]",
      icon: <UserGroupIcon className="h-7 w-7 text-white" />,
      loading: loading,
    },
    {
      title: "Total Coupons Issued",
      value: revenue?.total_coupon_issued || 0,
      bgColor: "bg-[--primary]",
      icon: <TicketIcon className="h-7 w-7 text-white" />,
      loading: loading,
    },
    {
      title: "Total Coupons Redeemed",
      value: revenue?.total_coupon_redeemed || 0,
      bgColor: "bg-[--primary-orange]",
      icon: <CheckCircleIcon className="h-7 w-7 text-white" />,
      loading: loading,
    },
    {
      title: "Total Expired Coupons",
      value: revenue?.total_expired_coupons || 0,
      bgColor: "bg-[--primary]",
      icon: <ClockIcon className="h-7 w-7 text-white" />,
      loading: loading,
    },
    {
      title: "Welcome Coupons Given",
      value: revenue?.welcome_coupons_given || 0,
      bgColor: "bg-[--primary-blue]",
      icon: <GiftIcon className="h-7 w-7 text-white" />,
      loading: loading,
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col h-full w-full gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Referral & Coupon Program
            </h1>
            <p className="text-gray-500 text-sm">
              Manage referral programs, welcome coupons, and promotional discounts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              disabled={isFetching}
              className="whitespace-nowrap"
            >
              {isFetching ? "Refreshing..." : "Refresh Data"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <ScrollArea className="w-full md:w-auto">
              <TabsList className="inline-flex w-max md:w-auto">
                <TabsTrigger value="overview" className="text-sm whitespace-nowrap">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="referral-performance" className="text-sm whitespace-nowrap">
                  Performance
                </TabsTrigger>
                <TabsTrigger value="welcome-coupon" className="text-sm whitespace-nowrap">
                  Welcome Coupon
                </TabsTrigger>
                <TabsTrigger value="generate-coupon" className="text-sm whitespace-nowrap">
                  Generate Coupon
                </TabsTrigger>
                <TabsTrigger value="all-coupons" className="text-sm whitespace-nowrap">
                  All Coupons
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            {activeTab === "all-coupons" && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search coupons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            )}
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {statsCards.map((stat, index) => (
                <Card
                  key={index}
                  className={`${stat.bgColor} border-none text-white transition-all hover:shadow-lg h-full`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>{stat.icon}</div>
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        Today
                      </Badge>
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <div className="text-xl sm:text-2xl font-bold">
                        {stat.loading ? (
                          <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 bg-white/30" />
                        ) : (
                          stat.value.toLocaleString()
                        )}
                      </div>
                      <div className="text-xs sm:text-sm opacity-90 mt-1 line-clamp-2">
                        {stat.title}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Charts and Quick Stats */}
              <div className="xl:col-span-2 space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        className="flex flex-col h-auto py-3 sm:py-4"
                        onClick={() => setActiveTab("generate-coupon")}
                      >
                        <Ticket className="h-5 w-5 mb-1 sm:h-6 sm:w-6" />
                        <span className="text-xs">Create Coupon</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col h-auto py-3 sm:py-4"
                        onClick={() => setActiveTab("welcome-coupon")}
                      >
                        <Sparkles className="h-5 w-5 mb-1 sm:h-6 sm:w-6" />
                        <span className="text-xs">Welcome Coupon</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col h-auto py-3 sm:py-4"
                        onClick={() => setActiveTab("referral-performance")}
                      >
                        <TrendingUp className="h-5 w-5 mb-1 sm:h-6 sm:w-6" />
                        <span className="text-xs">View Reports</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col h-auto py-3 sm:py-4"
                        onClick={() => setActiveTab("all-coupons")}
                      >
                        <FileText className="h-5 w-5 mb-1 sm:h-6 sm:w-6" />
                        <span className="text-xs">All Coupons</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                      <h3 className="text-lg font-semibold">Recent Coupon Activity</h3>
                      <Badge variant="outline" className="w-fit">Last 7 days</Badge>
                    </div>
                    {ReferralProgramListData?.slice(0, 5).length > 0 ? (
                      <div className="space-y-3">
                        {ReferralProgramListData.slice(0, 5).map((data: any) => (
                          <div
                            key={data.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <IoPersonOutline className="text-blue-600 h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium truncate">{data.name}</div>
                                <div className="text-sm text-gray-500">
                                  {data.referrals_made} referrals
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2">
                              <Badge variant="secondary" className="whitespace-nowrap">
                                {data.used_coupons} used
                              </Badge>
                              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <div className="text-gray-400 mb-2">No recent activity</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("generate-coupon")}
                        >
                          Create First Coupon
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Settings */}
              <div className="space-y-6">
                {/* Use only refProgram from API */}
                <ReferralProgram refProgram={refProgram} />
                <PriceControl price_control={price_control} />
                
                {/* Quick Stats */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Program Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">Referral Program</span>
                        <Badge variant={refProgram?.value?.is_active ? "default" : "secondary"}>
                          {refProgram?.value?.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">Price Control</span>
                        <Badge variant={price_control?.value?.is_active ? "default" : "secondary"}>
                          {price_control?.value?.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={handleRefreshData}
                        >
                          Check All Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Referral Performance Tab */}
          <TabsContent value="referral-performance" className="space-y-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">Referral Performance</h3>
                    <p className="text-gray-500 text-sm">
                      Track passenger referral activities and coupon usage
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm whitespace-nowrap">
                      Total: {ReferralProgramListData?.length || 0} Passengers
                    </Badge>
                  </div>
                </div>

                {ReferralProgramListData?.length > 0 ? (
                  <>
                    <ScrollArea className="w-full">
                      <div className="min-w-[700px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-bold text-left">
                                Passenger
                              </TableHead>
                              <TableHead className="font-bold text-center">
                                Referrals Made
                              </TableHead>
                              <TableHead className="font-bold text-center">
                                Used Coupons
                              </TableHead>
                              <TableHead className="font-bold text-center">
                                Unused Coupons
                              </TableHead>
                              <TableHead className="font-bold text-center">
                                Expired Coupons
                              </TableHead>
                              <TableHead className="font-bold text-center">
                                Success Rate
                              </TableHead>
                              <TableHead className="font-bold text-center">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loading ? (
                              Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                  {Array.from({ length: 7 }).map((_, j) => (
                                    <TableCell key={j}>
                                      <Skeleton className="h-6 w-full" />
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))
                            ) : (
                              ReferralProgramListData.map((data: any) => {
                                const successRate = data.referrals_made > 0 
                                  ? Math.round((data.used_coupons / data.referrals_made) * 100)
                                  : 0;
                                
                                return (
                                  <TableRow key={data.id} className="hover:bg-gray-50">
                                    <TableCell>
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                          <span className="text-blue-600 font-medium text-sm">
                                            {data.name.charAt(0)}
                                          </span>
                                        </div>
                                        <div className="min-w-0">
                                          <div className="font-medium truncate text-sm sm:text-base">
                                            {data.name}
                                          </div>
                                          <div className="text-xs sm:text-sm text-gray-500 truncate">
                                            ID: {data.id}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="outline" className="text-xs sm:text-sm">
                                        {data.referrals_made}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs sm:text-sm">
                                        {data.used_coupons}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="outline" className="text-xs sm:text-sm">
                                        {data.unused_coupons}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="secondary" className="text-xs sm:text-sm">
                                        {data.expired_coupons}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px] sm:max-w-[100px]">
                                          <div 
                                            className={`h-2 rounded-full ${
                                              successRate >= 70 ? 'bg-green-500' :
                                              successRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${Math.min(successRate, 100)}%` }}
                                          />
                                        </div>
                                        <span className="ml-2 text-xs sm:text-sm font-medium min-w-[35px]">
                                          {successRate}%
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                      >
                                        View Details
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    {totalPages > 1 && (
                      <div className="mt-6 pt-4 border-t">
                        <Pagination
                          currentPage={page}
                          totalPages={totalPages}
                          onPageChange={onPageChange}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                    <Image
                      src="/nodata.svg"
                      alt="No Data"
                      width={120}
                      height={120}
                      className="opacity-50"
                    />
                    <h3 className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-gray-700">
                      No referral data yet
                    </h3>
                    <p className="text-gray-500 text-center mt-1 sm:mt-2 max-w-md text-sm">
                      Start your referral program and track passenger activities here.
                    </p>
                    <Button
                      className="mt-3 sm:mt-4"
                      onClick={() => setActiveTab("overview")}
                      size="sm"
                    >
                      Configure Program
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Welcome Coupon Tab */}
          <TabsContent value="welcome-coupon" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <WelcomeCoupon />
              </div>
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-blue-600 mb-3">
                      <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">
                      Welcome Coupon Tips
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-blue-700">
                      <li className="flex items-start gap-2">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                        <span>Appears immediately after registration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                        <span>Great for first-ride incentives</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                        <span>Can be enabled/disabled anytime</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                        <span>Auto-generates codes by default</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-semibold mb-4">Quick Stats</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">Total Given</span>
                        <span className="font-semibold text-sm sm:text-base">{revenue?.welcome_coupons_given || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">Redeemed</span>
                        <span className="font-semibold text-green-600 text-sm sm:text-base">
                          {revenue?.welcome_coupons_redeemed || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">Active</span>
                        <span className="font-semibold text-blue-600 text-sm sm:text-base">
                          {(revenue?.welcome_coupons_given || 0) - (revenue?.welcome_coupons_redeemed || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Generate Coupon Tab */}
          <TabsContent value="generate-coupon" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CouponGenerator />
              </div>
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-green-600 mb-3">
                      <Target className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-green-800 mb-2">
                      Promotion Best Practices
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-green-700">
                      <li className="flex items-start gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                        <span>Use for special promotions/holidays</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                        <span>Set reasonable expiry dates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Percent className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                        <span>Consider minimum order amounts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                        <span>Track coupon performance</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-semibold mb-4">Coupon Ideas</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-sm sm:text-base">HOLIDAY25</div>
                        <div className="text-xs sm:text-sm text-gray-500">25% off for holiday season</div>
                      </div>
                      <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-sm sm:text-base">WEEKEND20</div>
                        <div className="text-xs sm:text-sm text-gray-500">20% off weekend rides</div>
                      </div>
                      <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-sm sm:text-base">FIRSTRIDE</div>
                        <div className="text-xs sm:text-sm text-gray-500">$10 off first ride</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* All Coupons Tab */}
          <TabsContent value="all-coupons" className="space-y-6">
            <CouponList 
              searchTerm={searchTerm}
              filter={couponFilter}
              onFilterChange={setCouponFilter}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReferralProgramPage;
// @/components/Settings/ViewCouponModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Percent, 
  Users, 
  Ticket, 
  Copy, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  User,
  Hash,
  Info,
  Eye,
  Loader2
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCouponByIdQuery, useGetCouponStatsQuery } from "@/redux/services/Slices/settings/couponApiSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Coupon {
  id: number;
  coupon_code: string;
  coupon_type: 'percentage' | 'fixed_amount';
  coupon_value: number;
  expiry_date: string;
  used_count: number;
  max_usage: number;
  max_users: number | null;
  status: 'active' | 'expired' | 'used_up' | 'inactive';
  description?: string;
  days_left: number;
  min_order_amount?: number;
  created_at: string;
  updated_at: string;
  users_used?: Array<{
    id: number;
    name: string;
    email: string;
    used_at: string;
    ride_fare: number;
    discount_amount: number;
  }>;
  total_revenue_generated?: number;
  total_discount_given?: number;
  usage_rate?: number;
}

interface ViewCouponModalProps {
  couponId: number;
  onCopyCode?: (code: string) => void;
  children?: React.ReactNode;
}

const ViewCouponModal: React.FC<ViewCouponModalProps> = ({ couponId, onCopyCode, children }) => {
  const [open, setOpen] = useState(false);
  
  // Use the correct query hook
  const { data: couponData, isLoading: couponLoading, isFetching } = useGetCouponByIdQuery(
    couponId,
    { skip: !open } // Only fetch when modal is open
  );
  
  const { data: stats, isLoading: statsLoading } = useGetCouponStatsQuery();

  const coupon = couponData?.data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'used_up':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Used Up</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {type === 'percentage' ? '%' : '$'} {type.replace('_', ' ')}
      </Badge>
    );
  };

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp');
    } catch (e) {
      return dateString;
    }
  };

  const handleCopyCode = () => {
    if (coupon?.coupon_code) {
      navigator.clipboard.writeText(coupon.coupon_code);
      toast.success(`Copied: ${coupon.coupon_code}`);
      onCopyCode?.(coupon.coupon_code);
    }
  };

  if (couponLoading && open) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Loading Coupon Details...
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!coupon && open) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Coupon Not Found
            </DialogTitle>
            <DialogDescription>
              The coupon you're trying to view does not exist or has been deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Unable to load coupon details.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Coupon Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about coupon code
          </DialogDescription>
        </DialogHeader>

        {isFetching && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage Details</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Coupon Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-mono font-bold text-2xl">
                        {coupon?.coupon_code || 'N/A'}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCode}
                        className="h-8"
                        disabled={!coupon?.coupon_code}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    {coupon?.description && (
                      <p className="text-gray-600 mb-4">{coupon.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {coupon?.status && getStatusBadge(coupon.status)}
                      {coupon?.coupon_type && getTypeBadge(coupon.coupon_type)}
                      {coupon?.coupon_type && (
                        <Badge variant="outline">
                          {coupon.coupon_type === 'percentage' 
                            ? `${coupon.coupon_value}% off`
                            : `${formatCurrency(coupon.coupon_value)} off`
                          }
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Created</div>
                    <div className="font-medium">
                      {coupon?.created_at ? formatDate(coupon.created_at) : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coupon Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Usage Limits */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Usage Limits
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Used Count</span>
                      <span className="font-semibold">
                        {coupon?.used_count || 0} / {coupon?.max_usage || 0}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Users</span>
                      <span className="font-semibold">
                        {coupon?.max_users ? coupon.max_users : 'Unlimited'}
                      </span>
                    </div>
                    {coupon?.min_order_amount && coupon.min_order_amount > 0 && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min Order</span>
                          <span className="font-semibold">
                            {formatCurrency(coupon.min_order_amount)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Validity */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Validity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date</span>
                      <span className="font-semibold">
                        {coupon?.expiry_date ? formatDate(coupon.expiry_date) : 'N/A'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days Left</span>
                      <span className={`font-semibold ${
                        (coupon?.days_left || 0) <= 3 ? 'text-red-600' :
                        (coupon?.days_left || 0) <= 7 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {(coupon?.days_left || 0) > 0 ? `${coupon?.days_left} days` : 'Expired'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      {coupon?.status && getStatusBadge(coupon.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Performance Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {coupon?.used_count || 0}
                    </div>
                    <div className="text-sm text-gray-600">Times Used</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(coupon?.max_usage || 0) - (coupon?.used_count || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Remaining Uses</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {coupon?.usage_rate || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Usage Rate</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${
                      coupon?.status === 'active' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {coupon?.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-sm text-gray-600">Current Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Details Tab */}
          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Users Who Used This Coupon</h3>
                {coupon?.users_used && coupon.users_used.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {coupon.users_used.map((user, index) => (
                        <div key={`${user.id}-${index}`} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                            <div>
                              <div className="font-medium">{user.name || `User ${user.id}`}</div>
                              <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">
                                {user.used_at ? formatDateTime(user.used_at) : 'Unknown date'}
                              </div>
                              <div className="font-medium">
                                Ride: {formatCurrency(user.ride_fare || 0)}
                              </div>
                              {user.discount_amount > 0 && (
                                <div className="text-sm text-green-600">
                                  Discount: {formatCurrency(user.discount_amount)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-700">No Usage Yet</h4>
                    <p className="text-gray-500 mt-1">
                      This coupon hasn't been used by any users yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Coupon Analytics</h3>
                {statsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                    
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(coupon?.total_revenue_generated || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Revenue Generated</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Percent className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(coupon?.total_discount_given || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Discount Given</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Hash className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">
                        {coupon?.used_count || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Redemptions</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCouponModal;
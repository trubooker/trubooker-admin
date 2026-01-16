"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Eye, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGeneratedCouponsQuery } from "@/redux/services/Slices/settings/couponApiSlice";
import toast from "react-hot-toast";
import Image from "next/image";

interface CouponListProps {
  searchTerm: string;
  filter: string;
  onFilterChange: (filter: string) => void;
}

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
}

const CouponList: React.FC<CouponListProps> = ({ searchTerm, filter, onFilterChange }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetGeneratedCouponsQuery({ page, limit: 10 });

  const coupons = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const handleViewDetails = (coupon: Coupon) => {
    // Implement view details modal
    console.log('View details:', coupon);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      case 'used_up':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Used Up</Badge>;
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {type === 'percentage' ? '%' : '$'} {type.replace('_', ' ')}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (coupons.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Image
            src="/nocoupons.svg"
            alt="No Coupons"
            width={160}
            height={160}
            className="opacity-50"
          />
          <h3 className="mt-6 text-lg font-semibold text-gray-700">
            No coupons created yet
          </h3>
          <p className="text-gray-500 text-center mt-2 max-w-md">
            Create your first coupon to start offering discounts to passengers.
          </p>
          <Button className="mt-4">
            Create First Coupon
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>All Generated Coupons</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('active')}
            >
              Active
            </Button>
            <Button
              variant={filter === 'expired' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('expired')}
            >
              Expired
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons
                .filter((coupon: Coupon) => {
                  if (filter === 'all') return true;
                  if (filter === 'active') return coupon.status === 'active';
                  if (filter === 'expired') return coupon.status === 'expired';
                  return true;
                })
                .filter((coupon: Coupon) => 
                  coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((coupon: Coupon) => (
                  <TableRow key={coupon.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-mono font-bold text-lg">
                        {coupon.coupon_code}
                      </div>
                      {coupon.description && (
                        <div className="text-sm text-gray-500">
                          {coupon.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getTypeBadge(coupon.coupon_type)}</TableCell>
                    <TableCell className="font-semibold">
                      {coupon.coupon_type === 'percentage' 
                        ? `${coupon.coupon_value}%`
                        : `$${coupon.coupon_value}`
                      }
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(coupon.expiry_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {coupon.days_left > 0 
                          ? `${coupon.days_left} days left`
                          : 'Expired'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {coupon.used_count || 0}/{coupon.max_usage}
                        {coupon.max_users && ` of ${coupon.max_users}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {coupon.used_count || 0} used
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCopyCode(coupon.coupon_code)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDetails(coupon)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CouponList;
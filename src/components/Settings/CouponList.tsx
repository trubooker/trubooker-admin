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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Copy, Eye, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useGetGeneratedCouponsQuery, 
  useDeleteCouponMutation,
  useGetCouponByIdQuery 
} from "@/redux/services/Slices/settings/couponApiSlice";
import toast from "react-hot-toast";
import Image from "next/image";
import ViewCouponModal from "./ViewCouponModal";
import EditCouponModal from "./EditCouponModal";

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
  min_order_amount?: number;
  created_at: string;
  updated_at: string;
}

const CouponList: React.FC<CouponListProps> = ({ searchTerm, filter, onFilterChange }) => {
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  
  const { data, isLoading, isFetching, refetch } = useGetGeneratedCouponsQuery({ 
    page, 
    limit: 10,
    search: searchTerm,
    filter,
    status: filter === 'all' ? 'all' : filter
  });
  
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const coupons = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const handleDeleteClick = (coupon: Coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;

    try {
      await deleteCoupon(couponToDelete.id).unwrap();
      toast.success(`Coupon "${couponToDelete.coupon_code}" deleted successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete coupon");
    } finally {
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    }
  };

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
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {type === 'percentage' ? '%' : '₦'} {type.replace('_', ' ')}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    <>
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
              <Button
                variant={filter === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('inactive')}
              >
                Inactive
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
                    if (filter === 'inactive') return coupon.status === 'inactive';
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
                          : `₦${coupon.coupon_value}`
                        }
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(coupon.expiry_date)}
                        </div>
                        <div className={`text-xs ${
                          coupon.days_left <= 3 ? 'text-red-500' :
                          coupon.days_left <= 7 ? 'text-yellow-500' : 'text-gray-500'
                        }`}>
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
                           <ViewCouponModal couponId={coupon.id}>
  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    <Eye className="h-4 w-4 mr-2" />
    View Details
  </DropdownMenuItem>
</ViewCouponModal>
                            
                            <DropdownMenuItem onClick={() => handleCopyCode(coupon.coupon_code)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Code
                            </DropdownMenuItem>
                            
                          <EditCouponModal 
  couponId={coupon.id} 
  onSuccess={refetch}
>
  <DropdownMenuItem 
    onSelect={(e) => e.preventDefault()}
    disabled={coupon.used_count > 0}
  >
    <Edit className="h-4 w-4 mr-2" />
    Edit
  </DropdownMenuItem>
</EditCouponModal>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onSelect={(e) => {
                                e.preventDefault();
                                handleDeleteClick(coupon);
                              }}
                            >
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1 || isFetching}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages || isFetching}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coupon
              <span className="font-bold text-red-600"> "{couponToDelete?.coupon_code}"</span>
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Coupon"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CouponList;
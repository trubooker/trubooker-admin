"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Search from "@/components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import debounce from "lodash/debounce";
import Pagination from "@/components/Pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DriverList } from "@/components/Driver/DriverList";
import { useGetDriversQuery } from "@/redux/services/Slices/driverApiSlice";
import { Button } from "@/components/ui/button";
import { FaSort, FaFilter } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Clock, X, FileText, Car } from "lucide-react";

interface DocStatusStats {
  [key: string]: number;
}

const Drivers = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get parameters from URL or use defaults
  const urlPage = searchParams.get('page');
  const urlSearch = searchParams.get('search') || "";
  const urlPerPage = searchParams.get('per_page');
  
  const [page, setPage] = useState(urlPage ? parseInt(urlPage) : 1);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [docStatusFilter, setDocStatusFilter] = useState<string>("all");
  const [perPage, setPerPage] = useState(urlPerPage ? parseInt(urlPerPage) : 10);
  
  // Log the query parameters being sent to the API
  console.log("📤 Sending API request with parameters:", {
    page,
    search: searchQuery,
    per_page: perPage
  });
  
  const {
    isLoading: loading,
    data: userData,
    isFetching,
    error,
  } = useGetDriversQuery({ page, search: searchQuery, per_page: perPage });
  
  // Log document status data
  useEffect(() => {
    if (userData?.data && userData.data.length > 0) {
      console.log("📊 Document Status Summary:");
      const statusCounts: Record<string, number> = {};
      userData.data.forEach((driver: any) => {
        const status = driver.vehicle_document_status || 'no status';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      console.log("Status counts:", statusCounts);
    }
  }, [userData]);

  const DriverListData = userData?.data;
  const totalPages = userData?.meta?.last_page;
  const totalDrivers = userData?.meta?.total || 0;
  
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      console.log("🔄 Changing page to:", pageNumber);
      setPage(pageNumber);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', pageNumber.toString());
      if (searchQuery) {
        params.set('search', searchQuery);
      }
      if (perPage !== 10) {
        params.set('per_page', perPage.toString());
      }
      router.push(`/drivers?${params.toString()}`, { scroll: false });
    }
  };
  
  const handlePerPageChange = (newPerPage: string) => {
    console.log("🔄 Changing items per page to:", newPerPage);
    const perPageValue = parseInt(newPerPage);
    setPerPage(perPageValue);
    setPage(1);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('per_page', perPageValue.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    router.push(`/drivers?${params.toString()}`, { scroll: false });
  };
  
  const [filteredDrivers, setFilteredDrivers] = useState(DriverListData);

  useEffect(() => {
    if (DriverListData) {
      setFilteredDrivers(DriverListData);
    }
  }, [DriverListData]);

  const debounceSearch = useCallback(
    debounce((query: string) => {
      console.log("🔍 Debounced search with query:", query);
      setSearchQuery(query);
      setPage(1);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      if (query) {
        params.set('search', query);
      } else {
        params.delete('search');
      }
      if (perPage !== 10) {
        params.set('per_page', perPage.toString());
      }
      router.push(`/drivers?${params.toString()}`, { scroll: false });
    }, 300),
    [router, searchParams, perPage]
  );

  const handleSearch = (query: string) => {
    console.log("⌨️ Handle search called with:", query);
    debounceSearch(query);
  };

  // Apply status filter
  const statusFilteredData =
    statusFilter === "all"
      ? filteredDrivers
      : filteredDrivers?.filter(
          (driver: any) => driver.status === statusFilter
        );
  
  // Apply document status filter
  const docStatusFilteredData =
    docStatusFilter === "all"
      ? statusFilteredData
      : statusFilteredData?.filter(
          (driver: any) => driver.vehicle_document_status === docStatusFilter
        );

  // Function to format document status for display
  const formatDocStatus = (status: string) => {
    return status
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get icon for document status filter
  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-3 h-3 mr-2" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-2" />;
      case 'rejected':
        return <X className="w-3 h-3 mr-2" />;
      case 'no documents uploaded':
        return <FileText className="w-3 h-3 mr-2" />;
      case 'no vehicle uploaded':
        return <Car className="w-3 h-3 mr-2" />;
      default:
        return <FaFilter className="w-3 h-3 mr-2" />;
    }
  };

  // Statistics for document status
const docStatusStats: DocStatusStats = userData?.data?.reduce((acc: DocStatusStats, driver: any) => {
  const status = driver.vehicle_document_status || 'no status';
  acc[status] = (acc[status] || 0) + 1;
  return acc;
}, {}) || {};

  return (
    <div className="flex flex-col h-fit w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Drivers Management</h2>
          <p className="text-gray-600 text-sm mt-1">Manage and monitor all registered drivers</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">Total Drivers:</div>
          <div className="flex items-center justify-center rounded-full px-3 py-1 bg-orange-500 text-white font-medium">
            {totalDrivers}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col xl:flex-row w-full">
        <div className="w-full">
          <div className="bg-white rounded-lg w-full p-5 mt-2 shadow-sm border border-gray-200">
            {/* Filters Section */}
            <div className="flex flex-col lg:flex-row gap-4 lg:justify-between mb-6">
              <Search
                placeholder={"Search by name, email, or phone..."}
                onSearch={handleSearch}
                defaultValue={urlSearch}
                classname="mb-0 max-w-[400px]"
              />
              
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <Select
                    value={perPage.toString()}
                    onValueChange={handlePerPageChange}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="30">30 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                      <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Document Status Filter */}
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FaFilter className="w-4 h-4" />
                        <span>Docs: {docStatusFilter === "all" ? "All" : formatDocStatus(docStatusFilter)}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setDocStatusFilter("all")} className="flex items-center">
                        <FaFilter className="w-3 h-3 mr-2" />
                        All Document Statuses
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDocStatusFilter("approved")} className="flex items-center">
                        <Check className="w-3 h-3 mr-2 text-green-600" />
                        Approved
                        {docStatusStats['approved'] && (
                          <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            {docStatusStats['approved']}
                          </span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDocStatusFilter("pending")} className="flex items-center">
                        <Clock className="w-3 h-3 mr-2 text-yellow-600" />
                        Pending
                        {docStatusStats['pending'] && (
                          <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            {docStatusStats['pending']}
                          </span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDocStatusFilter("rejected")} className="flex items-center">
                        <X className="w-3 h-3 mr-2 text-red-600" />
                        Rejected
                        {docStatusStats['rejected'] && (
                          <span className="ml-auto text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                            {docStatusStats['rejected']}
                          </span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDocStatusFilter("no documents uploaded")} className="flex items-center">
                        <FileText className="w-3 h-3 mr-2 text-gray-600" />
                        No Documents
                        {docStatusStats['no documents uploaded'] && (
                          <span className="ml-auto text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                            {docStatusStats['no documents uploaded']}
                          </span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDocStatusFilter("no vehicle uploaded")} className="flex items-center">
                        <Car className="w-3 h-3 mr-2 text-blue-600" />
                        No Vehicle
                        {docStatusStats['no vehicle uploaded'] && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {docStatusStats['no vehicle uploaded']}
                          </span>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Account Status Filter */}
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FaSort className="w-4 h-4" />
                        <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                        Inactive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("deleted")}>
                        Deleted
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            {/* Document Status Summary */}
            {Object.keys(docStatusStats).length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Document Status Overview</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(docStatusStats).map(([status, count]) => (
                    <div
                      key={status}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${
                        status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                        status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                        status === 'no documents uploaded' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {getDocStatusIcon(status)}
                      <span>{formatDocStatus(status)}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Table Section */}
            {isFetching || loading ? (
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <>
                <DriverList
                  data={docStatusFilteredData}
                  isFetching={isFetching}
                  loading={loading}
                />
                
                {/* Results Summary */}
                <div className="mt-4 text-sm text-gray-600">
                  Showing {docStatusFilteredData?.length || 0} of {totalDrivers} drivers
                  {(searchQuery || statusFilter !== 'all' || docStatusFilter !== 'all') && (
                    <span className="ml-2">
                      (filtered by {searchQuery ? `"${searchQuery}" ` : ''}
                      {statusFilter !== 'all' ? `status: ${statusFilter} ` : ''}
                      {docStatusFilter !== 'all' ? `docs: ${formatDocStatus(docStatusFilter)}` : ''})
                    </span>
                  )}
                </div>
              </>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-gray-200 mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;
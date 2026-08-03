"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriversTable from "@/components/Driver/Driver";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import { IoPersonOutline } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaExternalLinkAlt, FaPlus, FaTrash, FaEdit, FaHistory } from "react-icons/fa";
import { FaRegFileLines, FaClock } from "react-icons/fa6";
import { Skeleton } from "../ui/skeleton";
import { Table, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  useRejectDriversDocumentsMutation,
  useApproveDriversDocumentsMutation,
  useGetDriversDocumentsQuery,
  useAddDriversDocumentMutation,
  useUpdateDriversDocumentMutation,
  useDeleteDriversDocumentMutation,
  useGetDocumentHistoryQuery
} from "@/redux/services/Slices/driverApiSlice";
import { Button } from "../ui/button";
import { Modal } from "../DualModal";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AddVehicleModal } from "./Vehicle/AddVehicleModal";

// Define document types to match mobile app patterns
const DOCUMENT_TYPES = [
  { value: "license", label: "Driver's License", mobileField: "drivers_license" },
  { value: "insurance", label: "Vehicle Insurance", mobileField: "vehicle_insurance" },
  { value: "registration_doc", label: "Registration Document", mobileField: "reg_docs" },
  { value: "vehicle", label: "Vehicle Photo", mobileField: "photos" },
  { value: "other", label: "Other Document", mobileField: "other" },
];

// Available vehicle features matching your mobile app
const AVAILABLE_FEATURES = [
  { id: "wifi", label: "Wifi", },
  { id: "ac", label: "Air conditioner",},
  { id: "usb", label: "USB charging port", },
  { id: "neck_pillow", label: "Neck pillow",  },
  { id: "refreshment", label: "Onboard refreshment", },
  { id: "bluetooth", label: "Bluetooth connectivity",  },
  { id: "extra_legroom", label: "Extra legroom",  },
  { id: "others", label: "Others", },
];

// Document type labels mapping
const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  license: "Driver's License",
  insurance: "Vehicle Insurance",
  registration_doc: "Registration Document",
  vehicle: "Vehicle Photo",
  other: "Other Document",
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; label: string }> = {
    approved: { color: "bg-green-100 text-green-800 border-green-200", label: "Approved" },
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
    rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
  };

  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", label: status };

  return (
    <Badge className={`${config.color} border px-2 py-0.5 text-xs font-medium`} variant="outline">
      {config.label}
    </Badge>
  );
};

const ProfileVehicleDocs_Info = ({
  th = [],
  feedback = [],
  vehicle = [],
  profile = {},
  loading,
  isFetching,
  driverId,
}: any) => {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [documentFile, setDocumentFile] = useState<any>(null);
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [verifiableType, setVerifiableType] = useState<"driver" | "vehicle">("driver");
  const [verifiableId, setVerifiableId] = useState("");
  
  const { data: driverDocs, isLoading: docsLoading, refetch: refetchDocs } = 
    useGetDriversDocumentsQuery(driverId);
  
  const { data: documentHistory, isLoading: historyLoading, refetch: refetchHistory } = 
    useGetDocumentHistoryQuery(driverId);
  
  const [approveDocs, { isLoading: approveLoading }] =
    useApproveDriversDocumentsMutation();
  const [rejectDocs, { isLoading: rejectLoading }] =
    useRejectDriversDocumentsMutation();

  const [addDocument] = useAddDriversDocumentMutation();
  const [updateDocument] = useUpdateDriversDocumentMutation();
  const [deleteDocument] = useDeleteDriversDocumentMutation();

  // Safe profile data
  const safeProfile = profile || {};

  console.log('safe profile',th)

  
  // Safe vehicle data - ensure it's an array
  const safeVehicle = Array.isArray(vehicle) ? vehicle : [];
  
  // Safe feedback data - ensure it's an array
  const safeFeedback = Array.isArray(feedback) ? feedback : [];
  console.log('driver doc', driverDocs)
  // Safe trip history data
  const safeTripHistory = Array.isArray(th) ? th : [];

  // Debug logging for vehicle data
  useEffect(() => {
    if (safeVehicle.length > 0) {
      console.log("🚗 Vehicle data received:", safeVehicle.map(v => ({
        id: v.id,
        model: v.model,
        photos: v.photos,
        photosCount: v.photos?.length,
        vehicle_type: v.vehicle_type
      })));
    }
  }, [safeVehicle]);

  // Set verifiable ID when vehicle data is available
  useEffect(() => {
    if (safeVehicle.length > 0 && safeVehicle[0]?.id) {
      setVerifiableId(safeVehicle[0].id);
    }
  }, [vehicle]);

  const handleApproveDocument = async (
    id: string,
    onModalClose?: () => void
  ) => {
    try {
      await approveDocs(id)
        .unwrap()
        .then((res) => {
          toast.success("Document Approved");
          refetchDocs();
          refetchHistory();
          onModalClose?.();
        });
    } catch (error) {
      console.error("Failed to approve document:", error);
      toast.error("Failed to approve document");
    }
  };

  const validateReason = (value: string) => {
    if (value.length < 6) {
      setReasonError("Reason must be at least 6 characters long");
      return false;
    }
    setReasonError("");
    return true;
  };

  const handleDisapproveDocument = async ({
    reason,
    id,
    onModalClose,
  }: {
    reason: string;
    id: string;
    onModalClose?: () => void;
  }) => {
    if (!validateReason(reason)) {
      return;
    }

    try {
      await rejectDocs({ reason: reason, documentVerificationId: id })
        .unwrap()
        .then((res) => {
          toast.error("Document Rejected");
          setReason("");
          setReasonError("");
          refetchDocs();
          refetchHistory();
          onModalClose?.();
        });
    } catch (error) {
      console.error("Failed to reject document:", error);
      toast.error("Failed to reject document");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("📎 File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified)
      });
      
      // Store the actual File object
      setDocumentFile(file);
    } else {
      console.log("No file selected");
      setDocumentFile(null);
    }
  };

  const resetDocumentForm = () => {
    setDocumentFile(null);
    setDocumentType("");
    setDocumentName("");
    setSelectedDoc(null);
  };

  const handleAddDocument = async (onModalClose?: () => void) => {
    if (!documentFile || !documentType) {
      toast.error("Please select a file and document type");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    
    console.log("📝 === ADD DOCUMENT START ===");
    console.log("Driver ID:", driverId);
    console.log("Document Type:", documentType);
    console.log("Verifiable Type:", verifiableType);
    console.log("Verifiable ID:", verifiableType === "driver" ? driverId : verifiableId);
    console.log("File:", documentFile);
    
    // Add required fields
    formData.append("driver_id", driverId);
    // formData.append("verification_type", documentType);
    // formData.append("verifiable_type", verifiableType);
    // formData.append("verifiable_id", verifiableType === "driver" ? driverId : verifiableId);
    formData.append("documentType", documentType);
    
    if (documentName) {
      formData.append("name", documentName);
    }

    // Get the actual File object from the input
    const fileInput = document.getElementById('docFile') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const actualFile = fileInput.files[0];
      console.log("Actual file object:", {
        name: actualFile.name,
        type: actualFile.type,
        size: actualFile.size
      });
      
      // Append with the exact field name the backend expects
      formData.append("document", actualFile, actualFile.name);
    } else {
      console.error("No file found in input");
      toast.error("Please select a file");
      setIsUploading(false);
      return;
    }

    // Log FormData contents before sending
    console.log("📦 FormData entries (before send):");
    for (const [key, value] of formData.entries() as any) {
      if (value instanceof File) {
        console.log(`  ${key}: File - name: ${value.name}, type: ${value.type}, size: ${value.size}`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    try {
      console.log("🚀 Sending request to add document...");
      console.log("Request URL: /admin/drivers/add-document");
      console.log("Request method: POST");
      console.log("Request body: FormData with", Array.from(formData.entries()).length, "entries");
      
      const response = await addDocument({ id: driverId, formData }).unwrap();
      console.log("✅ Document added successfully:", response);
      toast.success("Document added successfully");
      refetchDocs();
      refetchHistory();
      resetDocumentForm();
      onModalClose?.();
    } catch (error: any) {
      console.error("❌ Failed to add document:", error);
      console.error("Error status:", error?.status);
      console.error("Error data:", error?.data);
      
      if (error?.data?.errors) {
        const validationErrors = error.data.errors;
        console.error("Validation errors:", validationErrors);
        Object.keys(validationErrors).forEach(key => {
          toast.error(`${key}: ${validationErrors[key][0]}`);
        });
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add document");
      }
    } finally {
      setIsUploading(false);
      console.log("📝 === ADD DOCUMENT END ===");
    }
  };

  const handleUpdateDocument = async (docId: string, onModalClose?: () => void) => {
    if (!documentFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    
    // Get the document being updated
    const doc = selectedDoc || driverDocs?.result?.find((d: any) => d.id === docId);
    console.log('docs', doc)
    
    if (doc?.verificationType === "vehicle") {
      formData.append(`photos[0]`, {
        uri: documentFile.uri,
        type: documentFile.type || "image/jpeg",
        name: documentFile.name || `vehicle_photo_${Date.now()}.jpg`,
      } as any);
    } 
    else if (doc?.verificationType === "registration_doc") {
      formData.append("reg_docs", {
        uri: documentFile.uri,
        type: documentFile.type || "image/jpeg",
        name: documentFile.name || `registration_${Date.now()}.jpg`,
      } as any);
    }
    else if (doc?.verificationType === "insurance") {
      formData.append("vehicle_insurance", {
        uri: documentFile.uri,
        type: documentFile.type || "image/jpeg",
        name: documentFile.name || `insurance_${Date.now()}.jpg`,
      } as any);
    }
    else if (doc?.verificationType === "license") {
      formData.append("drivers_license", {
        uri: documentFile.uri,
        type: documentFile.type || "image/jpeg",
        name: documentFile.name || `license_${Date.now()}.jpg`,
      } as any);
    }
    else {
      formData.append("document", {
        uri: documentFile.uri,
        type: documentFile.type || "application/octet-stream",
        name: documentFile.name || `document_${Date.now()}.pdf`,
      } as any);
    }
    
    if (documentName) {
      formData.append("name", documentName);
    }

    try {
      await updateDocument({ id: docId, formData }).unwrap();
      toast.success("Document updated successfully");
      refetchDocs();
      refetchHistory();
      resetDocumentForm();
      onModalClose?.();
    } catch (error: any) {
      console.error("Failed to update document:", error);
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to update document");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: string, onModalClose?: () => void) => {
    try {
      await deleteDocument(docId).unwrap();
      toast.success("Document deleted successfully");
      refetchDocs();
      refetchHistory();
      onModalClose?.();
    } catch (error: any) {
      console.error("Failed to delete document:", error);
      toast.error(error?.data?.message || "Failed to delete document");
    }
  };

  const getDocumentIcon = (type: string) => {
    switch(type) {
      case "license":
        return <FaRegFileLines className="w-[35px] h-[35px] mt-1 text-blue-600" />;
      case "insurance":
        return <FaRegFileLines className="w-[35px] h-[35px] mt-1 text-green-600" />;
      case "registration_doc":
        return <FaRegFileLines className="w-[35px] h-[35px] mt-1 text-purple-600" />;
      case "vehicle":
        return <FaRegFileLines className="w-[35px] h-[35px] mt-1 text-orange-600" />;
      default:
        return <FaRegFileLines className="w-[35px] h-[35px] mt-1 text-gray-700" />;
    }
  };

  // const getDocumentTypeLabel = (doc: any) => {
  //   if (doc?.documentType) return doc.documentType;
    
  //   switch(doc?.documentType) {
  //     case "license": return "Driver's License";
  //     case "insurance": return "Vehicle Insurance";
  //     case "registration_doc": return "Registration Document";
  //     case "vehicle": return "Vehicle Photo";
  //     default: return doc?.documentType || 'Document';
  //   }
  // };
const getDocumentTypeLabel = (doc: any) => {
  const type = doc?.documentType || doc?.verificationType || '';
  
  if (type.includes('license')) return "Driver's License";
  if (type.includes('insurance')) return "Vehicle Insurance";
  if (type.includes('registration') || type.includes('reg')) return "Registration Document";
  if (type.includes('vehicle')) return "Vehicle Photo";
  
  return type.replace(/_/g, ' ') || 'Document';
};

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const docs: any[] = driverDocs?.data || [];
  //const history: any[] = documentHistory?.result || [];
  const rawHistory = documentHistory?.result;
const history: any[] = rawHistory
  ? Array.isArray(rawHistory)
    ? rawHistory
    : Object.values(rawHistory)  
  : [];
  console.log('history', history)

  return (
    <div className="w-full">
      <div className="gap-4 grid xl:grid-cols-3 grid-rows-1 w-full">
        {/* Profile Card */}
        <Card className="h-auto w-full">
          <CardHeader>
            <CardTitle className="text-lg text-gray-500">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="my-5 space-y-6">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Full name
                    </span>
                    <span className="font-medium text-sm">
                      {(!safeProfile?.firstName && !safeProfile?.lastName) ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        <div className="flex gap-x-2">
                          <span> {safeProfile?.firstName || 'N/A'}</span>
                          <span> {safeProfile?.lastName || ''}</span>
                        </div>
                      )}
                    </span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Email address
                    </span>
                    <span className="font-medium text-sm">
                      {!safeProfile?.email ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        safeProfile?.email
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Phone number
                    </span>
                    <span className="font-medium text-sm">
                      {!safeProfile?.phone ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        safeProfile?.phone
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Address
                    </span>
                    <span className="font-medium text-sm">
                      {!safeProfile?.address ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        safeProfile?.address || 'Not provided'
                      )}
                    </span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Date of birth
                    </span>
                    <span className="font-medium text-sm">
                      {!safeProfile?.dob ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        new Date(safeProfile?.dob).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      City
                    </span>
                    <span className="font-medium text-sm">
                      {!safeProfile?.city ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        safeProfile?.city || 'Not provided'
                      )}
                    </span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Country
                    </span>
                    <span className="font-medium text-sm">
                      {!safeProfile?.country ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        safeProfile?.country || 'Not provided'
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Gender
                    </span>
                    <span className="font-medium text-sm">
                      {!safeProfile?.gender ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        safeProfile?.gender || 'Not provided'
                      )}
                    </span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Referral code
                    </span>
                    <span className="font-medium text-sm">
                      {!safeProfile?.referralCode ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        safeProfile?.referralCode || 'Not provided'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Info Card */}
        <Card className="h-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-gray-500">
              Vehicle Information
            </CardTitle>
            <AddVehicleModal 
              driverId={driverId}
              onSuccess={() => {
                console.log("Vehicle operation successful");
                // You can add a refetch function here if needed
              }}
              trigger={
                <Button className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-md flex items-center gap-2">
                  <FaPlus className="w-3 h-3" />
                  Add Vehicle
                </Button>
              }
            />
          </CardHeader>
          <CardContent>
            <div>
              {safeVehicle?.length > 0 ? (
                safeVehicle.map((deets: any, index: number) => (
                  <Accordion
                    key={deets?.id || index}
                    type="single"
                    collapsible
                    className="w-full"
                  >
                    <AccordionItem value={`item-${index + 1}`} className="">
                      <AccordionTrigger className="my-3">
                        <div className="flex items-center justify-between w-full pr-4">
                          <Table className="w-full">
                            <TableHeader>
                              <TableRow className="text-xs lg:text-sm">
                                <TableHead className="font-bold w-1/2 text-left">
                                  <div className="flex flex-col">
                                    <span className="font-normal text-xs text-gray-500">
                                      Vehicle Type
                                    </span>
                                    <span className="font-medium text-sm">
                                      {!deets?.type ? (
                                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                      ) : (
                                        deets?.type || 'Not specified'
                                      )}
                                    </span>
                                  </div>
                                </TableHead>
                                <TableHead className="font-bold w-1/2 text-left">
                                  <div className="flex text-end flex-col">
                                    <span className="font-normal text-xs text-gray-500">
                                      Vehicle Model
                                    </span>
                                    <span className="font-medium text-sm">
                                      {!deets?.model ? (
                                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                      ) : (
                                        deets?.model || 'Not specified'
                                      )}
                                    </span>
                                  </div>
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                          </Table>
                          <AddVehicleModal 
                            driverId={driverId}
                            vehicle={deets}
                            onSuccess={() => {
                              console.log("Vehicle updated successfully");
                            }}
                            trigger={
                              <Button className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md ml-2">
                                <FaEdit className="w-4 h-4" />
                              </Button>
                            }
                          />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="my-5 space-y-6">
                          <div className="flex justify-between">
                            <div className="flex flex-col">
                              <span className="font-normal text-xs text-gray-500">
                                License plate number
                              </span>
                              <span className="font-medium text-sm">
                                {!deets?.plateNumber ? (
                                  <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                ) : (
                                  deets?.plateNumber || 'Not specified'
                                )}
                              </span>
                            </div>
                            <div className="flex text-end flex-col">
                              <span className="font-normal text-xs text-gray-500">
                                Vehicle capacity
                              </span>
                              <span className="font-medium text-sm">
                                {!deets?.capacity ? (
                                  <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                ) : (
                                  `${deets?.capacity || '0'} Seats`
                                )}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <div className="flex flex-col">
                              <span className="font-normal text-xs text-gray-500">
                                Vehicle colour
                              </span>
                              <span className="font-medium text-sm">
                                {!deets?.color ? (
                                  <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                ) : (
                                  deets?.color || 'Not specified'
                                )}
                              </span>
                            </div>
                            <div className="flex text-end flex-col">
                              <span className="font-normal text-xs text-gray-500">
                                Insurance
                              </span>
                              <span className="font-medium text-sm">
                                {!deets?.insurance ? (
                                  <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                ) : (
                                  deets?.insurance || 'Not provided'
                                )}
                              </span>
                            </div>
                          </div>

                          <Tabs defaultValue="vehiclePhotos" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="vehiclePhotos">Photos</TabsTrigger>
                              <TabsTrigger value="features">Features</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="vehiclePhotos">
                              <div className="w-full grid grid-cols-1 pt-5 gap-4">
                                {deets?.vehiclePhoto && deets.vehiclePhoto.length > 0 ? (
                                  deets.vehiclePhoto.map((photo: string, photoIndex: number) => (
                                    <div key={photoIndex}>
                                      <Link href={photo || '#'} target="_blank">
                                        <span className="font-medium text-sm">
                                          <span className="flex gap-x-2 items-center">
                                            <Image
                                              src={"/photoGrid.svg"}
                                              alt="Vehicle Photo"
                                              width={35}
                                              height={35}
                                            />
                                            <div className="text-sm font-medium text-[#333F53]">
                                              Vehicle photo {photoIndex + 1}
                                            </div>
                                          </span>
                                        </span>
                                      </Link>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-sm text-gray-500 text-center py-4">
                                    No photos uploaded for this vehicle
                                  </div>
                                )}
                                
                              
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="features">
                              <div className="w-full pt-5">
                                {deets?.features && deets.features.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {deets.features.map((feature: string, idx: number) => {
                                      const featureDetails = AVAILABLE_FEATURES.find(
                                        (f) => f.id === feature || f.label.toLowerCase() === feature.toLowerCase()
                                      );
                                      
                                      return (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 border-orange-200"
                                        >
                                          
                                          {typeof feature === 'string' 
                                            ? feature.charAt(0).toUpperCase() + feature.slice(1).replace(/_/g, ' ')
                                            : feature
                                          }
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500 text-center py-4">
                                    No features specified for this vehicle
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))
              ) : (
                <div className="flex items-center justify-center h-[200px] flex-col">
                  <Image
                    src={"/nodata.svg"}
                    alt="No vehicle data"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                  <h1 className="mt-4 text-sm text-center font-semibold">
                    No Vehicle Information
                  </h1>
                  <div className="mt-4">
                    <AddVehicleModal 
                      driverId={driverId}
                      onSuccess={() => console.log("Vehicle added")}
                      trigger={
                        <Button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md">
                          Add Your First Vehicle
                        </Button>
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents Card with History Tab */}
        <Card className="h-auto col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-gray-500">
              Driver Documents
            </CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current" className="text-xs">
                  Current
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs">
                  History
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="current">
                <div>
                  {docsLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <Skeleton className="h-4 w-full bg-gray-200" />
                    </div>
                  ) : (
                    <>
                      {docs?.length > 0 ? (
                        <div className="mb-3">
                          <div className="max-h-[500px] h-auto overflow-y-auto">
                            <div className="grid grid-cols-1 gap-8">
                              {docs.map((doc: any, index: number) => (
                                <div
                                  key={doc?.id || index}
                                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex justify-between items-start">
                                    <Link href={doc?.link || '#'} target="_blank" className="flex-1">
                                      <span className="font-medium text-sm">
                                        <span className="flex gap-x-2 items-start">
                                          {getDocumentIcon(doc?.verificationType)}
                                          <div className="flex flex-col">
                                            <div className="text-sm font-bold items-center flex gap-x-2 text-[#333F53] capitalize">
                                              {getDocumentTypeLabel(doc)}
                                              <FaExternalLinkAlt className="w-3 h-3" />
                                            </div>
                                            <div className="text-xs mt-2">
                                              <StatusBadge status={doc?.status || 'unknown'} />
                                            </div>
                                            {doc?.reason && (
                                              <div className="text-[11px] mt-1 text-red-500">
                                                Reason: {doc.reason}
                                              </div>
                                            )}
                                            <div className="text-[11px] mt-1 text-gray-500">
                                              Added: {formatDate(doc?.createdAt)}
                                            </div>
                                          </div>
                                        </span>
                                      </span>
                                    </Link>

                                    <div className="flex gap-2 ml-2">
                                      <Modal
                                        trigger={
                                          <Button
                                            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                                            title="Update document"
                                            onClick={() => {
                                              setSelectedDoc(doc);
                                              setDocumentName(doc?.name || '');
                                            }}
                                          >
                                            <FaEdit className="w-4 h-4" />
                                          </Button>
                                        }
                                        title="Update Document"
                                        description={`Update ${getDocumentTypeLabel(doc)}`}
                                        content={
                                          <div className="flex flex-col space-y-4 lg:mb-4">
                                            <div className="space-y-4">
                                              <div className="space-y-2">
                                                <Label htmlFor="updateDocName">Document Name (Optional)</Label>
                                                <Input
                                                  id="updateDocName"
                                                  value={documentName}
                                                  onChange={(e) => setDocumentName(e.target.value)}
                                                  placeholder="Enter document name"
                                                />
                                              </div>

                                              <div className="space-y-2">
                                                <Label htmlFor="updateDocFile">New Document File</Label>
                                                <Input
                                                  id="updateDocFile"
                                                  type="file"
                                                  accept="image/*,.pdf"
                                                  onChange={handleFileChange}
                                                />
                                                <p className="text-xs text-gray-500">
                                                  Select a file to replace the current document
                                                </p>
                                              </div>

                                              <div className="flex justify-end space-x-3 pt-5">
                                                <Button
                                                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 w-full hover:bg-yellow-700 rounded-md disabled:bg-yellow-300"
                                                  onClick={() => handleUpdateDocument(doc?.id)}
                                                  disabled={isUploading || !documentFile}
                                                >
                                                  {isUploading ? "Updating..." : "Update Document"}
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        }
                                      />

                                      <Modal
                                        trigger={
                                          <Button
                                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                                            title="Delete document"
                                          >
                                            <FaTrash className="w-4 h-4" />
                                          </Button>
                                        }
                                        title="Delete Document"
                                        description="Are you sure you want to delete this document?"
                                        content={
                                          <div className="flex flex-col space-y-4 lg:mb-4">
                                            <p className="text-sm text-gray-600">
                                              This action cannot be undone. The document will be permanently removed.
                                            </p>
                                            <div className="flex justify-end space-x-3 pt-4">
                                              <Button
                                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 w-full hover:bg-red-700 rounded-md"
                                                onClick={() => handleDeleteDocument(doc?.id)}
                                              >
                                                Yes, Delete
                                              </Button>
                                            </div>
                                          </div>
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="mt-4 flex gap-x-2">
                                    <Modal
                                      trigger={
                                        <Button
                                          disabled={doc?.status === "approved"}
                                          className={`px-3 py-1.5 w-full text-xs font-bold rounded-md ${
                                            doc?.status === "approved"
                                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                              : "bg-green-500 text-white hover:bg-green-600"
                                          }`}
                                        >
                                          {doc?.status === "approved"
                                            ? "Approved"
                                            : "Approve"}
                                        </Button>
                                      }
                                      title={"Approve Document"}
                                      description={""}
                                      content={
                                        <div className="flex flex-col space-y-4 lg:mb-4">
                                          <p className="text-sm text-gray-600">
                                            Are you sure you want to approve this
                                            document? This action cannot be undone.
                                          </p>
                                          <div className="flex justify-end space-x-3 pt-4">
                                            <Button
                                              disabled={approveLoading}
                                              className="px-4 py-2 text-sm font-medium text-white w-full bg-green-600 hover:bg-green-500 rounded-md"
                                              onClick={() => {
                                                handleApproveDocument(doc?.id);
                                              }}
                                            >
                                              {approveLoading
                                                ? "Approving"
                                                : "Yes, Approve"}
                                            </Button>
                                          </div>
                                        </div>
                                      }
                                    />

                                    <Modal
                                      trigger={
                                        <Button
                                          disabled={doc?.status === "rejected"}
                                          className={`px-3 py-1.5 text-xs rounded-md w-full font-bold ${
                                            doc?.status === "rejected"
                                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                              : "bg-red-500 text-white hover:bg-red-600"
                                          }`}
                                        >
                                          {doc?.status === "rejected"
                                            ? "Rejected"
                                            : "Reject"}
                                        </Button>
                                      }
                                      title={"Reject Document"}
                                      description={"Enter reason for rejection"}
                                      content={
                                        <div className="flex flex-col space-y-4 lg:mb-4">
                                          <p className="text-sm text-gray-600 mb-2">
                                            Please provide a reason for rejecting this
                                            document. This will be shared with the
                                            driver.
                                          </p>
                                          <div className="space-y-4 mx-1">
                                            <div className="space-y-2">
                                              <Textarea
                                                value={reason}
                                                onChange={(e) => {
                                                  setReason(e.target.value);
                                                  validateReason(e.target.value);
                                                }}
                                                placeholder="Enter reason for rejection..."
                                                className={`w-full text-sm border rounded-md h-24 ${
                                                  reasonError
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                                }`}
                                              />
                                              {reasonError && (
                                                <p className="text-red-500 text-xs">
                                                  {reasonError}
                                                </p>
                                              )}
                                            </div>
                                            <div className="flex justify-end space-x-3 pt-5">
                                              <Button
                                                className="px-4 py-2 text-sm font-medium text-white bg-red-400 w-full hover:bg-red-500 rounded-md disabled:bg-red-200"
                                                onClick={() => {
                                                  handleDisapproveDocument({
                                                    reason: reason,
                                                    id: doc?.id,
                                                  });
                                                }}
                                                disabled={
                                                  rejectLoading || reason.length < 6
                                                }
                                              >
                                                {rejectLoading
                                                  ? "Submitting..."
                                                  : "Submit Rejection"}
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center w-full h-[300px] flex-col justify-center">
                          <Image
                            src={"/nodata.svg"}
                            alt=""
                            width={150}
                            height={150}
                            className="object-cover me-5"
                          />
                          <h1 className="mt-4 text-base text-center font-semibold">
                            No Documents
                          </h1>
                          <p className="text-xs text-gray-500 mt-1">
                            Click the button below to upload documents
                          </p>
                        </div>
                      )}
                      
                      {/* Add Document Button - ALWAYS VISIBLE */}
                      <div className="mt-4">
                        <Modal
                          trigger={
                            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-md flex items-center justify-center gap-2">
                              <FaPlus className="w-3 h-3" />
                              Add New Document
                            </Button>
                          }
                          title="Add New Document"
                          description="Upload a new document for this driver"
                          content={
                            <div className="flex flex-col space-y-4 lg:mb-4">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="docType">Document Type</Label>
                                  <Select value={documentType} onValueChange={setDocumentType}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {DOCUMENT_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="verifiableType">Belongs To</Label>
                                  <Select value={verifiableType} onValueChange={(value: "driver" | "vehicle") => setVerifiableType(value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="driver">Driver</SelectItem>
                                      <SelectItem value="vehicle">Vehicle</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {verifiableType === "vehicle" && safeVehicle.length > 0 && (
                                  <div className="space-y-2">
                                    <Label htmlFor="vehicleSelect">Select Vehicle</Label>
                                    <Select value={verifiableId} onValueChange={setVerifiableId}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select vehicle" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {safeVehicle.map((v: any) => (
                                          <SelectItem key={v.id} value={v.id}>
                                            {v.model} - {v.licensePlateNumber}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label htmlFor="docName">Document Name (Optional)</Label>
                                  <Input
                                    id="docName"
                                    value={documentName}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                    placeholder="e.g., Driver's License Front"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="docFile">Document File</Label>
                                  <Input
                                    id="docFile"
                                    name="docFile"
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                  />
                                  <p className="text-xs text-gray-500">
                                    Accepted formats: Images, PDF (Max 5MB)
                                  </p>
                                </div>

                                <div className="flex justify-end space-x-3 pt-5">
                                  <Button
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 w-full hover:bg-blue-700 rounded-md disabled:bg-blue-300"
                                    onClick={() => handleAddDocument()}
                                    disabled={isUploading || !documentFile || !documentType}
                                  >
                                    {isUploading ? "Uploading..." : "Upload Document"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div>
                  {historyLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <Skeleton className="h-4 w-full bg-gray-200" />
                    </div>
                  ) : history?.length > 0 ? (
                    <div className="max-h-[500px] h-auto overflow-y-auto">
                      <div className="space-y-4">
                        {history.map((item: any, index: number) => (
                          <div
                            key={item?.id || index}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                          >
                            <div className="flex items-start gap-3">
                              <FaClock className="w-4 h-4 mt-1 text-gray-500 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-gray-700">
                                    {getDocumentTypeLabel(item)}
                                  </h4>
                                  <StatusBadge status={item?.status || 'unknown'} />
                                </div>
                                
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(item?.createdAt)}
                                </p>
                                
                                {item?.rejectionReason && (
                                  <div className="mt-2 text-xs bg-red-50 border border-red-100 rounded p-2">
                                    <span className="font-medium text-red-700">Rejection reason:</span>
                                    <span className="text-red-600 ml-1">{item.rejectionReason}</span>
                                  </div>
                                )}

                                {item?.documentUrl && (
                                  <Link 
                                    href={item.documentUrl} 
                                    target="_blank" 
                                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    View Document <FaExternalLinkAlt className="w-3 h-3" />
                                  </Link>
                                )}

                                <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-400">
                                  <span>ID: {item?.id}</span>
                                  <span>•</span>
                                  <span>Type: {item?.driverId}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center w-full h-[400px] flex-col justify-center">
                      <Image
                        src={"/nodata.svg"}
                        alt=""
                        width={200}
                        height={200}
                        className="object-cover me-5"
                      />
                      <h1 className="mt-8 text-lg text-center font-semibold">
                        No History
                      </h1>
                      <p className="text-sm text-gray-500 mt-2">
                        Document upload history will appear here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Trip History */}
        <ScrollArea className="w-full lg:col-span-2 col-span-1 text-lg text-gray-500">
          <div className="bg-white rounded-lg w-full p-5">
            <div className="py-4">
              <h2 className="text-base font-bold">Trip history</h2>
            </div>
            <DriversTable 
              data={safeTripHistory} 
              loading={loading} 
              isFetching={isFetching} 
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Feedback */}
        <Card className="w-full overflow-auto h-[500px]">
          <CardHeader className="lg-white text-left">
            <CardTitle className="text-lg text-gray-500">
              Passengers Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {safeFeedback?.length > 0 ? (
              <>
                {safeFeedback.map((actions: any, index: number) => (
                  <div key={actions?.id || index}>
                    <Separator />
                    <div className="my-6">
                      <div className="flex w-full items-start space-x-4">
                        <Avatar className="lg:w-14 h-10 lg:h-14 w-10">
                          <AvatarImage src={actions?.profileImage} />
                          <AvatarFallback>
                            <IoPersonOutline className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="">
                          <p className="text-gray-800 font-bold text-sm">
                            {actions?.passenger || 'Anonymous'}
                          </p>
                          <span className="flex items-center gap-x-3">
                            {(actions?.rating || 0).toFixed(1)}{" "}
                            <StarRatings
                              rating={actions?.rating || 0}
                              numberOfStars={5}
                              name="rating"
                              starRatedColor="#F5A623"
                              starDimension="20px"
                              starSpacing="3px"
                              starEmptyColor="grey"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="text-sm mt-3">
                        {actions?.comment || 'No comment provided'}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center w-full h-[400px] flex-col justify-center">
                <Image
                  src={"/nodata.svg"}
                  alt=""
                  width={200}
                  height={200}
                  className="object-cover me-5"
                />
                <h1 className="mt-8 text-lg text-center font-semibold">
                  No Feedback
                </h1>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileVehicleDocs_Info;
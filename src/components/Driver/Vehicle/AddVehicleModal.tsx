"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/DualModal";
import { useAddVehicleMutation, useUpdateVehicleMutation, useGetVehicleTypesQuery } from "@/redux/services/Slices/vehicleApiSlice";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

// Define types
interface VehicleType {
  id: string;
  name: string;
}

interface Feature {
  id: string;
  label: string;
}

interface Vehicle {
  id?: string;
  vehicle_type_id?: string;
  vehicle_type?: { id: string; name: string };
  model?: string;
  license_plate_number?: string;
  capacity?: string;
  color?: string;
  features?: string[];
  photos?: string[];
}

interface AddVehicleModalProps {
  driverId: string;
  vehicle?: Vehicle;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

// Available vehicle features matching your mobile app
const AVAILABLE_FEATURES: Feature[] = [
  { id: "wifi", label: "Wifi" },
  { id: "ac", label: "Air conditioner" },
  { id: "usb", label: "USB charging port", },
  { id: "neck_pillow", label: "Neck pillow", },
  { id: "refreshment", label: "Onboard refreshment",},
  { id: "bluetooth", label: "Bluetooth connectivity",  },
  { id: "extra_legroom", label: "Extra legroom",  },
  { id: "others", label: "Others", },
];

export const AddVehicleModal = ({ driverId, vehicle, onSuccess, trigger }: AddVehicleModalProps) => {
  const [formData, setFormData] = useState({
    vehicle_type_id: vehicle?.vehicle_type_id || vehicle?.vehicle_type?.id || "",
    model: vehicle?.model || "",
    license_plate_number: vehicle?.license_plate_number || "",
    capacity: vehicle?.capacity || "",
    color: vehicle?.color || "",
    features: vehicle?.features || [] as string[],
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(vehicle?.photos || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch vehicle types from API
const { data: vehicleTypesData, isLoading: typesLoading, error: typesError } = useGetVehicleTypesQuery({});


  const [addVehicle] = useAddVehicleMutation();
  const [updateVehicle] = useUpdateVehicleMutation();

  // Debug logging
  useEffect(() => {
    if (vehicle) {
      console.log("📝 Editing vehicle with features:", vehicle.features);
      console.log("📝 Vehicle photos:", vehicle.photos);
      console.log("📝 Vehicle type ID:", vehicle.vehicle_type_id || vehicle.vehicle_type?.id);
    }
  }, [vehicle]);

  // Log vehicle types data
  useEffect(() => {
    if (vehicleTypesData) {
      console.log("🚗 Vehicle types from API:", vehicleTypesData);
    }
    if (typesError) {
      console.error("❌ Error loading vehicle types:", typesError);
    }
  }, [vehicleTypesData, typesError]);

  // Update form when vehicle prop changes (for editing)
  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicle_type_id: vehicle?.vehicle_type_id || vehicle?.vehicle_type?.id || "",
        model: vehicle?.model || "",
        license_plate_number: vehicle?.license_plate_number || "",
        capacity: vehicle?.capacity || "",
        color: vehicle?.color || "",
        features: vehicle?.features || [],
      });
      setExistingPhotos(vehicle?.photos || []);
    }
  }, [vehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      console.log("📸 Photos selected:", newPhotos.length);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const toggleFeature = (featureId: string) => {
    setFormData(prev => {
      const features = prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId];
      
      console.log("🔧 Features updated:", features);
      return { ...prev, features };
    });
  };

  const resetForm = () => {
    setFormData({
      vehicle_type_id: "",
      model: "",
      license_plate_number: "",
      capacity: "",
      color: "",
      features: [],
    });
    setPhotos([]);
    setExistingPhotos([]);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.vehicle_type_id) {
      toast.error("Please select vehicle type");
      return;
    }
    if (!formData.model) {
      toast.error("Please enter vehicle model");
      return;
    }
    if (!formData.license_plate_number) {
      toast.error("Please enter license plate number");
      return;
    }
    if (!formData.capacity) {
      toast.error("Please enter vehicle capacity");
      return;
    }
    if (!formData.color) {
      toast.error("Please enter vehicle color");
      return;
    }
    
    // Check for minimum 3 photos (combining existing and new)
    const totalPhotos = photos.length + existingPhotos.length;
    if (totalPhotos < 3) {
      toast.error(`Please upload at least 3 photos of your vehicle (currently ${totalPhotos})`);
      return;
    }

    setIsSubmitting(true);
    const submitData = new FormData();
    
    // Add driver_id
    submitData.append("driver_id", driverId);
    
    // Add vehicle fields - using vehicle_type_id as backend expects
    submitData.append("vehicle_type_id", formData.vehicle_type_id);
    submitData.append("model", formData.model);
    submitData.append("license_plate_number", formData.license_plate_number);
    submitData.append("capacity", formData.capacity);
    submitData.append("color", formData.color);

    // Add features as an array (not JSON string)
    if (formData.features.length > 0) {
      // Send as individual form fields with array notation
      formData.features.forEach((feature, index) => {
        submitData.append(`features[${index}]`, feature);
      });
    }

    // Add photos (only new ones)
    photos.forEach((photo, index) => {
      submitData.append(`photos[${index}]`, photo);
    });

    // If editing, add vehicle_id
    if (vehicle?.id) {
      submitData.append("vehicle_id", vehicle.id);
    }

    // Log for debugging
    console.log("📝 Submitting vehicle:", {
      driverId,
      vehicle_type_id: formData.vehicle_type_id,
      model: formData.model,
      license_plate_number: formData.license_plate_number,
      capacity: formData.capacity,
      color: formData.color,
      features: formData.features,
      newPhotosCount: photos.length,
      existingPhotosCount: existingPhotos.length,
      totalPhotos: photos.length + existingPhotos.length,
      isEdit: !!vehicle?.id
    });

    try {
      let response;
      if (vehicle?.id) {
        response = await updateVehicle(submitData).unwrap();
        toast.success("Vehicle updated successfully");
      } else {
        response = await addVehicle(submitData).unwrap();
        toast.success("Vehicle added successfully");
      }
      
      console.log("✅ Vehicle saved:", response);
      onSuccess?.();
      resetForm();
    } catch (error: any) {
      console.error("❌ Failed to save vehicle:", error);
      if (error?.data?.errors) {
        Object.keys(error.data.errors).forEach((key: string) => {
          toast.error(`${key}: ${error.data.errors[key][0]}`);
        });
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to save vehicle");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  // Calculate total photos for display
  const totalPhotos = photos.length + existingPhotos.length;

  // Get vehicle types array from response
  const vehicleTypes = Object.values(vehicleTypesData?.result || {});
  console.log("vehicle type", vehicleTypes)
  console.log("vehicle type length", vehicleTypes.length)


  // Create the modal content
  const modalContent = (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
      {/* Vehicle Type */}
      <div className="space-y-2">
        <Label htmlFor="vehicle_type_id">Vehicle Type *</Label>
        {typesLoading ? (
          <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
        ) : typesError ? (
          <div className="text-sm text-red-500">Error loading vehicle types</div>
        ) : (
          
          <Select
            value={formData.vehicle_type_id}
            onValueChange={(value: string) => setFormData(prev => ({ ...prev, vehicle_type_id: value }))}
          >
            
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">

              
              {vehicleTypes.length > 0 ? (
                vehicleTypes.map((type: VehicleType) => (
                  
                  <SelectItem key={type.id} value={type.id}>
                    
                    {type.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-types" disabled>No vehicle types available</SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Model */}
      <div className="space-y-2">
        <Label htmlFor="model">Vehicle Model *</Label>
        <Input
          id="model"
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          placeholder="e.g., Toyota Camry"
        />
      </div>

      {/* License Plate */}
      <div className="space-y-2">
        <Label htmlFor="license_plate_number">License Plate Number *</Label>
        <Input
          id="license_plate_number"
          name="license_plate_number"
          value={formData.license_plate_number}
          onChange={handleInputChange}
          placeholder="e.g., ABC-1234"
        />
      </div>

      {/* Capacity and Color in grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity (Seats) *</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleInputChange}
            placeholder="e.g., 4"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color *</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="e.g., Black"
          />
        </div>
      </div>

      {/* Features Section - Matching mobile app */}
      <div className="space-y-3">
        <Label>Vehicle Features</Label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_FEATURES.map((feature: Feature) => (
            <Badge
              key={feature.id}
              variant={formData.features.includes(feature.id) ? "default" : "outline"}
              className={`cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm ${
                formData.features.includes(feature.id)
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => toggleFeature(feature.id)}
            >
             
              {feature.label}
              {formData.features.includes(feature.id) && (
                <FaCheck className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Select features that your vehicle offers
        </p>
      </div>

      {/* Photos Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Vehicle Photos *</Label>
          <span className={`text-xs font-medium ${totalPhotos >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
            {totalPhotos}/3 minimum
          </span>
        </div>
        
        {/* Existing Photos */}
        {existingPhotos.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Existing Photos:</p>
            <div className="grid grid-cols-3 gap-2">
              {existingPhotos.map((photo: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Vehicle ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index, true)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Photos */}
        {photos.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">New Photos:</p>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo: File, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`New ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-2">
          <Label
            htmlFor="photos"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
          >
            <FaPlus className="w-3 h-3" />
            Add Photos ({totalPhotos}/3)
          </Label>
          <Input
            id="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500">
          Accepted formats: JPG, PNG (Max 5MB each). Minimum 3 photos required.
        </p>
        {totalPhotos < 3 && (
          <p className="text-xs text-orange-600">
            Please add {3 - totalPhotos} more photo{3 - totalPhotos > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || totalPhotos < 3}
          className={`w-full ${
            totalPhotos >= 3 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-400 cursor-not-allowed text-white'
          }`}
        >
          {isSubmitting ? "Saving..." : (vehicle?.id ? "Update Vehicle" : "Add Vehicle")}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      trigger={trigger || (
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <FaPlus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      )}
      title={vehicle?.id ? "Edit Vehicle" : "Add New Vehicle"}
      description="Enter vehicle details, features, and upload photos"
      content={modalContent}
    />
  );
};
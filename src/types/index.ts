export interface LinkItem {
  id: number;
  title: string;
  link?: string;
  icon: any;
  sublinks?: any[];
}

export interface NiyuItem {
  id: number;
  title: string;
  link?: string;
  icon: any;
  sublinks?: any[];
}

export interface ModalProps {
  data: any;
  onModalClose?: () => void;
}


export interface PassengerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  gender: string;
  dob: string;
  role: string;
  status: "active" | "inactive" | "deleted";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Passenger {
  id: string;
  userId: string;
  walletBalance: string;     // note: a string ("0.00"), not a number
  totalTrips: number;
  nxt_kin_name: string | null;
  nxt_kin_relationship: string | null;
  nxt_kin_telephone: string | null;
  payment_details: unknown | null;
  metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: PassengerUser;       // <-- everything you display lives here
}

export interface PassengersMeta {
  page: number;
  limit: number;
  count: number;             // total across all pages
  previousPage: boolean;
  nextPage: boolean;
}

export interface PassengersResponse {
  message: string;
  result: {
    data: Passenger[];
    meta: PassengersMeta;
  };
  statusCode: number;
  success: boolean;
}
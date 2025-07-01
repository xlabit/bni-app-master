
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'team_admin';
}

export interface Chapter {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  memberCount: number;
}

export interface Member {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  chapterName: string;
  membershipEndDate: string;
  status: 'active' | 'inactive';
  memberRole: 'regular' | 'leadership' | 'ro' | 'green' | 'gold';
  profileImage?: string;
  email: string;
  joinDate: string;
}

export interface Deal {
  id: string;
  dealName: string;
  shortDescription: string;
  longDescription: string;
  memberName: string;
  memberId: string;
  startDate: string;
  endDate: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  specialRoleDiscount?: {
    discountType: 'flat' | 'percentage';
    discountValue: number;
  };
  category: string;
  status: 'active' | 'inactive';
  logoImageUrl?: string;
  bannerImageUrl?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalDeals: number;
  activeDeals: number;
  totalChapters: number;
  activeChapters: number;
  expiringDeals: number;
}

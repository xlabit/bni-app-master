
import { Chapter, Member, Deal, DashboardStats } from '@/types';

export const mockChapters: Chapter[] = [
  {
    id: '1',
    name: 'Downtown Business Network',
    status: 'active',
    createdAt: '2024-01-15',
    memberCount: 45
  },
  {
    id: '2',
    name: 'Westside Entrepreneurs',
    status: 'active',
    createdAt: '2024-02-20',
    memberCount: 32
  },
  {
    id: '3',
    name: 'Tech Valley Chapter',
    status: 'inactive',
    createdAt: '2024-03-10',
    memberCount: 28
  },
  {
    id: '4',
    name: 'Northshore Professionals',
    status: 'active',
    createdAt: '2024-01-05',
    memberCount: 38
  }
];

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'John Smith',
    businessName: 'Smith Consulting',
    phone: '+1-555-0123',
    chapterName: 'Downtown Business Network',
    membershipEndDate: '2024-12-31',
    status: 'active',
    memberRole: 'leadership',
    email: 'john@smithconsulting.com',
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    businessName: 'Johnson Marketing',
    phone: '+1-555-0124',
    chapterName: 'Westside Entrepreneurs',
    membershipEndDate: '2024-11-30',
    status: 'active',
    memberRole: 'gold',
    email: 'sarah@johnsonmarketing.com',
    joinDate: '2024-02-01'
  },
  {
    id: '3',
    name: 'Mike Davis',
    businessName: 'Davis Law Firm',
    phone: '+1-555-0125',
    chapterName: 'Downtown Business Network',
    membershipEndDate: '2024-10-31',
    status: 'active',
    memberRole: 'ro',
    email: 'mike@davislawfirm.com',
    joinDate: '2024-01-20'
  },
  {
    id: '4',
    name: 'Emily Chen',
    businessName: 'Chen Tech Solutions',
    phone: '+1-555-0126',
    chapterName: 'Tech Valley Chapter',
    membershipEndDate: '2024-09-30',
    status: 'inactive',
    memberRole: 'regular',
    email: 'emily@chentech.com',
    joinDate: '2024-03-15'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    businessName: 'Wilson Catering',
    phone: '+1-555-0127',
    chapterName: 'Northshore Professionals',
    membershipEndDate: '2025-01-31',
    status: 'active',
    memberRole: 'green',
    email: 'robert@wilsoncatering.com',
    joinDate: '2024-01-10'
  }
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    dealName: '20% Off Marketing Services',
    shortDescription: 'Get 20% off all marketing consultation services',
    longDescription: 'Comprehensive marketing consultation including digital strategy, brand development, and campaign planning. Valid for new clients only.',
    memberName: 'Sarah Johnson',
    memberId: '2',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    discountType: 'percentage',
    discountValue: 20,
    specialRoleDiscount: {
      discountType: 'percentage',
      discountValue: 30
    },
    category: 'Business Services',
    status: 'active',
    keywords: 'marketing, consultation, digital strategy, brand development',
    isPremiumDeal: true,
    createdAt: '2024-05-15'
  },
  {
    id: '2',
    dealName: 'Free Legal Consultation',
    shortDescription: 'Complimentary 1-hour legal consultation',
    longDescription: 'One hour of free legal consultation for business matters including contracts, compliance, and general legal advice.',
    memberName: 'Mike Davis',
    memberId: '3',
    startDate: '2024-06-15',
    endDate: '2024-09-15',
    discountType: 'flat',
    discountValue: 250,
    specialRoleDiscount: {
      discountType: 'flat',
      discountValue: 400
    },
    category: 'Legal Services',
    status: 'active',
    keywords: 'legal, consultation, contracts, compliance, business law',
    isPremiumDeal: false,
    createdAt: '2024-06-01'
  },
  {
    id: '3',
    dealName: 'Catering Package Deal',
    shortDescription: '15% off corporate catering orders over $500',
    longDescription: 'Professional catering services for corporate events, meetings, and special occasions. Minimum order $500.',
    memberName: 'Robert Wilson',
    memberId: '5',
    startDate: '2024-07-01',
    endDate: '2024-12-31',
    discountType: 'percentage',
    discountValue: 15,
    specialRoleDiscount: {
      discountType: 'percentage',
      discountValue: 25
    },
    category: 'Food & Catering',
    status: 'active',
    keywords: 'catering, corporate events, food, meetings, special occasions',
    isPremiumDeal: false,
    createdAt: '2024-06-20'
  }
];

export const mockStats: DashboardStats = {
  totalMembers: 143,
  activeMembers: 128,
  totalDeals: 47,
  activeDeals: 38,
  totalChapters: 8,
  activeChapters: 6,
  expiringDeals: 5
};

export const dealCategories = [
  'Business Services',
  'Legal Services',
  'Food & Catering',
  'Technology',
  'Healthcare',
  'Finance',
  'Real Estate',
  'Retail',
  'Education',
  'Other'
];

export interface DashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  pendingCompanies: number;
  totalRevenue: number;
}

export interface RevenueChart {
  month: string;
  revenue: number;
}

export interface PlanDistribution {
  plan: string;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueChart: RevenueChart[];
  planDistribution: PlanDistribution[];
}
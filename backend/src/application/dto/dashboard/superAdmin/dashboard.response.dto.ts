export interface DashboardStatsDTO {
  totalCompanies: number;
  activeCompanies: number;
  pendingCompanies: number;
  totalRevenue: number;
}

export interface DashboardResponseDTO {
  stats: DashboardStatsDTO;
    revenueChart: RevenueChartDTO[];
  planDistribution: PlanDistributionDTO[];
}

export interface RevenueChartDTO {
  month: string;
  revenue: number;
}

export interface PlanDistributionDTO {
  plan: string;
  count: number;
}
export interface GetCompanySubscriptionResponseDTO{
    subscriptionId:string;
    planId:string;

    planName:string;
    description:string;

    pricePerMonth:number;
   pricePerYear:number;
   currency:"USD" | "INR" | "EUR";

   features:string[];

   limits:{
    maxProjects:number;
    maxDevelopers:number;
    maxStorageGB:number;
   };

    billingCycle: "MONTHLY" | "YEARLY";
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";

  startDate:Date;
  endDate:Date|null;
  renewsAt:Date|null;
}
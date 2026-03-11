export type PlanCurrency = 'USD' | 'INR' | 'EUR';

export interface PlanLimits {
    maxProjects: number;
    maxDevelopers: number;
    maxStorageGB: number;

}

export class Plan {
    constructor(
        public readonly id: string,
        public name: string,
        public slug: string,
        public description: string,
        public pricePerMonth: number,
        public pricePerYear: number,
        public currency: PlanCurrency,
        public features: string[],
        public limits: PlanLimits,
        public isActive: boolean,
        public createdAt?: Date,
        public updatedAt?: Date
    ) { }
}
import { Plan } from "../../domain/entities/plan.entity";
import { CreatePlanData, IPlanRepository, ListPlanQuery } from "../../domain/repositories/plan.repository";
import { IPlanDocument, PlanModel } from "../db/models/plan.model";

export class PlanRepository implements IPlanRepository{
    private _toDomain(doc:IPlanDocument):Plan{
        return new Plan(
            doc._id.toString(),
            doc.name,
            doc.slug,
            doc.description,
            doc.pricePerMonth,
            doc.pricePerYear,
            doc.currency,
            doc.features,
            doc.limits,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        )
    }

    async findByName(name: string): Promise<Plan | null> {
        const doc=await PlanModel.findOne({name});
        if(!doc) return null;
        return this._toDomain(doc)
    }

    async findBySlug(slug: string): Promise<Plan | null> {
        const doc=await PlanModel.findOne({slug});

        if(!doc) return null;
        return this._toDomain(doc);
    }

    async create(data: CreatePlanData): Promise<Plan> {
        const doc=await PlanModel.create(data);
        return this._toDomain(doc)
    }

    async findAll(query: ListPlanQuery): Promise<{ items: Plan[]; total: number; }> {
        const {page,limit,search,isActive}=query;
        const filter:Record<string,unknown>={};

        if(isActive!==undefined){
            filter.isActive=isActive
        }

        if(search){
            filter.$or=[
                {name:{$regex:search,$options:"i"}},
                {slug:{$regex:search,$options:"i"}}
            ]
        }

        const items=await PlanModel.find(filter).skip((page-1)*limit).limit(limit).sort({createdAt:-1})

        const total=await PlanModel.countDocuments(filter)

        return {
            items:items.map((plan)=>this._toDomain(plan)),
            total
        }

    }

    async findById(planId: string): Promise<Plan | null> {
        const plan=await PlanModel.findById(planId);
        if(!plan) return null;
        return this._toDomain(plan);
    }

    async delete(planId: string): Promise<void> {
        await PlanModel.deleteOne({_id:planId})
    }

    async save(plan: Plan): Promise<void> {
        await PlanModel.findByIdAndUpdate(plan.id,{
            name:plan.name,
            slug:plan.slug,
            description:plan.description,
            pricePerMonth:plan.pricePerMonth,
            pricePerYear:plan.pricePerYear,
            currency:plan.currency,
            features:plan.features,
            limits:plan.limits,
            isActive:plan.isActive
        },{new:true})
    }
}
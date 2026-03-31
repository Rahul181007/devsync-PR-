import { PipelineStage } from "mongoose";
import { GetTransactionOptions, ITransactionQueryRepository, Transaction, TransactionListResult } from "../../domain/repositories/transaction.query.repository";
import { PaymentModel } from "../db/models/payment.model";

type DateFilter = {
  $gte?: Date;
  $lte?: Date;
};

type MatchFilter = {
  status?: "PENDING" | "SUCCESS" | "FAILED";
  createdAt?: DateFilter;
};
export class TransactionQueryRepository implements ITransactionQueryRepository {
    async getAllTransactions(options: GetTransactionOptions): Promise<TransactionListResult> {
        const { page, limit, status, search,fromDate,toDate} = options;
        const skip = (page - 1) * limit;

        const match: MatchFilter = {};

        if (status) {
            match.status = status;
        }

        if (fromDate || toDate) {
  match.createdAt = {};

  if (fromDate) {
    match.createdAt.$gte = new Date(fromDate);
  }

  if (toDate) {
    match.createdAt.$lte = new Date(toDate);
  }
}

        

        const pipeline: PipelineStage[] = [];

        pipeline.push({ $match: match });

        pipeline.push(
            {
                $lookup: {
                    from: "invoices",
                    localField: "_id",
                    foreignField: "paymentId",
                    as: "invoice"
                }
            },
            {
                $unwind: {
                    path: "$invoice",
                    preserveNullAndEmptyArrays: true
                }
            }
        );


        pipeline.push(
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "company"
                }
            },
            { $unwind: "$company" }
        )

        pipeline.push(
            {
                $lookup: {
                    from: "plans",
                    localField: "planId",
                    foreignField: "_id",
                    as: "plan"

                }
            },
            { $unwind: "$plan" }
        )


        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "company.name": { $regex: search, $options: "i" } },
                        { "invoice.invoiceNumber": { $regex: search, $options: "i" } },
                        { orderId: { $regex: search, $options: "i" } }
                    ]
                }
            })
        }

        pipeline.push({
            $facet: {
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },

                    {
                        $project: {
                            paymentId: "$_id",
                            orderId: 1,

                            companyId: "$company._id",
                            companyName: "$company.name",

                            planId: "$plan._id",
                            planName: "$plan.name",

                            billingCycle: 1,

                            amount: 1,
                            currency: 1,

                            status: 1,

                            invoiceNumber: "$invoice.invoiceNumber",
                            invoiceId: "$invoice._id", 

                            subtotal: "$invoice.subtotal",
                            tax: "$invoice.tax",
                            total: "$invoice.total",

                            createdAt: 1
                        }
                    }
                ],

                totalCount: [
                    { $count: "total" }
                ]
            }
        } as PipelineStage);

        const result=await PaymentModel.aggregate(pipeline);

         const data:Transaction[]=result[0]?.data||[];
         const total:number=result[0]?.totalCount?.[0]?.total ||0

         return {
            data,
            total,
            page,
            limit
         }
    }
}
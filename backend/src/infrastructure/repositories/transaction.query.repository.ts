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
        const { page, limit, status, search, fromDate, toDate } = options;
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

        const result = await PaymentModel.aggregate(pipeline);

        const data: Transaction[] = result[0]?.data || [];
        const total: number = result[0]?.totalCount?.[0]?.total || 0

        return {
            data,
            total,
            page,
            limit
        }
    }

    async getTotalRevenue(): Promise<number> {
        const result = await PaymentModel.aggregate([
            {
                $match: {
                    status: "SUCCESS"
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        return result[0]?.total || 0;
    }

    async getRevenueByMonth(): Promise<{ month: string; revenue: number }[]> {
        const result = await PaymentModel.aggregate([
            {
                $match: {
                    status: "SUCCESS"
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$amount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Convert aggregation result to map
        const revenueMap = new Map<string, number>();

        result.forEach((item) => {
            const key = `${item._id.year}-${item._id.month}`;
            revenueMap.set(key, item.revenue);
        });

        // Get last 6 months
        const now = new Date();
        const months = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            const key = `${year}-${month}`;

            months.push({
                month: monthNames[month - 1],
                revenue: revenueMap.get(key) || 0
            });
        }

        return months;
    }
}
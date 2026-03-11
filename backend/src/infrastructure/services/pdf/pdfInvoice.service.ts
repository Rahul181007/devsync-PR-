import PDFDocument from "pdfkit";
import { Invoice } from "../../../domain/entities/invoice.entity";
import { IInvoiceService } from "../../../domain/service/invoice.service";

export class PdfInvoiceService implements IInvoiceService {

   async generate(invoice: Invoice): Promise<Buffer> {

    return new Promise((resolve) => {

      const doc = new PDFDocument({ margin: 50 });

      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* Header with professional styling */
      doc
        .fontSize(28)
        .fillColor("#2c3e50")
        .text("DevSync", { align: "left" });

      doc
        .fontSize(11)
        .fillColor("#7f8c8d")
        .text("Project Management Platform")
        .fillColor("#000000")
        .moveDown(2);

      /* Invoice title with subtle styling */
      doc
        .fontSize(24)
        .fillColor("#34495e")
        .text("INVOICE", { align: "right" })
        .fillColor("#000000")
        .moveDown();

      /* Invoice info with better formatting */
      doc
        .fontSize(11)
        .fillColor("#34495e")
        .text(`Invoice Number:`, { continued: true })
        .fillColor("#000000")
        .text(` ${invoice.invoiceNumber}`)
        .fillColor("#34495e")
        .text(`Date:`, { continued: true })
        .fillColor("#000000")
        .text(` ${invoice.createdAt.toDateString()}`)
        .moveDown();

      /* Company details with subtle indentation */
      doc
        .fontSize(11)
        .fillColor("#34495e")
        .text(`Company ID:`, { continued: true })
        .fillColor("#000000")
        .text(` ${invoice.companyId}`)
        .fillColor("#34495e")
        .text(`Plan ID:`, { continued: true })
        .fillColor("#000000")
        .text(` ${invoice.planId}`)
        .fillColor("#34495e")
        .text(`Billing Cycle:`, { continued: true })
        .fillColor("#000000")
        .text(` ${invoice.billingCycle}`)
        .moveDown(2);

      /* Elegant divider */
      doc
        .strokeColor("#bdc3c7")
        .lineWidth(0.5)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

      doc.moveDown(2);

      /* Amount table with clean formatting */
      doc.fontSize(11);

      /* Subtotal row */
      doc
        .fillColor("#34495e")
        .text("Subtotal:", 50, doc.y)
        .fillColor("#000000")
        .text(`${invoice.currency} ${invoice.subtotal.toFixed(2)}`, 450, doc.y, { align: "right" });

      doc.moveDown();

      /* Tax row */
      doc
        .fillColor("#34495e")
        .text("Tax (18%):", 50, doc.y)
        .fillColor("#000000")
        .text(`${invoice.currency} ${invoice.tax.toFixed(2)}`, 450, doc.y, { align: "right" });

      doc.moveDown();

      /* Light separator line */
      doc
        .strokeColor("#ecf0f1")
        .lineWidth(0.5)
        .moveTo(50, doc.y - 5)
        .lineTo(550, doc.y - 5)
        .stroke();

      doc.moveDown();

      /* Total row with emphasis */
      const totalY = doc.y;
      
      doc
        .fontSize(14)
        .fillColor("#2c3e50")
        .text("Total:", 50, totalY);

      doc
        .fontSize(16)
        .fillColor("#2980b9")
        .text(`${invoice.currency} ${invoice.total.toFixed(2)}`, 450, totalY, { align: "right" })
        .fillColor("#000000");

      doc.moveDown(3);

      /* Professional footer */
      doc
        .strokeColor("#bdc3c7")
        .lineWidth(0.5)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

      doc.moveDown();

      doc
        .fontSize(10)
        .fillColor("#7f8c8d")
        .text("Thank you for using DevSync.", { align: "center" })
        .fillColor("#000000");

      doc.end();

    });

  }

}
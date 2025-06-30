import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import dotenv from 'dotenv';
import { attachment, contentType } from 'express/lib/response';
dotenv.config();

export function createPdfBuffer(name: string, email: string, rollNo: string, department: string, boardingPoint: string, gender: string, feesdetails: string, feesamount: string):Promise<Buffer>{
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        let buffers: Uint8Array[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

       // --- Header ---
    doc.fillColor("green").fontSize(16).text("✔ Registration Successful", {
      align: "left",
    });

    doc.moveDown();
    doc.fillColor("black").fontSize(18).text("Acknowledgement Letter", {
      align: "center",
      underline: true,
    });

    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Dear ${name},`);
    doc.moveDown();

    doc.text(
      "We are pleased to confirm that your registration for the first year program has been successfully processed.\nBelow are the details of your registration:"
    );

    doc.moveDown(1.5);
    doc.rect(50, doc.y, 500, 150).stroke();
    doc.moveDown();

    const info = [
      { label: "Name", value: name },
      { label: "Roll Number", value: rollNo },
      { label: "Department", value: department },
      { label: "Email", value: email },
      { label: "Boarding Point", value: boardingPoint },
      { label: "Fees Status", value: feesdetails },
      { label: "Amount Paid", value: feesamount },
    ];

    info.forEach((item) => {
      doc.moveDown(0.3);
      doc.font("Helvetica-Bold").text(`${item.label}: `, { continued: true });
      doc.font("Helvetica").text(item.value);
    });

    doc.moveDown(2);
    doc.text(
      "Please keep this acknowledgement for your records. You will need to present this information during orientation.\n\nFor any queries, please contact the administration office at admin@college.edu or call at +91-9876543210.\n\nThank you,\nAdministration Department"
    );

    doc.end();
    });
}

export const sendEmail = async (email: string, subject: string, html: string, PdfBuffer: Buffer): Promise<any> => {
  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }); 

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html,
      attachments:[
        {
            filename: 'acknowledgement.pdf',
            content: PdfBuffer,
            contentType: 'application/pdf',
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    return { success: true, message: 'Email sent successfully' };
  } catch (error: any) {
    console.error("Error in sendEmail:", error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
};
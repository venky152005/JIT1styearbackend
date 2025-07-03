import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export function createPdfBuffer(name: string, email: string, rollNo: string, department: string, boardingPoint: string, gender: string, feesdetails: string, feesamount: string):Promise<Buffer>{
    return new Promise(async(resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        let buffers: Uint8Array[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

   
      try {
        const bannerPath = path.join(__dirname, '../../../assets/JIT Logo.jpg');
        const logoPath = path.join(__dirname, '../../../assets/logo.png');

        const banner = fs.readFileSync(bannerPath);
        const logo = fs.readFileSync(logoPath);

      
        doc.image(banner, 0, 0, { width: doc.page.width });


        doc.opacity(0.1).image(logo, (doc.page.width - 200) / 2, 250, { width: 200 });
        doc.opacity(1);
      } catch (imgErr) {
        console.error("Image load error:", imgErr);
      }

      doc.moveDown(6);

      doc.fillColor("green").fontSize(16).text("✔ Registration Successful", {
        align: "left"
      });

      doc.moveDown();
      doc.fillColor("black").fontSize(18).text("Acknowledgement Letter", {
        align: "center",
        underline: true
      });

      doc.moveDown();
      doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Dear ${name},`);
      doc.moveDown();
      doc.text(
        "Congratulations to select JIT to confirm that your registration for the first year program has been successfully processed.\nBelow are the details of your registration:"
      );

      doc.moveDown(2);

      const info = [
        { label: "Name", value: name },
        { label: "Roll Number", value: rollNo },
        { label: "Department", value: department },
        { label: "Email", value: email },
        { label: "Boarding Point", value: boardingPoint },
        { label: "Fees Status", value: feesdetails },
        { label: "Amount Paid", value: `₹${feesamount}` }
      ];

      const leftX = 60;
      const labelWidth = 120;
      const valueX = leftX + labelWidth + 10;
      const lineHeight = 20;

      const startY = doc.y;
      const boxHeight = info.length * lineHeight + 20;
      doc.rect(leftX - 10, startY - 10, 480, boxHeight).stroke();

      info.forEach((item, index) => {
        const y = startY + index * lineHeight;

        doc.font("Helvetica-Bold").fontSize(12).text(`${item.label}:`, leftX, y, {
          width: labelWidth
        });

        doc.font("Helvetica").fontSize(12).text(`${item.value}`, valueX, y);
      });

doc.moveDown(3);

const footerX = 50; 
doc.font("Helvetica").fontSize(12);

doc.text(
  "Please keep this acknowledgement for your records. You will need to present this information during orientation.",
  footerX,
  doc.y,
  {
    width: 500, 
    align: "left",
  }
);

doc.moveDown();
doc.text(
  "For any queries, please contact the administration office at admin@college.edu or call at +91-9876543210.",
  footerX,
  doc.y,
  {
    width: 500,
    align: "left",
  }
);

doc.moveDown();
doc.text("Thank you,", footerX);
doc.text("Administration Department", footerX);

      doc.end();
      doc.on('error', (err) => {
        console.error("PDF generation error:", err);
        reject(err);
      });
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
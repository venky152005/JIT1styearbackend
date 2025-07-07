import { Request, Response } from "express";
import Registration from "../../model/registration.model";
import { createPdfBuffer, sendEmail } from "./email";


export const registerUserAdmit = async (req: Request, res: Response):Promise<any> => {
  try {
    const { name, rollNo, email, department, gender, boardingpoint, feesdetails, feesamount } = req.body;
    if (!name){
        return res.status(400).json({ message: "Name is required" });
    }
    if (!rollNo) {
      return res.status(400).json({ message: "Roll number is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }
    if(!gender) {
      return res.status(400).json({ message: "Gender is required" });
    }
    if (!boardingpoint) {
      return res.status(400).json({ message: "Boarding point is required" });
    }
    if (!feesdetails) {
      return res.status(400).json({ message: "Fees details are required" });
    }
    if (!feesamount) {
      return res.status(400).json({ message: "Fees amount is required" });
    }

    const existingUser = await Registration.findOne({ name, rollNo, email });
    if (existingUser) {
      return res.status(402).json({ message: "User already registered" });
    }

    const newUser = await Registration.create({
      name,
      rollNo,
      email,
      department,
      gender,
      boardingpoint,
      feesdetails,
      feesamount
    });

    console.log("User registered successfully");
    const pdfBuffer = await createPdfBuffer(name, email, rollNo, department, boardingpoint, gender, feesdetails, feesamount);
    console.log("PDF buffer created successfully");

    await sendEmail(email,'Student Registration Acknowledgement','Please find your registration acknowledgment attached.',pdfBuffer);

    res.status(201).json({message:'Email sent successfully'})
  }catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
 }


 export const registerUser = async (req: Request, res: Response):Promise<any> => {
  try {
    const { name, rollNo, email, gender, department, boardingpoint,category, feesdetails, feesamount } = req.body;
    if (!name){
        return res.status(400).json({ message: "Name is required" });
    }
    if (!rollNo) {
      return res.status(400).json({ message: "Roll number is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    } 
    if(!gender){
      return res.status(400).json({ message: "Gender is required" });
    }
    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }
    if (!boardingpoint) {
      return res.status(400).json({ message: "Boarding point is required" });
    }
    if (!feesdetails) {
      return res.status(400).json({ message: "Fees details are required" });
    }
    if (!feesamount){
      return res.status(400).json({ message: "Fees amount are required" });
    }
    const existingUser = await Registration.findOne({ name, rollNo, email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const newUser = await Registration.create({
      name,
      rollNo,
      email,  
      gender,
      department,
      boardingpoint,
      category,
      feesdetails,
      feesamount
    });

    console.log("User registered successfully");
    res.status(201).json({ message: "User registered successfully", success: true, user: newUser });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
 }

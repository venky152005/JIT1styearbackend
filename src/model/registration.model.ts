import mongoose from "mongoose";

export interface IRegistration extends mongoose.Document {
  name: string; 
  rollNo: string; 
  email: string;
  gender: string;
  department: string;
  boardingpoint:string; 
  feesdetails: string;
  feesamount: string;
}

const registrationSchema = new mongoose.Schema<IRegistration>({
  name: { type: String },
  email: { type: String },
  rollNo: { type: String },
  department: { type: String, default: "CSE" , enum: ["CSE", "IT", "ECE", "CSBS", "MECH", "AIDS"]},
  gender:{type:String, default: "male", enum: ["male", "female", "other"]},
  boardingpoint: { type: String },
  feesdetails: { type: String, default: "Fully Paid", enum: ["Fully Paid", "Partially Paid"] },
  feesamount: { type: String, }
});

const Registration = mongoose.model<IRegistration>("Registration", registrationSchema);
export default Registration;

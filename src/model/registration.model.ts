import mongoose from "mongoose";

export interface IRegistration extends mongoose.Document {
  name: string; 
  rollNo: string; 
  email: string;
  gender: string;
  department: string;
  boardingpoint:string; 
  category: string;
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
  category: { type: String, default: "Management Quota", enum: ["Management Quota Dayscholar", "Management Quota Hostel", "Government Quota Dayscholar", "Government Quota Hostel", "Others"] },
  feesdetails: { type: String, default: "Fully Paid", enum: ["Fully Paid", "Partially Paid"] },
  feesamount: { type: String,  }
});

const Registration = mongoose.model<IRegistration>("Registration", registrationSchema);
export default Registration;

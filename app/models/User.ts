import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  domain: string;
  name: string;
  passwordHash: string;
  emailVerified: boolean;
  role: "admin" | "editor";
  subscription: {
    status: string | null;
    plan: string | null;
    paymentProvider?: "mollie" | "stripe";
    externalCustomerId?: string;
    externalSubscriptionId?: string;
  };
  permissions: {
    canEditExhibitions: boolean;
    canPostAds: boolean;
    canDownloadInvoices: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    domain: { type: String, required: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["admin", "editor"], default: "editor" },
    subscription: {
      status: { type: String, default: null },
      plan: { type: String, default: null },
      paymentProvider: {
        type: String,
        enum: ["mollie", "stripe"],
        default: "mollie",
      },
      externalCustomerId: { type: String },
      externalSubscriptionId: { type: String },
    },
    permissions: {
      canEditExhibitions: { type: Boolean, default: true },
      canPostAds: { type: Boolean, default: false },
      canDownloadInvoices: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

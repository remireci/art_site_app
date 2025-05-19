import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocation extends Document {
  name: string;
  domain: string;
  show: boolean;
}

const locationSchema = new Schema<ILocation>({
  name: String,
  domain: { type: String, required: true, unique: true },
  show: Boolean,
});

const Location: Model<ILocation> =
  mongoose.models.Location ||
  mongoose.model<ILocation>("Location", locationSchema);

export default Location;

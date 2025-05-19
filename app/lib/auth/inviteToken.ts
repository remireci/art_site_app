import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const SECRET = process.env.INVITE_SECRET!;

export function createInviteToken(email: string, locationId: ObjectId) {
  return jwt.sign({ email, locationId: locationId.toString() }, SECRET, {
    expiresIn: "2h",
  });
}

export function verifyInviteToken(token: string): {
  email: string;
  locationId: string;
} {
  return jwt.verify(token, SECRET) as { email: string; locationId: string };
}

// services/userService.ts
// TODO install needed packages
// uncomment

// import bcrypt from "bcrypt";
// import User from "@/models/User";
// import { dbConnect } from "@/lib/db";

interface CreateUserInput {
  email: string;
  domain: string;
  name: string;
  password: string;
}

// export async function createUser({
//   email,
//   domain,
//   name,
//   password,
// }: CreateUserInput) {
//   await dbConnect();

//   const existing = await User.findOne({ email });
//   if (existing) {
//     throw new Error("Email already in use");
//   }

//   const passwordHash = await bcrypt.hash(password, 10);

//   const user = await User.create({
//     email,
//     domain,
//     name,
//     passwordHash,
//     emailVerified: false,
//     role: "editor",
//     subscription: {
//       status: null,
//       plan: null,
//     },
//     permissions: {
//       canEditExhibitions: true,
//       canPostAds: false,
//       canDownloadInvoices: false,
//     },
//   });

//   return user;
// }

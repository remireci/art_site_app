import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("auth_token", "", {
    maxAge: 0,
    path: "/",
  });
  return res;
}

// import { NextResponse } from 'next/server';

// export async function POST() {
//   const response = NextResponse.json({ message: 'Logged out' });
//   response.cookies.set('auth_token', '', {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'lax',
//     expires: new Date(0),
//     path: '/',
//   });
//   return response;
// }

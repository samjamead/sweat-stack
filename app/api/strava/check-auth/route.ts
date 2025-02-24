import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const response = NextResponse.json({
    isAuthenticated:
      cookieStore.has("strava_access_token") &&
      cookieStore.has("strava_refresh_token"),
  });
  return response;
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { StravaActivity } from "@/app/types/strava";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("strava_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Not authenticated with Strava" },
      { status: 401 },
    );
  }

  try {
    // Calculate timestamp for 6 weeks ago
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42); // 6 weeks * 7 days
    const after = Math.floor(sixWeeksAgo.getTime() / 1000); // Convert to epoch seconds

    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Error fetching Strava activities:", error);
      throw new Error(`Failed to fetch activities: ${response.statusText}`);
    }

    const activities: StravaActivity[] = await response.json();

    // Process activities to return only relevant data
    const processedActivities = activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      type: activity.type,
      distance: activity.distance,
      moving_time: activity.moving_time,
      elapsed_time: activity.elapsed_time,
      total_elevation_gain: activity.total_elevation_gain,
      start_date: activity.start_date,
      start_date_local: activity.start_date_local,
      average_speed: activity.average_speed,
      max_speed: activity.max_speed,
      average_heartrate: activity.average_heartrate,
      max_heartrate: activity.max_heartrate,
      map: activity.map,
    }));

    return NextResponse.json(processedActivities);
  } catch (error) {
    console.error("Error in activities endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 },
    );
  }
}

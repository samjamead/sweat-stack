"use client";

import { useQuery } from "@tanstack/react-query";
import { StravaActivity } from "@/app/types/strava";

function formatDistance(meters: number): string {
  const kilometers = meters / 1000;
  return `${kilometers.toFixed(2)} km`;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

async function fetchActivities(): Promise<StravaActivity[]> {
  const response = await fetch("/api/strava/activities");
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }
  return response.json();
}

export function ActivityList() {
  const {
    data: activities,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
        <p className="font-medium">Error</p>
        <p>
          {error instanceof Error ? error.message : "Failed to load activities"}
        </p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No activities found in the last 6 weeks
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="overflow-hidden rounded-lg border shadow-sm"
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{activity.name}</h3>
                <p className="text-sm text-gray-500">{activity.type}</p>
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(activity.start_date)}
              </p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">
                  {formatDistance(activity.distance)}
                </p>
                <p className="text-gray-500">Distance</p>
              </div>
              <div>
                <p className="font-medium">
                  {formatDuration(activity.moving_time)}
                </p>
                <p className="text-gray-500">Time</p>
              </div>
              <div>
                <p className="font-medium">
                  {activity.total_elevation_gain.toFixed(0)}m
                </p>
                <p className="text-gray-500">Elevation</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

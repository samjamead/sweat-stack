"use client";

import { useQuery } from "@tanstack/react-query";
import { StravaActivity } from "@/app/types/strava";
import {
  startOfISOWeek,
  endOfISOWeek,
  isWithinInterval,
  getISOWeek,
} from "date-fns";

async function fetchActivities(): Promise<StravaActivity[]> {
  const response = await fetch("/api/strava/activities");
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }
  return response.json();
}

interface WeekSummary {
  weekStart: Date;
  activities: StravaActivity[];
  totalActivities: number;
}

function getWeekSummaries(activities: StravaActivity[]): WeekSummary[] {
  const weeks: WeekSummary[] = [];
  let currentDate = new Date();

  // Get the start of the current ISO week
  currentDate = startOfISOWeek(currentDate);

  // Generate the last 6 weeks including current week
  for (let i = 0; i < 6; i++) {
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - i * 7);
    const weekEnd = endOfISOWeek(weekStart);

    const weekActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.start_date);
      return isWithinInterval(activityDate, { start: weekStart, end: weekEnd });
    });

    weeks.push({
      weekStart,
      activities: weekActivities,
      totalActivities: weekActivities.length,
    });
  }

  // Sort weeks in reverse chronological order (most recent first)
  return weeks.sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime());
}

function ActivitySquare({ count }: { count: number }) {
  if (count === 0) {
    return <div className="h-4 w-4 rounded bg-gray-300" />;
  }

  if (count === 1) {
    return <div className="h-4 w-4 rounded bg-green-500" />;
  }

  // For multiple activities, split the square horizontally
  return (
    <div className="relative h-4 w-4 overflow-hidden rounded">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-green-500" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-green-600" />
      {count > 2 && (
        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
          {count}
        </span>
      )}
    </div>
  );
}

export function ActivitySummary() {
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

  const weekSummaries = getWeekSummaries(activities);

  return (
    <div className="space-y-2">
      {weekSummaries.map((week) => (
        <div
          key={week.weekStart.toISOString()}
          className="flex items-center gap-8 rounded border px-6 py-3 text-sm"
        >
          <p className="text-gray-500">Week {getISOWeek(week.weekStart)}</p>
          <p className="w-40 text-gray-500">
            {week.weekStart.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>

          <div className="flex space-x-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              // Count activities for this day
              const dayActivities = week.activities.filter((activity) => {
                const activityDate = new Date(activity.start_date);
                return activityDate.getDay() === dayIndex;
              });

              return (
                <ActivitySquare key={dayIndex} count={dayActivities.length} />
              );
            })}
          </div>
          <div className="flex flex-1 items-center justify-end space-x-3 text-right">
            {week.totalActivities >= 3 ? (
              <>
                <span className="text-green-500">✓</span>
                <span className="text-sm text-gray-400">
                  {week.totalActivities} activities logged
                </span>
              </>
            ) : (
              <>
                <span className="text-red-500">✗</span>
                <span className="text-sm text-gray-400">
                  {week.totalActivities} activities logged
                </span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

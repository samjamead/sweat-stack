"use client";

import { useQuery } from "@tanstack/react-query";
import { StravaActivity } from "@/app/types/strava";
import {
  startOfISOWeek,
  endOfISOWeek,
  isWithinInterval,
  getISOWeek,
  differenceInDays,
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
  dailyActivities: StravaActivity[][];
}

function getWeekSummaries(activities: StravaActivity[]): WeekSummary[] {
  const currentDate = new Date();
  const currentWeekStart = startOfISOWeek(currentDate);

  // Generate the last 6 weeks including current week using functional approach
  const weeks = Array.from({ length: 6 }, (_, i) => {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(weekStart.getDate() - i * 7);
    const weekEnd = endOfISOWeek(weekStart);

    const weekActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.start_date);
      return isWithinInterval(activityDate, { start: weekStart, end: weekEnd });
    });

    // Initialize array of 7 empty arrays (one for each day of the week)
    const dailyActivities: StravaActivity[][] = Array.from(
      { length: 7 },
      () => [],
    );

    // Single-pass distribution of activities to appropriate days
    weekActivities.forEach((activity) => {
      const activityDate = new Date(activity.start_date);
      const dayIndex = differenceInDays(activityDate, weekStart);
      if (dayIndex >= 0 && dayIndex < 7) {
        dailyActivities[dayIndex].push(activity);
      }
    });

    return {
      weekStart,
      activities: weekActivities,
      totalActivities: weekActivities.length,
      dailyActivities,
    };
  });

  // Sort weeks in reverse chronological order (most recent first)
  return weeks.sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime());
}

function ActivitySquare({ count }: { count: number }) {
  if (count === 0) {
    return <div className="h-5 w-5 rounded bg-gray-300" />;
  }

  if (count === 1) {
    return <div className="h-5 w-5 rounded bg-green-500" />;
  }

  // For multiple activities, split the square horizontally
  return (
    <div className="flex h-5 w-5 flex-col gap-0.5 overflow-hidden rounded">
      <div className="h-1/2 w-full rounded bg-green-500" />
      <div className="h-1/2 w-full rounded bg-green-600" />
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
            {week.dailyActivities.map((dayActivities, dayIndex) => (
              <ActivitySquare key={dayIndex} count={dayActivities.length} />
            ))}
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

"use client";

import { ActivityList } from "@/components/activity-list";
import { ActivitySummary } from "@/components/activity-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/strava/check-auth");
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Failed to check authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 pb-20 pt-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-8 pb-20 pt-8">
        <p>Connect to Strava to check your balance</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 pt-8">
      <Tabs defaultValue="summary">
        <TabsList className="mb-8">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <ActivitySummary />
        </TabsContent>
        <TabsContent value="activities">
          <ActivityList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

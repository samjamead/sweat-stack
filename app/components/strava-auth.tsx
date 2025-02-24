"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface StravaAuthProps {
  clientId: string;
}

export function StravaAuth({ clientId }: StravaAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Strava OAuth configuration
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/strava/callback`;
  const scope = "read,activity:read_all";
  const responseType = "code";

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

  useEffect(() => {
    // Check URL for error parameters
    const errorType = searchParams.get("error");
    const errorDetails = searchParams.get("details");

    if (errorType === "token_exchange" && errorDetails) {
      setError(decodeURIComponent(errorDetails));
    } else if (errorType === "missing_code") {
      setError("Authorization code missing from Strava response");
    }

    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/strava/check-auth");
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setError("Failed to check authentication status");
      }
    };

    checkAuth();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">
          <p className="font-medium">Authentication Error</p>
          <p>{error}</p>
        </div>
      )}

      {!isAuthenticated ? (
        <Button
          onClick={() => {
            setError(null);
            window.location.href = authUrl;
          }}
          className="bg-[#FC4C02] text-white hover:bg-[#FC4C02]/90"
        >
          Connect with Strava
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-green-600">✓ Connected to Strava</p>
          <Button
            onClick={async () => {
              try {
                await fetch("/api/strava/logout", { method: "POST" });
                setIsAuthenticated(false);
              } catch (error) {
                console.error("Error logging out:", error);
                setError("Failed to disconnect from Strava");
              }
            }}
            variant="outline"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
}

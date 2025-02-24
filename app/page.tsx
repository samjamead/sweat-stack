import { StravaAuth } from "./components/strava-auth";
import { ActivityList } from "./components/ActivityList";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-20 pt-12">
      <h1 className="text-center text-4xl font-bold">Strava Kitty</h1>
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <StravaAuth
            clientId={process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || ""}
          />
        </div>
        <ActivityList />
      </div>
    </div>
  );
}

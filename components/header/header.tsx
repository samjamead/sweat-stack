import { cn } from "@/lib/utils";

import Link from "next/link";
import { StravaAuth } from "../strava-auth";

export default function Header({
  maxWidth,
  bodyGutter = "px-4",
}: {
  maxWidth: string;
  bodyGutter?: string;
}) {
  return (
    <header className={cn("w-full border-b py-4", bodyGutter)}>
      <nav
        className={cn(
          "mx-auto flex flex-col items-center justify-between gap-2 lg:flex-row lg:gap-4",
          maxWidth,
        )}
      >
        <div className="flex flex-col gap-2">
          <Link href="/">
            <h1 className="text-lg font-bold">Sweat Stack</h1>
          </Link>
        </div>

        <StravaAuth clientId={process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || ""} />
      </nav>
    </header>
  );
}

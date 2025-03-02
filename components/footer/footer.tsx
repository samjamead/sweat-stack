import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import GithubMark from "@/public/github-mark.svg";
import GithubMarkWhite from "@/public/github-mark-white.svg";

export default async function Footer({
  maxWidth,
  bodyGutter = "px-4",
}: {
  maxWidth: string;
  bodyGutter?: string;
}) {
  const data = await fetch(
    "https://api.github.com/repos/samjamead/sweat-stack/commits/main",
  );
  const repoData = await data.json();

  return (
    <footer className={cn("w-full border-t py-16", bodyGutter)}>
      <div
        className={cn(
          "mx-auto flex w-full items-start justify-between",
          maxWidth,
        )}
      >
        <div className="flex flex-col gap-4 text-sm">
          <p>Made with ❤️ in the Channel Islands</p>
          {repoData && (
            <p>
              Last updated by commit{" "}
              <a
                href={`https://github.com/samjamead/sweat-stack/commits/main/${repoData.sha}`}
                target="_blank"
                className="rounded-t border-b-2 border-transparent bg-yellow-500/10 px-1 py-0.5 font-semibold text-numbers transition-all duration-300 hover:border-numbers"
              >
                {repoData.sha.slice(0, 7)}
              </a>{" "}
              on{" "}
              {format(
                new Date(repoData.commit.author.date),
                "EEEE d MMMM, yyyy",
              )}
            </p>
          )}
        </div>
        <a
          href="https://github.com/samjamead/sweat-stack"
          target="_blank"
          className="flex items-center gap-2 whitespace-nowrap rounded border px-3 py-2 font-mono text-xs transition-colors duration-300 hover:bg-blue-500/20"
        >
          <Image
            src={GithubMarkWhite}
            alt="GitHub Logo"
            width={15}
            height={15}
            className="hidden dark:block"
          />
          <Image
            src={GithubMark}
            alt="GitHub Logo"
            width={24}
            height={24}
            className="block dark:hidden"
          />
          <p>samjamead/sweat-stack</p>
        </a>
      </div>
    </footer>
  );
}

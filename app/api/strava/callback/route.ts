import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", request.url));
  }

  const clientId = parseInt(process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || "", 10);
  if (isNaN(clientId)) {
    console.error(
      "Invalid STRAVA_CLIENT_ID:",
      process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
    );
    return NextResponse.redirect(
      new URL(
        "/?error=token_exchange&details=" +
          encodeURIComponent("Invalid Strava client ID configuration"),
        request.url,
      ),
    );
  }

  try {
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Strava token exchange failed:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        responseBody: errorData,
        requestBody: {
          client_id: clientId,
          // Omit secret for security
          code,
          grant_type: "authorization_code",
        },
      });
      throw new Error(
        `Failed to exchange code for token: ${tokenResponse.status} ${tokenResponse.statusText}`,
      );
    }

    const data = await tokenResponse.json();

    // Store tokens securely in HTTP-only cookies
    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("strava_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.expires_in,
    });

    response.cookies.set("strava_refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });

    return response;
  } catch (error) {
    console.error("Error in Strava callback:", error);
    // Add error details to the redirect URL
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorUrl = new URL("/?error=token_exchange", request.url);
    errorUrl.searchParams.set("details", encodeURIComponent(errorMessage));
    return NextResponse.redirect(errorUrl);
  }
}

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export function middleware() {
  try {
    // Let the request continue to the route handler
    return NextResponse.next();
  } catch (error) {
    // https://www.prisma.io/docs/orm/reference/error-reference#error-codes
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: [{ path: "project", message: "Could not find ressource." }] },
          { status: 404 }
        );
      }
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}

// Configure which routes to apply the middleware to
export const config = {
  matcher: "/api/:path*",
};

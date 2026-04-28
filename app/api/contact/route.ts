import { NextResponse } from "next/server";

/**
 * Default contact-form handler.
 *
 * Emitted alongside the ContactForm widget so the form has a working endpoint
 * out of the box. The stub logs the submission and returns 200. Wire up real
 * delivery (email, CRM, DB) by replacing the TODO block below.
 */
const MAX_BODY_BYTES = 16_384;

export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Expected application/json" },
        { status: 415 },
      );
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Payload too large" },
        { status: 413 },
      );
    }

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON" },
        { status: 400 },
      );
    }

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { ok: false, error: "Payload must be an object" },
        { status: 400 },
      );
    }

    // TODO: wire up real delivery (email, CRM, DB).
    // The stub just logs so local development can confirm the round-trip.
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact-form]", payload);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, info: "POST JSON to submit." });
}

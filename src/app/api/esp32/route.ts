import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { pushReading, getReadings, clearReadings } from "@/lib/esp32Store";

// Headers CORS — nécessaires si l'ESP32 appelle depuis un réseau local
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Pré-flight CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/esp32
 *
 * Reçoit une trame JSON de l'ESP32 :
 * {
 *   "voltage": 220.5,
 *   "current": 4.8,
 *   "power": 1058.4,   // optionnel — calculé si absent
 *   "ip": "192.168.1.42" // optionnel
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const voltage = Number(body.voltage);
    const current = Number(body.current);

    if (isNaN(voltage) || isNaN(current)) {
      return NextResponse.json(
        { status: "error", message: "voltage et current sont requis (nombres)" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const reading = {
      timestamp: body.timestamp ?? new Date().toISOString(),
      voltage,
      current,
      power: isNaN(Number(body.power)) ? voltage * current : Number(body.power),
      ip: body.ip,
    };

    pushReading(reading);

    return NextResponse.json(
      { status: "ok", received: reading },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "JSON invalide ou requête malformée" },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

/**
 * GET /api/esp32
 * Retourne toutes les mesures stockées (max 50).
 * Le frontend poll cet endpoint pour afficher les données en temps réel.
 */
export async function GET() {
  return NextResponse.json(
    { status: "ok", data: getReadings() },
    { headers: CORS_HEADERS }
  );
}

/**
 * DELETE /api/esp32
 * Vide le buffer de mesures.
 */
export async function DELETE() {
  clearReadings();
  return NextResponse.json(
    { status: "ok", message: "Buffer vidé" },
    { headers: CORS_HEADERS }
  );
}

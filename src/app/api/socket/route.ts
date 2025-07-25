export const dynamic = "force-static";

export const revalidate = false;

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Gère les requêtes POST pour l'API socket.
 *
 * @param {NextRequest} request - La requête entrante de type NextRequest.
 * @returns {Promise<NextResponse>} La réponse JSON contenant le statut et le message.
 *
 * @throws {Error} Si une erreur se produit lors du traitement des données.
 *
 * Cette fonction tente de lire les données JSON de la requête et renvoie une réponse
 * JSON avec un statut de succès et un message contenant les données reçues de l'ESP32.
 * En cas d'erreur, elle renvoie une réponse JSON avec un statut d'erreur et un message
 * d'erreur.
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Simulation de réponse statique
    return NextResponse.json({
      status: "success",
      message: `Données reçues de l'ESP32 (${data.ip}): ${data.valeur}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        message: "Erreur de traitement des données",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "Service ESP32 disponible",
    timestamp: new Date().toISOString(),
  });
}

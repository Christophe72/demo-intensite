/**
 * ESP32 — Envoi de mesures électriques vers Next.js via HTTP POST
 *
 * Matériel testé : ESP32-WROOM-32 / ESP32-S3
 * Capteurs supportés :
 *   - Tension  : pont diviseur + analogRead, ou module ZMPT101B
 *   - Courant  : module ACS712 (5A / 20A / 30A)
 *
 * L'ESP32 envoie toutes les SEND_INTERVAL_MS millisecondes un POST JSON vers :
 *   http://<IP_DU_SERVEUR>:<PORT>/api/esp32
 *
 * Dépendances Arduino :
 *   - WiFi.h        (inclus dans le board ESP32)
 *   - HTTPClient.h  (inclus dans le board ESP32)
 *   - ArduinoJson   (installer via le gestionnaire de bibliothèques)
 *
 * INSTALLATION ArduinoJson :
 *   Outils → Gérer les bibliothèques → rechercher "ArduinoJson" → installer v7.x
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ──────────────────────────────────────────────
// CONFIGURATION — à modifier selon votre réseau
// ──────────────────────────────────────────────
const char* WIFI_SSID     = "VotreSSID";
const char* WIFI_PASSWORD = "VotreMotDePasse";

// Adresse IP de la machine qui fait tourner `npm run dev`
// (commande Windows : ipconfig  |  Linux/Mac : ip addr)
const char* SERVER_HOST = "192.168.1.100";
const int   SERVER_PORT = 3000;
const char* API_PATH    = "/api/esp32";

// Intervalle d'envoi (ms)
const unsigned long SEND_INTERVAL_MS = 2000;

// ──────────────────────────────────────────────
// BROCHES ANALOGIQUES
// ──────────────────────────────────────────────
const int PIN_VOLTAGE = 34;   // GPIO34 — entrée tension (ADC1)
const int PIN_CURRENT = 35;   // GPIO35 — entrée courant (ADC1)

// ──────────────────────────────────────────────
// CALIBRATION CAPTEURS
// ──────────────────────────────────────────────
// ACS712-5A  : sensibilité 185 mV/A  → CURRENT_SENSITIVITY = 0.185
// ACS712-20A : sensibilité  100 mV/A → CURRENT_SENSITIVITY = 0.100
// ACS712-30A : sensibilité  66 mV/A  → CURRENT_SENSITIVITY = 0.066
const float CURRENT_SENSITIVITY = 0.185f;  // V/A
const float ADC_VREF            = 3.3f;    // tension de référence ADC
const int   ADC_RESOLUTION      = 4096;    // 12 bits

// Facteur de mise à l'échelle du pont diviseur de tension
// Ex. : R1=100kΩ, R2=10kΩ → facteur = (R1+R2)/R2 = 11
// Ajustez selon votre montage pour obtenir la vraie tension secteur (RMS)
const float VOLTAGE_SCALE = 11.0f;

unsigned long lastSendTime = 0;

// ──────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  analogReadResolution(12);

  Serial.print("Connexion WiFi à ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connecté. IP : ");
  Serial.println(WiFi.localIP());
}

// ──────────────────────────────────────────────
float readVoltage() {
  // Moyenne sur 20 échantillons pour réduire le bruit
  long sum = 0;
  for (int i = 0; i < 20; i++) {
    sum += analogRead(PIN_VOLTAGE);
    delayMicroseconds(100);
  }
  float adcValue = sum / 20.0f;
  float adcVoltage = (adcValue / ADC_RESOLUTION) * ADC_VREF;
  return adcVoltage * VOLTAGE_SCALE; // tension réelle estimée
}

float readCurrent() {
  // Le zéro du capteur ACS712 est à VCC/2 ≈ 1.65 V
  long sum = 0;
  for (int i = 0; i < 20; i++) {
    sum += analogRead(PIN_CURRENT);
    delayMicroseconds(100);
  }
  float adcValue = sum / 20.0f;
  float adcVoltage = (adcValue / ADC_RESOLUTION) * ADC_VREF;
  float current = (adcVoltage - ADC_VREF / 2.0f) / CURRENT_SENSITIVITY;
  return fabs(current); // valeur absolue
}

// ──────────────────────────────────────────────
void loop() {
  unsigned long now = millis();
  if (now - lastSendTime < SEND_INTERVAL_MS) return;
  lastSendTime = now;

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi déconnecté — tentative de reconnexion…");
    WiFi.reconnect();
    return;
  }

  float voltage = readVoltage();
  float current = readCurrent();
  float power   = voltage * current;

  // Construction du JSON
  JsonDocument doc;
  doc["voltage"]   = serialized(String(voltage, 2));
  doc["current"]   = serialized(String(current, 3));
  doc["power"]     = serialized(String(power, 2));
  doc["ip"]        = WiFi.localIP().toString();
  // timestamp ISO8601 approximatif (sans RTC — remplacer si précision requise)
  doc["timestamp"] = String("millis:") + String(now);

  String payload;
  serializeJson(doc, payload);

  // Envoi HTTP POST
  String url = String("http://") + SERVER_HOST + ":" + SERVER_PORT + API_PATH;
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(payload);

  if (httpCode == 201) {
    Serial.print("OK  V=");
    Serial.print(voltage, 2);
    Serial.print("V  I=");
    Serial.print(current, 3);
    Serial.print("A  P=");
    Serial.print(power, 2);
    Serial.println("W");
  } else {
    Serial.print("Erreur HTTP : ");
    Serial.println(httpCode);
    Serial.println(http.getString());
  }

  http.end();
}

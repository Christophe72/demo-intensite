"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ElectricityData {
  timestamp: string;
  voltage: number;
  current: number;
  power: number;
  ip?: string;
}

const POLL_INTERVAL_MS = 2000;

const EnergyDataFetcher: React.FC = () => {
  const [dataHistory, setDataHistory] = useState<ElectricityData[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [status, setStatus] = useState<"waiting" | "receiving" | "error">(
    "waiting"
  );
  const [lastIp, setLastIp] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);

    const fetchData = async () => {
      try {
        const res = await fetch("/api/esp32");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const readings: ElectricityData[] = json.data ?? [];

        if (readings.length > 0) {
          setStatus("receiving");
          setDataHistory(readings.slice(-20)); // affiche les 20 dernières
          const lastEntry = readings[readings.length - 1];
          if (lastEntry.ip) setLastIp(lastEntry.ip);
        } else {
          setStatus("waiting");
        }
      } catch {
        setStatus("error");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  const statusColor =
    status === "receiving"
      ? "text-green-600"
      : status === "error"
        ? "text-red-600"
        : "text-yellow-600";

  const statusLabel =
    status === "receiving"
      ? `Données ESP32 reçues${lastIp ? ` (${lastIp})` : ""}`
      : status === "error"
        ? "Erreur de connexion à l'API"
        : "En attente de l'ESP32…";

  return (
    <div className="chart-container">
      <p className={`text-sm mb-2 font-semibold ${statusColor}`}>
        {statusLabel}
      </p>

      {dataHistory.length === 0 ? (
        <p className="text-gray-400 text-sm">
          Aucune donnée reçue. Vérifiez que l&apos;ESP32 envoie sur{" "}
          <code>/api/esp32</code>.
        </p>
      ) : (
        <>
          <LineChart width={560} height={300} data={dataHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(t) => new Date(t).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                typeof value === "number" ? value.toFixed(2) : value
              }
              labelFormatter={(label) => new Date(label).toLocaleTimeString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#8884d8"
              name="Tension (V)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#82ca9d"
              name="Courant (A)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="power"
              stroke="#ffc658"
              name="Puissance (W)"
              dot={false}
            />
          </LineChart>

          <table className="mt-4 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2">Horodatage</th>
                <th className="border p-2">Tension (V)</th>
                <th className="border p-2">Courant (A)</th>
                <th className="border p-2">Puissance (W)</th>
              </tr>
            </thead>
            <tbody>
              {[...dataHistory].reverse().map((d, i) => (
                <tr key={i}>
                  <td className="border p-2">
                    {new Date(d.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="border p-2">{d.voltage.toFixed(2)}</td>
                  <td className="border p-2">{d.current.toFixed(2)}</td>
                  <td className="border p-2">{d.power.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EnergyDataFetcher;

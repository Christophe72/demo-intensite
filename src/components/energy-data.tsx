"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface EnergyDataProps {
  apiUrl: string;
}

interface EnergyData {
  timestamp: string;
  voltage: number;
  current: number;
  power: number;
  cos: number;
  longueur: number;
}

const EnergyData: React.FC<EnergyDataProps> = ({ apiUrl }) => {
  const [data, setData] = useState<EnergyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const newData: EnergyData = await response.json();

        setData((prevData) => [...prevData, newData].slice(-5));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchData, 1000);
    fetchData(); // Premier appel

    return () => clearInterval(interval);
  }, [apiUrl]);

  if (loading) return <div>Chargement des données...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>Monitoring Énergie</h1>
      <h3>
        Le {new Date().getDate()} / {new Date().getMonth() + 1} /{" "}
        {new Date().getFullYear()}
      </h3>

      <LineChart
        data={data}
        height={300}
        width={410}
        margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(time) => new Date(time).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line dataKey="voltage" stroke="#8884d8" name="Tension (V)" />
        <Line dataKey="current" stroke="#82ca9d" name="Courant (A)" />
        <Line dataKey="power" stroke="#ffc658" name="Puissance (W)" />
      </LineChart>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #614555", padding: "8px" }}>
              Horodatage
            </th>
            <th style={{ border: "1px solid #614555", padding: "8px" }}>
              Tension (V)
            </th>
            <th style={{ border: "1px solid #614555", padding: "8px" }}>
              Courant (A)
            </th>
            <th style={{ border: "1px solid #614555", padding: "8px" }}>
              Puissance (W)
            </th>
            <th style={{ border: "1px solid #614555", padding: "8px" }}>
              Cos φ
            </th>
            <th style={{ border: "1px solid #614555", padding: "8px" }}>
              Longueur (m)
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #4aec5f", padding: "8px" }}>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </td>
              <td style={{ border: "1px solid #4aec5f", padding: "8px" }}>
                {entry.voltage.toFixed(2)}
              </td>
              <td style={{ border: "1px solid #4aec5f", padding: "8px" }}>
                {entry.current.toFixed(2)}
              </td>
              <td style={{ border: "1px solid #4aec5f", padding: "8px" }}>
                {entry.power.toFixed(2)}
              </td>
              <td style={{ border: "1px solid #4aec5f", padding: "8px" }}>
                {entry.cos.toFixed(2)}
              </td>
              <td style={{ border: "1px solid #4aec5f", padding: "8px" }}>
                {entry.longueur.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnergyData;

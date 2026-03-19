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

/**
 * Interface représentant les données simulées.
 *
 * @interface SimulatedData
 *
 * @property {string} timestamp - L'horodatage des données.
 * @property {string} voltage - La tension mesurée.
 * @property {string} current - Le courant mesuré.
 * @property {number} power - La puissance calculée.
 */
interface SimulatedData {
  timestamp: string;
  voltage: string;
  current: string;
  power: number;
}

/**
 * `CalculIntensite` est un composant fonctionnel React qui simule des données énergétiques et les affiche dans un graphique en ligne et un tableau.
 *
 * Le composant utilise le hook `useState` pour gérer un tableau de données simulées et le hook `useEffect` pour configurer un intervalle
 * qui génère de nouvelles données toutes les secondes. Les données générées incluent un horodatage, une tension, un courant et des valeurs de puissance.
 *
 * Le composant rend :
 * - Un titre et la date actuelle.
 * - Un graphique en ligne affichant les valeurs de courant au fil du temps.
 * - Un tableau affichant l'horodatage, la tension, le courant et les valeurs de puissance pour les 10 derniers points de données.
 *
 * @composant
 * @exemple
 * return (
 *   <CalculIntensite />
 * )
 */

// ...existing imports...

const CalculIntensite: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [data, setData] = useState<SimulatedData[]>([]);

  useEffect(() => {
    setMounted(true);
    // Mettre à jour la date
    setCurrentDate(new Date());

    // Générer les données initiales
    const initialData: SimulatedData = {
      timestamp: new Date().toISOString(),
      voltage: "220.00",
      current: "5.00",
      power: 1100,
    };
    setData([initialData]);

    // fetch("http://localhost:5000/api/energy-data");
    // Configurer l'intervalle pour les mises à jour
    const interval = setInterval(() => {
      const simulatedData: SimulatedData = {
        timestamp: new Date().toISOString(),
        voltage: (220 + Math.random() * 10).toFixed(2),
        current: (Math.random() * 10).toFixed(2),
        power: +(220 + Math.random() * 10) * (Math.random() * 10),
      };

      setData((prevData) => {
        const newData = [...prevData, simulatedData].slice(-5);
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>Monitoring Courant</h1>
      <h3>
        Le {currentDate.getDate()} / {currentDate.getMonth() + 1} /{" "}
        {currentDate.getFullYear()}
      </h3>
      {mounted && (
        <LineChart
          data={data}
          height={300}
          width={410}
          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="current" stroke="#291eec" />
        </LineChart>
      )}
      <table
        style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Timestamp
            </th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Voltage
            </th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Current
            </th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>Power</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {entry.voltage > "220"
                  ? entry.voltage + " Tension trop élevée"
                  : entry.voltage}
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {entry.current}
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {entry.power.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalculIntensite;

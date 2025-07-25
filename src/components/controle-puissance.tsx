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

interface SimulatedData {
  timestamp: string;
  voltage: string;
  current: string;
  power: number;
}

/**
 * `CalculPuissance` est un composant fonctionnel React qui simule et affiche des données de surveillance de puissance.
 * Il génère des données simulées pour la tension, le courant et la puissance à intervalles réguliers et affiche les données
 * dans un graphique en ligne et un tableau.
 *
 * @component
 * @example
 * return (
 *   <CalculPuissance />
 * )
 *
 * @returns {JSX.Element} Le composant rendu.
 *
 * @remarks
 * Le composant utilise `useState` pour gérer les données simulées et `useEffect` pour configurer un intervalle
 * qui génère de nouvelles données toutes les secondes. Les données sont affichées dans un graphique en ligne
 * en utilisant le composant `LineChart` et dans un format de tableau.
 *
 * @see https://reactjs.org/docs/hooks-state.html
 * @see https://reactjs.org/docs/hooks-effect.html
 */
const CalculPuissance: React.FC = () => {
  const [data, setData] = useState<SimulatedData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedData: SimulatedData = {
        // Générer la date ici pour éviter les incohérences
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
      <h1>Monitoring Puissance</h1>
      <h3>
        Le {new Date().getDate()} / {new Date().getMonth() + 1} /{" "}
        {new Date().getFullYear()}
      </h3>
      <LineChart
        data={data}
        height={300}
        width={300}
        margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line dataKey="power" stroke="#251aec" type="monotone" />
      </LineChart>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #41042e", padding: "8px" }}>
              Timestamp
            </th>
            <th style={{ border: "1px solid #41042e", padding: "8px" }}>
              Puissance (Watts)
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
                {entry.voltage}
              </td>
              <td style={{ border: "1px solid #4aec5f", padding: "8px" }}>
                {entry.current}
              </td>
              <td style={{ border: "1px solid #4aec5f", padding: "8px" }}>
                {entry.power.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalculPuissance;

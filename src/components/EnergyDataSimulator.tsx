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

// Interface pour les données simulées
interface SimulatedData {
  timestamp: string; // Horodatage
  voltage: string; // Tension
  current: string; // Courant
  power: number; // Puissance
}

/**
 * Composant React pour simuler et afficher des données énergétiques.
 *
 * @component
 * @example
 * <EnergyDataSimulator />
 *
 * @returns {JSX.Element} Un composant React affichant des données énergétiques simulées sous forme de graphique et de tableau.
 *
 * @description
 * Ce composant utilise un intervalle pour générer des données énergétiques simulées toutes les secondes.
 * Les données incluent la tension, le courant et la puissance, et sont affichées dans un graphique et un tableau.
 * Le graphique utilise la bibliothèque `recharts` pour afficher les données sous forme de lignes.
 *
 * @remarks
 * - Le composant conserve uniquement les 5 dernières entrées de données.
 * - Les données sont mises à jour toutes les secondes.
 * - Le tableau affiche uniquement l'heure des horodatages.
 *
 * @typedef {Object} SimulatedData
 * @property {string} timestamp - L'horodatage des données simulées.
 * @property {string} voltage - La tension simulée en volts.
 * @property {string} current - Le courant simulé en ampères.
 * @property {number} power - La puissance simulée en watts.
 */
const EnergyDataSimulator: React.FC = () => {
  const [data, setData] = useState<SimulatedData[]>([]); // État pour stocker les données simulées

  useEffect(() => {
    // Intervalle pour simuler la réception de données toutes les secondes
    const interval = setInterval(() => {
      const simulatedData: SimulatedData = {
        // Générer l'horodatage pour éviter les incohérences
        timestamp: new Date().toISOString(),
        voltage: (220 + Math.random() * 10).toFixed(2), // Tension aléatoire
        current: (Math.random() * 10).toFixed(2), // Courant aléatoire
        power: +(220 + Math.random() * 10) * (Math.random() * 10), // Puissance calculée
      };

      // Mettre à jour l'état avec les nouvelles données
      setData((prevData) => {
        const newData = [...prevData, simulatedData].slice(-5); // Garder les 10 dernières entrées

        return newData;
      });
    }, 1000); // Intervalle de 1 seconde

    return () => clearInterval(interval); // Nettoyer l'intervalle à la désinstallation du composant
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Simulated Energy Data</h1>
      <h3>
        Le {new Date().getDate()} / {new Date().getMonth() + 1} /{" "}
        {new Date().getFullYear()}
      </h3>
      <div>
        <LineChart data={data} height={300} width={410}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey="power" stroke="#8884d8" type="monotone" />
          <Line dataKey="voltage" stroke="#82ca9d" type="monotone" />
          <Line dataKey="current" stroke="#ff7300" type="monotone" />
        </LineChart>
      </div>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Timestamp
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Voltage (V)
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Current (A)
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Power (W)
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {entry.timestamp.slice(11, 19)}{" "}
                {/* Afficher uniquement l'heure */}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {entry.voltage}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {entry.current}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {entry.power.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnergyDataSimulator;

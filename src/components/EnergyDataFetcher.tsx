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
}

const EnergyDataFetcher: React.FC = () => {
  const [dataHistory, setDataHistory] = useState<ElectricityData[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const updateData = () => {
      const newData = {
        timestamp: new Date().toISOString(),
        voltage: 220 + Math.random() * 10,
        current: Math.random() * 10,
        power: (220 + Math.random() * 10) * (Math.random() * 10),
      };
      setDataHistory((prev) => [...prev, newData].slice(-10));
    };

    const interval = setInterval(updateData, 1000);
    updateData(); // Premier appel immédiat

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <div className="chart-container">
      <LineChart width={600} height={300} data={dataHistory}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(time) => new Date(time).toLocaleTimeString()}
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
        />
        <Line
          type="monotone"
          dataKey="current"
          stroke="#82ca9d"
          name="Courant (A)"
        />
        <Line
          type="monotone"
          dataKey="power"
          stroke="#ffc658"
          name="Puissance (W)"
        />
      </LineChart>

      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Horodatage</th>
            <th className="border p-2">Tension (V)</th>
            <th className="border p-2">Courant (A)</th>
            <th className="border p-2">Puissance (W)</th>
          </tr>
        </thead>
        <tbody>
          {dataHistory.map((data, index) => (
            <tr key={index}>
              <td className="border p-2">
                {new Date(data.timestamp).toLocaleTimeString()}
              </td>
              <td className="border p-2">{data.voltage.toFixed(2)}</td>
              <td className="border p-2">{data.current.toFixed(2)}</td>
              <td className="border p-2">{data.power.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnergyDataFetcher;

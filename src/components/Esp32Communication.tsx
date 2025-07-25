import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface EnergyChartProps {
  data: Array<{
    timestamp: string;
    voltage: number;
    current: number;
    power: number;
  }>;
  width?: number;
  height?: number;
}

const EnergyChart: React.FC<EnergyChartProps> = ({
  data,
  width = 410,
  height = 300,
}) => {
  const chartId = `energy-chart-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="chart-container">
      <LineChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(time) => new Date(time).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <defs>
          <clipPath id={`${chartId}-clip`}>
            <rect x={0} y={0} width={width} height={height} />
          </clipPath>
        </defs>
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
    </div>
  );
};

export default EnergyChart;

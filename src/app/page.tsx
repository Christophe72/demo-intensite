"use client";
import EnergyDataSimulator from "@/components/EnergyDataSimulator";
import ControleIntensite from "@/components/controle-intensite";
import EnergyDataFetcher from "@/components/EnergyDataFetcher";
import CalculateTension from "@/components/controle-tension";
import HeaderLogo from "@/components/header-logo";
import EnergyData from "@/components/energy-data";
// import Esp32Communication from "@/components/Esp32Communication";

import Card from "@/components/card";
const Home: React.FC = () => {
  console.log("Rendering Home component...");

  return (
    <>
      <HeaderLogo />
      <div className="container mx-auto p-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Contrôle Intensité">
            <ControleIntensite />
          </Card>

          <Card title="Données Temps Réel">
            <EnergyDataFetcher />
          </Card>

          <Card title="Contrôle Tension">
            <CalculateTension />
          </Card>
          <Card title="EnergyDataSimulator">
            <EnergyDataSimulator />
          </Card>
          <Card title="EnergyData from server">
            <EnergyData apiUrl="http://localhost:5000/api/energy-data" />
          </Card>
          {/* <CalculerGaz /> */}
          {/* <Card title="Communiquez avec le serveur">
            <Esp32Communication
              data={[
                {
                  timestamp: "2023-01-01T00:00:00Z",
                  voltage: 230,
                  current: 10,
                  power: 2300,
                },
                {
                  timestamp: "2023-01-01T00:00:01Z",
                  voltage: 231,
                  current: 11,
                  power: 2541,
                },
                {
                  timestamp: "2023-01-01T00:00:02Z",
                  voltage: 232,
                  current: 12,
                  power: 2784,
                },
                {
                  timestamp: "2023-01-01T00:00:03Z",
                  voltage: 233,
                  current: 13,
                  power: 3039,
                },
                {
                  timestamp: "2023-01-01T00:00:04Z",
                  voltage: 234,
                  current: 14,
                  power: 3306,
                },
              ]}
            />
          </Card> */}
        </div>
      </div>
    </>
  );
};

export default Home;

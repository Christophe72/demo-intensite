import dynamic from "next/dynamic";

const WithNoSSR = dynamic(() => import("./EnergyDataFetcher"), {
  ssr: true,
});

export default WithNoSSR;

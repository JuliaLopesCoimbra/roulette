"use client";
import { React, useState } from "react";
import ChartTheme from "../../../components/client/Chart/theme/ChartTheme";
import ViewsChart from "./charts/ViewsChart";
import ClicksChart from "./charts/ClicksChart";
import TypeAd from "./charts/TypeAdChart";
import PerfomanceChart from "./charts/PerfomanceChart";
import AllClicksViewsYear from "./charts/AllClicksViewsYear";
import ByStates from "./charts/ByStates";
import ByHobbies from "./charts/ByHobbies";
import ByJobs from "./charts/ByJobs";
import ByAge from "./charts/ByAge";
import Funil from "./charts/Funil";
import ByMarcas from "./charts/ByMarcas";
import BySocialMedias from "./charts/BySocialMedias";

export default function Chart() {
  const [modo, setModo] = useState("avancado");

  return (
    <div className="space-y-10">
      <ChartTheme>
        {modo === "basico" && (
          <>
            <ViewsChart />
            <ClicksChart />
            {/* <TypeAd /> */}
            <ByJobs />
            <PerfomanceChart />
            <AllClicksViewsYear />
            <ByStates />
            <ByMarcas />
            <ByHobbies />
            <ByAge />
            <BySocialMedias />
          </>
        )}

        {modo === "avancado" && <Funil />}
      </ChartTheme>
    </div>
  );
}

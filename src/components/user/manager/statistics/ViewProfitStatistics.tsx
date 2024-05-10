import React, {useEffect, useState} from "react";
import {getProfitStatistics} from "../../../../index.js";
import {notifyError} from "../../../../utilities/notify.js";
import {Typography} from "@mui/material";
import {BarChart} from "@mui/x-charts";
import moment from "moment";
import {useLanguage} from "../../../../contexts/language/language-context.jsx";

const ViewProfitStatistic = () => {
  const [statistics, setStatistics] = useState<any>([]);

  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    getProfitStatistics()
      .then((statistics) => {
        setStatistics(
          Object.entries(statistics)
            .map(([date, profit]) => ({ profit, date: moment(date).format("YYYY-MM-DD") }))
            .slice(0, 16)
        );
      })
      .catch(() => notifyError("Something went wrong"));
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ borderRadius: "8px", marginTop: 20, background: "#fff" }}>
        <Typography textAlign="center" marginTop="20px" variant="h4">
            {
                language === 'EN' ? 'Profit statistics USD' : 'Статистика виручки USD'
            }
        </Typography>
        <BarChart
          dataset={statistics}
          width={1200}
          height={600}
          series={[{ dataKey: "profit" }]}
          xAxis={[
            {
              data: statistics.map((item) => item.date),
              scaleType: "band",
              label: "Date",
            },
          ]}
          yAxis={[{ label: "Profit" }]}
        />
      </div>
    </div>
  );
};

export default ViewProfitStatistic;

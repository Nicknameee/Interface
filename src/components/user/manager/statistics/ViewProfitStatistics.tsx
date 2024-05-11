import React, { useEffect, useState } from "react";
import { getProfitStatistics } from "../../../../index.js";
import { notifyError } from "../../../../utilities/notify.js";
import { Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import moment from "moment";
import { Form, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { useLanguage } from "../../../../contexts/language/language-context.jsx";

const ViewProfitStatistic = () => {
  const [statistics, setStatistics] = useState<any>([]);

  const { language } = useLanguage();

  const [fromDate, setFromDate] = useState<string>();
  const [toDate, setToDate] = useState<string>();
  const [currency, setCurrency] = useState<string>("UAH");

  useEffect(() => {
    getProfitStatistics(undefined, undefined, "UAH")
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 160 }}>
      <ListGroup style={{ width: "500px", marginTop: 20 }}>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>{language === "EN" ? "Date from:" : "Дата від:"}</div>
          <input
            type="date"
            name="issuedAtFrom"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>{language === "EN" ? "Date to:" : "Дата до: "}</div>
          <input
            type="date"
            name="issuedAtTo"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>{language === "EN" ? "Currency:" : "Валюта: "}</div>
          <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)} size="lg">
            <option>USD</option>
            <option>UAH</option>
          </Form.Select>
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between">
          <Button
            color="primary"
            onClick={() => {
              getProfitStatistics(fromDate, toDate, currency)
                .then((statistics) => {
                  setStatistics(
                    Object.entries(statistics)
                      .map(([date, profit]) => ({ profit, date: moment(date).format("YYYY-MM-DD") }))
                      .slice(0, 16)
                  );
                })
                .catch(() => notifyError("Something went wrong"));
            }}
          >
            {language === "EN" ? "Filter" : "Фільтр"}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setFromDate("");
              setToDate("");
              setCurrency("UAH");
              getProfitStatistics(undefined, undefined, "UAH")
                .then((statistics) => {
                  setStatistics(
                    Object.entries(statistics)
                      .map(([date, profit]) => ({ profit, date: moment(date).format("YYYY-MM-DD") }))
                      .slice(0, 16)
                  );
                })
                .catch(() => notifyError("Something went wrong"));
            }}
          >
            {language === "EN" ? "Drop Filters" : "Скинути фільтрацію"}
          </Button>
        </ListGroupItem>
      </ListGroup>
      <div style={{ borderRadius: "8px", marginTop: 20, background: "#fff" }}>
        <Typography textAlign="center" marginTop="20px" variant="h4">
          {language === "EN" ? "Profit statistics" : "Статистика виручки"}
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

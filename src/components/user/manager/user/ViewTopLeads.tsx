import { Button, Form, Card, CardBody, CardHeader, Collapse, ListGroup, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { getTopLeads } from "../../../../index";
import { redirectToUI } from "../../../../utilities/redirect";
import React, { useEffect, useState } from "react";
import { notifyError } from "../../../../utilities/notify.js";
import { useLanguage } from "../../../../contexts/language/language-context";

const ViewTopLeads = () => {
  const [topLeads, setTopLeads] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState<any>();
  const { language } = useLanguage();

  const [fromDate, setFromDate] = useState<string>();
  const [toDate, setToDate] = useState<string>();
  const [currency, setCurrency] = useState<string>("UAH");

  useEffect(() => {
    getTopLeads(page, undefined, undefined, "UAH")
      .then((res) => setTopLeads(res))
      .catch(() => {
              if (language === 'EN') {
                  notifyError("Something went wrong")
              } else {
                  notifyError('Щось пішло не так')
              }
          }
      );
  }, [page]);

  return (
    <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
      <ListGroup style={{ width: "32%" }}>
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
              getTopLeads(fromDate, toDate, currency)
                .then((res) => setTopLeads(res))
                .catch(() => {
                      if (language === 'EN') {
                        notifyError("Something went wrong")
                      } else {
                        notifyError('Щось пішло не така')
                      }
                    }
                );
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
              getTopLeads(undefined, undefined, "UAH")
                .then((res) => setTopLeads(res))
                .catch(() => notifyError("Something went wrong"));
            }}
          >
            {language === "EN" ? "Drop Filters" : "Скинути фільтрацію"}
          </Button>
        </ListGroupItem>
      </ListGroup>
      <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
        {topLeads.length > 0 ? (
          topLeads.map((lead) => (
            <Card className="mb-3 w-100" key={crypto.randomUUID()}>
              <CardHeader
                onClick={() =>
                  selectedLeadId === lead.customerId ? setSelectedLeadId(undefined) : setSelectedLeadId(lead.customerId)
                }
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    {language === "EN" ? " Customer ID: " : " Ідентифікатор користувача: "}
                    {lead.customerId} |{language === "EN" ? " Total Profit: " : " Загальна виручка: "}
                    {lead.totalProfit} |{language === "EN" ? " Currency: " : " Валюта виручки: "}
                    {lead.currency}{" "}
                  </span>
                  <FontAwesomeIcon icon={selectedLeadId === lead.customerId ? faAngleUp : faAngleDown} />
                </div>
              </CardHeader>
              <Collapse in={selectedLeadId === lead.customerId}>
                <CardBody>
                  <ListGroup>
                    <ListGroupItem>
                      {language === "EN" ? "Customer ID: " : "Ідентифікатор користувача: "}
                      {lead.customerId}
                    </ListGroupItem>
                    {lead.contact.find((item) => item.includes("https")) && (
                      <ListGroupItem>
                        Telegram:{" "}
                        <a href={lead.contact.find((item) => item.includes("https"))}>
                          {lead.contact.find((item) => item.includes("https"))}
                        </a>
                      </ListGroupItem>
                    )}
                    {lead.contact.find((item) => !item.includes("https")) && (
                      <ListGroupItem>
                        Email:{" "}
                        <a href={`mailto:${lead.contact.find((item) => !item.includes("https"))}`}>
                          {lead.contact.find((item) => !item.includes("https"))}
                        </a>
                      </ListGroupItem>
                    )}
                    <ListGroupItem>
                      {language === "EN" ? "Total Profit: " : "Загальна виручка: "}
                      {lead.totalProfitByCustomer.toFixed(2)}
                    </ListGroupItem>
                    <ListGroupItem>
                      {language === "EN" ? "Currency: " : "Валюта виручки: "}
                      {lead.currency}
                    </ListGroupItem>
                  </ListGroup>
                </CardBody>
              </Collapse>
            </Card>
          ))
        ) : (
          <div>
            <h1 className="font-monospace my-3">
              {language === "EN" ? "No top leads..." : "Відсутні прибуткові користувачі"}
            </h1>
            <h3 onClick={() => redirectToUI()} className="text-decoration-underline" style={{ cursor: "pointer" }}>
              {language === "EN" ? "Go to main" : "На головну сторінку"}
            </h3>
          </div>
        )}
        <div className="w-100 d-flex justify-content-center align-items-center">
          <Button
            className="mx-3"
            style={{ width: "100px" }}
            disabled={page <= 1}
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
          >
            Prev
          </Button>
          <h3 className="font-monospace">{page}</h3>
          <Button
            className="mx-3"
            style={{ width: "100px" }}
            onClick={() => {
              if (topLeads?.length > 0) {
                setPage(page + 1);
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewTopLeads;

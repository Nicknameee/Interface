import { Card, CardBody, CardHeader, Collapse, ListGroup, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { getTopLeads } from "../../../../index";
import { redirectToUI } from "../../../../utilities/redirect";
import React, { useEffect, useState } from "react";
import { notifyError } from "../../../../utilities/notify.js";

const ViewTopLeads = () => {
  const [topLeads, setTopLeads] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<any>();

  useEffect(() => {
    getTopLeads()
      .then((res) => setTopLeads(res))
      .catch(() => notifyError("Something went wrong"));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
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
                  Customer ID: {lead.customerId} | Total Profit: {lead.totalProfit} | Currency: {lead.currency}{" "}
                </span>
                <FontAwesomeIcon icon={selectedLeadId === lead.customerId ? faAngleUp : faAngleDown} />
              </div>
            </CardHeader>
            <Collapse in={selectedLeadId === lead.customerId}>
              <CardBody>
                <ListGroup>
                  <ListGroupItem>Customer ID: {lead.customerId}</ListGroupItem>
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
                  <ListGroupItem>Total Profit: {lead.totalProfitByCustomer.toFixed(2)}</ListGroupItem>
                  <ListGroupItem>Currency: {lead.currency}</ListGroupItem>
                </ListGroup>
              </CardBody>
            </Collapse>
          </Card>
        ))
      ) : (
        <div>
          <h1 className="font-monospace my-3">No top leads...</h1>
          <h3 onClick={() => redirectToUI()} className="text-decoration-underline" style={{ cursor: "pointer" }}>
            Go to main
          </h3>
        </div>
      )}
    </div>
  );
};

export default ViewTopLeads;

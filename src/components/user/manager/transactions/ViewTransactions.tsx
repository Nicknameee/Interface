import { Button, Card, CardBody, CardHeader, Collapse, ListGroup, ListGroupItem } from "react-bootstrap";
import { useEffect, useState } from "react";
import React from "react";
import { getTransactions } from "../../../../index.js";
import { Transaction } from "../../../../schemas/responses/models/Transaction.ts";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const [fromDate, setFromDate] = useState<string>();
  const [toDate, setToDate] = useState<string>();

  useEffect(() => {
    getTransactions(page, 5, fromDate, toDate).then((transactions) => {
      setTransactions(transactions);
    });
  }, [page]);

  return (
    <div style={{ display: "flex", padding: "0 100px", justifyContent: "space-between", marginTop: "20px" }}>
      <ListGroup style={{ width: "28%" }}>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>Issued at from:</div>
          <input
            type="date"
            name="issuedAtFrom"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>Issued at to:</div>
          <input
            type="date"
            name="issuedAtTo"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between">
          <Button
            color="primary"
            onClick={() => {
              getTransactions(page, 5, fromDate, toDate).then((transactions) => {
                setTransactions(transactions);
              });
            }}
          >
            Filter
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setFromDate("");
              setToDate("");
              getTransactions(page, 5).then((transactions) => {
                setTransactions(transactions);
              });
            }}
          >
            Drop Filters
          </Button>
        </ListGroupItem>
      </ListGroup>

      <div style={{ width: "70%", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 2%" }}>
          {transactions.map((transaction) => (
            <Card className="mb-3 w-100" key={crypto.randomUUID()}>
              <CardHeader
                onClick={() =>
                  setSelectedTransactionId(selectedTransactionId === transaction.id ? undefined : transaction.id)
                }
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    Transaction ID: {transaction.id} | Status: {transaction.status} | Created at:{" "}
                    {moment(transaction.issuedAt).format("DD/MM/YYYY HH:mm:ss")}
                  </span>
                  <FontAwesomeIcon icon={selectedTransactionId === transaction.id ? faAngleUp : faAngleDown} />
                </div>
              </CardHeader>
              <Collapse in={selectedTransactionId === transaction.id}>
                <CardBody>
                  <ListGroup>
                    <ListGroupItem>Customer ID: {transaction.customerId}</ListGroupItem>
                    <ListGroupItem>Amount: {transaction.amount}</ListGroupItem>
                    <ListGroupItem>Acquiring Currency: {transaction.acquiringCurrency}</ListGroupItem>
                    <ListGroupItem>Type: {transaction.transactionType}</ListGroupItem>
                    <ListGroupItem>Status: {transaction.status}</ListGroupItem>
                    <ListGroupItem>Country: {transaction.transactionProcessingCountry}</ListGroupItem>
                    <ListGroupItem>
                      Issued At: {moment(transaction.issuedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </ListGroupItem>
                  </ListGroup>
                </CardBody>
              </Collapse>
            </Card>
          ))}
        </div>

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
              if (transactions.length > 0) {
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

export default ViewTransactions;

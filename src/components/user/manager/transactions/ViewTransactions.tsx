import {Button, Card, CardBody, CardHeader, Collapse, ListGroup, ListGroupItem} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {getTransactions} from "../../../../index.js";
import {Transaction} from "../../../../schemas/responses/models/Transaction.ts";
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment";
import {useLanguage} from "../../../../contexts/language/language-context.jsx";

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const [fromDate, setFromDate] = useState<string>();
  const [toDate, setToDate] = useState<string>();

  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    getTransactions(page, 5, fromDate, toDate).then((transactions) => {
      setTransactions(transactions);
    });
  }, [page]);

  return (
    <div style={{ display: "flex", padding: "0 100px", justifyContent: "space-between", marginTop: "20px" }}>
      <ListGroup style={{ width: "28%" }}>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>
              {
                  language === 'EN' ? 'Issued at from:' : 'Час створення мін: '
              }
          </div>
          <input
            type="date"
            name="issuedAtFrom"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div style={{ whiteSpace: "nowrap", marginRight: 5 }}>
              {
                  language === 'EN' ? 'Issued at to:' : 'Час створення макс: '
              }
          </div>
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
              {
                  language === 'EN' ? 'Filter' : 'Фільтр'
              }
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
              {
                  language === 'EN' ? 'Drop Filters' : 'Скинути фільтрацію'
              }
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
                    <ListGroupItem>
                        {
                            language === 'EN' ? 'Customer ID: ' : 'Ідентифікатор клієнта: '
                        }
                        {transaction.customerId}
                    </ListGroupItem>
                    <ListGroupItem>
                        {
                            language === 'EN' ? 'Amount: ' : 'Сума: '
                        }
                        {transaction.amount}</ListGroupItem>
                    <ListGroupItem>
                        {
                            language === 'EN' ? 'Acquiring Currency: ' : 'Придбано у валюті: '
                        }
                        {transaction.acquiringCurrency}</ListGroupItem>
                    <ListGroupItem>
                        {
                            language === 'EN' ? 'Type: ' : 'Тип: '
                        }
                        {transaction.transactionType}</ListGroupItem>
                    <ListGroupItem>
                        {
                            language === 'EN' ? 'Status: ' : 'Статус: '
                        }
                        {transaction.status}</ListGroupItem>
                    <ListGroupItem>
                        {
                            language === 'EN' ? 'Country: ' : 'Країна: '
                        }
                        {transaction.transactionProcessingCountry}</ListGroupItem>
                    <ListGroupItem>
                        {
                            language === 'EN' ? 'Issued At: ' : 'Зареєстровано о: '
                        }
                        {moment(transaction.issuedAt).format("DD/MM/YYYY HH:mm:ss")}
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

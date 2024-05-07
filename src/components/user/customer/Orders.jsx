import { CustomerOrder } from "../../../schemas/responses/models/CustomerOrder.ts";
import { Button, Card, Form, CardBody, CardHeader, Collapse, ListGroup, ListGroupItem } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { redirectToUI } from "../../../utilities/redirect";
import { ShipmentAddress } from "../../../schemas/responses/models/ShipmentAddress.ts";
import {
  exportOrderHistory,
  updateOrder,
  exportOrders,
  getOrderHistory,
  getUserInfo,
  isLoggedIn,
} from "../../../index";
import { OrderHistory } from "../../../schemas/responses/models/OrderHistory.ts";
import { OrderFilter } from "../../../schemas/requests/filters/OrderFilter.ts";
import OrderedProducts from "./OrderedProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Modal, Box, Typography } from "@mui/material";
import { notifyError, notifySuccess } from "../../../utilities/notify.js";

const Orders = ({ orders, setOrders, managerMode }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [orderHistoryView, setOrderHistoryView] = useState([]);
  const [historyClicked, setHistoryClicked] = useState(false);
  const [user, setUser] = useState(null);

  const [isChangeOrderStatusModalOpen, setIsChangeOrderStatusModalOpen] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState();

  const toggleOrder = (orderId) => {
    setOrderHistoryView([]);
    setHistoryClicked(false);
    setSelectedProductId(null);
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  const toggleProduct = (productId) => {
    setSelectedProductId(selectedProductId === productId ? null : productId);
  };

  const formatDate = (dateDate: string): string => {
    const date: Date = new Date(dateDate);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const toggleAddress = (addressId) => {
    setSelectedAddressId(selectedAddressId === addressId ? null : addressId);
  };

  const toggleHistory = (orderNumber: string) => {
    setHistoryClicked(!historyClicked);

    if (orderHistoryView.length > 0) {
      setOrderHistoryView([]);
    } else {
      const initHistory = async (num) => {
        const orderFilter: OrderFilter = new OrderFilter();
        orderFilter.orderNumber = num;
        const history = await getOrderHistory(orderFilter);

        setOrderHistoryView(history);
      };

      initHistory(orderNumber).then(() => console.log("Orders were fetched successfully"));
    }
  };

  const toggleTransaction = (transactionId: string) => {
    if (selectedTransactionId) {
      setSelectedTransactionId(null);
    } else {
      setSelectedTransactionId(transactionId);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      setUser(getUserInfo());
    }
  }, []);

  useEffect(() => {
    if (!isChangeOrderStatusModalOpen) setSelectedOrderStatus(undefined);
  }, [isChangeOrderStatusModalOpen]);

  return (
    <div className="container">
      <Modal open={isChangeOrderStatusModalOpen} onClose={() => setIsChangeOrderStatusModalOpen(false)}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
            p: 8,
          }}
          borderRadius="10px"
          bgcolor="#fff"
        >
          <div style={{ padding: "30px 40px 30px" }}>
            <Typography textAlign="center" variant="h4">
              Change order status
            </Typography>
            <Form.Group className="mb-3 mt-3" controlId="ssomeid">
              <Form.Label style={{ fontSize: 20 }}>Order status</Form.Label>
              <Form.Select
                value={selectedOrderStatus}
                onChange={(e) => setSelectedOrderStatus(e.target.value)}
                size="lg"
              >
                <option disabled selected value>
                  Select order status
                </option>
                <option value="INITIATED">Initiated</option>
                <option value="ASSIGNED_TO_OPERATOR">Assigned to operator</option>
                <option value="WAITING_FOR_PAYMENT">Waiting for payment</option>
                <option value="PAID">Paid</option>
                <option value="SHIPPED">Shopped</option>
                <option value="IN_DELIVERY_PROCESS">In delivery process</option>
                <option value="DELIVERED">Delivered</option>
                <option value="RETURNED">Returned</option>
                <option value="RECEIVED">Received</option>
                <option value="DECLINED">Declined</option>
              </Form.Select>
            </Form.Group>
            <div style={{ marginTop: 30, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button
                disabled={!selectedOrderStatus}
                onClick={async () => {
                  try {
                    const updatedOrder = await updateOrder(selectedOrderId, selectedOrderStatus);

                    orders.find(({ order }) => order.id === selectedOrderId).order = updatedOrder;

                    setIsChangeOrderStatusModalOpen(false);
                    notifySuccess("Order status updated successfully");
                  } catch {
                    notifyError("Something went wrong");
                  }
                }}
                size="lg"
              >
                Save
              </Button>
              <Button onClick={() => setIsChangeOrderStatusModalOpen(false)} size="lg" variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      <h3>Orders</h3>
      {orders.length > 0 && (
        <Button
          className="my-3 btn btn-secondary"
          onClick={() => exportOrders(OrderFilter.build({ customerId: user.id }))}
        >
          Export orders
        </Button>
      )}
      <div className="row" style={{ marginBottom: "10vh" }}>
        {orders.length > 0 ? (
          orders.map((customerOrder: CustomerOrder) => (
            <div className="col-md-6 w-100" key={customerOrder.order.id}>
              <Card className="mb-3" key={crypto.randomUUID()}>
                <CardHeader onClick={() => toggleOrder(customerOrder.order.id)} style={{ cursor: "pointer" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      Order Number: {customerOrder.order.number} | Status: {customerOrder.order.status} | Date:{" "}
                      {formatDate(customerOrder.order.creationDate)}
                    </span>
                    <FontAwesomeIcon icon={selectedOrderId === customerOrder.order.id ? faAngleUp : faAngleDown} />
                  </div>
                </CardHeader>
                <Collapse in={selectedOrderId === customerOrder.order.id}>
                  <CardBody>
                    <ListGroup>
                      <ListGroupItem key={crypto.randomUUID()}>
                        Ordered Product Cost: {customerOrder.order.orderedProductCost}
                      </ListGroupItem>
                      <ListGroupItem
                        style={{ display: "flex", gap: "20px", alignItems: "center" }}
                        key={crypto.randomUUID()}
                      >
                        Status: {customerOrder.order.status}{" "}
                        {managerMode && (
                          <Button onClick={() => setIsChangeOrderStatusModalOpen(true)} size="sm">
                            Change order status
                          </Button>
                        )}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        Payment Type: {customerOrder.order.paymentType}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        Creation Date: {formatDate(customerOrder.order.creationDate)}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        Processing Operator ID: {customerOrder.order.processingOperatorId || "UNKNOWN"}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        Paid: {String(customerOrder.order.paid).toUpperCase()}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        Last Update Date: {formatDate(customerOrder.order.lastUpdateDate)}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        Delivery Service: {customerOrder.order.deliveryServiceType}
                      </ListGroupItem>
                      {customerOrder.order.deliveryServiceType !== "NONE" && (
                        <ListGroupItem key={crypto.randomUUID()}>
                          Delivery Cost: {customerOrder.order.deliveryCost}
                        </ListGroupItem>
                      )}
                      {managerMode && (
                        <div>
                          <ListGroupItem key={crypto.randomUUID()}>
                            Customer ID: {String(customerOrder.order.customerId).toUpperCase()}
                          </ListGroupItem>
                        </div>
                      )}
                    </ListGroup>
                    {customerOrder.order.shipmentAddress !== undefined &&
                      customerOrder.order.shipmentAddress !== null && (
                        <Card className="my-3" key={crypto.randomUUID()}>
                          <CardHeader
                            onClick={() => toggleAddress(customerOrder.order.shipmentAddress.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Delivery Address</span>
                              <FontAwesomeIcon
                                icon={
                                  selectedAddressId === customerOrder.order.shipmentAddress.id ? faAngleUp : faAngleDown
                                }
                              />
                            </div>
                          </CardHeader>
                          <Collapse in={selectedAddressId === customerOrder.order.shipmentAddress.id}>
                            <CardBody>
                              <ListGroup>
                                {Object.entries(customerOrder.order.shipmentAddress.address)
                                  .filter(([key: string, value: string]) => ShipmentAddress.customerViewAllowed(key))
                                  .map(([key: string, value: string]) => (
                                    <ListGroupItem key={crypto.randomUUID()}>
                                      {ShipmentAddress.getAddressLocaleByName(key)} : {value ? value : "UNKNOWN"}
                                    </ListGroupItem>
                                  ))}
                              </ListGroup>
                            </CardBody>
                          </Collapse>
                        </Card>
                      )}
                    {customerOrder.transaction !== undefined && customerOrder.transaction !== null && (
                      <Card className="my-3" key={crypto.randomUUID()}>
                        <CardHeader
                          onClick={() => toggleTransaction(customerOrder.order.transactionId)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>Transaction</span>
                            <FontAwesomeIcon
                              icon={
                                selectedTransactionId === customerOrder.order.transactionId ? faAngleUp : faAngleDown
                              }
                            />
                          </div>
                        </CardHeader>
                        <Collapse in={selectedTransactionId === customerOrder.order.transactionId}>
                          <CardBody>
                            <ListGroup>
                              <ListGroupItem key={crypto.randomUUID()}>
                                Transaction Fee: {customerOrder.transaction.amount}{" "}
                                {customerOrder.transaction.sourceCurrency}
                              </ListGroupItem>
                              <ListGroupItem key={crypto.randomUUID()}>
                                Status: {customerOrder.transaction.status}
                              </ListGroupItem>
                              <ListGroupItem key={crypto.randomUUID()}>
                                Is Authorized: {String(customerOrder.transaction.authorized).toUpperCase()}
                              </ListGroupItem>
                              <ListGroupItem key={crypto.randomUUID()}>
                                Is Settled: {String(customerOrder.transaction.settled).toUpperCase()}
                              </ListGroupItem>
                            </ListGroup>
                          </CardBody>
                        </Collapse>
                      </Card>
                    )}
                    <hr />
                    <h5>Ordered Products:</h5>
                    <OrderedProducts
                      orderedProducts={customerOrder.order.orderedProducts}
                      toggleProduct={toggleProduct}
                      selectedProductId={selectedProductId}
                    />
                    <Button className="my-3" onClick={() => toggleHistory(customerOrder.order.number)}>
                      {orderHistoryView.length <= 0 ? "Order History" : "Close"}
                    </Button>
                    {orderHistoryView.length > 0 && (
                      <Button
                        className="my-3 mx-3 btn btn-secondary"
                        onClick={() =>
                          exportOrderHistory(
                            OrderFilter.build({ customerId: user.id, number: customerOrder.order.number })
                          )
                        }
                      >
                        Export Order History
                      </Button>
                    )}
                    {orderHistoryView.length > 0 &&
                      orderHistoryView.map((view: OrderHistory) => (
                        <div className="flex-wrap w-100 d-flex my-1 border-bottom border-black">
                          <h5 className="w-100">
                            Update # {view.iteration} at {formatDate(view.updateTime)}
                          </h5>
                          <ListGroup className="w-50 font-monospace">
                            <ListGroupItem key={crypto.randomUUID()}>
                              Ordered Product Cost: {view.oldOrder.orderedProductCost}{" "}
                              {view.isParamChanged("orderedProductCost") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              Status: {view.oldOrder.status} {view.isParamChanged("status") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              Payment Type: {view.oldOrder.paymentType} {view.isParamChanged("paymentType") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              Creation Date: {formatDate(view.oldOrder.creationDate)}{" "}
                              {view.isParamChanged("creationDate") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              Processing Operator ID: {view.oldOrder.processingOperatorId || "UNKNOWN"}
                              {view.isParamChanged("processingOperatorId") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              Paid: {String(view.oldOrder.paid).toUpperCase()} {view.isParamChanged("paid") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              Last Update Date: {formatDate(view.oldOrder.lastUpdateDate)}{" "}
                              {view.isParamChanged("lastUpdateDate") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              Delivery Service: {view.oldOrder.deliveryServiceType}{" "}
                              {view.isParamChanged("deliveryServiceType") ? "->" : ""}
                            </ListGroupItem>
                            {view.oldOrder.deliveryServiceType !== "NONE" && (
                              <ListGroupItem key={crypto.randomUUID()}>
                                Delivery Cost: {view.oldOrder.deliveryCost}
                              </ListGroupItem>
                            )}
                          </ListGroup>
                          <ListGroup className="w-50 font-monospace">
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("orderedProductCost") ? "text-decoration-underline" : ""}
                            >
                              Ordered Product Cost: {view.updatedOrder.orderedProductCost}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("status") ? "text-decoration-underline" : ""}
                            >
                              Status: {view.updatedOrder.status}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("paymentType") ? "text-decoration-underline" : ""}
                            >
                              Payment Type: {view.updatedOrder.paymentType}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("creationDate") ? "text-decoration-underline" : ""}
                            >
                              Creation Date: {formatDate(view.updatedOrder.creationDate)}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("processingOperatorId") ? "text-decoration-underline" : ""}
                            >
                              Processing Operator ID: {view.updatedOrder.processingOperatorId || "UNKNOWN"}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("paid") ? "text-decoration-underline" : ""}
                            >
                              Paid: {String(view.updatedOrder.paid).toUpperCase()}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("lastUpdateDate") ? "text-decoration-underline" : ""}
                            >
                              Last Update Date: {formatDate(view.updatedOrder.lastUpdateDate)}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("deliveryServiceType") ? "text-decoration-underline" : ""}
                            >
                              Delivery Service: {view.updatedOrder.deliveryServiceType}
                            </ListGroupItem>
                            {view.updatedOrder.deliveryServiceType !== "NONE" && (
                              <ListGroupItem key={crypto.randomUUID()}>
                                Delivery Cost: {view.updatedOrder.deliveryCost}
                              </ListGroupItem>
                            )}
                          </ListGroup>
                        </div>
                      ))}
                    {historyClicked && orderHistoryView.length < 1 && (
                      <h5 className="font-monospace my-3">No history records were found</h5>
                    )}
                  </CardBody>
                </Collapse>
              </Card>
            </div>
          ))
        ) : (
          <div>
            <h1 className="font-monospace my-3">You seem to not have any orders...</h1>
            <h3 onClick={() => redirectToUI()} className="text-decoration-underline" style={{ cursor: "pointer" }}>
              Go to main
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

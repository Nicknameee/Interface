import {CustomerOrder} from "../../../schemas/responses/models/CustomerOrder.ts";
import {Button, Card, CardBody, CardHeader, Collapse, Form, ListGroup, ListGroupItem} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {redirectToUI} from "../../../utilities/redirect";
import {ShipmentAddress} from "../../../schemas/responses/models/ShipmentAddress.ts";
import {exportOrderHistory, exportOrders, getOrderHistory, getUserInfo, isLoggedIn, updateOrder,} from "../../../index";
import {OrderHistory} from "../../../schemas/responses/models/OrderHistory.ts";
import {OrderFilter} from "../../../schemas/requests/filters/OrderFilter.ts";
import OrderedProducts from "./OrderedProducts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {Box, Modal, Typography} from "@mui/material";
import {notifyError, notifySuccess} from "../../../utilities/notify.js";
import {useLanguage} from "../../../contexts/language/language-context";

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

  const { language, setLanguage } = useLanguage();

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
              {
                language === 'EN' ? 'Change order status' : 'Змінити статус замовлення'
              }
            </Typography>
            <Form.Group className="mb-3 mt-3" controlId="ssomeid">
              <Form.Label style={{ fontSize: 20 }}>
                {
                  language === 'EN' ? 'Order status' : 'Статус замовлення'
                }
              </Form.Label>
              <Form.Select
                value={selectedOrderStatus}
                onChange={(e) => setSelectedOrderStatus(e.target.value)}
                size="lg"
              >
                <option disabled selected value>
                  {
                    language === 'EN' ? 'Select order status' : 'Оберіть статус замовлення'
                  }
                </option>
                <option value="INITIATED">
                  {
                    language === 'EN' ? 'Initiated' : 'Ініціовано'
                  }
                </option>
                <option value="ASSIGNED_TO_OPERATOR">
                  {
                    language === 'EN' ? 'Assigned to operator' : 'Закріплено за оператором'
                  }
                </option>
                <option value="WAITING_FOR_PAYMENT">
                  {
                    language === 'EN' ? 'Waiting for payment' : 'Очікування оплати'
                  }
                </option>
                <option value="PAID">
                  {
                      language === 'EN' ? 'Paid' : 'Оплачено'
                  }
                </option>
                <option value="SHIPPED">
                  {
                      language === 'EN' ? 'Shipped' : 'Доставлено'
                  }
                </option>
                <option value="IN_DELIVERY_PROCESS">
                  {
                    language === 'EN' ? 'In delivery process' : 'У дорозі до пункту отримання'
                  }
                </option>
                <option value="DELIVERED">
                  {
                      language === 'EN' ? 'Delivered' : 'Доставлено'
                  }
                </option>
                <option value="RETURNED">
                  {
                    language === 'EN' ? 'Returned' : 'Повернуто відправнику'
                  }
                </option>
                <option value="RECEIVED">
                  {
                      language === 'EN' ?' Received' : 'Отримано'
                  }
                </option>
                <option value="DECLINED">
                  {
                      language === 'EN' ? 'Declined' : 'Відмова'
                  }
                </option>
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
                    if (language === 'EN') {
                      notifySuccess("Order status updated successfully");
                    } else {
                      notifySuccess("Статус замовлення було успішно оновлено");
                    }
                  } catch {
                    if (language === 'EN') {
                      notifyError("Something went wrong");
                    } else {
                      notifyError("Щось пішло не так");
                    }
                  }
                }}
                size="lg"
              >
                {
                  language === 'EN' ? 'Save' : 'Зберегти'
                }
              </Button>
              <Button onClick={() => setIsChangeOrderStatusModalOpen(false)} size="lg" variant="secondary">
                {
                  language === 'EN' ? 'Cancel' : 'Відхилити'
                }
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      <h3>Orders</h3>
      {orders.length > 0 && (
        <Button
          className="my-3 btn btn-secondary"
          onClick={() => exportOrders(OrderFilter.build({ customerId: user.role === 'ROLE_MANAGER' ? null : user.id }))}
        >
          {
            language === 'EN' ? 'Export orders' : 'Експортувати замовлення'
          }
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
                      {
                        language === 'EN' ? 'Order Number: ' : 'Замовлення №: '
                      }
                      {customerOrder.order.number} | Status: {customerOrder.order.status} | Date:{" "}
                      {formatDate(customerOrder.order.creationDate)}
                    </span>
                    <FontAwesomeIcon icon={selectedOrderId === customerOrder.order.id ? faAngleUp : faAngleDown} />
                  </div>
                </CardHeader>
                <Collapse in={selectedOrderId === customerOrder.order.id}>
                  <CardBody>
                    <ListGroup>
                      <ListGroupItem key={crypto.randomUUID()}>
                        {
                          language === 'EN' ? 'Ordered Product Cost: ' : 'Вартість замовлених продуктів: '
                        }
                        {customerOrder.order.orderedProductCost}
                      </ListGroupItem>
                      <ListGroupItem
                        style={{ display: "flex", gap: "20px", alignItems: "center" }}
                        key={crypto.randomUUID()}
                      >
                        {
                          language === 'EN' ? 'Status: ' : 'Статус: '
                        }
                        {customerOrder.order.status}{" "}
                        {managerMode && (
                          <Button onClick={() => setIsChangeOrderStatusModalOpen(true)} size="sm">
                            {
                              language === 'EN' ? 'Change order status' : 'Оновити статус'
                            }
                          </Button>
                        )}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        {
                          language === 'EN' ? 'Payment Type: ' : 'Шлях оплати: '
                        }
                        {customerOrder.order.paymentType}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        {
                          language === 'EN' ? 'Creation Date: ' : 'Створено о: '
                        }
                        {formatDate(customerOrder.order.creationDate)}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        {
                          language === 'EN' ? 'Processing Operator ID: ' : 'Оператор: '
                        }
                        {customerOrder.order.processingOperatorId || "UNKNOWN"}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        {
                          language === 'EN' ? 'Paid: ' : 'Оплачене замовлення: '
                        }
                        {String(customerOrder.order.paid).toUpperCase()}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        {
                          language === 'EN' ? 'Last Update Date: ' : 'Час останньої зміни: '
                        }
                        {formatDate(customerOrder.order.lastUpdateDate)}
                      </ListGroupItem>
                      <ListGroupItem key={crypto.randomUUID()}>
                        {
                          language === 'EN' ? 'Delivery Service: ' : 'Замовлення буде доставлено сервісом: '
                        }
                        {customerOrder.order.deliveryServiceType}
                      </ListGroupItem>
                      {customerOrder.order.deliveryServiceType !== "NONE" && (
                        <ListGroupItem key={crypto.randomUUID()}>
                          {
                            language === 'EN' ? 'Delivery Cost: ' : 'Ціна доставки: '
                          }
                          {customerOrder.order.deliveryCost}
                        </ListGroupItem>
                      )}
                      {managerMode && (
                        <div>
                          <ListGroupItem key={crypto.randomUUID()}>
                            {
                              language === 'EN' ? 'Customer ID: ' : 'ID клієнта: '
                            }
                            {String(customerOrder.order.customerId).toUpperCase()}
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
                              <span>
                                {
                                  language === 'EN' ? 'Delivery Address' : 'Адреса доставки: '
                                }
                              </span>
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
                            <span>
                              {
                                language === 'EN' ? 'Transaction' : 'Банківська транзакція'
                              }
                            </span>
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
                                {
                                  language === 'EN' ? 'Transaction Fee: ' : 'Сума оплати: '
                                }
                                {customerOrder.transaction.amount}{" "}
                                {customerOrder.transaction.sourceCurrency}
                              </ListGroupItem>
                              <ListGroupItem key={crypto.randomUUID()}>
                                {
                                  language === 'EN' ? 'Status: ' : 'Статус: '
                                }
                                {customerOrder.transaction.status}
                              </ListGroupItem>
                              <ListGroupItem key={crypto.randomUUID()}>
                                {
                                  language === 'EN' ? 'Is Authorized: ' : 'Авторизована: '
                                }
                                {String(customerOrder.transaction.authorized).toUpperCase()}
                              </ListGroupItem>
                              <ListGroupItem key={crypto.randomUUID()}>
                                {
                                  language === 'EN' ? 'Is Settled: ' : 'Оброблена: '
                                }
                                {String(customerOrder.transaction.settled).toUpperCase()}
                              </ListGroupItem>
                            </ListGroup>
                          </CardBody>
                        </Collapse>
                      </Card>
                    )}
                    <hr />
                    <h5>
                      {
                        language === 'EN' ? 'Ordered Products: ' : 'Замовлені продукти: '
                      }
                    </h5>
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
                        {
                          language === 'EN' ? 'Export Order History' : 'Експортувати історію замовлення'
                        }
                      </Button>
                    )}
                    {orderHistoryView.length > 0 &&
                      orderHistoryView.map((view: OrderHistory) => (
                        <div className="flex-wrap w-100 d-flex my-1 border-bottom border-black">
                          <h5 className="w-100">
                            {
                              language === 'EN' ? 'Update #' : 'Оновлення #'
                            }
                            {view.iteration} at {formatDate(view.updateTime)}
                          </h5>
                          <ListGroup className="w-50 font-monospace">
                            <ListGroupItem key={crypto.randomUUID()}>
                              {
                                language === 'EN' ? 'Ordered Product Cost: ' : 'Вартість замовлення : '
                              }
                              {view.oldOrder.orderedProductCost}{" "}
                              {view.isParamChanged("orderedProductCost") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              {
                                language === 'EN' ? 'Status: ' : 'Статус: '
                              }
                              {view.oldOrder.status} {view.isParamChanged("status") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              {
                                language === 'EN' ? 'Payment Type: ' : 'Тип оплати: '
                              }
                              {view.oldOrder.paymentType} {view.isParamChanged("paymentType") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              {
                                language === 'EN' ? 'Creation Date: ' : 'Створено о: '
                              }
                              {formatDate(view.oldOrder.creationDate)}{" "}
                              {view.isParamChanged("creationDate") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              {
                                language === 'EN' ? 'Processing Operator ID: ' : 'Оператор замовлення: '
                              }
                              {view.oldOrder.processingOperatorId || "UNKNOWN"}
                              {view.isParamChanged("processingOperatorId") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              {
                                language === 'EN' ? 'Paid: ' : 'Оплачено: '
                              }
                              {String(view.oldOrder.paid).toUpperCase()} {view.isParamChanged("paid") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              {
                                language === 'EN' ? 'Last Update Date: ' : 'Оновлено о: '
                              }
                              {formatDate(view.oldOrder.lastUpdateDate)}{" "}
                              {view.isParamChanged("lastUpdateDate") ? "->" : ""}
                            </ListGroupItem>
                            <ListGroupItem key={crypto.randomUUID()}>
                              {
                                language === 'EN' ? "Delivery Service: " : "Компанія доставки: "

                              }
                              {view.oldOrder.deliveryServiceType}{" "}
                              {view.isParamChanged("deliveryServiceType") ? "->" : ""}
                            </ListGroupItem>
                            {view.oldOrder.deliveryServiceType !== "NONE" && (
                              <ListGroupItem key={crypto.randomUUID()}>
                                {
                                  language === 'EN' ? 'Delivery Cost: ' : 'Вартість доставки: '
                                }
                                {view.oldOrder.deliveryCost}
                              </ListGroupItem>
                            )}
                          </ListGroup>
                          <ListGroup className="w-50 font-monospace">
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("orderedProductCost") ? "text-decoration-underline" : ""}
                            >
                              {
                                language === 'EN' ? 'Ordered Product Cost: ' : 'Вартість замовлення: '
                              }
                              {view.updatedOrder.orderedProductCost}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("status") ? "text-decoration-underline" : ""}
                            >
                              {
                                language === 'EN' ? 'Status: ' : 'Статус: '
                              }
                              {view.updatedOrder.status}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("paymentType") ? "text-decoration-underline" : ""}
                            >
                              {
                                language === 'EN' ? 'Payment Type: ' : 'Тип оплати: '
                              }
                              {view.updatedOrder.paymentType}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("creationDate") ? "text-decoration-underline" : ""}
                            >
                              {
                                language === 'EN' ? 'Creation Date: ' : 'Створено о: '
                              }
                              {formatDate(view.updatedOrder.creationDate)}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("processingOperatorId") ? "text-decoration-underline" : ""}
                            >
                              {
                                language === 'EN' ? 'Processing Operator ID: ' : 'Оператор замовлення: '
                              }
                              {view.updatedOrder.processingOperatorId || "UNKNOWN"}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("paid") ? "text-decoration-underline" : ""}
                            >
                              {
                                language === 'EN' ? 'Paid: ' : 'Оплачено: '
                              }
                              {String(view.updatedOrder.paid).toUpperCase()}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("lastUpdateDate") ? "text-decoration-underline" : ""}
                            >
                              {
                                language === 'EN' ? 'Last Update Date: ' : 'Оновлено о: '
                              }
                              {formatDate(view.updatedOrder.lastUpdateDate)}
                            </ListGroupItem>
                            <ListGroupItem
                              key={crypto.randomUUID()}
                              className={view.isParamChanged("deliveryServiceType") ? "text-decoration-underline" : ""}
                            >
                              {
                                language === 'EN' ? "Delivery Service: " : "Компанія доставки: "
                              }
                              {view.updatedOrder.deliveryServiceType}
                            </ListGroupItem>
                            {view.updatedOrder.deliveryServiceType !== "NONE" && (
                              <ListGroupItem key={crypto.randomUUID()}>
                                {
                                  language === 'EN' ? 'Delivery Cost: ' : 'Вартість доставки: '
                                }
                                {view.updatedOrder.deliveryCost}
                              </ListGroupItem>
                            )}
                          </ListGroup>
                        </div>
                      ))}
                    {historyClicked && orderHistoryView.length < 1 && (
                      <h5 className="font-monospace my-3">
                        {
                          language === 'EN' ? 'No history records were found' : 'Історія замовлення відсутня'
                        }
                      </h5>
                    )}
                  </CardBody>
                </Collapse>
              </Card>
            </div>
          ))
        ) : (
          <div>
            <h1 className="font-monospace my-3">
              {
                language === 'EN' ? 'You seem to not have any orders...' : 'У вас відсутні замовлення...'
              }
            </h1>
            <h3 onClick={() => redirectToUI()} className="text-decoration-underline" style={{ cursor: "pointer" }}>
              {
                language === 'EN' ? 'Go to main' : 'На головну сторінку'
              }
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

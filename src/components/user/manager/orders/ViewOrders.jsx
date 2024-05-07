import { Order } from "../../../../schemas/responses/models/Order.ts";
import { useEffect, useState } from "react";
import Orders from "../../customer/Orders";
import { OrderFilter } from "../../../../schemas/requests/filters/OrderFilter.ts";
import { CustomerOrder } from "../../../../schemas/responses/models/CustomerOrder.ts";
import { getOrdersCompleteData } from "../../../../index";

const ViewOrders = () => {
  const [orders: Order[], setOrders] = useState([]);

  useEffect(() => {
    const initOrders = async () => {
      const orderFilter: OrderFilter = new OrderFilter();
      orderFilter.direction = "DESC";
      const orders: CustomerOrder[] = await getOrdersCompleteData(orderFilter);

      setOrders(orders);
    };

    initOrders().then(() => {});
  }, []);

  return <Orders orders={orders} setOrders={setOrders} managerMode={true} />;
};

export default ViewOrders;

import React from "react";
import Table from "react-bootstrap/Table";

function OrderHistory({ orders }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Order History</h2>

      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No orders yet
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.item_name}</td>
                <td>₹{order.price}</td>
                <td>{order.quantity}</td>
                <td>
                  {new Date(order.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default OrderHistory;

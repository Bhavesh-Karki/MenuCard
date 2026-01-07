import React from "react";
import Table from "react-bootstrap/Table";

const baseCellStyle = {
  border: "1px solid #ffd28a",
  padding: "12px 16px",
  fontSize: "14px",
};

const headerCellStyle = {
  ...baseCellStyle,
  fontWeight: "800",
  fontSize: "15px",
  background: "linear-gradient(90deg, #ffb000, #ffa500)",
  color: "#fff",
  textAlign: "center",
  verticalAlign: "middle",
  letterSpacing: "0.5px",
  border: "1px solid #ff9f00",
};

function OrderHistory({ orders = [] }) {
  const rows = Array.isArray(orders) ? orders : [];

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Times New Roman",
        background: "#fffaf2",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "800",
          letterSpacing: "1px",
          color: "#ff9800",
          marginBottom: "30px",
        }}
      >
        ORDER HISTORY
      </h2>

      <Table
        bordered
        hover
        responsive
        className="mt-3"
        style={{
          borderCollapse: "separate",
          borderSpacing: "0",
          width: "95%",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        }}
      >
        <thead>
          <tr>
            <th rowSpan="2" style={headerCellStyle}>
              SR.NO
            </th>
            <th rowSpan="2" style={headerCellStyle}>
              ITEM NAME
            </th>
            <th colSpan="2" style={headerCellStyle}>
              PURCHASE
            </th>
            <th rowSpan="2" style={headerCellStyle}>
              DATE
            </th>
          </tr>
          <tr>
            <th style={headerCellStyle}>PRICE</th>
            <th style={headerCellStyle}>QUANTITY</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  ...baseCellStyle,
                  textAlign: "center",
                  backgroundColor: "#fff7ea",
                  fontWeight: "600",
                }}
              >
                NO ORDERS YET
              </td>
            </tr>
          ) : (
            rows.map((order, index) => (
              <tr key={order.id}>
                <td
                  style={{
                    ...baseCellStyle,
                    backgroundColor: index % 2 === 0 ? "#fff7ea" : "#ffffff",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    ...baseCellStyle,
                    backgroundColor: index % 2 === 0 ? "#fff7ea" : "#ffffff",
                  }}
                >
                  {order.item_name}
                </td>
                <td
                  style={{
                    ...baseCellStyle,
                    backgroundColor: index % 2 === 0 ? "#fff7ea" : "#ffffff",
                    textAlign: "right",
                    fontWeight: "600",
                  }}
                >
                  ${Number(order.price || 0).toFixed(2)}
                </td>
                <td
                  style={{
                    ...baseCellStyle,
                    backgroundColor: index % 2 === 0 ? "#fff7ea" : "#ffffff",
                    textAlign: "center",
                  }}
                >
                  {order.quantity}
                </td>
                <td
                  style={{
                    ...baseCellStyle,
                    backgroundColor: index % 2 === 0 ? "#fff7ea" : "#ffffff",
                    textAlign: "center",
                  }}
                >
                  {order.order_date
                    ? new Date(order.order_date).toLocaleString()
                    : "—"}
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

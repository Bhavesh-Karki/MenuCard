import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { TrashIcon } from '../../components/Icons';

function formatDate(value) {
  if (!value) {
    return 'Pending';
  }

  return new Date(value).toLocaleString();
}

function OrderHistoryPage({
  orders,
  onBack,
  onClearAll,
  onDeleteOrder,
  onOrderAgain,
  onPayAll,
}) {
  const pendingOrders = orders.filter(
    order => (order.payment_status || 'pending') === 'pending'
  );

  const totalPendingPrice = pendingOrders.reduce((sum, order) => {
    return sum + Number(order.total_amount || order.total_price || order.price || 0);
  }, 0);

  return (
    <main className="history-page">
      <div className="section-header">
        <div>
          <span className="eyebrow">Your purchases</span>
          <h1>Order History</h1>
        </div>
        <div className="history-actions">
          <Button variant="outline-dark" onClick={onBack}>
            Menu
          </Button>
          <Button variant="danger" onClick={onClearAll} disabled={!orders.length}>
            Clear All History
          </Button>
        </div>
      </div>

      {!orders.length ? (
        <Alert variant="light" className="empty-history">
          No orders yet.
        </Alert>
      ) : (
        <>
          <Table responsive hover className="history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{String(order.id).slice(-6)}</td>
                  <td>{formatDate(order.order_date || order.created_at)}</td>
                  <td>{order.item_name || order.items?.map(item => item.title).join(', ')}</td>
                  <td>{order.quantity || order.items?.[0]?.quantity || 1}</td>
                  <td>
                    Rs. {Number(order.total_amount || order.total_price || order.price || 0).toFixed(2)}
                  </td>
                  <td>
                    <span className={`status-pill ${order.order_status || 'pending'}`}>
                      {order.order_status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${order.payment_status || 'pending'}`}>
                      {order.payment_status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Button size="sm" className="btn-order-again" onClick={() => onOrderAgain(order)}>
                        Order Again
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        aria-label="Delete order"
                        onClick={() => onDeleteOrder(order.id)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pendingOrders.length > 0 && (
            <div className="pay-together-card">
              <div className="pay-together-info">
                <span className="pay-together-title">Pay Together</span>
                <span className="pay-together-subtitle">
                  You have <strong>{pendingOrders.length}</strong> unpaid order(s). You can pay them all at once.
                </span>
              </div>
              <div className="pay-together-meta">
                <span className="pay-together-amount">Total: Rs. {totalPendingPrice.toFixed(2)}</span>
                <Button className="pay-together-btn" onClick={() => onPayAll(pendingOrders)}>
                  Pay Now (All Orders)
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default OrderHistoryPage;

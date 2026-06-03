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

function OrderHistoryPage({ orders, onBack, onClearAll, onDeleteOrder, onOrderAgain }) {
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
        <Table responsive hover className="history-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
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
                <td>Rs. {Number(order.total_price || order.price || 0).toFixed(2)}</td>
                <td>
                  <span className="status-pill">{order.order_status || 'Preparing'}</span>
                </td>
                <td>
                  <div className="table-actions">
                    <Button size="sm" onClick={() => onOrderAgain(order)}>
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
      )}
    </main>
  );
}

export default OrderHistoryPage;

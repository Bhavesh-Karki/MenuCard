import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AppFooter from '../../components/Footer/AppFooter';
import FoodCard from '../../components/FoodCard/FoodCard';
import FilterSearch from '../../components/Filters/FilterSearch';
import HeroCarousel from '../../components/Carousel/HeroCarousel';
import AppNavbar from '../../components/Navbar/AppNavbar';
import MobileDrawer from '../../components/Navbar/MobileDrawer';
import { useAuth } from '../../context/AuthContext';
import {
  clearOrders,
  createOrder,
  deleteOrder,
  fetchMenuItems,
  getOrders,
  markOrderPaid,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../../services/api';
import OrderHistoryPage from '../OrderHistory/OrderHistoryPage';

const ORDERS_KEY_PREFIX = 'foodOrderingOrders';

function getInitialVisibleCount() {
  if (typeof window === 'undefined') {
    return 8;
  }

  if (window.innerWidth < 768) {
    return 4;
  }

  if (window.innerWidth < 1200) {
    return 6;
  }

  return 8;
}

function orderKey(userId) {
  return `${ORDERS_KEY_PREFIX}:${userId}`;
}

function readLocalOrders(userId) {
  try {
    return JSON.parse(localStorage.getItem(orderKey(userId)) || '[]');
  } catch {
    return [];
  }
}

function writeLocalOrders(userId, orders) {
  localStorage.setItem(orderKey(userId), JSON.stringify(orders));
}

function normalizeCategory(value = '') {
  return String(value).trim().toLowerCase().replace(/\s+/g, '-');
}

function normalizeMenuItem(item) {
  const title = item.title || item.item_name || item.name || '';

  return {
    rating: 4.6,
    ...item,
    id: item.food_item_id || item.id,
    title,
    item_name: item.item_name || title,
    description: item.description || '',
    price: Number(item.price || item.item_price || 0),
    image: item.image || item.image_url,
    category: normalizeCategory(item.category || item.category_name || 'veg'),
  };
}

function isDatabaseUser(user) {
  return Boolean(user && !user.isGuest && Number.isInteger(Number(user.id)));
}

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function ConfettiBurst() {
  return (
    <div className="confetti-overlay" aria-hidden="true">
      {Array.from({ length: 36 }).map((_, index) => (
        <span key={index} style={{ '--i': index }} />
      ))}
    </div>
  );
}

function Home() {
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllItems, setShowAllItems] = useState(false);
  const [visibleCount, setVisibleCount] = useState(getInitialVisibleCount);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState('menu');
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState('');
  const [pendingCartItem, setPendingCartItem] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchMenuItems()
      .then(items => setMenu(items.map(normalizeMenuItem)))
      .catch(error => {
        console.error('Error fetching menu:', error);
        setNotice('Menu could not be loaded. Please try again later.');
      });
  }, []);

  useEffect(() => {
    const onResize = () => setVisibleCount(getInitialVisibleCount());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const refreshLocalOrders = useCallback(() => {
    if (!user?.id) {
      return;
    }

    setOrders(readLocalOrders(user.id));
  }, [user?.id]);

  useEffect(() => {
    refreshLocalOrders();
  }, [refreshLocalOrders]);

  const filteredMenu = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();

    return menu.filter(item => {
      const matchesCategory =
        activeCategory === 'all' || normalizeCategory(item.category) === activeCategory;
      const searchableText = [
        item.title,
        item.item_name,
        item.description,
        item.category,
        item.price,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch =
        !cleanSearch ||
        searchableText.includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, menu, searchTerm]);

  const displayedItems = showAllItems
    ? filteredMenu
    : filteredMenu.slice(0, visibleCount);

  const handleOrderHistory = () => {
    setDrawerOpen(false);

    if (user?.isGuest) {
      setNotice('Please login or register first.');
      return;
    }

    getOrders(user.id)
      .then(remoteOrders => {
        if (Array.isArray(remoteOrders) && remoteOrders.length) {
          setOrders(remoteOrders);
          writeLocalOrders(user.id, remoteOrders);
        } else {
          refreshLocalOrders();
        }
      })
      .catch(refreshLocalOrders)
      .finally(() => setView('history'));
  };

  const persistLocalOrder = order => {
    const nextOrders = [order, ...readLocalOrders(user.id)];
    writeLocalOrders(user.id, nextOrders);
    setOrders(nextOrders);
  };

  const replaceLocalOrder = (localOrderId, remoteOrder) => {
    const nextOrders = readLocalOrders(user.id).map(order =>
      order.id === localOrderId ? { ...order, ...remoteOrder } : order
    );
    writeLocalOrders(user.id, nextOrders);
    setOrders(nextOrders);
  };

  const handleAddToCart = item => {
    setPendingCartItem(item);
    setCartQuantity(1);
  };

  const handleConfirmAddToCart = async () => {
    if (!pendingCartItem) {
      return;
    }

    const item = pendingCartItem;
    const nextOrder = {
      id: `local-${Date.now()}`,
      user_id: user.id,
      item_name: item.title,
      item_id: item.id,
      price: Number(item.price),
      quantity: cartQuantity,
      total_price: Number(item.price) * cartQuantity,
      total_amount: Number(item.price) * cartQuantity,
      order_status: 'pending',
      payment_status: 'pending',
      order_date: new Date().toISOString(),
      items: [{ ...item, quantity: cartQuantity, item_price: Number(item.price) }],
    };

    persistLocalOrder(nextOrder);
    setPendingCartItem(null);
    setNotice('Added to cart successfully');

    if (!isDatabaseUser(user)) {
      return;
    }

    try {
      const response = await createOrder({
        user_id: user.id,
        items: [
          {
            food_item_id: item.id,
            item_name: item.title,
            item_price: Number(item.price),
            quantity: cartQuantity,
          },
        ],
      });

      if (response?.order) {
        replaceLocalOrder(nextOrder.id, {
          ...response.order,
          items: nextOrder.items,
          item_name: nextOrder.item_name,
          quantity: nextOrder.quantity,
        });
      }
    } catch (error) {
      console.error('Create order error:', error);
    }
  };

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      'Are you confirm to removing all history? This will permanently delete your order history.'
    );

    if (!confirmed || !user?.id) {
      return;
    }

    try {
      if (isDatabaseUser(user)) {
        await clearOrders(user.id);
      }

      writeLocalOrders(user.id, []);
      setOrders([]);
      setNotice('Order history cleared permanently.');
    } catch (error) {
      console.error('Clear order history error:', error);
      setNotice('Could not clear order history from database. Please try again.');
    }
  };

  const handleDeleteOrder = orderId => {
    const nextOrders = readLocalOrders(user.id).filter(order => order.id !== orderId);
    writeLocalOrders(user.id, nextOrders);
    setOrders(nextOrders);
    if (isDatabaseUser(user) && Number.isInteger(Number(orderId))) {
      deleteOrder(orderId, user.id).catch(() => {});
    }
  };

  const handleOrderAgain = order => {
    const menuItem =
      menu.find(item => order.item_name?.includes(item.title)) ||
      order.items?.[0];

    if (menuItem) {
      handleAddToCart(menuItem);
    }
  };

  const updatePaidOrder = orderId => {
    const nextOrders = readLocalOrders(user.id).map(order =>
      order.id === orderId
        ? { ...order, order_status: 'success', payment_status: 'paid' }
        : order
    );
    writeLocalOrders(user.id, nextOrders);
    setOrders(nextOrders);
  };

  const handlePayNow = async order => {
    try {
      // If guest user/offline, just complete simulated payment immediately.
      if (!isDatabaseUser(user) || !Number.isInteger(Number(order.id))) {
        updatePaidOrder(order.id);
        setNotice('Payment Successful (Offline Mode)');
        setPaymentSuccess(true);
        window.setTimeout(() => setPaymentSuccess(false), 2200);
        return;
      }

      setNotice('Initializing payment...');
      // Request Razorpay/Simulated order from backend
      const paymentOrder = await createRazorpayOrder(order.id, user.id);

      // Check if simulation mode is active (backend doesn't have credentials)
      if (paymentOrder.simulation) {
        console.log('Simulation mode detected from backend payment response.');
        if (window.confirm(`Razorpay credentials are not configured on the server. Proceed with Simulated Payment for Order #${order.id}?`)) {
          setNotice('Processing simulated payment...');
          await verifyRazorpayPayment(order.id, user.id, {
            razorpay_order_id: paymentOrder.razorpay_order_id,
            razorpay_payment_id: 'sim_pay_' + Math.random().toString(36).substring(7),
            razorpay_signature: 'sim_signature',
          });

          updatePaidOrder(order.id);
          setNotice('Payment Successful (Simulated)');
          setPaymentSuccess(true);
          window.setTimeout(() => setPaymentSuccess(false), 2200);
        } else {
          setNotice('Payment cancelled.');
        }
        return;
      }

      // Real Razorpay flow
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setNotice('Razorpay checkout could not be loaded. Please try again.');
        return;
      }

      const razorpay = new window.Razorpay({
        key: paymentOrder.key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: paymentOrder.name || 'Menu Card',
        description: paymentOrder.description || `Order #${order.id}`,
        image: '/menucard-logo.png',
        handler: async response => {
          try {
            await verifyRazorpayPayment(order.id, user.id, response);
            updatePaidOrder(order.id);
            setNotice('Payment Successful');
            setPaymentSuccess(true);
            window.setTimeout(() => setPaymentSuccess(false), 2200);
          } catch (error) {
            console.error('Payment verification error:', error);
            setNotice('Payment succeeded, but order status could not be verified on the server.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#ff7300',
        },
        modal: {
          ondismiss: () => setNotice('Payment cancelled.'),
        },
      });

      razorpay.open();
    } catch (error) {
      console.error('Pay Now error:', error);
      setNotice(error.message || 'Failed to initialize payment.');
    }
  };

  const handlePayAll = async pendingOrders => {
    try {
      if (!pendingOrders || !pendingOrders.length) return;

      // If guest user/offline, complete payment locally
      if (!isDatabaseUser(user)) {
        pendingOrders.forEach(order => updatePaidOrder(order.id));
        setNotice('All pending orders paid (Offline Mode)');
        setPaymentSuccess(true);
        window.setTimeout(() => setPaymentSuccess(false), 2200);
        return;
      }

      setNotice('Processing payment for all pending orders...');

      // Verify each order via simulation verify endpoint
      for (const order of pendingOrders) {
        await verifyRazorpayPayment(order.id, user.id, {
          razorpay_order_id: `sim_order_all_${order.id}_${Date.now()}`,
          razorpay_payment_id: 'sim_pay_all_' + Math.random().toString(36).substring(7),
          razorpay_signature: 'sim_signature',
        });
        updatePaidOrder(order.id);
      }

      setNotice('Payment Successful for all orders!');
      setPaymentSuccess(true);
      window.setTimeout(() => setPaymentSuccess(false), 2200);
    } catch (error) {
      console.error('Pay All error:', error);
      setNotice(error.message || 'Failed to complete payment.');
    }
  };

  const handleLogout = () => {
    logout();
    setView('menu');
  };

  if (view === 'history') {
    return (
      <div className="app-shell">
        <AppNavbar
          user={user}
          onMenuClick={() => setDrawerOpen(true)}
          onOrderHistory={handleOrderHistory}
          onLogout={handleLogout}
          onHome={() => setView('menu')}
        />
        <MobileDrawer
          show={drawerOpen}
          onHide={() => setDrawerOpen(false)}
          user={user}
          onOrderHistory={handleOrderHistory}
          onLogout={handleLogout}
        />
        <OrderHistoryPage
          orders={orders}
          onBack={() => setView('menu')}
          onClearAll={handleClearAll}
          onDeleteOrder={handleDeleteOrder}
          onOrderAgain={handleOrderAgain}
          onPayAll={handlePayAll}
        />
        {paymentSuccess && <ConfettiBurst />}
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNavbar
        user={user}
        onMenuClick={() => setDrawerOpen(true)}
        onOrderHistory={handleOrderHistory}
        onLogout={handleLogout}
        onHome={() => setView('menu')}
      />
      <MobileDrawer
        show={drawerOpen}
        onHide={() => setDrawerOpen(false)}
        user={user}
        onOrderHistory={handleOrderHistory}
        onLogout={handleLogout}
      />
      {paymentSuccess && <ConfettiBurst />}

      <main className="home-page">
        {notice && (
          <Alert variant="warning" dismissible onClose={() => setNotice('')}>
            {notice}
          </Alert>
        )}

        <HeroCarousel />
        <FilterSearch
          activeCategory={activeCategory}
          onCategoryChange={value => {
            setActiveCategory(value);
            setShowAllItems(false);
          }}
          searchTerm={searchTerm}
          onSearchChange={value => {
            setSearchTerm(value);
            setShowAllItems(false);
          }}
        />

        <section className="food-section" aria-label="Food menu">
          <div className="food-grid">
            {displayedItems.map(item => (
              <FoodCard item={item} key={item.id} onAddToCart={handleAddToCart} />
            ))}
          </div>

          {!displayedItems.length && (
            <div className="empty-menu">No food items match your search.</div>
          )}

          {filteredMenu.length > visibleCount && (
            <Button
              className="show-more-button"
              onClick={() => setShowAllItems(current => !current)}
            >
              {showAllItems ? 'Show Less △ ' : 'Show More ▽'}
            </Button>
          )}
        </section>
      </main>

      <Modal
        centered
        show={Boolean(pendingCartItem)}
        onHide={() => setPendingCartItem(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Added to cart successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingCartItem && (
            <div className="cart-confirm">
              <img src={pendingCartItem.image} alt={pendingCartItem.title} />
              <div>
                <h2>{pendingCartItem.title}</h2>
                <p>Rs. {Number(pendingCartItem.price || 0).toFixed(2)}</p>
                <div className="quantity-control" aria-label="Select quantity">
                  <button
                    type="button"
                    onClick={() => setCartQuantity(quantity => Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{cartQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setCartQuantity(quantity => quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setPendingCartItem(null)}>
            Cancel
          </Button>
          <Button className="primary-action modal-action" onClick={handleConfirmAddToCart}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <AppFooter />
    </div>
  );
}

export default Home;

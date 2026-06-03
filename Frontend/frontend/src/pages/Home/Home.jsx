import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
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

function normalizeMenuItem(item) {
  return {
    rating: 4.6,
    ...item,
  };
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
        activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !cleanSearch ||
        item.title.toLowerCase().includes(cleanSearch) ||
        item.description.toLowerCase().includes(cleanSearch);

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

  const handleAddToCart = item => {
    const nextOrder = {
      id: `local-${Date.now()}`,
      user_id: user.id,
      item_name: item.title,
      item_id: item.id,
      price: Number(item.price),
      quantity: 1,
      total_price: Number(item.price),
      order_status: 'Preparing',
      order_date: new Date().toISOString(),
      items: [{ ...item, quantity: 1 }],
    };

    const nextOrders = [nextOrder, ...readLocalOrders(user.id)];
    writeLocalOrders(user.id, nextOrders);
    setOrders(nextOrders);
    setNotice(`${item.title} added to cart.`);

    createOrder(nextOrder).catch(() => {
      // Local history keeps the UI usable while PostgreSQL is being configured.
    });
  };

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      'Are you confirm to removing all history? This will permanently delete your order history.'
    );

    if (!confirmed || !user?.id) {
      return;
    }

    try {
      if (!user.isGuest) {
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
    deleteOrder(orderId, user.id).catch(() => {});
  };

  const handleOrderAgain = order => {
    const menuItem = menu.find(item => item.title === order.item_name) || order.items?.[0];

    if (menuItem) {
      handleAddToCart(menuItem);
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
        />
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

      <AppFooter />
    </div>
  );
}

export default Home;

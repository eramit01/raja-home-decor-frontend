import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiUser, FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const BottomNav = () => {
  const location = useLocation();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/products', icon: FiGrid, label: 'Category' },
    { path: '/cart', icon: FiShoppingCart, label: 'Cart', badge: cartItemCount },
    { path: isAuthenticated ? '/orders' : '/login', icon: FiUser, label: isAuthenticated ? 'Account' : 'Login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-4 py-2 ${isActive ? 'text-primary-600' : 'text-gray-600'
                }`}
            >
              <div className="relative">
                <Icon className="text-xl" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

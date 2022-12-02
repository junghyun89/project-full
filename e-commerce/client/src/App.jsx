import Product from './pages/Product';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/Cart';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

const App = () => {
  const user = true;
  const NoUserRoute = ({ children }) => {
    if (user) return <Navigate to="/" />;
    return children;
  };
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/login',
      element: (
        <NoUserRoute>
          <Login />
        </NoUserRoute>
      ),
    },
    {
      path: '/register',
      element: (
        <NoUserRoute>
          <Register />
        </NoUserRoute>
      ),
    },
    {
      path: '/cart',
      element: <Cart />,
    },
    {
      path: '/products/:category',
      element: <ProductList />,
    },
    {
      path: '/product/:id',
      element: <Product />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
};

export default App;

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { IndexPage } from './pages';
import { RootLayout } from './pages/layout';
import { RouterErrorPage } from './pages/routeError';

let router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Outlet />
      </>
    ),

    errorElement: <RouterErrorPage />,
    children: [
      {
        path: '',
        element: <RootLayout />,
        children: [
          {
            path: '',
            element: <IndexPage />
          }
        ]
      }
    ]
  }
]);

export let App = () => {
  return <RouterProvider router={router} />;
};

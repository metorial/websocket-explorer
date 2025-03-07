import { Outlet } from 'react-router-dom';
import { Layout } from '../scenes/layout';

export let RootLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

import { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import DrawerMenu from '../components/DrawerMenu/DrawerMenu'; 
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(prev => !prev);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <Navbar onMenuClick={toggleDrawer} />
      <DrawerMenu open={drawerOpen} onClose={closeDrawer} />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;

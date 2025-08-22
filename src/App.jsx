import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './component/Header.jsx';
import SelectLocation from './component/select-location.jsx';
import LoginModal from './component/LoginModal.jsx';
import RegisterModal from './component/RegisterModal.jsx';
import HeroSlider from './component/HeroSlider.jsx';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Category from './component/Category.jsx';
import ProductGrid from './component/ProductGrid.jsx';
import CartSidebar from './component/CartSidebar.jsx';
import Footer from './component/Footer.jsx';
import AboutUs from './component/AboutUs.jsx';
import ContactUs from './component/ContactUs.jsx';
import Dashboard from './component/Dashboard.jsx';
import ShopPage from './Pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import OrderSummary from './Pages/OrderSummary.jsx';


// --- CHANGE 1: Import the new modal and the AuthProvider ---
import AddressFlowModal from './component/AddressFlowModal.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; // Assuming your AuthContext is in this path
import { CartProvider } from './context/CartContext.jsx';
import './App.css';

const HomePage = () => (
  <div>
    <HeroSlider />
    <Category />
    <ProductGrid />
  </div>
);

// We need a small inner component to use the navigate hook, as App itself is not inside Routes
const AppContent = () => {
  // State for modals and user data
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  
  // --- CHANGE 2: Add state for the new Address Modal ---
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [currentAddress, setCurrentAddress] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Using the hook from AuthContext

  // Effect to listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // --- Handlers for opening and closing modals ---
  const handleOpenLocationModal = () => setLocationModalOpen(true);
  const handleCloseLocationModal = () => setLocationModalOpen(false);
  const handleOpenLoginModal = () => setLoginModalOpen(true);
  const handleCloseLoginModal = () => setLoginModalOpen(false);
  const handleOpenRegisterModal = () => setRegisterModalOpen(true);
  const handleCloseRegisterModal = () => setRegisterModalOpen(false);
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    handleCloseLoginModal();
  };
  
  const handleLogout = () => {
    signOut(auth);
    navigate('/');
  };
  
  const handleProfileClick = () => {
    navigate('/dashboard');
  };

  const handleSetAddress = (address) => setCurrentAddress(address);

  // --- Handlers for switching between Login and Register modals ---
  const handleSwitchToRegister = () => {
    handleCloseLoginModal();
    handleOpenRegisterModal();
  };
  const handleSwitchToLogin = () => {
    handleCloseRegisterModal();
    handleOpenLoginModal();
  };

  // --- CHANGE 3: Create a handler to open the Address Modal from the cart ---
  const handleAddAddressClick = () => {
    if (!currentUser) {
      alert("Please log in to add an address.");
      handleOpenLoginModal(); // Optional: prompt user to log in
      return;
    }
    setIsCartOpen(false); // Close the cart
    setIsAddressModalOpen(true); // Open the address modal
  };

  return (
    <div className="App">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onLocationClick={handleOpenLocationModal}
        onLoginClick={handleOpenLoginModal}
        address={currentAddress}
        isLoggedIn={isLoggedIn}
        onProfileClick={handleProfileClick}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dashboard" element={<Dashboard handleLogout={handleLogout} />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
                    <Route path="/order-summary" element={<OrderSummary />} />

      </Routes>

      {/* --- CHANGE 4: Pass the new handler as a prop to CartSidebar --- */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onAddAddressClick={handleAddAddressClick} 
      />
      
      {/* --- CHANGE 5: Render the new AddressFlowModal --- */}
      <AddressFlowModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
      />
      
      <SelectLocation
        isOpen={isLocationModalOpen}
        onClose={handleCloseLocationModal}
        onLocationSet={handleSetAddress}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onSwitchToRegister={handleSwitchToRegister}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onSwitchToLogin={handleSwitchToLogin}
        onClose={handleCloseRegisterModal}
      />
      <Footer />
    </div>
  );
}

// The main App component now wraps everything with the necessary context providers
function App() {
  return (
    // --- CHANGE 6: Wrap with AuthProvider for user data access ---
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
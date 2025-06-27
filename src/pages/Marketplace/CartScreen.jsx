import React, { useState } from "react";
import {
  Bell,
  ChevronLeft,
  Book,
  Home,
  Settings,
  Moon,
  Sun,
  Sparkles,
  ShoppingCart,
  Trash2,
  BookOpen,
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";

const Cart = () => {
  const [darkMode, setDarkMode] = useState(true);

  // Colors for dark mode
  const colors = {
    primary: "#bb86fc",
    secondary: "#3700b3",
    accent: "#03dac6",
    accentLight: "#018786",
    accentSecondary: "#cf6679",
    text: "#e0e0e0",
    lightText: "#ffffff",
    background: "#121212",
    cardBg: "#1e1e1e",
    cardBgAlt: "#2d2d2d",
    borderColor: "#333333",
    sidebarBg: "#1a1a1a",
    navActiveBg: "rgba(187, 134, 252, 0.12)",
    inputBg: "#2d2d2d",
  };

  const cartItems = [
    {
      id: 1,
      title: "Advanced Algebra Workbook",
      author: "Dr. Smith",
      price: 250,
      quantity: 1,
      image: "algebra_cover.jpg",
    },
    {
      id: 2,
      title: "Chemistry Lab Experiments",
      author: "Prof. Johnson",
      price: 320,
      quantity: 2,
      image: "chemistry_cover.jpg",
    },
    {
      id: 6,
      title: "Biology Illustrated Guide",
      author: "Jennifer Adams",
      price: 350,
      quantity: 1,
      image: "biology_cover.jpg",
    },
  ];

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Sidebar - same as in previous components */}
      <div
        className="w-64 shadow-lg"
        style={{ backgroundColor: colors.sidebarBg }}
      >
        <div
          className="p-5 flex justify-center border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <div className="h-16">
            <img src={Logo1} alt="EduGame Logo" className="h-20 w-auto" />
          </div>
        </div>

        {/* User info and navigation as in previous components */}
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-8">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: colors.primary }}
            >
              JS
            </div>
            <div>
              <p className="font-medium" style={{ color: colors.primary }}>
                John Smith
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                Teacher
              </p>
            </div>
          </div>

          <nav>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded hover:bg-opacity-10"
                  style={{ color: colors.text, backgroundColor: "transparent" }}
                >
                  <Home
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded hover:bg-opacity-10"
                  style={{ color: colors.text, backgroundColor: "transparent" }}
                >
                  <BookOpen
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Marketplace
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded"
                  style={{
                    backgroundColor: colors.navActiveBg,
                    color: colors.primary,
                    fontWeight: 500,
                  }}
                >
                  <ShoppingCart
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  My Cart
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded hover:bg-opacity-10"
                  style={{ color: colors.text, backgroundColor: "transparent" }}
                >
                  <Book
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  My Classes
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - similar to previous components */}
        <header
          className="flex items-center justify-between p-4 shadow-md"
          style={{ backgroundColor: colors.cardBgAlt }}
        >
          <div className="flex items-center">
            <a href="#" className="flex items-center mr-4">
              <ChevronLeft
                className="w-5 h-5 mr-1"
                style={{ color: colors.primary }}
              />
              <span style={{ color: colors.primary }}>Continue Shopping</span>
            </a>
            <h2
              className="text-xl font-medium"
              style={{ color: colors.primary }}
            >
              Shopping Cart
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Header buttons as in previous components */}
            <button
              className="p-2 rounded-full hover:bg-opacity-20"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
            >
              <Settings className="w-5 h-5" style={{ color: colors.primary }} />
            </button>

            <button
              className="p-2 rounded-full hover:bg-opacity-20"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" style={{ color: colors.accent }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: colors.primary }} />
              )}
            </button>

            <button
              className="p-2 rounded-full hover:bg-opacity-20 relative"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
            >
              <Bell className="w-5 h-5" style={{ color: colors.primary }} />
              <span
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.accentSecondary }}
              ></span>
            </button>

            <div
              className="w-8 h-8 rounded overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #bb86fc 0%, #3700b3 100%)",
              }}
            ></div>
          </div>
        </header>

        {/* Cart Content */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colors.background }}
        >
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="col-span-2">
              <div
                className="rounded-lg shadow-md mb-6"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <div
                  className="p-5 border-b"
                  style={{ borderColor: colors.borderColor }}
                >
                  <div className="flex justify-between items-center">
                    <h3
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      Cart Items ({cartItems.length})
                    </h3>
                    <span style={{ color: "rgba(224, 224, 224, 0.7)" }}>
                      Price
                    </span>
                  </div>
                </div>

                {/* Cart Items List */}
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 border-b flex items-center"
                    style={{ borderColor: colors.borderColor }}
                  >
                    <div
                      className="w-20 h-20 rounded bg-cover bg-center mr-4"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundColor: colors.cardBg,
                      }}
                    />

                    <div className="flex-1">
                      <h4
                        className="font-medium mb-1"
                        style={{ color: colors.lightText }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="text-sm mb-2"
                        style={{ color: "rgba(224, 224, 224, 0.7)" }}
                      >
                        by {item.author}
                      </p>

                      <div className="flex items-center">
                        <span
                          className="text-sm mr-3"
                          style={{ color: colors.text }}
                        >
                          Qty: {item.quantity}
                        </span>
                        <button
                          className="text-sm flex items-center"
                          style={{ color: colors.accentSecondary }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Sparkles
                        className="w-4 h-4 mr-1"
                        style={{ color: colors.accent }}
                      />
                      <span style={{ color: colors.primary }}>
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Empty cart message (shown if cart is empty) */}
                {cartItems.length === 0 && (
                  <div className="p-10 flex flex-col items-center justify-center">
                    <ShoppingCart
                      className="w-16 h-16 mb-4"
                      style={{ color: "rgba(224, 224, 224, 0.3)" }}
                    />
                    <p
                      className="text-lg mb-2"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Your cart is empty
                    </p>
                    <p
                      className="text-sm mb-6"
                      style={{ color: "rgba(224, 224, 224, 0.5)" }}
                    >
                      Browse the marketplace to find educational content
                    </p>
                    <button
                      className="px-6 py-2 rounded-lg font-medium"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#000",
                      }}
                    >
                      Go to Marketplace
                    </button>
                  </div>
                )}
              </div>

              {/* Continue Shopping Button */}
              {cartItems.length > 0 && (
                <a
                  href="#"
                  className="inline-flex items-center font-medium"
                  style={{ color: colors.primary }}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Continue Shopping
                </a>
              )}
            </div>

            {/* Right Column - Order Summary */}
            {cartItems.length > 0 && (
              <div className="col-span-1">
                <div
                  className="rounded-lg shadow-md"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <div
                    className="p-5 border-b"
                    style={{ borderColor: colors.borderColor }}
                  >
                    <h3
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      Order Summary
                    </h3>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between mb-4">
                      <span style={{ color: colors.text }}>
                        Items ({cartItems.length}):
                      </span>
                      <div className="flex items-center">
                        <Sparkles
                          className="w-4 h-4 mr-1"
                          style={{ color: colors.accent }}
                        />
                        <span style={{ color: colors.text }}>{subtotal}</span>
                      </div>
                    </div>

                    <div
                      className="p-4 rounded-lg mb-6"
                      style={{ backgroundColor: colors.navActiveBg }}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className="font-medium"
                          style={{ color: colors.primary }}
                        >
                          Order Total:
                        </span>
                        <div className="flex items-center">
                          <Sparkles
                            className="w-5 h-5 mr-1"
                            style={{ color: colors.accent }}
                          />
                          <span
                            className="text-lg font-bold"
                            style={{ color: colors.primary }}
                          >
                            {subtotal}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-4 rounded-lg mb-6 flex items-center"
                      style={{
                        backgroundColor: "rgba(3, 218, 198, 0.1)",
                        border: `1px solid ${colors.accent}`,
                      }}
                    >
                      <div
                        className="mr-3 p-2 rounded-full"
                        style={{ backgroundColor: "rgba(3, 218, 198, 0.2)" }}
                      >
                        <Sparkles
                          className="w-5 h-5"
                          style={{ color: colors.accent }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: colors.accent }}
                        >
                          Your Balance: 1,500 Sparks
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(224, 224, 224, 0.7)" }}
                        >
                          Sufficient for this purchase
                        </p>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 rounded-lg font-medium mb-3"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#000",
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

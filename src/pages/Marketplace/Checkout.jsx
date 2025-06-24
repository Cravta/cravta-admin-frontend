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
  BookOpen,
  Check,
  CreditCard,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";

const Checkout = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState("review"); // review, payment, confirmation

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

  // Mock cart data
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

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Mock user data
  const userData = {
    sparkBalance: 2500,
  };

  // Determine if user has enough balance
  const hasEnoughBalance = userData.sparkBalance >= subtotal;

  // Function to handle payment
  const handlePayment = () => {
    if (checkoutStep === "review") {
      setCheckoutStep("payment");
    } else if (checkoutStep === "payment") {
      setCheckoutStep("confirmation");
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Sidebar */}
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

        {/* User info and navigation */}
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
                  Checkout
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
                  My Purchases
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header
          className="flex items-center justify-between p-4 shadow-md"
          style={{ backgroundColor: colors.cardBgAlt }}
        >
          <div className="flex items-center">
            {checkoutStep !== "confirmation" && (
              <a href="#" className="flex items-center mr-4">
                <ChevronLeft
                  className="w-5 h-5 mr-1"
                  style={{ color: colors.primary }}
                />
                <span style={{ color: colors.primary }}>Back to Cart</span>
              </a>
            )}
            <h2
              className="text-xl font-medium"
              style={{ color: colors.primary }}
            >
              {checkoutStep === "review" && "Checkout"}
              {checkoutStep === "payment" && "Payment"}
              {checkoutStep === "confirmation" && "Order Confirmation"}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Header buttons */}
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

        {/* Checkout Steps */}
        <div
          className="p-4 flex justify-center border-b"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
          }}
        >
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: colors.primary,
                color: "#000",
              }}
            >
              <Check className="w-5 h-5" />
            </div>
            <div
              className="w-24 h-1 mx-2"
              style={{
                backgroundColor:
                  checkoutStep === "review"
                    ? "rgba(187, 134, 252, 0.3)"
                    : colors.primary,
              }}
            ></div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor:
                  checkoutStep === "review"
                    ? "rgba(187, 134, 252, 0.3)"
                    : colors.primary,
                color:
                  checkoutStep === "review"
                    ? "rgba(224, 224, 224, 0.5)"
                    : "#000",
              }}
            >
              {checkoutStep !== "review" ? <Check className="w-5 h-5" /> : "2"}
            </div>
            <div
              className="w-24 h-1 mx-2"
              style={{
                backgroundColor:
                  checkoutStep === "confirmation"
                    ? colors.primary
                    : "rgba(187, 134, 252, 0.3)",
              }}
            ></div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor:
                  checkoutStep === "confirmation"
                    ? colors.primary
                    : "rgba(187, 134, 252, 0.3)",
                color:
                  checkoutStep === "confirmation"
                    ? "#000"
                    : "rgba(224, 224, 224, 0.5)",
              }}
            >
              {checkoutStep === "confirmation" ? (
                <Check className="w-5 h-5" />
              ) : (
                "3"
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colors.background }}
        >
          {checkoutStep === "review" && (
            <div className="grid grid-cols-3 gap-8">
              {/* Left Column - Order Summary */}
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
                    <h3
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      Order Summary
                    </h3>
                  </div>

                  {/* Items List */}
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
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Sparkles
                          className="w-4 h-4 mr-1"
                          style={{ color: colors.accent }}
                        />
                        <span style={{ color: colors.primary }}>
                          {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Payment Summary */}
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
                      Payment Summary
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
                        backgroundColor: hasEnoughBalance
                          ? "rgba(3, 218, 198, 0.1)"
                          : "rgba(207, 102, 121, 0.1)",
                        border: `1px solid ${
                          hasEnoughBalance
                            ? colors.accent
                            : colors.accentSecondary
                        }`,
                      }}
                    >
                      <div
                        className="mr-3 p-2 rounded-full"
                        style={{
                          backgroundColor: hasEnoughBalance
                            ? "rgba(3, 218, 198, 0.2)"
                            : "rgba(207, 102, 121, 0.2)",
                        }}
                      >
                        <Sparkles
                          className="w-5 h-5"
                          style={{
                            color: hasEnoughBalance
                              ? colors.accent
                              : colors.accentSecondary,
                          }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-medium"
                          style={{
                            color: hasEnoughBalance
                              ? colors.accent
                              : colors.accentSecondary,
                          }}
                        >
                          Your Balance: {userData.sparkBalance} Sparks
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(224, 224, 224, 0.7)" }}
                        >
                          {hasEnoughBalance
                            ? "Sufficient for this purchase"
                            : "Insufficient balance for this purchase"}
                        </p>
                      </div>
                    </div>

                    <button
                      className={`w-full py-3 rounded-lg font-medium ${
                        !hasEnoughBalance ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{
                        backgroundColor: colors.primary,
                        color: "#000",
                      }}
                      disabled={!hasEnoughBalance}
                      onClick={handlePayment}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {checkoutStep === "payment" && (
            <div className="grid grid-cols-3 gap-8">
              {/* Left Column - Payment Method */}
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
                    <h3
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      Payment Method
                    </h3>
                  </div>

                  <div className="p-5">
                    <div
                      className="rounded-lg p-5 border mb-4 flex items-center"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.accent,
                        borderWidth: "2px",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: "rgba(3, 218, 198, 0.1)" }}
                      >
                        <Sparkles
                          className="w-5 h-5"
                          style={{ color: colors.accent }}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className="font-medium"
                          style={{ color: colors.lightText }}
                        >
                          Pay with Sparks
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(224, 224, 224, 0.7)" }}
                        >
                          Use your available Sparks balance
                        </p>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: colors.accent,
                          backgroundColor: "rgba(3, 218, 198, 0.2)",
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        ></div>
                      </div>
                    </div>

                    <div
                      className="rounded-lg p-5 border mb-4 flex items-center"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.borderColor,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: "rgba(187, 134, 252, 0.1)" }}
                      >
                        <CreditCard
                          className="w-5 h-5"
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className="font-medium"
                          style={{ color: colors.lightText }}
                        >
                          Credit or Debit Card
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(224, 224, 224, 0.7)" }}
                        >
                          Pay directly with your card
                        </p>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: colors.borderColor }}
                      ></div>
                    </div>

                    <div
                      className="rounded-lg p-4 flex items-start mt-6"
                      style={{ backgroundColor: "rgba(3, 218, 198, 0.1)" }}
                    >
                      <AlertCircle
                        className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                        style={{ color: colors.accent }}
                      />
                      <p className="text-sm" style={{ color: colors.text }}>
                        By proceeding with the payment, you agree to our{" "}
                        <a href="#" style={{ color: colors.accent }}>
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" style={{ color: colors.accent }}>
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Summary */}
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
                    {/* Mini items list */}
                    <div className="mb-4 space-y-2">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-8 h-8 rounded bg-cover bg-center mr-2"
                              style={{
                                backgroundImage: `url(${item.image})`,
                                backgroundColor: colors.cardBg,
                              }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: colors.text }}
                            >
                              {item.title} × {item.quantity}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Sparkles
                              className="w-3 h-3 mr-1"
                              style={{ color: colors.accent }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: colors.primary }}
                            >
                              {item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className="p-4 rounded-lg mb-6 border-t border-b"
                      style={{
                        borderColor: "rgba(224, 224, 224, 0.1)",
                        paddingTop: "16px",
                        paddingBottom: "16px",
                      }}
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
                        backgroundColor: colors.navActiveBg,
                      }}
                    >
                      <div>
                        <p className="text-sm" style={{ color: colors.text }}>
                          After payment, your balance will be:
                        </p>
                        <div className="flex items-center mt-1">
                          <Sparkles
                            className="w-4 h-4 mr-1"
                            style={{ color: colors.accent }}
                          />
                          <span
                            className="font-medium"
                            style={{ color: colors.primary }}
                          >
                            {userData.sparkBalance - subtotal} Sparks
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 rounded-lg font-medium"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#000",
                      }}
                      onClick={handlePayment}
                    >
                      Complete Purchase
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {checkoutStep === "confirmation" && (
            <div className="flex justify-center">
              <div
                className="max-w-2xl w-full rounded-lg shadow-md p-8"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <div className="flex justify-center mb-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(3, 218, 198, 0.1)" }}
                  >
                    <Check
                      className="w-12 h-12"
                      style={{ color: colors.accent }}
                    />
                  </div>
                </div>

                <h3
                  className="text-xl font-medium text-center mb-2"
                  style={{ color: colors.lightText }}
                >
                  Thank You for Your Purchase!
                </h3>

                <p
                  className="text-center mb-8"
                  style={{ color: "rgba(224, 224, 224, 0.7)" }}
                >
                  Your order has been successfully processed.
                </p>

                <div
                  className="rounded-lg p-6 mb-6"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <div
                    className="flex justify-between items-center mb-4 pb-4 border-b"
                    style={{ borderColor: colors.borderColor }}
                  >
                    <span style={{ color: colors.text }}>Order Number:</span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      #ORDER-12345
                    </span>
                  </div>

                  <div
                    className="flex justify-between items-center mb-4 pb-4 border-b"
                    style={{ borderColor: colors.borderColor }}
                  >
                    <span style={{ color: colors.text }}>Order Date:</span>
                    <span style={{ color: colors.lightText }}>
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <div
                    className="flex justify-between items-center mb-4 pb-4 border-b"
                    style={{ borderColor: colors.borderColor }}
                  >
                    <span style={{ color: colors.text }}>Payment Method:</span>
                    <div className="flex items-center">
                      <Sparkles
                        className="w-4 h-4 mr-1"
                        style={{ color: colors.accent }}
                      />
                      <span style={{ color: colors.lightText }}>
                        Sparks Balance
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex justify-between items-center mb-4 pb-4 border-b"
                    style={{ borderColor: colors.borderColor }}
                  >
                    <span style={{ color: colors.text }}>Items:</span>
                    <span style={{ color: colors.lightText }}>
                      {cartItems.length} items
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span style={{ color: colors.text }}>Total Amount:</span>
                    <div className="flex items-center">
                      <Sparkles
                        className="w-4 h-4 mr-1"
                        style={{ color: colors.accent }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        {subtotal} Sparks
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-lg p-4 mb-6 flex items-center"
                  style={{ backgroundColor: "rgba(3, 218, 198, 0.1)" }}
                >
                  <AlertCircle
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.accent }}
                  />
                  <p className="text-sm" style={{ color: colors.text }}>
                    Your content is now available in your purchases library. You
                    can download it anytime.
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <a
                    href="#"
                    className="px-6 py-2 rounded-lg flex items-center"
                    style={{
                      backgroundColor: "rgba(187, 134, 252, 0.1)",
                      color: colors.primary,
                      border: `1px solid ${colors.primary}`,
                    }}
                  >
                    <span>Continue Shopping</span>
                  </a>

                  <a
                    href="#"
                    className="px-6 py-2 rounded-lg flex items-center"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#000",
                    }}
                  >
                    <span>Go to My Purchases</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;

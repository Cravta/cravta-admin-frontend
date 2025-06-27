import React, { useState } from "react";
import {
  Bell,
  Book,
  Home,
  Settings,
  Moon,
  Sun,
  BookOpen,
  DollarSign,
  Sparkles,
  ArrowRight,
  CreditCard,
  HelpCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";

const CurrencyExchange = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [exchangeAmount, setExchangeAmount] = useState(300);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  // Mock user balance data
  const userBalance = {
    sparks: 1250,
    totalEarned: 4500,
    exchanged: 3000,
    riyalsEarned: 1000,
  };

  // Calculate exchange values
  const sparksToRiyals = (sparks) => sparks / 3;
  const calculateRiyals = () => sparksToRiyals(exchangeAmount);

  // Function to handle form submission
  const handleExchange = () => {
    setShowConfirmation(true);
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: colors.background }}
    >

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - similar to previous components */}
        {/* <header
          className="flex items-center justify-between p-4 shadow-md"
          style={{ backgroundColor: colors.cardBgAlt }}
        > */}
          {/* <div className="flex items-center">
            <h2
              className="text-xl font-medium"
              style={{ color: colors.primary }}
            >
              Currency Exchange
            </h2>
          </div> */}

          {/* <div className="flex items-center space-x-4"> */}
            {/* Header buttons as in previous components */}
            {/* <button
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
            ></div> */}
          {/* </div> */}
        {/* </header> */}

        {/* Exchange Content */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colors.background }}
        >
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Exchange Form */}
            <div className="col-span-2">
              {showConfirmation ? (
                <div
                  className="rounded-lg shadow-md p-8"
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
                      <CheckCircle
                        className="w-12 h-12"
                        style={{ color: colors.accent }}
                      />
                    </div>
                  </div>

                  <h3
                    className="text-xl font-medium text-center mb-2"
                    style={{ color: colors.lightText }}
                  >
                    Exchange Successful!
                  </h3>

                  <p
                    className="text-center mb-8"
                    style={{ color: "rgba(224, 224, 224, 0.7)" }}
                  >
                    Your exchange request has been processed successfully.
                  </p>

                  <div
                    className="rounded-lg p-6 mb-8"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(224, 224, 224, 0.7)" }}
                        >
                          You exchanged
                        </p>
                        <div className="flex items-center">
                          <Sparkles
                            className="w-5 h-5 mr-2"
                            style={{ color: colors.accent }}
                          />
                          <span
                            className="text-xl font-medium"
                            style={{ color: colors.lightText }}
                          >
                            {exchangeAmount} Sparks
                          </span>
                        </div>
                      </div>

                      <ArrowRight
                        className="w-6 h-6"
                        style={{ color: colors.primary }}
                      />

                      <div>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(224, 224, 224, 0.7)" }}
                        >
                          You received
                        </p>
                        <div className="flex items-center">
                          <DollarSign
                            className="w-5 h-5 mr-2"
                            style={{ color: colors.primary }}
                          />
                          <span
                            className="text-xl font-medium"
                            style={{ color: colors.lightText }}
                          >
                            {calculateRiyals()} Riyals
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="rounded-lg p-4 flex items-center"
                      style={{ backgroundColor: "rgba(3, 218, 198, 0.1)" }}
                    >
                      <AlertCircle
                        className="w-5 h-5 mr-3"
                        style={{ color: colors.accent }}
                      />
                      <p className="text-sm" style={{ color: colors.text }}>
                        Funds will be transferred to your linked bank account
                        within 1-3 business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      className="px-6 py-2 rounded-lg"
                      style={{
                        backgroundColor: "rgba(187, 134, 252, 0.1)",
                        color: colors.primary,
                        border: `1px solid ${colors.primary}`,
                      }}
                      onClick={() => setShowConfirmation(false)}
                    >
                      Make Another Exchange
                    </button>

                    <button
                      className="px-6 py-2 rounded-lg"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#000",
                      }}
                    >
                      View Transaction History
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-lg shadow-md p-6"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <h3
                    className="text-lg font-medium mb-6"
                    style={{ color: colors.primary }}
                  >
                    Exchange Sparks for Riyals
                  </h3>

                  <div className="grid grid-cols-1 gap-8">
                    {/* Exchange Rate Information */}
                    <div
                      className="rounded-lg p-4 flex items-center"
                      style={{ backgroundColor: colors.cardBg }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                        style={{ backgroundColor: "rgba(187, 134, 252, 0.1)" }}
                      >
                        <Sparkles
                          className="w-6 h-6"
                          style={{ color: colors.primary }}
                        />
                      </div>

                      <div className="flex-1">
                        <p
                          className="font-medium mb-1"
                          style={{ color: colors.lightText }}
                        >
                          Current Exchange Rate
                        </p>
                        <p style={{ color: "rgba(224, 224, 224, 0.7)" }}>
                          300 Sparks = 100 Riyals
                        </p>
                      </div>
                    </div>

                    {/* Exchange Form */}
                    <div>
                      <div className="grid grid-cols-3 gap-4 items-center mb-8">
                        {/* From (Sparks) */}
                        <div>
                          <label
                            className="block mb-2 font-medium"
                            style={{ color: colors.text }}
                          >
                            From
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={exchangeAmount}
                              onChange={(e) =>
                                setExchangeAmount(parseInt(e.target.value) || 0)
                              }
                              className="w-full p-3 pl-10 rounded-lg"
                              style={{
                                backgroundColor: colors.inputBg,
                                color: colors.text,
                                border: `1px solid ${colors.borderColor}`,
                              }}
                            />
                            <Sparkles
                              className="absolute left-3 top-3.5 w-4 h-4"
                              style={{ color: colors.accent }}
                            />
                          </div>
                          <p
                            className="text-xs mt-1"
                            style={{ color: "rgba(224, 224, 224, 0.5)" }}
                          >
                            Sparks
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center items-center">
                          <ArrowRight
                            className="w-8 h-8"
                            style={{ color: colors.primary }}
                          />
                        </div>

                        {/* To (Riyals) */}
                        <div>
                          <label
                            className="block mb-2 font-medium"
                            style={{ color: colors.text }}
                          >
                            To
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={calculateRiyals()}
                              disabled
                              className="w-full p-3 pl-10 rounded-lg"
                              style={{
                                backgroundColor: colors.inputBg,
                                color: colors.text,
                                border: `1px solid ${colors.borderColor}`,
                                opacity: 0.8,
                              }}
                            />
                            <DollarSign
                              className="absolute left-3 top-3.5 w-4 h-4"
                              style={{ color: colors.primary }}
                            />
                          </div>
                          <p
                            className="text-xs mt-1"
                            style={{ color: "rgba(224, 224, 224, 0.5)" }}
                          >
                            Riyals
                          </p>
                        </div>
                      </div>

                      {/* Quick Amount Selectors */}
                      <div className="mb-8">
                        <label
                          className="block mb-3 font-medium"
                          style={{ color: colors.text }}
                        >
                          Quick Amounts
                        </label>
                        <div className="flex space-x-3">
                          {[300, 600, 900, 1200].map((amount) => (
                            <button
                              key={amount}
                              onClick={() => setExchangeAmount(amount)}
                              className="flex-1 py-2 rounded-lg"
                              style={{
                                backgroundColor:
                                  exchangeAmount === amount
                                    ? colors.primary
                                    : "rgba(187, 134, 252, 0.1)",
                                color:
                                  exchangeAmount === amount
                                    ? "#000"
                                    : colors.primary,
                                border: `1px solid ${
                                  exchangeAmount === amount
                                    ? colors.primary
                                    : "transparent"
                                }`,
                              }}
                            >
                              <div className="flex items-center justify-center">
                                <Sparkles className="w-4 h-4 mr-1" />
                                <span>{amount}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="mb-8">
                        <label
                          className="block mb-3 font-medium"
                          style={{ color: colors.text }}
                        >
                          Payment Method
                        </label>
                        <div
                          className="rounded-lg p-4 flex items-center"
                          style={{
                            backgroundColor: colors.cardBg,
                            border: `1px solid ${colors.borderColor}`,
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded flex items-center justify-center mr-4"
                            style={{
                              backgroundColor: "rgba(187, 134, 252, 0.1)",
                            }}
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
                              Bank Account (Primary)
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: "rgba(224, 224, 224, 0.7)" }}
                            >
                              **** **** **** 5678
                            </p>
                          </div>

                          <button
                            className="px-3 py-1 rounded text-sm"
                            style={{
                              backgroundColor: "rgba(187, 134, 252, 0.1)",
                              color: colors.primary,
                            }}
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      {/* Warnings and Info */}
                      <div
                        className="rounded-lg p-4 mb-8 flex items-start"
                        style={{ backgroundColor: "rgba(207, 102, 121, 0.1)" }}
                      >
                        <AlertCircle
                          className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                          style={{ color: colors.accentSecondary }}
                        />
                        <div>
                          <p className="text-sm" style={{ color: colors.text }}>
                            <span
                              className="font-medium"
                              style={{ color: colors.accentSecondary }}
                            >
                              Important:
                            </span>{" "}
                            Minimum exchange amount is 300 Sparks. Exchanges are
                            processed within 1-3 business days. This action
                            cannot be undone.
                          </p>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          className={`px-6 py-3 rounded-lg font-medium ${
                            exchangeAmount < 300 ||
                            exchangeAmount > userBalance.sparks
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          style={{
                            backgroundColor: colors.primary,
                            color: "#000",
                          }}
                          disabled={
                            exchangeAmount < 300 ||
                            exchangeAmount > userBalance.sparks
                          }
                          onClick={handleExchange}
                        >
                          Exchange Sparks for Riyals
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Balance and History */}
            <div className="col-span-1">
              {/* Current Balance */}
              <div
                className="rounded-lg shadow-md p-6 mb-6"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <h3
                  className="font-medium mb-4"
                  style={{ color: colors.primary }}
                >
                  Your Balance
                </h3>

                <div
                  className="rounded-lg p-5 mb-4"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <p
                    className="text-sm mb-2"
                    style={{ color: "rgba(224, 224, 224, 0.7)" }}
                  >
                    Available Sparks
                  </p>
                  <div className="flex items-center">
                    <Sparkles
                      className="w-6 h-6 mr-2"
                      style={{ color: colors.accent }}
                    />
                    <span
                      className="text-2xl font-bold"
                      style={{ color: colors.lightText }}
                    >
                      {userBalance.sparks}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <p
                      className="text-xs mb-1"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Total Earned
                    </p>
                    <div className="flex items-center">
                      <Sparkles
                        className="w-4 h-4 mr-1"
                        style={{ color: colors.accent }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: colors.lightText }}
                      >
                        {userBalance.totalEarned}
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <p
                      className="text-xs mb-1"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Total Exchanged
                    </p>
                    <div className="flex items-center">
                      <Sparkles
                        className="w-4 h-4 mr-1"
                        style={{ color: colors.accent }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: colors.lightText }}
                      >
                        {userBalance.exchanged}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exchange History */}
              <div
                className="rounded-lg shadow-md p-6"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <h3
                  className="font-medium mb-4"
                  style={{ color: colors.primary }}
                >
                  Recent Exchanges
                </h3>

                <div className="space-y-4">
                  {/* Recent exchange entries */}
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p
                        className="font-medium"
                        style={{ color: colors.lightText }}
                      >
                        300 Sparks → 100 Riyals
                      </p>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: "rgba(3, 218, 198, 0.1)",
                          color: colors.accent,
                        }}
                      >
                        Completed
                      </span>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(224, 224, 224, 0.5)" }}
                    >
                      May 15, 2023 • 10:24 AM
                    </p>
                  </div>

                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p
                        className="font-medium"
                        style={{ color: colors.lightText }}
                      >
                        600 Sparks → 200 Riyals
                      </p>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: "rgba(3, 218, 198, 0.1)",
                          color: colors.accent,
                        }}
                      >
                        Completed
                      </span>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(224, 224, 224, 0.5)" }}
                    >
                      April 28, 2023 • 3:15 PM
                    </p>
                  </div>

                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p
                        className="font-medium"
                        style={{ color: colors.lightText }}
                      >
                        900 Sparks → 300 Riyals
                      </p>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: "rgba(3, 218, 198, 0.1)",
                          color: colors.accent,
                        }}
                      >
                        Completed
                      </span>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(224, 224, 224, 0.5)" }}
                    >
                      March 12, 2023 • 9:45 AM
                    </p>
                  </div>
                </div>

                <button
                  className="w-full mt-5 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgba(187, 134, 252, 0.1)",
                    color: colors.primary,
                  }}
                >
                  View All Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyExchange;

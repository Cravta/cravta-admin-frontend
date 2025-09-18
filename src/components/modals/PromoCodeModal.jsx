import React, { useEffect, useState } from "react";
import { X, Tag, Percent, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppSettings } from "../../contexts/AppSettingsProvider";
import { useDispatch } from "react-redux";
import { createPromoCode, fetchPromoCodes, updatePromoCode } from "../../store/admin/promoCodesSlice";

const PromoCodeModal = ({ showModal, setShowModal, promoCodeInfo, setPromoCodeInfo }) => {
    const { colors } = useAppSettings();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [promoCode, setPromoCode] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [validUntil, setValidUntil] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (promoCodeInfo?.id) {
            setPromoCode(promoCodeInfo.promoCode || "");
            setDiscountPercentage(promoCodeInfo.discountPercentage || "");
            setValidUntil(
                promoCodeInfo.validUntil
                    ? new Date(promoCodeInfo.validUntil).toISOString().split("T")[0]
                    : ""
            );
            setIsActive(promoCodeInfo.isActive !== undefined ? promoCodeInfo.isActive : true);
        } else {
            resetForm();
        }
    }, [promoCodeInfo?.id, showModal]);

    const resetForm = () => {
        setPromoCode("");
        setDiscountPercentage("");
        setValidUntil("");
        setIsActive(true);
        setPromoCodeInfo(null);
    };

    const generateRandomPromoCode = () => {
        const chars = "0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPromoCode(result);
    };

    const handleSubmit = () => {
        if (!promoCode || !discountPercentage || !validUntil) {
            toast.error("Please fill all required fields.");
            return;
        }

        if (discountPercentage < 1 || discountPercentage > 100) {
            toast.error("Discount percentage must be between 1 and 100.");
            return;
        }

        if (new Date(validUntil) <= new Date()) {
            toast.error("Valid until date must be in the future.");
            return;
        }

        const payload = {
            promoCode: promoCode.toUpperCase(),
            discountPercentage: parseFloat(discountPercentage),
            validUntil,
            isActive,
        };

        setIsSubmitting(true);

        if (promoCodeInfo?.id) {
            // Update existing promo code
            payload.id = promoCodeInfo.id;
            dispatch(updatePromoCode(payload))
                .unwrap()
                .then(() => {
                    toast.success("Promo code updated successfully!");
                    resetForm();
                    setShowModal(false);
                })
                .catch((error) => {
                    toast.error(`Failed to update promo code: ${error}`);
                })
                .finally(() => setIsSubmitting(false));
        } else {
            // Create new promo code
            dispatch(createPromoCode(payload))
                .unwrap()
                .then(() => {
                    toast.success("Promo code created successfully!");
                    resetForm();
                    setShowModal(false);
                })
                .catch((error) => {
                    toast.error(`Failed to create promo code: ${error}`);
                })
                .finally(() => setIsSubmitting(false));
        }
    };

    const handleCloseModal = () => {
        resetForm();
        setShowModal(false);
    };

    // Get minimum date (tomorrow)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    };

    if (!showModal) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        >
            <div
                className="w-full max-w-lg rounded-lg shadow-lg overflow-hidden"
                style={{ backgroundColor: colors.cardBgAlt }}
            >
                {/* Modal Header */}
                <div
                    className="flex justify-between items-center p-5 border-b"
                    style={{ borderColor: colors.borderColor }}
                >
                    <h3
                        className="text-lg font-medium flex items-center"
                        style={{ color: colors.primary }}
                    >
                        <Tag className="w-5 h-5 mr-2" />
                        {promoCodeInfo?.id ? "Edit Promo Code" : "Create Promo Code"}
                    </h3>
                    <button
                        onClick={handleCloseModal}
                        className="p-1 rounded-full hover:bg-opacity-20"
                        style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
                    >
                        <X className="w-5 h-5" style={{ color: colors.text }} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-5 space-y-4">
                    {/* Promo Code Field */}
                    <div>
                        <label
                            className="block text-sm mb-1 flex items-center"
                            style={{ color: colors.terColor }}
                        >
                            <Tag className="w-4 h-4 mr-1" />
                            {t("Promo Code")} *
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                className="flex-1 p-3 rounded-lg font-mono"
                                style={{
                                    backgroundColor: colors.inputBg,
                                    border: `1px solid ${colors.borderColor}`,
                                    color: colors.text,
                                }}
                                disabled={true}
                                placeholder={t("Enter promo code")}
                                maxLength={20}
                            />
                            <button
                                type="button"
                                onClick={generateRandomPromoCode}
                                className="px-3 py-2 rounded-lg text-sm whitespace-nowrap"
                                style={{
                                    backgroundColor: colors.primary,
                                    color: colors.lightText,
                                }}
                            >
                                Generate
                            </button>
                        </div>
                    </div>

                    {/* Discount Percentage */}
                    <div>
                        <label
                            className="block text-sm mb-1 flex items-center"
                            style={{ color: colors.terColor }}
                        >
                            <Percent className="w-4 h-4 mr-1" />
                            {t("Discount Percentage")} *
                        </label>
                        <input
                            type="number"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                            className="w-full p-3 rounded-lg"
                            style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.text,
                            }}
                            placeholder={t("Enter discount percentage")}
                            min="1"
                            max="100"
                        />
                    </div>

                    {/* Valid Until Date */}
                    <div>
                        <label
                            className="block text-sm mb-1 flex items-center"
                            style={{ color: colors.terColor }}
                        >
                            <Calendar className="w-4 h-4 mr-1" />
                            {t("Valid Until")} *
                        </label>
                        <input
                            type="date"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                            className="w-full p-3 rounded-lg"
                            style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.text,
                            }}
                            min={getMinDate()}
                        />
                    </div>

                    {/* Active Status */}
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="mr-2"
                                style={{ accentColor: colors.primary }}
                            />
                            <span className="text-sm" style={{ color: colors.terColor }}>
                {t("Active")}
              </span>
                        </label>
                    </div>
                </div>

                {/* Modal Footer */}
                <div
                    className="flex justify-end p-5 border-t"
                    style={{ borderColor: colors.borderColor }}
                >
                    <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 mr-3 rounded-lg text-sm"
                        style={{
                            backgroundColor: "transparent",
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                        }}
                        type="button"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!promoCode || !discountPercentage || !validUntil || isSubmitting}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.cardBg,
                            opacity: !promoCode || !discountPercentage || !validUntil || isSubmitting ? 0.6 : 1,
                            cursor: !promoCode || !discountPercentage || !validUntil || isSubmitting
                                ? "not-allowed"
                                : "pointer",
                        }}
                        type="button"
                    >
                        {isSubmitting
                            ? (promoCodeInfo?.id ? t("Updating...") : t("Creating..."))
                            : (promoCodeInfo?.id ? t("Update Promo Code") : t("Create Promo Code"))
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromoCodeModal;
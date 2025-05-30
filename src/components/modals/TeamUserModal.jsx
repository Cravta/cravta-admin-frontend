import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppSettings } from "../../context/AppSettingsProvider";

const CreateUserModal = ({ showModal, setShowModal }) => {
  const { colors } = useAppSettings();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch roles from backend (adjust URL as needed)
  useEffect(() => {
    if (showModal) {
      axios
        .get("https://your-backend-api.com/api/v1/roles")
        .then((res) => setRoles(res.data.data))
        .catch((err) => toast.error("Failed to load roles."));
    }
  }, [showModal]);

  const resetForm = () => {
    setName("");
    setEmailAddress("");
    setPassword("");
    setRoleId("");
  };

  const handleSubmit = () => {
    if (!name || !emailAddress || !password || !roleId) {
      toast.error("Please fill all required fields.");
      return;
    }

    const userData = {
      name,
      email_address: emailAddress,
      password,
      role_id: roleId,
    };

    setIsSubmitting(true);
    axios
      .post("https://your-backend-api.com/api/v1/users", userData)
      .then(() => {
        toast.success("User created successfully!");
        resetForm();
        setShowModal(false);
      })
      .catch(() => toast.error("Failed to create user."))
      .finally(() => setIsSubmitting(false));
  };

  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
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
          <h3 className="text-lg font-medium" style={{ color: colors.primary }}>
            {t("createUser")}
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
          <div>
            <label className="block text-sm mb-1" style={{ color: colors.terColor }}>
              {t("name")} *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
              placeholder={t("enterName")}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: colors.terColor }}>
              {t("emailAddress")} *
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
              placeholder={t("enterEmail")}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: colors.terColor }}>
              {t("password")} *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
              placeholder={t("enterPassword")}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: colors.terColor }}>
              {t("role")} *
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
            >
              <option value="">{t("selectRole")}</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
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
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name || !emailAddress || !password || !roleId || isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: colors.primary,
              color: colors.cardBg,
              opacity: !name || !emailAddress || !password || !roleId || isSubmitting ? 0.6 : 1,
              cursor: !name || !emailAddress || !password || !roleId || isSubmitting
                ? "not-allowed"
                : "pointer",
            }}
            type="button"
          >
            {isSubmitting ? t("creating") : t("createUser")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;

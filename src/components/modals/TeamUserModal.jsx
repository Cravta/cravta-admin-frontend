import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppSettings } from "../../contexts/AppSettingsProvider";
import { fetchRoles } from "../../store/admin/roleSlice";
import { useDispatch, useSelector } from "react-redux";
import { createTeamUser, fetchTeamUsers, updateTeamUser } from "../../store/auth/adminUsersSlice";

const CreateUserModal = ({ showModal, setShowModal, editingUser,setEditingUser }) => {
  const { colors } = useAppSettings();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { roleList, loading } = useSelector((state) => state.role);
  const dispatch = useDispatch();
  // Fetch roles from backend (adjust URL as needed)
  useEffect(() => {
    if (showModal) {
      dispatch(fetchRoles({}))
    }
  }, [showModal]);
  useEffect(() => {
    if (editingUser?.id && roleList.length) {
      setName(editingUser?.name || '');
      setPassword('')
      setEmailAddress(editingUser?.email_address || '');
      setRoleId(editingUser?.role_id || '');
    }
  }, [editingUser?.id, roleList.length]);
  const resetForm = () => {
    setName("");
    setEmailAddress("");
    setPassword("");
    setRoleId("");
    setEditingUser(null)
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
    if (editingUser?.id) {
      dispatch(updateTeamUser({ userId: editingUser.id, userData })).unwrap().then(() => {
        toast.success("User updated successfully!");
        dispatch(fetchTeamUsers({}));
        resetForm();
        setShowModal(false);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSubmitting(false));
      return;
    }
    else {
    dispatch(createTeamUser(userData)).unwrap().then(() => {
        toast.success("User created successfully!");
        dispatch(fetchTeamUsers({}));
        resetForm();
        setShowModal(false);
    })
    .catch((err) => console.log(err))
    .finally(() => setIsSubmitting(false));
    }
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
            Create User
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
              Name *
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
              placeholder={t("Enter name")}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: colors.terColor }}>
              {t("Email Address")} *
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
              placeholder={t("enter email")}
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
              placeholder={t("enter password")}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: colors.terColor }}>
              {t("Role")} *
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
              <option value="">{t("select role")}</option>
              {roleList.map((role) => (
                <option key={role?.id} value={role?.id}>
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
            {isSubmitting ? t(editingUser?.id ? "Updating..." : "Creating...")
            : t(editingUser?.id ? "Update User" : "Create User")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;

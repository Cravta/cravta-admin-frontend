import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAppSettings } from "../../contexts/AppSettingsProvider.jsx";
import { useDispatch } from "react-redux";
import { createRole, editRole, fetchRoles } from "../../store/admin/roleSlice.js";

const availableRights = [
  "overview",
  "users",
  "classes",
  "content",
  "blogs",
  "reports",
  "settings",
  "audit",
  "roles",
  "teams",
  "help",
  "packages"
];

const CreateRoleModal = ({ showModal, setShowModal, setRoleInfo, roleInfo = {} }) => {
  const { colors } = useAppSettings();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [roleName, setRoleName] = useState("");
  const [selectedRights, setSelectedRights] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (roleInfo?.id) {
      setRoleName(roleInfo?.name || "");
      setSelectedRights(roleInfo?.rights || []);
    }
  }, [showModal]);

  const resetForm = () => {
    setRoleName("");
    setSelectedRights([]);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    setRoleInfo(null);
    setShowModal(false);
  };

  const handleToggleRight = (right) => {
    setSelectedRights((prev) =>
      prev.includes(right)
        ? prev.filter((r) => r !== right)
        : [...prev, right]
    );
  };

  const handleSubmit = () => {
    if (!roleName.trim()) {
      toast.error("Role name is required.");
      return;
    }
    if (selectedRights.length === 0) {
      toast.error("Select at least one right.");
      return;
    }

    setIsSubmitting(true);

    const roleData = {
      name: roleName.trim(),
      rights: selectedRights,
    };

    // if (onSubmit) onSubmit(roleData);
    if(roleInfo?.id){
    dispatch(editRole({roleId:roleInfo?.id,updatedData:roleData})).unwrap().then(() => {
    toast.success(roleInfo?.id ? "Role updated successfully!" : "Role created successfully!");
    handleClose();
    })
    }
    else{
    dispatch(createRole(roleData)).unwrap().then(() => {
    toast.success(roleInfo?.id ? "Role updated successfully!" : "Role created successfully!");
    handleClose();
    })
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
      <div className="w-full max-w-md rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: colors.cardBgAlt }}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: colors.borderColor }}>
          <h3 className="text-lg font-medium" style={{ color: colors.primary }}>
            {roleInfo?.id ? "Edit Role" : "Create Role"}
          </h3>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-opacity-20" style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}>
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.terColor }}>
              Role Name *
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder={"Enter role name"}
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: colors.terColor }}>
              Assign Rights *
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {availableRights.map((right) => (
                <label key={right} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRights.includes(right)}
                    onChange={() => handleToggleRight(right)}
                  />
                  <span style={{ color: colors.text }}>{t(right)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5 border-t" style={{ borderColor: colors.borderColor }}>
          <button
            onClick={handleClose}
            className="px-4 py-2 mr-3 rounded-lg text-sm"
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${colors.borderColor}`,
              color: colors.text,
            }}
          >
            {"Cancel"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!roleName || selectedRights.length === 0 || isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: colors.primary,
              color: colors.cardBg,
              opacity: !roleName || selectedRights.length === 0 || isSubmitting ? 0.6 : 1,
              cursor: !roleName || selectedRights.length === 0 || isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {roleInfo?.id ? isSubmitting ? "Saving..." : "Update Role" : isSubmitting ? "Creating..." : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;

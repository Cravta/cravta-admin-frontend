import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppSettings } from "../../contexts/AppSettingsProvider";
import { useDispatch } from "react-redux";
import { createUser, fetchUsersAdmin, updateUser } from "../../store/admin/usersSlice";

const UserModal = ({ showModal, setShowModal, userInfo, setUserInfo }) => {
  const { colors } = useAppSettings();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // default type
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userInfo?.id) {
      setName(userInfo.name || "");
      setEmailAddress(userInfo.email_address || "");
      setUserType(userInfo.user_type || "user");
      setDob(new Date(userInfo.dob).toISOString().split("T")[0] || "");
      setGender(userInfo.gender || "");
      setPassword(""); // optional: don't autofill password
    } else {
      resetForm();
    }
  }, [userInfo?.id, showModal]);

  const resetForm = () => {
    setName("");
    setEmailAddress("");
    setPassword("");
    setUserType("user");
    setDob("");
    setGender("");
    setUserInfo(null);
  };

  const handleSubmit = () => {
    if (!name || !emailAddress || !password || !userType || !dob || !gender) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      name,
      email_address: emailAddress,
      password,
      user_type: userType,
      dob,
      gender,
    };

    setIsSubmitting(true);
    if (userInfo?.id) {
      payload.id = userInfo.id;
      dispatch(updateUser(payload))
        .unwrap()
        .then(() => {
          toast.success("User updated successfully!");
          dispatch(fetchUsersAdmin({}));
          resetForm();
          setShowModal(false);
        })
        .catch(() => toast.error("Failed to update user."))
        .finally(() => setIsSubmitting(false));
    }
    else{
    dispatch(createUser(payload))
      .unwrap()
      .then(() => {
        toast.success("User created successfully!");
        dispatch(fetchUsersAdmin({}));
        resetForm();
        setShowModal(false);
      })
      .catch(() => toast.error("Failed to create user."))
      .finally(() => setIsSubmitting(false));
    }
  };

  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
      <div className="w-full max-w-lg rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: colors.cardBgAlt }}>
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: colors.borderColor }}>
          <h3 className="text-lg font-medium" style={{ color: colors.primary }}>Create User</h3>
          <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-opacity-20" style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}>
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          {[
            { label: "Name", value: name, setter: setName, type: "text" },
            { label: "Email Address", value: emailAddress, setter: setEmailAddress, type: "email" },
            { label: "Password", value: password, setter: setPassword, type: "password" },
            { label: "Date of Birth", value: dob, setter: setDob, type: "date" }
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-sm mb-1" style={{ color: colors.terColor }}>{t(field.label)} *</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full p-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
                placeholder={t(`Enter ${field.label.toLowerCase()}`)}
              />
            </div>
          ))}

          {/* User Type */}
          <div>
            <label className="block text-sm mb-1" style={{ color: colors.terColor }}>{t("User Type")} *</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
            >
              <option value="">Select user type</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="school">School</option>
              {/* Add more types if needed */}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm mb-1" style={{ color: colors.terColor }}>{t("Gender")} *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-5 border-t" style={{ borderColor: colors.borderColor }}>
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
            disabled={!name || !emailAddress || !password || !userType || !dob || !gender || isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: colors.primary,
              color: colors.cardBg,
              opacity: !name || !emailAddress || !password || !userType || !dob || !gender || isSubmitting ? 0.6 : 1,
              cursor: !name || !emailAddress || !password || !userType || !dob || !gender || isSubmitting ? "not-allowed" : "pointer",
            }}
            type="button"
          >
            {isSubmitting ? t("Creating...") : t("Create User")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;

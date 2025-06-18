import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAppSettings } from "../../contexts/AppSettingsProvider";
import { createPackage, editPackage } from "../../store/admin/packageSlice"; // Make sure to create these actions

const userTypes = ["teacher", "student", "school"];
const packageTypes = ["monthly", "annual"]; // Adjust as needed

const CreatePackageModal = ({ showModal, setShowModal, setPackageInfo, packageInfo = {} }) => {
  const { colors } = useAppSettings();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [sparks, setSparks] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [userType, setUserType] = useState("");
  const [packageType, setPackageType] = useState("");
  const [descriptionList, setDescriptionList] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (packageInfo?.id) {
      setName(packageInfo.name || "");
      setSparks(packageInfo.sparks || "");
      setPrice(packageInfo.price || "");
      setDiscountPercentage(packageInfo.discount_percentage || "");
      setUserType(packageInfo.user_type || "");
      setPackageType(packageInfo.package_type || "");
      setDescriptionList(packageInfo.description || [""]);
    }
  }, [showModal]);

  const handleClose = () => {
    setShowModal(false);
    setPackageInfo(null);
    setIsSubmitting(false);
    setName("");
    setSparks("");
    setPrice("");
    setDiscountPercentage("");
    setUserType("");
    setPackageType("");
    setDescriptionList([""]);
  };

  const handleAddDescription = () => {
    setDescriptionList([...descriptionList, ""]);
  };

  const handleRemoveDescription = (index) => {
    const newList = [...descriptionList];
    newList.splice(index, 1);
    setDescriptionList(newList);
  };

  const handleDescriptionChange = (index, value) => {
    const newList = [...descriptionList];
    newList[index] = value;
    setDescriptionList(newList);
  };

  const handleSubmit = () => {
    if (!name || !sparks || !price || !discountPercentage || !userType || !packageType || descriptionList.some(desc => !desc.trim())) {
      toast.error("Please fill all fields and ensure all description points are filled.");
      return;
    }

    const payload = {
      name,
      sparks: +sparks,
      price: +price,
      discount_percentage: +discountPercentage,
      user_type: userType,
      package_type: packageType,
      description: descriptionList,
    };

    setIsSubmitting(true);

    const action = packageInfo?.id
      ? editPackage({ packageId: packageInfo.id, updatedData: payload })
      : createPackage(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(packageInfo?.id ? "Package updated successfully!" : "Package created successfully!");
        handleClose();
      })
      .catch(() => {
        toast.error("Something went wrong.");
        setIsSubmitting(false);
      });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
      <div className="w-full max-w-lg rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: colors.cardBgAlt }}>
        <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: colors.borderColor }}>
          <h3 className="text-lg font-medium" style={{ color: colors.primary }}>
            {packageInfo?.id ? "Edit Package" : "Create Package"}
          </h3>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-opacity-20" style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}>
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {[
            { label: "Package Name", state: name, setState: setName, type: "text" },
            { label: "Sparks", state: sparks, setState: setSparks, type: "number" },
            { label: "Price (SAR)", state: price, setState: setPrice, type: "number" },
            { label: "Discount Percentage", state: discountPercentage, setState: setDiscountPercentage, type: "number" },
          ].map(({ label, state, setState, type }) => (
            <div key={label}>
              <label className="block text-sm mb-2" style={{ color: colors.terColor }}>{label} *</label>
              <input
                type={type}
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
              />
            </div>
          ))}

          {/* Dropdowns */}
          {[{ label: "User Type", options: userTypes, value: userType, setValue: setUserType },
            { label: "Package Type", options: packageTypes, value: packageType, setValue: setPackageType }]
            .map(({ label, options, value, setValue }) => (
              <div key={label}>
                <label className="block text-sm mb-2" style={{ color: colors.terColor }}>{label} *</label>
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full p-3 rounded-lg"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.borderColor}`,
                    color: colors.text,
                  }}
                >
                  <option value="">Select {label}</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}

          {/* Description Points */}
          <div>
            <label className="block text-sm mb-2" style={{ color: colors.terColor }}>
              Description Points *
            </label>
            {descriptionList.map((desc, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                  className="flex-1 p-3 rounded-lg"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.borderColor}`,
                    color: colors.text,
                  }}
                />
                {descriptionList.length > 1 && (
                  <button onClick={() => handleRemoveDescription(index)} className="text-red-500">✕</button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddDescription}
              className="text-sm underline mt-1"
              style={{ color: colors.primary }}
            >
              + Add another point
            </button>
          </div>
        </div>

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
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !name || !sparks || !price || !discountPercentage ||
              !userType || !packageType ||
              descriptionList.some((desc) => !desc.trim())
            }
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: colors.primary,
              color: colors.cardBg,
              opacity:
                !name || !sparks || !price || !discountPercentage || !userType || !packageType ||
                descriptionList.some((desc) => !desc.trim()) || isSubmitting
                  ? 0.6
                  : 1,
              cursor:
                !name || !sparks || !price || !discountPercentage || !userType || !packageType ||
                descriptionList.some((desc) => !desc.trim()) || isSubmitting
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {packageInfo?.id
              ? isSubmitting
                ? "Saving..."
                : "Update Package"
              : isSubmitting
              ? "Creating..."
              : "Create Package"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePackageModal;

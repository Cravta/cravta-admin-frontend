import React, { useState, useEffect } from "react";
import { X, Building2, MapPin, DollarSign, Clock, Palette } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { createEnterprise, updateEnterprise } from "../../store/admin/enterpriseSlice";
import { toast } from "react-toastify";

const CreateEnterpriseModal = ({
                                   showModal,
                                   setShowModal,
                                   enterpriseInfo = null,
                                   onClose
                               }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();

    // Safe selector with fallback values
    const enterpriseState = useSelector((state) => state.adminEnterprise || {});
    const { loading = false, status = 'idle' } = enterpriseState;

    // Form state
    const [formData, setFormData] = useState({
        logo_id: '',
        name: '',
        location: '',
        theme: {
            colour: '#121344'
        },
        default_token_price: '',
        default_freemium_period: ''
    });

    const [errors, setErrors] = useState({});
    const isEditMode = Boolean(enterpriseInfo);

    // Populate form when editing
    useEffect(() => {
        if (enterpriseInfo && showModal) {
            setFormData({
                logo_id: enterpriseInfo.logo_id || '',
                name: enterpriseInfo.name || '',
                location: enterpriseInfo.location || '',
                theme: {
                    colour: enterpriseInfo.theme?.colour || enterpriseInfo.theme?.spmething || '#121344'
                },
                default_token_price: enterpriseInfo.default_token_price || '',
                default_freemium_period: enterpriseInfo.default_freemium_period || ''
            });
        } else if (!isEditMode && showModal) {
            // Reset form for new enterprise
            setFormData({
                logo_id: '',
                name: '',
                location: '',
                theme: {
                    colour: '#121344'
                },
                default_token_price: '',
                default_freemium_period: ''
            });
        }
    }, [enterpriseInfo, showModal, isEditMode]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'theme_colour') {
            setFormData(prev => ({
                ...prev,
                theme: {
                    ...prev.theme,
                    colour: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Enterprise name is required';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.default_token_price || formData.default_token_price < 0) {
            newErrors.default_token_price = 'Valid token price is required';
        }

        if (!formData.default_freemium_period || formData.default_freemium_period < 0) {
            newErrors.default_freemium_period = 'Valid freemium period is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = {
            ...formData,
            logo_id: formData.logo_id ? Number(formData.logo_id) : null,
            default_token_price: Number(formData.default_token_price),
            default_freemium_period: Number(formData.default_freemium_period)
        };

        try {
            if (isEditMode) {
                await dispatch(updateEnterprise({
                    enterpriseId: enterpriseInfo.id,
                    enterpriseData: submitData
                })).unwrap();
                toast.success('Enterprise updated successfully!');
            } else {
                await dispatch(createEnterprise(submitData)).unwrap();
                toast.success('Enterprise created successfully!');
            }
            handleClose();
        } catch (error) {
            toast.error(error || `Failed to ${isEditMode ? 'update' : 'create'} enterprise`);
        }
    };

    // Handle modal close
    const handleClose = () => {
        setFormData({
            logo_id: '',
            name: '',
            location: '',
            theme: {
                colour: '#121344'
            },
            default_token_price: '',
            default_freemium_period: ''
        });
        setErrors({});
        setShowModal(false);
        if (onClose) onClose();
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
                style={{ backgroundColor: colors.cardBg }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-6 border-b"
                    style={{ borderColor: colors.borderColor }}
                >
                    <h3
                        className="text-lg font-semibold"
                        style={{ color: colors.text }}
                    >
                        {isEditMode ? 'Edit Enterprise' : 'Create New Enterprise'}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: colors.textMuted }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Logo ID */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: colors.text }}
                        >
                            Logo ID (Optional)
                        </label>
                        <input
                            type="number"
                            name="logo_id"
                            value={formData.logo_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                                backgroundColor: colors.inputBg,
                                borderColor: errors.logo_id ? colors.error : colors.borderColor,
                                color: colors.text,
                            }}
                            placeholder="Enter logo ID"
                        />
                    </div>

                    {/* Enterprise Name */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: colors.text }}
                        >
                            Enterprise Name *
                        </label>
                        <div className="relative">
                            <Building2
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                                style={{ color: colors.textMuted }}
                            />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{
                                    backgroundColor: colors.inputBg,
                                    borderColor: errors.name ? colors.error : colors.borderColor,
                                    color: colors.text,
                                }}
                                placeholder="Enter enterprise name"
                                required
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-sm" style={{ color: colors.error }}>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: colors.text }}
                        >
                            Location *
                        </label>
                        <div className="relative">
                            <MapPin
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                                style={{ color: colors.textMuted }}
                            />
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{
                                    backgroundColor: colors.inputBg,
                                    borderColor: errors.location ? colors.error : colors.borderColor,
                                    color: colors.text,
                                }}
                                placeholder="e.g., Lahore, Pakistan"
                                required
                            />
                        </div>
                        {errors.location && (
                            <p className="mt-1 text-sm" style={{ color: colors.error }}>
                                {errors.location}
                            </p>
                        )}
                    </div>

                    {/* Theme Color */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: colors.text }}
                        >
                            Theme Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Palette
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                                    style={{ color: colors.textMuted }}
                                />
                                <input
                                    type="text"
                                    name="theme_colour"
                                    value={formData.theme.colour}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{
                                        backgroundColor: colors.inputBg,
                                        borderColor: colors.borderColor,
                                        color: colors.text,
                                        width: '120px'
                                    }}
                                    placeholder="#121344"
                                />
                            </div>
                            <input
                                type="color"
                                name="theme_colour"
                                value={formData.theme.colour}
                                onChange={handleInputChange}
                                className="w-10 h-10 rounded border cursor-pointer"
                                style={{ borderColor: colors.borderColor }}
                            />
                        </div>
                    </div>

                    {/* Token Price */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: colors.text }}
                        >
                            Default Token Price (Sparks) *
                        </label>
                        <div className="relative">
                            <DollarSign
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                                style={{ color: colors.textMuted }}
                            />
                            <input
                                type="number"
                                name="default_token_price"
                                value={formData.default_token_price}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{
                                    backgroundColor: colors.inputBg,
                                    borderColor: errors.default_token_price ? colors.error : colors.borderColor,
                                    color: colors.text,
                                }}
                                placeholder="35"
                                min="0"
                                required
                            />
                        </div>
                        {errors.default_token_price && (
                            <p className="mt-1 text-sm" style={{ color: colors.error }}>
                                {errors.default_token_price}
                            </p>
                        )}
                    </div>

                    {/* Freemium Period */}
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: colors.text }}
                        >
                            Default Freemium Period (Seconds) *
                        </label>
                        <div className="relative">
                            <Clock
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                                style={{ color: colors.textMuted }}
                            />
                            <input
                                type="number"
                                name="default_freemium_period"
                                value={formData.default_freemium_period}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{
                                    backgroundColor: colors.inputBg,
                                    borderColor: errors.default_freemium_period ? colors.error : colors.borderColor,
                                    color: colors.text,
                                }}
                                placeholder="172800 (48 hours)"
                                min="0"
                                required
                            />
                        </div>
                        {errors.default_freemium_period && (
                            <p className="mt-1 text-sm" style={{ color: colors.error }}>
                                {errors.default_freemium_period}
                            </p>
                        )}
                        <p className="mt-1 text-xs" style={{ color: colors.textMuted }}>
                            Note: 3600 seconds = 1 hour, 86400 seconds = 1 day
                        </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg border transition-colors"
                            style={{
                                borderColor: colors.borderColor,
                                color: colors.text,
                                backgroundColor: 'transparent',
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg transition-colors"
                            style={{
                                backgroundColor: colors.primary,
                                color: colors.lightText,
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Enterprise' : 'Create Enterprise'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEnterpriseModal;
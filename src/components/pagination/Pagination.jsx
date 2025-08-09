import React from "react";
import {useAppSettings} from "../../contexts/AppSettingsProvider.jsx";

export default function Pagination({ page, limit, totalItems, onPageChange, onLimitChange }) {
    const { colors } = useAppSettings();
    const totalPages = Math.ceil(totalItems / limit);

    const styles = {
        container: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem 2rem",
            background: colors.cardBg,
            borderRadius: "16px",
            boxShadow: `0 6px 20px ${colors.terColor3}`,
            fontFamily: "system-ui, sans-serif",
            maxWidth: "fit-content",
            margin: "auto",
            border: `1px solid ${colors.borderColor}`,
        },
        button: {
            backgroundColor: colors.primary,
            color: colors.lightText,
            border: "none",
            padding: "0.5rem 1.2rem",
            borderRadius: "9999px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            boxShadow: `0 2px 6px ${colors.terColor4}`,
            transition: "all 0.2s ease-in-out",
        },
        buttonHover: {
            backgroundColor: colors.secondary,
        },
        buttonDisabled: {
            backgroundColor: colors.terColor4,
            color: colors.textSecondary,
            cursor: "not-allowed",
            boxShadow: "none",
        },
        text: {
            fontSize: "0.95rem",
            color: colors.text,
        },
        label: {
            fontSize: "0.85rem",
            color: colors.text,
            display: "flex",
            alignItems: "center",
        },
        select: {
            marginLeft: "0.5rem",
            padding: "0.35rem 0.75rem",
            borderRadius: "8px",
            border: `1px solid ${colors.borderColor}`,
            fontSize: "0.85rem",
            background: colors.inputBg,
            color: colors.text,
            cursor: "pointer",
            transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        },
    };

    const hoverEffect = (e, hover) => {
        if (!e.target.disabled) {
            e.target.style.backgroundColor = hover
                ? styles.buttonHover.backgroundColor
                : styles.button.backgroundColor;
        }
    };

    return (
        <div style={styles.container}>
            <button
                style={{
                    ...styles.button,
                    ...(page === 1 ? styles.buttonDisabled : {}),
                }}
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                onMouseEnter={(e) => hoverEffect(e, true)}
                onMouseLeave={(e) => hoverEffect(e, false)}
            >
                Prev
            </button>

            <span style={styles.text}>
        Page <strong>{page}</strong> of {totalPages}
      </span>

            <button
                style={{
                    ...styles.button,
                    ...(page === totalPages ? styles.buttonDisabled : {}),
                }}
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                onMouseEnter={(e) => hoverEffect(e, true)}
                onMouseLeave={(e) => hoverEffect(e, false)}
            >
                Next
            </button>

            <label style={styles.label}>
                Items per page:
                <select
                    style={styles.select}
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    onFocus={(e) => {
                        e.target.style.borderColor = colors.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.terColor4}`;
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = colors.borderColor;
                        e.target.style.boxShadow = "none";
                    }}
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

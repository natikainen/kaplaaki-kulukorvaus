// FormComponents.jsx — shared UI components for Kaplaaki expense form
// Exports to window: SectionCard, SectionTitle, FormField, InputEl, Checkbox, SuccessScreen, ErrorBox

function SectionCard({ theme, children, style = {} }) {
  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: theme.cardRadius,
      padding: "20px 24px",
      marginBottom: 16,
      boxShadow: theme.cardShadow,
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ theme, children }) {
  return (
    <h2 style={{
      margin: "0 0 18px",
      fontSize: theme.sectionTitleSize || "13px",
      fontWeight: 700,
      fontFamily: theme.headingFont,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: theme.sectionTitleColor,
    }}>
      {children}
    </h2>
  );
}

function FormField({ theme, label, required, error, children }) {
  return (
    <div>
      {label && (
        <label style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          color: theme.labelColor,
          marginBottom: 5,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          fontFamily: theme.bodyFont,
        }}>
          {label}{required && <span style={{ color: theme.errorText, marginLeft: 2 }}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <div style={{ fontSize: 11, color: theme.errorText, marginTop: 3, fontFamily: theme.bodyFont }}>
          {error}
        </div>
      )}
    </div>
  );
}

function InputEl({ theme, submitted, valid = true, style = {}, ...props }) {
  const hasError = submitted && !valid;
  return (
    <input
      style={{
        width: "100%",
        padding: "9px 12px",
        fontSize: 14,
        fontFamily: theme.bodyFont,
        border: `${theme.inputBorderWidth} solid ${hasError ? theme.errorText + "88" : theme.inputBorder}`,
        borderRadius: theme.borderRadius,
        background: hasError ? theme.errorBg : theme.inputBg,
        outline: "none",
        color: theme.text,
        transition: "border-color 0.2s",
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    />
  );
}

function Checkbox({ theme, checked, onChange, label, required }) {
  const activeColor = theme.checkboxColor;
  return (
    <label style={{
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      padding: "5px 0",
      cursor: "pointer",
      fontSize: 13,
      color: theme.text,
      fontFamily: theme.bodyFont,
      userSelect: "none",
    }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border: `1.5px solid ${checked ? activeColor : theme.inputBorder}`,
          background: checked ? activeColor : theme.cardBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
          cursor: "pointer",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span>{label}{required && <span style={{ color: theme.errorText, marginLeft: 2 }}>*</span>}</span>
    </label>
  );
}

function SuccessScreen({ theme, t, total, name, formType, onBack }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: theme.pageBg,
      fontFamily: theme.bodyFont,
    }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: "40px 24px" }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: theme.successIcon,
          margin: "0 auto 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{
          fontSize: 22,
          fontWeight: 700,
          fontFamily: theme.headingFont,
          color: theme.text,
          margin: "0 0 10px",
        }}>
          {t.successTitle}
        </h2>
        <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
          {t.successMsg}{" "}
          <strong style={{ color: theme.text }}>
            {formType === "estiem" ? "talous@kaplaaki.fi ja estiem@kaplaaki.fi" : "talous@kaplaaki.fi"}
          </strong>
        </p>
        <div style={{
          background: theme.accentLight,
          border: `1px solid ${theme.accentBorder}`,
          padding: "14px 18px",
          borderRadius: theme.borderRadius,
          fontSize: 13,
          color: theme.text,
          lineHeight: 1.7,
          textAlign: "left",
        }}>
          <div><strong>{t.successTotal}:</strong> {total.toFixed(2)} EUR</div>
          <div><strong>{t.successApplicant}:</strong> {name}</div>
        </div>
        <button
          onClick={onBack}
          style={{
            marginTop: 20,
            padding: "10px 24px",
            background: "none",
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: theme.borderRadius,
            cursor: "pointer",
            fontSize: 13,
            color: theme.textMuted,
            fontFamily: theme.bodyFont,
          }}
        >
          {t.successBack}
        </button>
      </div>
    </div>
  );
}

function ErrorBox({ theme, t, errors }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div style={{
      background: theme.errorBg,
      border: `1px solid ${theme.errorBorder}`,
      borderRadius: theme.borderRadius,
      padding: "14px 18px",
      marginBottom: 16,
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: theme.errorText,
        marginBottom: 8,
        fontFamily: theme.bodyFont,
      }}>
        {t.validErrors}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {errors.map((e, i) => (
          <div key={i} style={{
            fontSize: 12,
            color: theme.errorText,
            display: "flex",
            gap: 6,
            fontFamily: theme.bodyFont,
          }}>
            <span style={{ flexShrink: 0 }}>·</span>
            <span>{e}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  SectionCard,
  SectionTitle,
  FormField,
  InputEl,
  Checkbox,
  SuccessScreen,
  ErrorBox,
});

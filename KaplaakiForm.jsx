// KaplaakiForm.jsx — main Kaplaaki expense form app
// Depends on: THEMES, I18N, validateIBAN, validatePhone, validateEmail,
//   formatIBAN, formatPhone, parseAmount (globals from plain-JS files),
//   SectionCard, SectionTitle, FormField, InputEl, Checkbox, SuccessScreen, ErrorBox (FormComponents.jsx),
//   useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakRadio (tweaks-panel.jsx)

const { useState } = React;
const ESTIEM_MAX_TRAVEL = 250;
const ESTIEM_PARTICIPATION_MAX = 50;
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ "theme": "Classic Navy", "language": "fi" }/*EDITMODE-END*/;
const initialRow = () => ({ date: "", description: "", amount: "" });

function LangToggle({ theme: th, lang, onToggle, dark }) {
  const isFi = lang === "fi";
  const base = {
    display: "flex", alignItems: "center", gap: 0,
    borderRadius: 20, overflow: "hidden",
    border: dark ? "1px solid rgba(255,255,255,0.25)" : `1px solid ${th.inputBorder}`,
    flexShrink: 0,
  };
  const btn = (active, label) => ({
    padding: "5px 11px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
    fontFamily: th.bodyFont, letterSpacing: "0.03em", transition: "all 0.15s",
    background: active
      ? (dark ? "rgba(255,255,255,0.22)" : th.primary)
      : "transparent",
    color: active
      ? (dark ? "#fff" : th.headerText || "#fff")
      : (dark ? "rgba(255,255,255,0.5)" : th.textMuted),
  });
  return (
    <div style={base}>
      <button style={btn(isFi,  "FI")} onClick={onToggle}>FI</button>
      <button style={btn(!isFi, "EN")} onClick={onToggle}>EN</button>
    </div>
  );
}

function KaplaakiApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const th = THEMES[t.theme] || THEMES["Classic Navy"];
  const L  = I18N[t.language] || I18N["fi"];

  // ── Form state ──
  const [formType, setFormType] = useState("normal");
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [email,    setEmail]    = useState("");
  const [bank,     setBank]     = useState("");
  const [iban,     setIban]     = useState("");
  const [rows,     setRows]     = useState([initialRow(), initialRow(), initialRow(), initialRow()]);
  const [tapahtuma,      setTapahtuma]      = useState("");
  const [attachmentDesc, setAttachmentDesc] = useState("");
  const [attachedFiles,  setAttachedFiles]  = useState([]);
  const [location,   setLocation]   = useState("");
  const [signature,  setSignature]  = useState("");
  const [dateField,  setDateField]  = useState(new Date().toLocaleDateString("fi-FI"));

  // ── Km state ──
  const [includeKm,            setIncludeKm]            = useState(false);
  const [kmFrom,               setKmFrom]               = useState("");
  const [kmTo,                 setKmTo]                 = useState("");
  const [kmPurpose,            setKmPurpose]            = useState("");
  const [kmDistance,           setKmDistance]           = useState("");
  const [kmConsumption,        setKmConsumption]        = useState("6");
  const [kmFuelPrice,          setKmFuelPrice]          = useState("");
  const [kmFuelReceiptAttached,setKmFuelReceiptAttached]= useState(false);

  // ── ESTIEM state ──
  const [estiemEventType,  setEstiemEventType]  = useState("academic");
  const [hasCompensation,  setHasCompensation]  = useState(false);
  const [hasCertificate,   setHasCertificate]   = useState(false);

  // ── Submission state ──
  const [receiptsAttached, setReceiptsAttached] = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors,      setErrors]      = useState([]);
  const [generating,  setGenerating]  = useState(false);

  // ── Computed ──
  const total = rows.reduce((sum, r) => sum + parseAmount(r.amount), 0);
  const kmCompensation = (() => {
    const km   = parseFloat(kmDistance);
    const cons = parseFloat((kmConsumption || "").replace(",", "."));
    const fuel = parseFloat((kmFuelPrice   || "").replace(",", "."));
    return km > 0 && cons > 0 && fuel > 0 ? km * (cons / 100) * fuel : 0;
  })();
  const displayTotal = total + (includeKm ? kmCompensation : 0);

  // ── Handlers ──
  const updateRow = (index, field, value) => setRows(prev => {
    const next = [...prev];
    next[index] = { ...next[index], [field]: value };
    return next;
  });
  const addRow    = () => setRows(prev => [...prev, initialRow()]);
  const removeRow = (i) => { if (rows.length > 1) setRows(prev => prev.filter((_, idx) => idx !== i)); };

  const getEstiemInfo = () => {
    if (formType !== "estiem") return null;
    if (estiemEventType === "representation") return { text: L.estiemRepresentationInfo };
    const rate = estiemEventType === "academic" ? 0.7 : 0.5;
    return { text: L.estiemInfo(rate, ESTIEM_MAX_TRAVEL, ESTIEM_PARTICIPATION_MAX) };
  };

  const validate = () => {
    const errs = [];
    if (!name.trim()) errs.push(L.errName);
    if (!phone.trim() || !validatePhone(phone)) errs.push(L.errPhone);
    if (!email.trim() || !validateEmail(email)) errs.push(L.errEmail);
    if (!bank.trim()) errs.push(L.errBank);
    if (!iban.trim() || !validateIBAN(iban)) errs.push(L.errIban);
    const filledRows = rows.filter(r => r.date || r.description || r.amount);
    if (filledRows.length === 0 && !includeKm) errs.push(L.errNoRows);
    filledRows.forEach((r, i) => {
      if (!r.date) errs.push(L.errRowDate(i + 1));
      if (!r.description) errs.push(L.errRowDesc(i + 1));
      if (!r.amount || parseAmount(r.amount) <= 0) errs.push(L.errRowAmt(i + 1));
    });
    if (!receiptsAttached) errs.push(L.errReceipts);
    if (includeKm) {
      if (!kmFrom.trim()) errs.push(L.errKmFrom);
      if (!kmTo.trim()) errs.push(L.errKmTo);
      if (!kmPurpose.trim()) errs.push(L.errKmPurpose);
      if (!kmDistance || parseFloat(kmDistance) < 1) errs.push(L.errKmDist);
      if (!kmConsumption || parseFloat(kmConsumption.replace(",", ".")) <= 0) errs.push(L.errKmCons);
      if (!kmFuelPrice || parseFloat(kmFuelPrice.replace(",", ".")) <= 0) errs.push(L.errKmFuel);
      if (!kmFuelReceiptAttached) errs.push(L.errKmFuelReceipt);
    }
    if (!attachmentDesc.trim()) errs.push(L.errAttachDesc);
    if (!location.trim()) errs.push(L.errPlace);
    if (!signature.trim()) errs.push(L.errSignature);
    if (formType === "estiem") {
      if (!tapahtuma.trim()) errs.push(L.errEstiemEvent);
      if (!hasCompensation) errs.push(L.errEstiemComp);
      if (!hasCertificate) errs.push(L.errEstiemCert);
    }
    return errs;
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    setGenerating(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <SuccessScreen theme={th} t={L} total={displayTotal} name={name} formType={formType}
        onBack={() => { setShowSuccess(false); setSubmitted(false); }} />
    );
  }

  const estiemInfo = getEstiemInfo();
  const colHdr = { fontSize: 11, fontWeight: 600, color: th.textLight, fontFamily: th.bodyFont, letterSpacing: "0.04em" };

  return (
    <div style={{ minHeight: "100vh", background: th.pageBg, fontFamily: th.bodyFont, color: th.text }}>

      {/* ── HEADER ── */}
      {th.headerStyle === "light" ? (
        <div style={{ background: th.headerBg, borderBottom: `1px solid ${th.cardBorder}`, padding: "14px 28px", display: "flex", alignItems: "center", gap: 14 }}>
          <img src="kaplaaki-logo.png" alt="Kaplaaki" style={{ width: 64, height: 64 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: th.text, fontFamily: th.headingFont, letterSpacing: "-0.01em" }}>{L.appTitle}</div>
            <div style={{ fontSize: 11, color: th.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{L.appSubtitle}</div>
          </div>
          <LangToggle theme={th} lang={t.language} onToggle={() => setTweak("language", t.language === "fi" ? "en" : "fi")} dark={false} />
        </div>
      ) : (
        <div style={{ background: th.headerBg, color: th.headerText, padding: "18px 28px", display: "flex", alignItems: "center" }}>
          <div style={{ width: 120, height: 120, background: "#fff", borderRadius: "50%", flexShrink: 0, overflow: "hidden", boxShadow: "0 0 0 2px rgba(255,255,255,0.25)", margin: "-8px 0" }}>
            <img src="kaplaaki-logo.png" alt="Kaplaaki" style={{ width: "100%", height: "100%", display: "block" }} />
          </div>
          <div style={{ marginLeft: 16 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: th.headingFont, letterSpacing: "0.02em" }}>{L.appTitle}</h1>
            <p style={{ margin: "3px 0 0", fontSize: 11, opacity: 0.65, letterSpacing: "0.07em", textTransform: "uppercase" }}>{L.appSubtitle}</p>
          </div>
          <div style={{ flex: 1 }} />
          <LangToggle theme={th} lang={t.language} onToggle={() => setTweak("language", t.language === "fi" ? "en" : "fi")} dark={true} />
        </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* ── FORM TYPE ── */}
        <SectionCard theme={th} style={{ display: "flex", gap: 8, padding: "10px 12px" }}>
          {[["normal", L.formTypeNormal], ["estiem", L.formTypeEstiem]].map(([val, label]) => (
            <button key={val} onClick={() => setFormType(val)} style={{
              flex: 1, padding: "9px 16px", borderRadius: th.borderRadius, border: "none",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
              background: formType === val ? th.segmentActiveBg : th.segmentInactiveBg,
              color: formType === val ? th.segmentActiveColor : th.segmentInactiveColor,
              fontFamily: th.bodyFont,
            }}>{label}</button>
          ))}
        </SectionCard>

        {/* ── ESTIEM BANNER ── */}
        {formType === "estiem" && estiemInfo && (
          <div style={{ background: th.estiemInfoBg, border: `1px solid ${th.estiemInfoBorder}`, borderRadius: th.borderRadius, padding: "11px 16px", marginBottom: 16, fontSize: 13, color: th.estiemInfoText, lineHeight: 1.5 }}>
            <strong style={{ fontSize: 12 }}>{L.estiemBanner}</strong>{" "}{estiemInfo.text}
          </div>
        )}

        {/* ── APPLICANT CARD ── */}
        <SectionCard theme={th}>
          <SectionTitle theme={th}>{L.sectionApplicant}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormField theme={th} label={L.applicantName} required>
              <InputEl theme={th} submitted={submitted} valid={!!name.trim()} value={name}
                onChange={e => setName(e.target.value)} placeholder={L.applicantNamePlaceholder} />
            </FormField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormField theme={th} label={L.phone} required>
                <InputEl theme={th} submitted={submitted} valid={!phone || validatePhone(phone)} value={phone}
                  onChange={e => setPhone(formatPhone(e.target.value))} placeholder={L.phonePlaceholder} />
              </FormField>
              <FormField theme={th} label={L.email} required>
                <InputEl theme={th} submitted={submitted} valid={!email || validateEmail(email)} value={email}
                  onChange={e => setEmail(e.target.value)} placeholder={L.emailPlaceholder} type="email" />
              </FormField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12 }}>
              <FormField theme={th} label={L.bank} required>
                <InputEl theme={th} submitted={submitted} valid={!!bank.trim()} value={bank}
                  onChange={e => setBank(e.target.value)} placeholder={L.bankPlaceholder} />
              </FormField>
              <FormField theme={th} label={L.iban} required error={iban && !validateIBAN(iban) ? L.ibanError : null}>
                <InputEl theme={th} submitted={submitted} valid={!iban || validateIBAN(iban)} value={iban}
                  onChange={e => setIban(formatIBAN(e.target.value))} placeholder={L.ibanPlaceholder} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        {/* ── ITEMIZATION CARD ── */}
        <SectionCard theme={th}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ fontSize: th.sectionTitleSize || "13px", fontWeight: 700, fontFamily: th.headingFont, textTransform: "uppercase", letterSpacing: "0.06em", color: th.sectionTitleColor, whiteSpace: "nowrap" }}>
              {L.sectionItemization}
            </span>
            <InputEl theme={th} value={tapahtuma} onChange={e => setTapahtuma(e.target.value)}
              placeholder={L.eventPlaceholder} style={{ fontSize: 13 }} />
          </div>

          {/* ESTIEM event type */}
          {formType === "estiem" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: th.labelColor, marginBottom: 6, letterSpacing: "0.03em", textTransform: "uppercase", fontFamily: th.bodyFont }}>
                {L.estiemEventTypeLabel}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["academic", L.estiemAcademic], ["other", L.estiemOther], ["representation", L.estiemRepresentation]].map(([val, label]) => (
                  <button key={val} onClick={() => setEstiemEventType(val)} style={{
                    padding: "6px 14px", borderRadius: th.borderRadius, fontSize: 12, cursor: "pointer",
                    fontWeight: 500, fontFamily: th.bodyFont,
                    border: `1px solid ${estiemEventType === val ? th.primary : th.inputBorder}`,
                    background: estiemEventType === val ? th.accentLight : th.inputBg,
                    color: estiemEventType === val ? th.accentText : th.textMuted,
                  }}>{label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px 28px", gap: 8, marginBottom: 6 }}>
            <span style={colHdr}>{L.colDate}</span>
            <span style={colHdr}>{L.colDesc}</span>
            <span style={colHdr}>{L.colAmount}</span>
            <span />
          </div>

          {/* Expense rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {rows.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px 28px", gap: 8, alignItems: "center" }}>
                <InputEl theme={th} value={row.date} onChange={e => updateRow(i, "date", e.target.value)}
                  placeholder="1.1.2026" style={{ padding: "7px 10px", fontSize: 13 }} />
                <InputEl theme={th} value={row.description} onChange={e => updateRow(i, "description", e.target.value)}
                  placeholder="…" style={{ padding: "7px 10px", fontSize: 13 }} />
                <InputEl theme={th} value={row.amount} onChange={e => updateRow(i, "amount", e.target.value)}
                  placeholder="0,00" style={{ padding: "7px 10px", fontSize: 13, textAlign: "right" }} />
                <button onClick={() => removeRow(i)} disabled={rows.length <= 1} style={{
                  background: "none", border: "none", cursor: rows.length <= 1 ? "default" : "pointer",
                  opacity: rows.length <= 1 ? 0.15 : 0.4, fontSize: 18, color: th.textMuted, padding: 0, lineHeight: 1,
                }}>×</button>
              </div>
            ))}
          </div>

          <button onClick={addRow} style={{
            marginTop: 10, width: "100%", padding: "7px 0", background: "none",
            border: `1px dashed ${th.inputBorder}`, borderRadius: th.borderRadius,
            cursor: "pointer", fontSize: 12, color: th.textMuted, fontFamily: th.bodyFont,
          }}>{L.addRow}</button>

          {/* Subtotal */}
          {total > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${th.cardBorder}` }}>
              <span style={{ fontSize: 13, color: th.textMuted }}>{L.totalExpenses}</span>
              <div style={{ background: th.totalBg, padding: "5px 14px", borderRadius: th.borderRadius, fontSize: 15, fontWeight: 700, minWidth: 90, textAlign: "right", fontVariantNumeric: "tabular-nums", color: th.text }}>
                {total.toFixed(2)} <span style={{ fontSize: 11, fontWeight: 500, color: th.textMuted }}>EUR</span>
              </div>
            </div>
          )}

          {/* ── KM TOGGLE + SECTION ── */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${th.cardBorder}` }}>
            <Checkbox theme={th} checked={includeKm} onChange={setIncludeKm} label={L.kmToggle} />
            {includeKm && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <FormField theme={th} label={L.kmFrom} required>
                    <InputEl theme={th} submitted={submitted} valid={!!kmFrom.trim()} value={kmFrom}
                      onChange={e => setKmFrom(e.target.value)} placeholder={L.kmFromPlaceholder} />
                  </FormField>
                  <FormField theme={th} label={L.kmTo} required>
                    <InputEl theme={th} submitted={submitted} valid={!!kmTo.trim()} value={kmTo}
                      onChange={e => setKmTo(e.target.value)} placeholder={L.kmToPlaceholder} />
                  </FormField>
                </div>
                <FormField theme={th} label={L.kmPurpose} required>
                  <InputEl theme={th} submitted={submitted} valid={!!kmPurpose.trim()} value={kmPurpose}
                    onChange={e => setKmPurpose(e.target.value)} placeholder={L.kmPurposePlaceholder} />
                </FormField>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <FormField theme={th} label={L.kmDistance} required>
                    <InputEl theme={th} submitted={submitted} valid={!kmDistance || parseFloat(kmDistance) >= 1}
                      value={kmDistance} onChange={e => setKmDistance(e.target.value)} placeholder="0" type="number" min="1" />
                  </FormField>
                  <FormField theme={th} label={L.kmConsumption} required>
                    <InputEl theme={th} value={kmConsumption} onChange={e => setKmConsumption(e.target.value)} placeholder="6" />
                  </FormField>
                  <FormField theme={th} label={L.kmFuelPrice} required>
                    <InputEl theme={th} value={kmFuelPrice} onChange={e => setKmFuelPrice(e.target.value)} placeholder="0,00" />
                  </FormField>
                </div>
                <div style={{ background: th.kmDisplayBg, border: `1px solid ${th.kmDisplayBorder}`, borderRadius: th.borderRadius, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: th.kmDisplayText, marginBottom: 5, opacity: 0.8 }}>
                    {parseFloat(kmDistance) || 0} km × {parseFloat((kmConsumption || "0").replace(",", ".")).toFixed(1)} L/100 km × {parseFloat((kmFuelPrice || "0").replace(",", ".")).toFixed(2)} €/L
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: th.kmDisplayText }}>{L.kmCompensationLabel}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: th.primary, fontVariantNumeric: "tabular-nums" }}>
                      {kmCompensation.toFixed(2)} <span style={{ fontSize: 11, fontWeight: 500, color: th.textMuted }}>EUR</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grand total */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 12, borderTop: `2px solid ${th.primary}` }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{L.grandTotal}</span>
            <div style={{ background: th.accentLight, border: `1px solid ${th.accentBorder}`, padding: "8px 16px", borderRadius: th.borderRadius, fontSize: 18, fontWeight: 700, minWidth: 100, textAlign: "right", fontVariantNumeric: "tabular-nums", color: th.primary }}>
              {displayTotal.toFixed(2)} <span style={{ fontSize: 12, fontWeight: 500, color: th.textMuted }}>EUR</span>
            </div>
          </div>
        </SectionCard>

        {/* ── ATTACHMENTS CARD ── */}
        <SectionCard theme={th}>
          <SectionTitle theme={th}>{L.sectionAttachments}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormField theme={th} label={L.attachDesc} required>
              <InputEl theme={th} submitted={submitted} valid={!!attachmentDesc.trim()} value={attachmentDesc}
                onChange={e => setAttachmentDesc(e.target.value)} placeholder={L.attachDescPlaceholder} />
            </FormField>
            <FormField theme={th} label={L.attachFilesLabel}>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: `1.5px dashed ${th.inputBorder}`, borderRadius: th.borderRadius, padding: "13px 16px", cursor: "pointer", fontSize: 13, color: th.textMuted, background: th.inputBg, fontFamily: th.bodyFont }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {L.attachFiles}
                <input type="file" multiple accept="image/*,.pdf"
                  onChange={e => setAttachedFiles(Array.from(e.target.files))} style={{ display: "none" }} />
              </label>
              {attachedFiles.length > 0 && (
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {attachedFiles.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: th.totalBg, borderRadius: th.borderRadius, padding: "6px 10px", fontSize: 12, color: th.text }}>
                      <span>{f.name}</span>
                      <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: th.textMuted, fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </FormField>
            <div style={{ background: th.checklistBg, borderRadius: th.borderRadius, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, marginBottom: 8, letterSpacing: "0.03em", textTransform: "uppercase", fontFamily: th.bodyFont }}>
                {L.checklistTitle}
              </div>
              <Checkbox theme={th} checked={receiptsAttached} onChange={setReceiptsAttached} label={L.checkReceipts} required />
              {includeKm && <Checkbox theme={th} checked={kmFuelReceiptAttached} onChange={setKmFuelReceiptAttached} label={L.checkFuelReceipt} required />}
              {formType === "estiem" && (
                <React.Fragment>
                  <Checkbox theme={th} checked={hasCompensation} onChange={setHasCompensation} label={L.checkCompensation} required />
                  <Checkbox theme={th} checked={hasCertificate} onChange={setHasCertificate} label={L.checkCertificate} required />
                </React.Fragment>
              )}
            </div>
          </div>
        </SectionCard>

        {/* ── SIGNATURE CARD ── */}
        <SectionCard theme={th}>
          <SectionTitle theme={th}>{L.sectionSignature}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField theme={th} label={L.place} required>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 108px", gap: 8 }}>
                <InputEl theme={th} submitted={submitted} valid={!!location.trim()} value={location}
                  onChange={e => setLocation(e.target.value)} placeholder={L.placePlaceholder} />
                <InputEl theme={th} value={dateField} onChange={e => setDateField(e.target.value)} />
              </div>
            </FormField>
            <FormField theme={th} label={L.signature} required>
              <InputEl theme={th} submitted={submitted} valid={!!signature.trim()} value={signature}
                onChange={e => setSignature(e.target.value)} placeholder={L.signaturePlaceholder} />
            </FormField>
          </div>
        </SectionCard>

        {/* ── VALIDATION ERRORS ── */}
        {submitted && <ErrorBox theme={th} t={L} errors={errors} />}

        {/* ── SUBMIT BUTTON ── */}
        <button onClick={handleSubmit} disabled={generating} style={{
          width: "100%", padding: "14px 24px",
          background: generating ? th.textLight : th.primary,
          color: th.headerText || "#fff",
          border: "none", borderRadius: th.borderRadius,
          fontSize: 15, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer",
          letterSpacing: "0.02em", transition: "opacity 0.2s",
          fontFamily: th.bodyFont,
        }}>
          {generating ? L.generating : L.submitBtn}
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: th.textLight, marginTop: 14 }}>
          {L.footer}
        </p>
      </div>

      {/* ── TWEAKS PANEL ── */}
      <TweaksPanel>
        <TweakSection label="Visual Direction" />
        <TweakSelect label="Theme" value={t.theme}
          options={["Classic Navy", "Nordic Minimal", "Guild Heritage"]}
          onChange={v => setTweak("theme", v)} />
        <TweakSection label="Language" />
        <TweakRadio label="Language" value={t.language}
          options={["fi", "en"]}
          onChange={v => setTweak("language", v)} />
      </TweaksPanel>
    </div>
  );
}

Object.assign(window, { KaplaakiApp });

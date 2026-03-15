import { useState } from "react";

const WEB3FORMS_KEY = "a0fa1d10-f7ef-4d52-9fd7-7804b9c87579";

const KAPLAAKI_NAVY = "#001F3F";
const KAPLAAKI_LOGO = "data:image/png;base64,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";

const ESTIEM_MAX_TRAVEL = 250;
const ESTIEM_PARTICIPATION_MAX = 50;
const KM_RATE = 0.23;

function validateIBAN(iban) {
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  if (!/^FI\d{16}$/.test(cleaned) && !/^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(cleaned)) return false;
  return true;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[\d\s+\-()]{7,20}$/.test(phone);
}

function parseAmount(str) {
  if (!str) return 0;
  const cleaned = str.replace(",", ".").trim();
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

const initialRow = () => ({ date: "", description: "", amount: "" });

export default function KulukorvausForm() {
  const [formType, setFormType] = useState("normal"); // normal | estiem
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bank, setBank] = useState("");
  const [iban, setIban] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [rows, setRows] = useState([initialRow(), initialRow(), initialRow(), initialRow()]);
  const [attachmentDesc, setAttachmentDesc] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [location, setLocation] = useState("");
  const [signature, setSignature] = useState("");
  const [dateField, setDateField] = useState(new Date().toLocaleDateString("fi-FI"));

  // ESTIEM specific
  const [estiemEventType, setEstiemEventType] = useState("academic"); // academic | other | representation
  const [hasReport, setHasReport] = useState(false);
  const [hasCompensation, setHasCompensation] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(false);

  // Checklist
  const [receiptsAttached, setReceiptsAttached] = useState(false);

  // Validation state
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState([]);

  const total = rows.reduce((sum, r) => sum + parseAmount(r.amount), 0);

  const updateRow = (index, field, value) => {
    setRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addRow = () => setRows(prev => [...prev, initialRow()]);
  const removeRow = (i) => {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter((_, idx) => idx !== i));
  };

  const validate = () => {
    const errs = [];
    if (!name.trim()) errs.push("Nimi puuttuu");
    if (!phone.trim() || !validatePhone(phone)) errs.push("Puhelinnumero puuttuu tai on virheellinen");
    if (!email.trim() || !validateEmail(email)) errs.push("Sähköpostiosoite puuttuu tai on virheellinen");
    if (!bank.trim()) errs.push("Pankin nimi / BIC puuttuu");
    if (!iban.trim() || !validateIBAN(iban)) errs.push("IBAN puuttuu tai on väärässä muodossa (esim. FI21 1234 5600 0007 85)");

    const filledRows = rows.filter(r => r.date || r.description || r.amount);
    if (filledRows.length === 0) errs.push("Vähintään yksi erittelyrivi pitää täyttää");

    filledRows.forEach((r, i) => {
      if (!r.date) errs.push(`Rivi ${i + 1}: päivämäärä puuttuu`);
      if (!r.description) errs.push(`Rivi ${i + 1}: selitys puuttuu`);
      if (!r.amount || parseAmount(r.amount) <= 0) errs.push(`Rivi ${i + 1}: summa puuttuu tai on 0`);
    });

    if (total <= 0) errs.push("Kokonaissumma on 0 €");
    if (!receiptsAttached) errs.push("Vahvista että liitteet ovat mukana");
    if (!attachmentDesc.trim()) errs.push("Liitteiden kuvaus puuttuu");
    if (!location.trim()) errs.push("Paikka puuttuu");
    if (!signature.trim()) errs.push("Allekirjoitus puuttuu");

    if (formType === "estiem") {
      if (!eventTitle.trim()) errs.push("ESTIEM-tapahtuman nimi puuttuu");
      if (!hasReport) errs.push("Matkaraportti vaaditaan ESTIEM-korvaukseen");
      if (!hasCompensation) errs.push("Päästökompensaatio vaaditaan ESTIEM-korvaukseen");
      if (!hasCertificate) errs.push("Osallistumistodistus vaaditaan ESTIEM-korvaukseen");
    }

    return errs;
  };

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const handleSubmit = async () => {
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;

    const filledRows = rows.filter(r => r.date || r.description || r.amount);
    const rowsText = filledRows
      .map(r => `${r.date}  ${r.description}  ${parseAmount(r.amount).toFixed(2)} €`)
      .join("\n");

    const cc = formType === "estiem"
      ? `estiem@kaplaaki.fi,${email}`
      : email;

    const formData = new FormData();
    formData.append("access_key", WEB3FORMS_KEY);
    formData.append("subject", `Kulukorvausanomus — ${name}${formType === "estiem" ? ` (ESTIEM: ${eventTitle})` : ""}`);
    formData.append("from_name", name);
    formData.append("replyto", email);
    formData.append("cc", cc);
    formData.append("Hakija", name);
    formData.append("Puhelinnumero", phone);
    formData.append("Sähköposti", email);
    formData.append("Pankki / BIC", bank);
    formData.append("IBAN", iban);
    formData.append("Lomaketyyppi", formType === "estiem" ? "ESTIEM-matka" : "Normaali kulukorvaus");
    if (formType === "estiem") formData.append("ESTIEM-tapahtuma", eventTitle);
    formData.append("Erittely", rowsText);
    formData.append("Yhteensä (EUR)", total.toFixed(2));
    formData.append("Liitteiden kuvaus", attachmentDesc);
    formData.append("Paikka", location);
    formData.append("Päivämäärä", dateField);
    formData.append("Allekirjoitus", signature);
    attachedFiles.forEach(f => formData.append("liitteet", f, f.name));

    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
      } else {
        setSendError("Lähetys epäonnistui: " + (data.message || "tuntematon virhe"));
      }
    } catch (err) {
      setSendError("Sähköpostin lähetys epäonnistui. Tarkista verkkoyhteys.");
    } finally {
      setSending(false);
    }
  };

  // ESTIEM calculation
  const getEstiemInfo = () => {
    if (formType !== "estiem") return null;
    if (estiemEventType === "representation") return { text: "Edustustapahtuma — kaikki kulut korvataan", maxTotal: null };
    const travelRate = estiemEventType === "academic" ? 0.7 : 0.5;
    return {
      text: `Matkakuluista korvataan ${travelRate * 100}% (max ${ESTIEM_MAX_TRAVEL} €), osallistumismaksu max ${ESTIEM_PARTICIPATION_MAX} €`,
      maxTotal: ESTIEM_MAX_TRAVEL + ESTIEM_PARTICIPATION_MAX,
      travelRate,
    };
  };

  if (showSuccess) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf8", fontFamily: "'Roboto Slab', serif" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#22c55e", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Kulukorvaus valmis lähetettäväksi!</h2>
          <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            Anomus on tarkistettu ja valmis. {formType === "estiem"
              ? "Lähetä osoitteisiin talous@kaplaaki.fi JA estiem@kaplaaki.fi"
              : "Lähetä osoitteeseen talous@kaplaaki.fi"}
          </p>
          <p style={{ background: "#f0f4f8", padding: "12px 16px", borderRadius: 8, fontSize: 13, color: "#444", lineHeight: 1.5 }}>
            <strong>Yhteensä:</strong> {total.toFixed(2)} EUR<br />
            <strong>Hakija:</strong> {name}
          </p>
          <button onClick={() => { setShowSuccess(false); setSubmitted(false); }} style={{ marginTop: 20, padding: "10px 24px", background: "none", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#666" }}>
            ← Takaisin lomakkeelle
          </button>
        </div>
      </div>
    );
  }

  const estiemInfo = getEstiemInfo();
  const hasErrors = submitted && errors.length > 0;

  const inputStyle = (fieldValid = true) => ({
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    border: `1.5px solid ${submitted && !fieldValid ? "#ef4444" : "#ddd"}`,
    borderRadius: 6,
    background: submitted && !fieldValid ? "#fef2f2" : "#fafafa",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  });

  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4, letterSpacing: "0.02em" };

  const sectionStyle = { marginBottom: 28 };
  const cardStyle = { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "20px 24px", marginBottom: 16 };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f0", fontFamily: "'Roboto Slab', serif", color: "#1a1a1a" }}>
      {/* Header */}
      <div style={{ background: KAPLAAKI_NAVY, color: "#fff", padding: "16px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src={KAPLAAKI_LOGO} alt="Kaplaaki ry" style={{ width: 48, height: 48, filter: "brightness(0) invert(1)" }} />
              <div>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>KAPLAAKI RY</h1>
                <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Kulukorvausanomus</p>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: 11, opacity: 0.5 }}>
              Laserkatu 10<br/>53850 Lappeenranta
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* Form type selector */}
        <div style={{ ...cardStyle, display: "flex", gap: 8, padding: "12px 16px" }}>
          {[["normal", "Normaali kulukorvaus"], ["estiem", "ESTIEM-matka"]].map(([val, label]) => (
            <button key={val} onClick={() => setFormType(val)} style={{
              flex: 1, padding: "10px 16px", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              background: formType === val ? KAPLAAKI_NAVY : "#f0f0f0", color: formType === val ? "#fff" : "#666",
            }}>{label}</button>
          ))}
        </div>

        {/* ESTIEM info banner */}
        {formType === "estiem" && estiemInfo && (
          <div style={{ background: "#eef4ff", border: "1px solid #c5d8f6", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#2c5282" }}>
            <strong style={{ fontSize: 12 }}>ESTIEM-korvaus:</strong> {estiemInfo.text}
          </div>
        )}

        {/* Hakijan tiedot */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: KAPLAAKI_NAVY }}>Hakijan tiedot</h2>

          <div style={sectionStyle}>
            <label style={labelStyle}>Korvauksen hakijan nimi *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Etunimi Sukunimi" style={inputStyle(!!name.trim())} />

          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, ...sectionStyle }}>
            <div>
              <label style={labelStyle}>Puhelinnumero *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="045 123 4567" style={inputStyle(!phone || validatePhone(phone))} />
            </div>
            <div>
              <label style={labelStyle}>Sähköposti *</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="nimi@email.fi" type="email" style={inputStyle(!email || validateEmail(email))} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Pankki / BIC *</label>
              <input value={bank} onChange={e => setBank(e.target.value)} placeholder="NDEAFIHH" style={inputStyle(!!bank.trim())} />
            </div>
            <div>
              <label style={labelStyle}>IBAN *</label>
              <input value={iban} onChange={e => setIban(e.target.value)} placeholder="FI21 1234 5600 0007 85" style={inputStyle(!iban || validateIBAN(iban))} />
              {iban && !validateIBAN(iban) && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>IBAN-muoto virheellinen</div>}
            </div>
          </div>
        </div>

        {/* Erittely */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: KAPLAAKI_NAVY }}>Erittely</h2>
            {formType === "estiem" && (
              <input value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="Tapahtuman nimi (esim. Europe 3D Athens)" style={{ ...inputStyle(!!eventTitle.trim()), width: 280, fontSize: 13 }} />
            )}
          </div>

          {formType === "estiem" && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Tapahtuman tyyppi</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[["academic", "Akateeminen"], ["other", "Muu"], ["representation", "Edustustapahtuma"]].map(([val, label]) => (
                  <button key={val} onClick={() => setEstiemEventType(val)} style={{
                    padding: "6px 14px", borderRadius: 5, border: "1px solid", fontSize: 12, cursor: "pointer", fontWeight: 500,
                    borderColor: estiemEventType === val ? "#2c5282" : "#ddd",
                    background: estiemEventType === val ? "#eef4ff" : "#fff",
                    color: estiemEventType === val ? "#2c5282" : "#888",
                  }}>{label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px 28px", gap: 8, marginBottom: 6, padding: "0 2px" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#999" }}>PVM</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#999" }}>SELITYS</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#999" }}>SUMMA (€)</span>
            <span></span>
          </div>

          {rows.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px 28px", gap: 8, marginBottom: 6, alignItems: "center" }}>
              <input value={row.date} onChange={e => updateRow(i, "date", e.target.value)} placeholder="1.1.2026" style={{ ...inputStyle(), padding: "8px 10px", fontSize: 13 }} />
              <input value={row.description} onChange={e => updateRow(i, "description", e.target.value)} placeholder="Selitys" style={{ ...inputStyle(), padding: "8px 10px", fontSize: 13 }} />
              <input value={row.amount} onChange={e => updateRow(i, "amount", e.target.value)} placeholder="0,00" style={{ ...inputStyle(), padding: "8px 10px", fontSize: 13, textAlign: "right" }} />
              <button onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: rows.length <= 1 ? "default" : "pointer", opacity: rows.length <= 1 ? 0.2 : 0.4, fontSize: 16, color: "#999", padding: 0 }} disabled={rows.length <= 1}>×</button>
            </div>
          ))}

          <button onClick={addRow} style={{ marginTop: 8, padding: "6px 14px", background: "none", border: "1px dashed #ccc", borderRadius: 5, cursor: "pointer", fontSize: 12, color: "#888", width: "100%" }}>
            + Lisää rivi
          </button>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 16, paddingTop: 12, borderTop: `2px solid ${KAPLAAKI_NAVY}`, gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Yhteensä</span>
            <div style={{ background: "#eef4ff", padding: "8px 16px", borderRadius: 6, fontSize: 18, fontWeight: 700, minWidth: 100, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {total.toFixed(2)} <span style={{ fontSize: 12, fontWeight: 500, color: "#666" }}>EUR</span>
            </div>
          </div>
        </div>

        {/* Liitteet & checklist */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: KAPLAAKI_NAVY }}>Liitteet</h2>

          <div style={sectionStyle}>
            <label style={labelStyle}>Liitteiden kuvaus *</label>
            <input value={attachmentDesc} onChange={e => setAttachmentDesc(e.target.value)} placeholder="esim. 1x lentokuitti, 1x tiliote, 1x osallistumistodistus" style={inputStyle(!!attachmentDesc.trim())} />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Liitteet</label>
            <label style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              border: "1.5px dashed #ccc", borderRadius: 6, padding: "14px 16px",
              cursor: "pointer", fontSize: 13, color: "#888", background: "#fafafa",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Valitse tiedostot
              <input type="file" multiple accept="image/*,.pdf" onChange={e => setAttachedFiles(Array.from(e.target.files))} style={{ display: "none" }} />
            </label>
            {attachedFiles.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {attachedFiles.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0f4f8", borderRadius: 5, padding: "6px 10px", fontSize: 12, color: "#444" }}>
                    <span>{f.name}</span>
                    <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 14, padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "#fafafa", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 10 }}>Tarkistuslista ennen lähetystä:</div>

            <Checkbox checked={receiptsAttached} onChange={setReceiptsAttached} label="Kaikki kuitit liitteenä + pankista maksutositteet" required />

            {formType === "estiem" && (
              <>
                <Checkbox checked={hasReport} onChange={setHasReport} label="Matkaraportti kirjoitettu ja liitteenä" required />
                <Checkbox checked={hasCompensation} onChange={setHasCompensation} label="Päästökompensaatio suoritettu (aircanada.chooose.today) ja kuitti liitteenä" required />
                <Checkbox checked={hasCertificate} onChange={setHasCertificate} label="ESTIEM-osallistumistodistus liitteenä (LG, nimi, maksu, tapahtuma, allekirjoitus)" required />
              </>
            )}
          </div>
        </div>

        {/* Paikka + allekirjoitus */}
        <div style={cardStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Paikka ja päivämäärä *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 8 }}>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Lappeenranta" style={inputStyle(!!location.trim())} />
                <input value={dateField} onChange={e => setDateField(e.target.value)} style={inputStyle()} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Allekirjoitus *</label>
              <input value={signature} onChange={e => setSignature(e.target.value)} placeholder="Nimikirjaimet" style={inputStyle(!!signature.trim())} />
            </div>
          </div>
        </div>

        {/* Errors */}
        {hasErrors && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", marginBottom: 6 }}>Korjaa seuraavat ennen lähetystä:</div>
            {errors.map((e, i) => (
              <div key={i} style={{ fontSize: 12, color: "#b91c1c", padding: "2px 0", display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>•</span> {e}
              </div>
            ))}
          </div>
        )}

        {/* Send error */}
        {sendError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "14px 18px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
            {sendError}
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={sending} style={{
          width: "100%", padding: "14px 24px", background: KAPLAAKI_NAVY, color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700,
          cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1,
          letterSpacing: "0.02em", transition: "transform 0.1s, opacity 0.2s",
        }}
          onMouseDown={e => { if (!sending) e.currentTarget.style.transform = "scale(0.98)"; }}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {sending ? "Lähetetään..." : formType === "estiem" ? "Tarkista ja lähetä → talous + estiem@kaplaaki.fi" : "Tarkista ja lähetä → talous@kaplaaki.fi"}
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 12 }}>
          Kaplaaki ry — Tuotantotalouden kilta — LUT-yliopisto
        </p>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label, required }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", cursor: "pointer", fontSize: 13, color: "#444" }}>
      <div onClick={() => onChange(!checked)} style={{
        width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${checked ? "#22c55e" : "#ccc"}`, flexShrink: 0, marginTop: 1,
        background: checked ? "#22c55e" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer",
      }}>
        {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <span>{label} {required && <span style={{ color: "#ef4444" }}>*</span>}</span>
    </label>
  );
}

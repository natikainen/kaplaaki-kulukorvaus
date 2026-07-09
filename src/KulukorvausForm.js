import { useState } from "react";
import { generateAndDownloadPDF } from "./generatePDF";

// ── Design tokens (Classic Navy) ────────────────────────────────────────────
const TH = {
  primary:       "#001F3F",
  pageBg:        "#F5F5F0",
  cardBg:        "#FFFFFF",
  cardBorder:    "#E8E8E8",
  cardRadius:    "10px",
  text:          "#1A1A1A",
  textMuted:     "#666666",
  textLight:     "#999999",
  labelColor:    "#555555",
  inputBg:       "#FAFAFA",
  inputBorder:   "#DDDDDD",
  borderRadius:  "8px",
  accentLight:   "#EEF4FF",
  accentBorder:  "#C5D8F6",
  accentText:    "#2C5282",
  errorBg:       "#FEF2F2",
  errorBorder:   "#FECACA",
  errorText:     "#DC2626",
  checkboxColor: "#22C55E",
  bodyFont:      "'Roboto Slab', serif",
  headingFont:   "'Roboto Slab', serif",
};

// ── i18n ────────────────────────────────────────────────────────────────────
const LABELS = {
  fi: {
    appTitle: "KAPLAAKI RY",
    appSubtitle: "Kulukorvausanomus",
    formTypeNormal: "Normaali kulukorvaus",
    formTypeEstiem: "ESTIEM-matka",
    sectionApplicant: "Hakijan tiedot",
    sectionItemization: "Erittely",
    sectionAttachments: "Liitteet",
    sectionSignature: "Paikka ja allekirjoitus",
    applicantName: "Korvauksen hakijan nimi",
    applicantNamePlaceholder: "Etunimi Sukunimi",
    phone: "Puhelinnumero",
    phonePlaceholder: "045 123 4567",
    email: "Sähköposti",
    emailPlaceholder: "nimi@email.fi",
    bank: "Pankki / BIC",
    bankPlaceholder: "NDEAFIHH",
    iban: "IBAN",
    ibanPlaceholder: "FI21 1234 5600 0007 85",
    ibanError: "IBAN-muoto virheellinen",
    eventPlaceholder: "Tapahtuman nimi",
    colDate: "PVM",
    colDesc: "SELITYS",
    colAmount: "SUMMA (€)",
    addRow: "+ Lisää rivi",
    totalExpenses: "Kulut yhteensä",
    grandTotal: "Yhteensä",
    kmToggle: "Lisää kilometrikorvaus",
    kmFrom: "Matkan lähtöpaikka",
    kmFromPlaceholder: "Lappeenranta",
    kmTo: "Matkan määränpää",
    kmToPlaceholder: "Helsinki",
    kmPurpose: "Matkan tarkoitus / selitys",
    kmPurposePlaceholder: "esim. Edustusmatka",
    kmDistance: "Ajetut kilometrit",
    kmConsumption: "Kulutus L/100km",
    kmFuelPrice: "Litrahinta €",
    kmCompensationLabel: "Kilometrikorvaus",
    attachDesc: "Liitteiden kuvaus",
    attachDescPlaceholder: "esim. 1x lentokuitti, 1x tiliote, 1x osallistumistodistus",
    attachFiles: "Valitse tiedostot",
    attachFilesLabel: "Liitteet (kuitit yhdistetään PDF:ään)",
    checklistTitle: "Tarkistuslista ennen lähetystä:",
    checkReceipts: "Kaikki kuitit liitteenä + pankista maksutositteet",
    checkFuelReceipt: "Tankkauskuitti liitteenä (kilometrikorvaus)",
    checkCompensation: "Päästökompensaatio suoritettu ja kuitti liitteenä",
    checkCertificate: "ESTIEM-tapahtuman osallistumistodistus liitteenä",
    place: "Paikka ja päivämäärä",
    placePlaceholder: "Lappeenranta",
    signature: "Allekirjoitus",
    signaturePlaceholder: "Nimikirjaimet",
    submitBtn: "Luo PDF-tiedosto",
    generating: "Luodaan PDF...",
    footer: "Tuotantotalouden kilta Kaplaaki ry",
    validErrors: "Korjaa seuraavat ennen lähetystä:",
    errName: "Nimi puuttuu",
    errPhone: "Puhelinnumero puuttuu tai on virheellinen",
    errEmail: "Sähköpostiosoite puuttuu tai on virheellinen",
    errBank: "Pankin nimi / BIC puuttuu",
    errIban: "IBAN puuttuu tai on väärässä muodossa (esim. FI21 1234 5600 0007 85)",
    errNoRows: "Vähintään yksi erittelyrivi tai kilometrikorvaus vaaditaan",
    errRowDate: (i) => `Rivi ${i}: päivämäärä puuttuu`,
    errRowDesc: (i) => `Rivi ${i}: selitys puuttuu`,
    errRowAmt:  (i) => `Rivi ${i}: summa puuttuu tai on 0`,
    errReceipts: "Vahvista että liitteet ovat mukana",
    errKmFrom: "Matkan lähtöpaikka puuttuu",
    errKmTo: "Matkan määränpää puuttuu",
    errKmPurpose: "Matkan tarkoitus puuttuu",
    errKmDist: "Ajetut kilometrit puuttuvat tai ovat alle 1",
    errKmCons: "Auton kulutus puuttuu tai on virheellinen",
    errKmFuel: "Polttoaineen litrahinta puuttuu",
    errKmFuelReceipt: "Vahvista että tankkauskuitti on liitteenä",
    errAttachDesc: "Liitteiden kuvaus puuttuu",
    errPlace: "Paikka puuttuu",
    errSignature: "Allekirjoitus puuttuu",
    errEstiemEvent: "ESTIEM-tapahtuman nimi puuttuu",
    errEstiemComp: "Päästökompensaatio vaaditaan ESTIEM-korvaukseen",
    errEstiemCert: "Osallistumistodistus vaaditaan ESTIEM-korvaukseen",
    successTitle: "PDF ladattu!",
    successMsg: "Lähetä PDF sähköpostilla osoitteeseen",
    successTotal: "Yhteensä",
    successApplicant: "Hakija",
    successBack: "← Takaisin lomakkeelle",
    estiemBanner: "ESTIEM-korvaus:",
    estiemAcademic: "Akateeminen",
    estiemOther: "Muu",
    estiemRepresentation: "Edustustapahtuma",
    estiemRepresentationInfo: "Edututapahtuma — kaikki kulut korvataan",
    estiemInfo: (rate, maxTravel, maxPartic) =>
      `Matkakuluista korvataan ${rate * 100}% (max ${maxTravel} €), osallistumismaksu max ${maxPartic} €`,
    estiemEventTypeLabel: "Tapahtuman tyyppi",
  },
  en: {
    appTitle: "KAPLAAKI RY",
    appSubtitle: "Expense Reimbursement",
    formTypeNormal: "Standard Reimbursement",
    formTypeEstiem: "ESTIEM Travel",
    sectionApplicant: "Applicant Information",
    sectionItemization: "Itemization",
    sectionAttachments: "Attachments",
    sectionSignature: "Place & Signature",
    applicantName: "Applicant Name",
    applicantNamePlaceholder: "First Last",
    phone: "Phone Number",
    phonePlaceholder: "045 123 4567",
    email: "Email",
    emailPlaceholder: "name@email.fi",
    bank: "Bank / BIC",
    bankPlaceholder: "NDEAFIHH",
    iban: "IBAN",
    ibanPlaceholder: "FI21 1234 5600 0007 85",
    ibanError: "Invalid IBAN format",
    eventPlaceholder: "Event name",
    colDate: "DATE",
    colDesc: "DESCRIPTION",
    colAmount: "AMOUNT (€)",
    addRow: "+ Add row",
    totalExpenses: "Expenses total",
    grandTotal: "Total",
    kmToggle: "Add mileage compensation",
    kmFrom: "Trip origin",
    kmFromPlaceholder: "Lappeenranta",
    kmTo: "Destination",
    kmToPlaceholder: "Helsinki",
    kmPurpose: "Trip purpose / description",
    kmPurposePlaceholder: "e.g. Board meeting, ESTIEM event",
    kmDistance: "Distance (km)",
    kmConsumption: "Consumption L/100km",
    kmFuelPrice: "Fuel price €/L",
    kmCompensationLabel: "Mileage compensation",
    attachDesc: "Attachment description",
    attachDescPlaceholder: "e.g. 1x flight receipt, 1x bank statement",
    attachFiles: "Choose files",
    attachFilesLabel: "Attachments (receipts will be merged into PDF)",
    checklistTitle: "Checklist before sending:",
    checkReceipts: "All receipts attached + bank payment confirmations",
    checkFuelReceipt: "Fuel receipt attached (mileage compensation)",
    checkCompensation: "Carbon offset paid and receipt attached",
    checkCertificate: "ESTIEM event participation certificate attached",
    place: "Place and Date",
    placePlaceholder: "Lappeenranta",
    signature: "Signature",
    signaturePlaceholder: "Initials",
    submitBtn: "Generate PDF",
    generating: "Generating PDF...",
    footer: "Guild of Industrial Engineering and Management · Kaplaaki ry",
    validErrors: "Please fix the following before submitting:",
    errName: "Name is missing",
    errPhone: "Phone number is missing or invalid",
    errEmail: "Email is missing or invalid",
    errBank: "Bank name / BIC is missing",
    errIban: "IBAN is missing or in wrong format (e.g. FI21 1234 5600 0007 85)",
    errNoRows: "At least one expense row or mileage compensation is required",
    errRowDate: (i) => `Row ${i}: date is missing`,
    errRowDesc: (i) => `Row ${i}: description is missing`,
    errRowAmt:  (i) => `Row ${i}: amount is missing or zero`,
    errReceipts: "Please confirm that attachments are included",
    errKmFrom: "Trip origin is missing",
    errKmTo: "Destination is missing",
    errKmPurpose: "Trip purpose is missing",
    errKmDist: "Distance is missing or less than 1 km",
    errKmCons: "Fuel consumption is missing or invalid",
    errKmFuel: "Fuel price is missing",
    errKmFuelReceipt: "Please confirm fuel receipt is attached",
    errAttachDesc: "Attachment description is missing",
    errPlace: "Place is missing",
    errSignature: "Signature is missing",
    errEstiemEvent: "ESTIEM event name is missing",
    errEstiemComp: "Carbon offset is required for ESTIEM reimbursement",
    errEstiemCert: "Participation certificate is required for ESTIEM reimbursement",
    successTitle: "PDF Downloaded!",
    successMsg: "Send the PDF by email to",
    successTotal: "Total",
    successApplicant: "Applicant",
    successBack: "← Back to form",
    estiemBanner: "ESTIEM reimbursement:",
    estiemAcademic: "Academic",
    estiemOther: "Other",
    estiemRepresentation: "Representation",
    estiemRepresentationInfo: "Representation event — all costs covered",
    estiemInfo: (rate, maxTravel, maxPartic) =>
      `${rate * 100}% of travel costs covered (max ${maxTravel} €), participation fee max ${maxPartic} €`,
    estiemEventTypeLabel: "Event type",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const ESTIEM_MAX_TRAVEL = 250;
const ESTIEM_PARTICIPATION_MAX = 50;

function validateIBAN(iban) {
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  if (!/^FI\d{16}$/.test(cleaned) && !/^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(cleaned)) return false;
  return true;
}
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone) { return /^[\d\s+\-()]{7,20}$/.test(phone); }
function formatIBAN(value) {
  const cleaned = value.replace(/\s/g, "").toUpperCase();
  return cleaned.match(/.{1,4}/g)?.join(" ") ?? cleaned;
}
function formatPhone(value) {
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+358")) {
    const rest = digits.slice(4);
    return "+358 " + [rest.slice(0, 2), rest.slice(2, 5), rest.slice(5)].filter(Boolean).join(" ");
  }
  if (digits.startsWith("0")) {
    return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)].filter(Boolean).join(" ");
  }
  return value;
}
function parseAmount(str) {
  if (!str) return 0;
  const val = parseFloat(str.replace(",", ".").trim());
  return isNaN(val) ? 0 : val;
}

const initialRow = () => ({ date: "", description: "", amount: "" });

// ── Sub-components ────────────────────────────────────────────────────────────
function LangToggle({ lang, onToggle }) {
  const btn = (active, label) => ({
    padding: "5px 11px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
    fontFamily: TH.bodyFont, letterSpacing: "0.03em", transition: "all 0.15s",
    background: active ? "rgba(255,255,255,0.22)" : "transparent",
    color: active ? "#fff" : "rgba(255,255,255,0.5)",
  });
  return (
    <div style={{ display: "flex", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.25)", flexShrink: 0 }}>
      <button style={btn(lang === "fi",  "FI")} onClick={onToggle}>FI</button>
      <button style={btn(lang === "en", "EN")} onClick={onToggle}>EN</button>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ margin: "0 0 18px", fontSize: 13, fontWeight: 700, fontFamily: TH.headingFont, textTransform: "uppercase", letterSpacing: "0.06em", color: TH.primary }}>
      {children}
    </h2>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: TH.labelColor, marginBottom: 5, letterSpacing: "0.03em", textTransform: "uppercase", fontFamily: TH.bodyFont }}>
      {children}{required && <span style={{ color: TH.errorText, marginLeft: 2 }}>*</span>}
    </label>
  );
}

function InputEl({ submitted, valid = true, style: extraStyle = {}, ...props }) {
  const hasError = submitted && !valid;
  return (
    <input
      style={{
        width: "100%", padding: "9px 12px", fontSize: 14, fontFamily: TH.bodyFont,
        border: `1.5px solid ${hasError ? TH.errorText + "88" : TH.inputBorder}`,
        borderRadius: TH.borderRadius, background: hasError ? TH.errorBg : TH.inputBg,
        outline: "none", color: TH.text, transition: "border-color 0.2s", boxSizing: "border-box",
        ...extraStyle,
      }}
      {...props}
    />
  );
}

function Checkbox({ checked, onChange, label, required }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 0", cursor: "pointer", fontSize: 13, color: TH.text, fontFamily: TH.bodyFont, userSelect: "none" }}>
      <div onClick={() => onChange(!checked)} style={{
        width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${checked ? TH.checkboxColor : TH.inputBorder}`,
        background: checked ? TH.checkboxColor : TH.cardBg, display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s", cursor: "pointer", flexShrink: 0, marginTop: 1,
      }}>
        {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <span>{label}{required && <span style={{ color: TH.errorText, marginLeft: 2 }}>*</span>}</span>
    </label>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function KulukorvausForm() {
  const [language, setLanguage] = useState("fi");
  const L = LABELS[language];

  // Existing state (keep names — generatePDF depends on them)
  const [formType,    setFormType]    = useState("normal");
  const [name,        setName]        = useState("");
  const [phone,       setPhone]       = useState("");
  const [email,       setEmail]       = useState("");
  const [bank,        setBank]        = useState("");
  const [iban,        setIban]        = useState("");
  const [rows,        setRows]        = useState([initialRow(), initialRow(), initialRow(), initialRow()]);
  const [tapahtuma,   setTapahtuma]   = useState("");
  const [attachmentDesc, setAttachmentDesc] = useState("");
  const [attachedFiles,  setAttachedFiles]  = useState([]);
  const [location,    setLocation]    = useState("");
  const [signature,   setSignature]   = useState("");
  const [dateField,   setDateField]   = useState(new Date().toLocaleDateString("fi-FI"));

  const [includeKm,             setIncludeKm]             = useState(false);
  const [kmFrom,                setKmFrom]                = useState("");
  const [kmTo,                  setKmTo]                  = useState("");
  const [kmPurpose,             setKmPurpose]             = useState("");
  const [kmDistance,            setKmDistance]            = useState("");
  const [kmConsumption,         setKmConsumption]         = useState("6");
  const [kmFuelPrice,           setKmFuelPrice]           = useState("");
  const [kmFuelReceiptAttached, setKmFuelReceiptAttached] = useState(false);

  const [estiemEventType, setEstiemEventType] = useState("academic");
  const [hasCompensation, setHasCompensation] = useState(false);
  const [hasCertificate,  setHasCertificate]  = useState(false);

  const [receiptsAttached, setReceiptsAttached] = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors,      setErrors]      = useState([]);
  const [generating,  setGenerating]  = useState(false);
  const [pdfError,    setPdfError]    = useState(null);

  // ── Computed ──
  const total = rows.reduce((sum, r) => sum + parseAmount(r.amount), 0);
  const kmCompensation = (() => {
    const km   = parseFloat(kmDistance);
    const cons = parseFloat((kmConsumption || "").replace(",", "."));
    const fuel = parseFloat((kmFuelPrice   || "").replace(",", "."));
    return km > 0 && cons > 0 && fuel > 0 ? km * (cons / 100) * fuel : 0;
  })();
  const displayTotal = total + (includeKm ? kmCompensation : 0);

  // ── Row handlers ──
  const updateRow = (index, field, value) => setRows(prev => {
    const next = [...prev];
    next[index] = { ...next[index], [field]: value };
    return next;
  });
  const addRow    = () => setRows(prev => [...prev, initialRow()]);
  const removeRow = (i) => { if (rows.length > 1) setRows(prev => prev.filter((_, idx) => idx !== i)); };

  // ── ESTIEM info ──
  const getEstiemInfo = () => {
    if (formType !== "estiem") return null;
    if (estiemEventType === "representation") return { text: L.estiemRepresentationInfo };
    const rate = estiemEventType === "academic" ? 0.7 : 0.5;
    return { text: L.estiemInfo(rate, ESTIEM_MAX_TRAVEL, ESTIEM_PARTICIPATION_MAX) };
  };

  // ── Validation ──
  const validate = () => {
    const errs = [];
    if (!name.trim())                             errs.push(L.errName);
    if (!phone.trim() || !validatePhone(phone))   errs.push(L.errPhone);
    if (!email.trim() || !validateEmail(email))   errs.push(L.errEmail);
    if (!bank.trim())                             errs.push(L.errBank);
    if (!iban.trim() || !validateIBAN(iban))      errs.push(L.errIban);

    const filledRows = rows.filter(r => r.date || r.description || r.amount);
    if (filledRows.length === 0 && !includeKm) errs.push(L.errNoRows);
    filledRows.forEach((r, i) => {
      if (!r.date)                            errs.push(L.errRowDate(i + 1));
      if (!r.description)                     errs.push(L.errRowDesc(i + 1));
      if (!r.amount || parseAmount(r.amount) <= 0) errs.push(L.errRowAmt(i + 1));
    });

    if (!receiptsAttached) errs.push(L.errReceipts);

    if (includeKm) {
      if (!kmFrom.trim())    errs.push(L.errKmFrom);
      if (!kmTo.trim())      errs.push(L.errKmTo);
      if (!kmPurpose.trim()) errs.push(L.errKmPurpose);
      const km   = parseFloat(kmDistance);
      if (!kmDistance || isNaN(km) || km < 1) errs.push(L.errKmDist);
      const cons = parseFloat((kmConsumption || "").replace(",", "."));
      if (!kmConsumption || isNaN(cons) || cons <= 0) errs.push(L.errKmCons);
      const fuel = parseFloat((kmFuelPrice || "").replace(",", "."));
      if (!kmFuelPrice || isNaN(fuel) || fuel <= 0) errs.push(L.errKmFuel);
      if (!kmFuelReceiptAttached) errs.push(L.errKmFuelReceipt);
    }

    if (!attachmentDesc.trim()) errs.push(L.errAttachDesc);
    if (!location.trim())       errs.push(L.errPlace);
    if (!signature.trim())      errs.push(L.errSignature);

    if (formType === "estiem") {
      if (!tapahtuma.trim())   errs.push(L.errEstiemEvent);
      if (!hasCompensation)    errs.push(L.errEstiemComp);
      if (!hasCertificate)     errs.push(L.errEstiemCert);
    }
    return errs;
  };

  // ── Submit (keep generatePDF call intact) ──
  const handleSubmit = async () => {
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;
    setGenerating(true);
    setPdfError(null);
    try {
      await generateAndDownloadPDF({
        name, phone, email, bank, iban, formType, estiemEventType,
        rows, total, attachmentDesc, location, dateField, signature,
        attachedFiles, tapahtuma, includeKm, kmFrom, kmTo, kmPurpose,
        kmDistance:    parseFloat(kmDistance) || 0,
        kmConsumption: parseFloat((kmConsumption || "").replace(",", ".")) || 6,
        kmFuelPrice:   parseFloat((kmFuelPrice   || "").replace(",", ".")) || 0,
        kmCompensation,
      });
      setShowSuccess(true);
    } catch (err) {
      setPdfError(`PDF:n luonti epäonnistui: ${err?.message || err}`);
    } finally {
      setGenerating(false);
    }
  };

  // ── Success screen ──
  if (showSuccess) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: TH.pageBg, fontFamily: TH.bodyFont }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: "40px 24px" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#22C55E", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: TH.headingFont, color: TH.text, margin: "0 0 10px" }}>{L.successTitle}</h2>
          <p style={{ color: TH.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            {L.successMsg}{" "}
            <strong style={{ color: TH.text }}>
              {formType === "estiem" ? "talous@kaplaaki.fi ja estiem@kaplaaki.fi" : "talous@kaplaaki.fi"}
            </strong>
          </p>
          <div style={{ background: TH.accentLight, border: `1px solid ${TH.accentBorder}`, padding: "14px 18px", borderRadius: TH.borderRadius, fontSize: 13, color: TH.text, lineHeight: 1.7, textAlign: "left" }}>
            <div><strong>{L.successTotal}:</strong> {displayTotal.toFixed(2)} EUR</div>
            <div><strong>{L.successApplicant}:</strong> {name}</div>
          </div>
          <button onClick={() => { setShowSuccess(false); setSubmitted(false); }} style={{ marginTop: 20, padding: "10px 24px", background: "none", border: `1px solid ${TH.cardBorder}`, borderRadius: TH.borderRadius, cursor: "pointer", fontSize: 13, color: TH.textMuted, fontFamily: TH.bodyFont }}>
            {L.successBack}
          </button>
        </div>
      </div>
    );
  }

  const estiemInfo = getEstiemInfo();
  const card = { background: TH.cardBg, border: `1px solid ${TH.cardBorder}`, borderRadius: TH.cardRadius, padding: "20px 24px", marginBottom: 16 };
  const colHdr = { fontSize: 11, fontWeight: 600, color: TH.textLight, fontFamily: TH.bodyFont, letterSpacing: "0.04em" };

  return (
    <div style={{ minHeight: "100vh", background: TH.pageBg, fontFamily: TH.bodyFont, color: TH.text }}>

      {/* ── HEADER ── */}
      <div style={{ background: TH.primary, color: "#fff", padding: "18px 28px", display: "flex", alignItems: "center" }}>
        <div style={{ width: 120, height: 120, background: "#fff", borderRadius: "50%", flexShrink: 0, overflow: "hidden", boxShadow: "0 0 0 2px rgba(255,255,255,0.25)", margin: "-8px 0" }}>
          <img src="./kaplaaki-logo.png" alt="Kaplaaki" style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
        <div style={{ marginLeft: 16 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: TH.headingFont, letterSpacing: "0.02em" }}>{L.appTitle}</h1>
          <p style={{ margin: "3px 0 0", fontSize: 11, opacity: 0.65, letterSpacing: "0.07em", textTransform: "uppercase" }}>{L.appSubtitle}</p>
        </div>
        <div style={{ flex: 1 }} />
        <LangToggle lang={language} onToggle={() => setLanguage(l => l === "fi" ? "en" : "fi")} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* ── FORM TYPE ── */}
        <div style={{ ...card, display: "flex", gap: 8, padding: "10px 12px" }}>
          {[["normal", L.formTypeNormal], ["estiem", L.formTypeEstiem]].map(([val, label]) => (
            <button key={val} onClick={() => setFormType(val)} style={{
              flex: 1, padding: "9px 16px", borderRadius: TH.borderRadius, border: "none",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.18s", fontFamily: TH.bodyFont,
              background: formType === val ? TH.primary : "#F0F0F0",
              color:      formType === val ? "#fff" : TH.textMuted,
            }}>{label}</button>
          ))}
        </div>

        {/* ── ESTIEM BANNER ── */}
        {formType === "estiem" && estiemInfo && (
          <div style={{ background: TH.accentLight, border: `1px solid ${TH.accentBorder}`, borderRadius: TH.borderRadius, padding: "11px 16px", marginBottom: 16, fontSize: 13, color: TH.accentText, lineHeight: 1.5 }}>
            <strong style={{ fontSize: 12 }}>{L.estiemBanner}</strong>{" "}{estiemInfo.text}
          </div>
        )}

        {/* ── APPLICANT CARD ── */}
        <div style={card}>
          <SectionTitle>{L.sectionApplicant}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <FieldLabel required>{L.applicantName}</FieldLabel>
              <InputEl submitted={submitted} valid={!!name.trim()} value={name}
                onChange={e => setName(e.target.value)} placeholder={L.applicantNamePlaceholder} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel required>{L.phone}</FieldLabel>
                <InputEl submitted={submitted} valid={!phone || validatePhone(phone)} value={phone}
                  onChange={e => setPhone(formatPhone(e.target.value))} placeholder={L.phonePlaceholder} />
              </div>
              <div>
                <FieldLabel required>{L.email}</FieldLabel>
                <InputEl submitted={submitted} valid={!email || validateEmail(email)} value={email}
                  onChange={e => setEmail(e.target.value)} placeholder={L.emailPlaceholder} type="email" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12 }}>
              <div>
                <FieldLabel required>{L.bank}</FieldLabel>
                <InputEl submitted={submitted} valid={!!bank.trim()} value={bank}
                  onChange={e => setBank(e.target.value)} placeholder={L.bankPlaceholder} />
              </div>
              <div>
                <FieldLabel required>{L.iban}</FieldLabel>
                <InputEl submitted={submitted} valid={!iban || validateIBAN(iban)} value={iban}
                  onChange={e => setIban(formatIBAN(e.target.value))} placeholder={L.ibanPlaceholder} />
                {iban && !validateIBAN(iban) && <div style={{ fontSize: 11, color: TH.errorText, marginTop: 3, fontFamily: TH.bodyFont }}>{L.ibanError}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* ── ITEMIZATION CARD ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: TH.headingFont, textTransform: "uppercase", letterSpacing: "0.06em", color: TH.primary, whiteSpace: "nowrap" }}>
              {L.sectionItemization}
            </span>
            <InputEl value={tapahtuma} onChange={e => setTapahtuma(e.target.value)}
              placeholder={L.eventPlaceholder} style={{ fontSize: 13 }} />
          </div>

          {/* ESTIEM event type chips */}
          {formType === "estiem" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TH.labelColor, marginBottom: 6, letterSpacing: "0.03em", textTransform: "uppercase", fontFamily: TH.bodyFont }}>{L.estiemEventTypeLabel}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["academic", L.estiemAcademic], ["other", L.estiemOther], ["representation", L.estiemRepresentation]].map(([val, label]) => (
                  <button key={val} onClick={() => setEstiemEventType(val)} style={{
                    padding: "6px 14px", borderRadius: TH.borderRadius, fontSize: 12, cursor: "pointer",
                    fontWeight: 500, fontFamily: TH.bodyFont,
                    border: `1px solid ${estiemEventType === val ? TH.primary : TH.inputBorder}`,
                    background: estiemEventType === val ? TH.accentLight : TH.inputBg,
                    color: estiemEventType === val ? TH.accentText : TH.textMuted,
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
                <InputEl value={row.date} onChange={e => updateRow(i, "date", e.target.value)}
                  placeholder="1.1.2026" style={{ padding: "7px 10px", fontSize: 13 }} />
                <InputEl value={row.description} onChange={e => updateRow(i, "description", e.target.value)}
                  placeholder="…" style={{ padding: "7px 10px", fontSize: 13 }} />
                <InputEl value={row.amount} onChange={e => updateRow(i, "amount", e.target.value)}
                  placeholder="0,00" style={{ padding: "7px 10px", fontSize: 13, textAlign: "right" }} />
                <button onClick={() => removeRow(i)} disabled={rows.length <= 1} style={{
                  background: "none", border: "none", cursor: rows.length <= 1 ? "default" : "pointer",
                  opacity: rows.length <= 1 ? 0.15 : 0.4, fontSize: 18, color: TH.textMuted, padding: 0, lineHeight: 1,
                }}>×</button>
              </div>
            ))}
          </div>

          <button onClick={addRow} style={{
            marginTop: 10, width: "100%", padding: "7px 0", background: "none",
            border: `1px dashed ${TH.inputBorder}`, borderRadius: TH.borderRadius,
            cursor: "pointer", fontSize: 12, color: TH.textMuted, fontFamily: TH.bodyFont,
          }}>{L.addRow}</button>

          {/* Subtotal */}
          {total > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${TH.cardBorder}` }}>
              <span style={{ fontSize: 13, color: TH.textMuted }}>{L.totalExpenses}</span>
              <div style={{ background: TH.accentLight, padding: "5px 14px", borderRadius: TH.borderRadius, fontSize: 15, fontWeight: 700, minWidth: 90, textAlign: "right", fontVariantNumeric: "tabular-nums", color: TH.text }}>
                {total.toFixed(2)} <span style={{ fontSize: 11, fontWeight: 500, color: TH.textMuted }}>EUR</span>
              </div>
            </div>
          )}

          {/* Km toggle */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${TH.cardBorder}` }}>
            <Checkbox checked={includeKm} onChange={setIncludeKm} label={L.kmToggle} />

            {includeKm && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <FieldLabel required>{L.kmFrom}</FieldLabel>
                    <InputEl submitted={submitted} valid={!!kmFrom.trim()} value={kmFrom}
                      onChange={e => setKmFrom(e.target.value)} placeholder={L.kmFromPlaceholder} />
                  </div>
                  <div>
                    <FieldLabel required>{L.kmTo}</FieldLabel>
                    <InputEl submitted={submitted} valid={!!kmTo.trim()} value={kmTo}
                      onChange={e => setKmTo(e.target.value)} placeholder={L.kmToPlaceholder} />
                  </div>
                </div>
                <div>
                  <FieldLabel required>{L.kmPurpose}</FieldLabel>
                  <InputEl submitted={submitted} valid={!!kmPurpose.trim()} value={kmPurpose}
                    onChange={e => setKmPurpose(e.target.value)} placeholder={L.kmPurposePlaceholder} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <FieldLabel required>{L.kmDistance}</FieldLabel>
                    <InputEl submitted={submitted} valid={!kmDistance || parseFloat(kmDistance) >= 1}
                      value={kmDistance} onChange={e => setKmDistance(e.target.value)} placeholder="0" type="number" min="1" />
                  </div>
                  <div>
                    <FieldLabel required>{L.kmConsumption}</FieldLabel>
                    <InputEl value={kmConsumption} onChange={e => setKmConsumption(e.target.value)} placeholder="6" />
                  </div>
                  <div>
                    <FieldLabel required>{L.kmFuelPrice}</FieldLabel>
                    <InputEl value={kmFuelPrice} onChange={e => setKmFuelPrice(e.target.value)} placeholder="0,00" />
                  </div>
                </div>
                <div style={{ background: TH.accentLight, border: `1px solid ${TH.accentBorder}`, borderRadius: TH.borderRadius, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: TH.accentText, marginBottom: 5, opacity: 0.8 }}>
                    {parseFloat(kmDistance) || 0} km × {parseFloat((kmConsumption || "0").replace(",", ".")).toFixed(1)} L/100 km × {parseFloat((kmFuelPrice || "0").replace(",", ".")).toFixed(2)} €/L
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TH.accentText }}>{L.kmCompensationLabel}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: TH.primary, fontVariantNumeric: "tabular-nums" }}>
                      {kmCompensation.toFixed(2)} <span style={{ fontSize: 11, fontWeight: 500, color: TH.textMuted }}>EUR</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grand total */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 12, borderTop: `2px solid ${TH.primary}` }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{L.grandTotal}</span>
            <div style={{ background: TH.accentLight, border: `1px solid ${TH.accentBorder}`, padding: "8px 16px", borderRadius: TH.borderRadius, fontSize: 18, fontWeight: 700, minWidth: 100, textAlign: "right", fontVariantNumeric: "tabular-nums", color: TH.primary }}>
              {displayTotal.toFixed(2)} <span style={{ fontSize: 12, fontWeight: 500, color: TH.textMuted }}>EUR</span>
            </div>
          </div>
        </div>

        {/* ── ATTACHMENTS CARD ── */}
        <div style={card}>
          <SectionTitle>{L.sectionAttachments}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <FieldLabel required>{L.attachDesc}</FieldLabel>
              <InputEl submitted={submitted} valid={!!attachmentDesc.trim()} value={attachmentDesc}
                onChange={e => setAttachmentDesc(e.target.value)} placeholder={L.attachDescPlaceholder} />
            </div>
            <div>
              <FieldLabel>{L.attachFilesLabel}</FieldLabel>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: `1.5px dashed ${TH.inputBorder}`, borderRadius: TH.borderRadius, padding: "13px 16px", cursor: "pointer", fontSize: 13, color: TH.textMuted, background: TH.inputBg, fontFamily: TH.bodyFont }}>
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
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: TH.accentLight, borderRadius: TH.borderRadius, padding: "6px 10px", fontSize: 12, color: TH.text }}>
                      <span>{f.name}</span>
                      <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: TH.textMuted, fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ background: "#FAFAFA", borderRadius: TH.borderRadius, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TH.textMuted, marginBottom: 8, letterSpacing: "0.03em", textTransform: "uppercase", fontFamily: TH.bodyFont }}>{L.checklistTitle}</div>
              <Checkbox checked={receiptsAttached} onChange={setReceiptsAttached} label={L.checkReceipts} required />
              {includeKm && <Checkbox checked={kmFuelReceiptAttached} onChange={setKmFuelReceiptAttached} label={L.checkFuelReceipt} required />}
              {formType === "estiem" && (
                <>
                  <Checkbox checked={hasCompensation} onChange={setHasCompensation} label={L.checkCompensation} required />
                  <Checkbox checked={hasCertificate}  onChange={setHasCertificate}  label={L.checkCertificate}  required />
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── SIGNATURE CARD ── */}
        <div style={card}>
          <SectionTitle>{L.sectionSignature}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <FieldLabel required>{L.place}</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 108px", gap: 8 }}>
                <InputEl submitted={submitted} valid={!!location.trim()} value={location}
                  onChange={e => setLocation(e.target.value)} placeholder={L.placePlaceholder} />
                <InputEl value={dateField} onChange={e => setDateField(e.target.value)} />
              </div>
            </div>
            <div>
              <FieldLabel required>{L.signature}</FieldLabel>
              <InputEl submitted={submitted} valid={!!signature.trim()} value={signature}
                onChange={e => setSignature(e.target.value)} placeholder={L.signaturePlaceholder} />
            </div>
          </div>
        </div>

        {/* ── VALIDATION ERRORS ── */}
        {submitted && errors.length > 0 && (
          <div style={{ background: TH.errorBg, border: `1px solid ${TH.errorBorder}`, borderRadius: TH.borderRadius, padding: "14px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TH.errorText, marginBottom: 8, fontFamily: TH.bodyFont }}>{L.validErrors}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {errors.map((e, i) => (
                <div key={i} style={{ fontSize: 12, color: TH.errorText, display: "flex", gap: 6, fontFamily: TH.bodyFont }}>
                  <span style={{ flexShrink: 0 }}>·</span><span>{e}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PDF ERROR ── */}
        {pdfError && (
          <div style={{ background: TH.errorBg, border: `1px solid ${TH.errorBorder}`, borderRadius: TH.borderRadius, padding: "14px 18px", marginBottom: 16, fontSize: 13, color: TH.errorText, fontFamily: TH.bodyFont }}>
            {pdfError}
          </div>
        )}

        {/* ── SUBMIT ── */}
        <button onClick={handleSubmit} disabled={generating} style={{
          width: "100%", padding: "14px 24px",
          background: generating ? TH.textLight : TH.primary,
          color: "#fff", border: "none", borderRadius: TH.borderRadius,
          fontSize: 15, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer",
          letterSpacing: "0.02em", transition: "opacity 0.2s", fontFamily: TH.bodyFont,
        }}>
          {generating ? L.generating : L.submitBtn}
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: TH.textLight, marginTop: 14 }}>{L.footer}</p>
      </div>
    </div>
  );
}

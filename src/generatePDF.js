import { jsPDF } from "jspdf";
import { PDFDocument, rgb } from "pdf-lib";

const NAVY = [0, 31, 63];
const LIGHT = [240, 244, 248];

function normalizeToJpeg(arrayBuf, maxPx, quality) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([arrayBuf]);
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        b => b ? b.arrayBuffer().then(resolve).catch(reject) : reject(new Error("toBlob failed")),
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}


async function getLogoDataUrl() {
  try {
    const base = process.env.PUBLIC_URL || "";
    const res = await fetch(`${base}/KAPLAAKI%20logo%20white.svg`);
    const svgText = await res.text();
    const match = svgText.match(/xlink:href="(data:image\/png;base64,[^"]+)"/);
    if (!match) return null;
    // Downscale logo to 100×100 px max — it's drawn at 20×20 mm in the PDF
    return await resizeDataUrl(match[1], 400, 1.0);
  } catch (e) {
    return null;
  }
}

function resizeDataUrl(dataUrl, maxPx, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png", quality));
    };
    img.onerror = () => resolve(dataUrl); // fallback: käytä alkuperäistä
    img.src = dataUrl;
  });
}

function addFormPage(doc, data, logoDataUrl, fontName = "helvetica") {
  const { name, phone, email, bank, iban, formType, estiemEventType,
    rows, total, attachmentDesc, location, dateField, signature, tapahtuma } = data;

  const W = 210, ml = 14, mr = 196;

  // Header background
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 28, "F");

  // Logo
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", ml, 4, 20, 20);
  }

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(fontName, "bold");
  doc.text("KAPLAAKI RY", ml + 24, 12);
  doc.setFontSize(8);
  doc.setFont(fontName, "normal");
  doc.text("KULUKORVAUSANOMUS", ml + 24, 18);
  // Tosite nro box — top right corner (smaller: 26×16mm)
  const tnW = 26, tnH = 16, tnX = mr - tnW;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.roundedRect(tnX, 2, tnW, tnH, 2, 2, "FD");
  doc.setTextColor(...NAVY);
  doc.setFontSize(6);
  doc.setFont(fontName, "bold");
  doc.text("TOSITE NRO", tnX + tnW / 2, 6.5, { align: "center" });
  doc.setDrawColor(180, 180, 180);
  doc.line(tnX + 2, 8, tnX + tnW - 2, 8);
  doc.setLineWidth(0.2);

  // Address — to the left of tosite box
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont(fontName, "normal");
  doc.text("Laserkatu 10, 53850 Lappeenranta", tnX - 4, 16, { align: "right" });

  // Form type badge
  const badge = formType === "estiem"
    ? `ESTIEM-matka${tapahtuma ? ` — ${tapahtuma}` : ""}${estiemEventType ? ` (${estiemEventType})` : ""}`
    : "Normaali kulukorvaus";
  doc.setFillColor(220, 235, 255);
  doc.setDrawColor(...NAVY);
  doc.roundedRect(ml, 32, mr - ml, 8, 2, 2, "FD");
  doc.setTextColor(...NAVY);
  doc.setFontSize(8);
  doc.setFont(fontName, "bold");
  doc.text(badge, W / 2, 37.5, { align: "center" });

  let y = 46;

  // Section helper
  const section = (title) => {
    doc.setFillColor(...NAVY);
    doc.rect(ml, y, mr - ml, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(fontName, "bold");
    doc.text(title, ml + 2, y + 4.2);
    y += 9;
  };

  const field = (label, value, x, w, inline = false) => {
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont(fontName, "normal");
    doc.text(label, x, y);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont(fontName, "bold");
    doc.text(value || "—", x, y + 4.5);
    if (!inline) {
      doc.setDrawColor(200, 200, 200);
      doc.line(x, y + 5.5, x + w, y + 5.5);
    }
  };

  // Hakijan tiedot
  section("HAKIJAN TIEDOT");
  field("Nimi", name, ml, mr - ml);
  y += 12;
  field("Puhelinnumero", phone, ml, 80);
  field("Sähköposti", email, ml + 90, mr - (ml + 90));
  y += 12;
  field("Pankki / BIC", bank, ml, 50);
  field("IBAN", iban, ml + 60, mr - ml - 60);
  y += 14;

  // Erittely
  section("ERITTELY");
  if (tapahtuma) {
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.setFont(fontName, "normal");
    doc.text(tapahtuma, mr, y - 5, { align: "right" });
  }

  // Table header
  doc.setFillColor(...LIGHT);
  doc.rect(ml, y, mr - ml, 6, "F");
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(7);
  doc.setFont(fontName, "bold");
  doc.text("PVM", ml + 2, y + 4);
  doc.text("SELITYS", ml + 32, y + 4);
  doc.text("SUMMA (€)", mr - 2, y + 4, { align: "right" });
  y += 7;

  const filledRows = rows.filter(r => r.date || r.description || r.amount);
  filledRows.forEach((r, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(ml, y - 1, mr - ml, 6, "F");
    }
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(8);
    doc.setFont(fontName, "normal");
    doc.text(r.date || "", ml + 2, y + 3.5);
    doc.text(r.description || "", ml + 32, y + 3.5);
    const amt = parseFloat(r.amount?.toString().replace(",", ".")) || 0;
    doc.text(amt.toFixed(2), mr - 2, y + 3.5, { align: "right" });
    y += 6;
  });

  // Total
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.5);
  doc.line(ml, y, mr, y);
  y += 1;
  doc.setFillColor(...NAVY);
  doc.rect(mr - 50, y, 50, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont(fontName, "bold");
  doc.text("YHTEENSÄ", mr - 48, y + 5.5);
  doc.text(`${total.toFixed(2)} EUR`, mr - 2, y + 5.5, { align: "right" });
  doc.setLineWidth(0.2);
  y += 13;

  // Liitteet
  section("LIITTEET");
  field("Liitteiden kuvaus", attachmentDesc, ml, mr - ml);
  y += 14;

  // Paikka & allekirjoitus
  section("ALLEKIRJOITUS");
  field("Paikka ja päivämäärä", `${location}, ${dateField}`, ml, 90);
  field("Allekirjoitus", signature, ml + 100, 96, true);
  y += 14;

  // Talousvastaava täyttää
  const tvY = y;
  const tvHeight = 34;
  doc.setFillColor(...LIGHT);
  doc.rect(ml, y, mr - ml, tvHeight, "F");
  doc.setDrawColor(180, 180, 180);
  doc.rect(ml, y, mr - ml, tvHeight);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.setFont(fontName, "bold");
  doc.text("TALOUSVASTAAVA TÄYTTÄÄ", ml + 2, y + 4);
  doc.setFont(fontName, "normal");
  // Row 1: Hyväksytty | PVM
  doc.text("Hyväksytty:", ml + 2, y + 10);
  doc.setDrawColor(180, 180, 180);
  doc.line(ml + 22, y + 10.5, ml + 90, y + 10.5);
  doc.text("PVM:", ml + 100, y + 10);
  doc.line(ml + 110, y + 10.5, mr - 2, y + 10.5);
  // Row 2: Maksettu
  doc.text("Maksettu:", ml + 2, y + 17);
  doc.line(ml + 19, y + 17.5, ml + 90, y + 17.5);
  // Row 3: Lisätiedot
  doc.text("Lisätiedot:", ml + 2, y + 24);
  doc.line(ml + 20, y + 24.5, mr - 2, y + 24.5);

  // Footer
  doc.setTextColor(160, 160, 160);
  doc.setFontSize(6);
  doc.text(`Tulostettu: ${new Date().toLocaleDateString("fi-FI")}  |  Kaplaaki ry — Tuotantotalouden kilta — LUT-yliopisto`, W / 2, 293, { align: "center" });

  return { tvY, tnX, tnW };
}


function addKilometriPage(doc, data, logoDataUrl, fontName = "helvetica") {
  const { name, phone, email, bank, iban, kmFrom, kmTo, kmPurpose, kmDistance, kmFuelPrice, kmCompensation,
    attachmentDesc, location, dateField, signature } = data;

  const W = 210, ml = 14, mr = 196;

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 28, "F");

  if (logoDataUrl) doc.addImage(logoDataUrl, "PNG", ml, 4, 20, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(fontName, "bold");
  doc.text("KAPLAAKI RY", ml + 24, 12);
  doc.setFontSize(8);
  doc.setFont(fontName, "normal");
  doc.text("KILOMETRIKORVAUSANOMUS", ml + 24, 18);

  const tnW = 26, tnH = 16, tnX = mr - tnW;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.roundedRect(tnX, 2, tnW, tnH, 2, 2, "FD");
  doc.setTextColor(...NAVY);
  doc.setFontSize(6);
  doc.setFont(fontName, "bold");
  doc.text("TOSITE NRO", tnX + tnW / 2, 6.5, { align: "center" });
  doc.setDrawColor(180, 180, 180);
  doc.line(tnX + 2, 8, tnX + tnW - 2, 8);
  doc.setLineWidth(0.2);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont(fontName, "normal");
  doc.text("Laserkatu 10, 53850 Lappeenranta", tnX - 4, 16, { align: "right" });

  doc.setFillColor(220, 235, 255);
  doc.setDrawColor(...NAVY);
  doc.roundedRect(ml, 32, mr - ml, 8, 2, 2, "FD");
  doc.setTextColor(...NAVY);
  doc.setFontSize(8);
  doc.setFont(fontName, "bold");
  doc.text("Kilometrikorvaus", W / 2, 37.5, { align: "center" });

  let y = 46;

  const section = (title) => {
    doc.setFillColor(...NAVY);
    doc.rect(ml, y, mr - ml, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(fontName, "bold");
    doc.text(title, ml + 2, y + 4.2);
    y += 9;
  };

  const field = (label, value, x, w, inline = false) => {
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont(fontName, "normal");
    doc.text(label, x, y);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont(fontName, "bold");
    doc.text(value || "—", x, y + 4.5);
    if (!inline) {
      doc.setDrawColor(200, 200, 200);
      doc.line(x, y + 5.5, x + w, y + 5.5);
    }
  };

  section("HAKIJAN TIEDOT");
  field("Nimi", name, ml, mr - ml);
  y += 12;
  field("Puhelinnumero", phone, ml, 80);
  field("Sähköposti", email, ml + 90, mr - (ml + 90));
  y += 12;
  field("Pankki / BIC", bank, ml, 50);
  field("IBAN", iban, ml + 60, mr - ml - 60);
  y += 14;

  section("MATKATIEDOT");
  field("Lähtöpaikka", kmFrom, ml, 80);
  field("Määränpää", kmTo, ml + 90, mr - (ml + 90));
  y += 12;
  field("Tarkoitus / selitys", kmPurpose, ml, mr - ml);
  y += 14;

  section("LASKELMA");
  doc.setFillColor(...LIGHT);
  doc.rect(ml, y, mr - ml, 7, "F");
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(7);
  doc.setFont(fontName, "bold");
  doc.text("AJETUT KM", ml + 2, y + 4.5);
  doc.text("KULUTUS", ml + 42, y + 4.5);
  doc.text("LITRAHINTA", ml + 82, y + 4.5);
  doc.text("LASKUKAAVA", ml + 122, y + 4.5);
  doc.text("KORVAUS", mr - 2, y + 4.5, { align: "right" });
  y += 8;

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont(fontName, "normal");
  doc.text(`${kmDistance} km`, ml + 2, y + 3.5);
  doc.text("6 L/100km", ml + 42, y + 3.5);
  doc.text(`${(kmFuelPrice || 0).toFixed(2)} €/L`, ml + 82, y + 3.5);
  doc.text(`${kmDistance} × 0,06 × ${(kmFuelPrice || 0).toFixed(2)}`, ml + 122, y + 3.5);
  doc.text((kmCompensation || 0).toFixed(2), mr - 2, y + 3.5, { align: "right" });
  y += 8;

  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.5);
  doc.line(ml, y, mr, y);
  y += 1;
  doc.setFillColor(...NAVY);
  doc.rect(mr - 50, y, 50, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont(fontName, "bold");
  doc.text("YHTEENSÄ", mr - 48, y + 5.5);
  doc.text(`${(kmCompensation || 0).toFixed(2)} EUR`, mr - 2, y + 5.5, { align: "right" });
  doc.setLineWidth(0.2);
  y += 13;

  doc.setFillColor(240, 248, 240);
  doc.setDrawColor(180, 220, 180);
  doc.roundedRect(ml, y, mr - ml, 8, 2, 2, "FD");
  doc.setTextColor(60, 120, 60);
  doc.setFontSize(7);
  doc.setFont(fontName, "normal");
  doc.text("Kulutus 6 L/100km (kiinteä) — kattaa vain polttoaineen", W / 2, y + 5, { align: "center" });
  y += 13;

  section("LIITTEET");
  field("Liitteiden kuvaus", attachmentDesc, ml, mr - ml);
  y += 14;

  section("ALLEKIRJOITUS");
  field("Paikka ja päivämäärä", `${location}, ${dateField}`, ml, 90);
  field("Allekirjoitus", signature, ml + 100, 96, true);
  y += 14;

  const tvY = y;
  const tvHeight = 34;
  doc.setFillColor(...LIGHT);
  doc.rect(ml, y, mr - ml, tvHeight, "F");
  doc.setDrawColor(180, 180, 180);
  doc.rect(ml, y, mr - ml, tvHeight);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.setFont(fontName, "bold");
  doc.text("TALOUSVASTAAVA TÄYTTÄÄ", ml + 2, y + 4);
  doc.setFont(fontName, "normal");
  doc.text("Hyväksytty:", ml + 2, y + 10);
  doc.setDrawColor(180, 180, 180);
  doc.line(ml + 22, y + 10.5, ml + 90, y + 10.5);
  doc.text("PVM:", ml + 100, y + 10);
  doc.line(ml + 110, y + 10.5, mr - 2, y + 10.5);
  doc.text("Maksettu:", ml + 2, y + 17);
  doc.line(ml + 19, y + 17.5, ml + 90, y + 17.5);
  doc.text("Lisätiedot:", ml + 2, y + 24);
  doc.line(ml + 20, y + 24.5, mr - 2, y + 24.5);

  doc.setTextColor(160, 160, 160);
  doc.setFontSize(6);
  doc.text(`Tulostettu: ${new Date().toLocaleDateString("fi-FI")}  |  Kaplaaki ry — Tuotantotalouden kilta — LUT-yliopisto`, W / 2, 293, { align: "center" });

  return { tvY, tnX, tnW };
}

export async function generateAndDownloadPDF(data) {
  // 1. Generate form page with jsPDF
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logoDataUrl = await getLogoDataUrl();
  const { tvY, tnX, tnW } = data.formType === "kilometrikorvaus"
    ? addKilometriPage(doc, data, logoDataUrl, "helvetica")
    : addFormPage(doc, data, logoDataUrl, "helvetica");

  const formPdfBytes = doc.output("arraybuffer");

  // 2. Start merging with pdf-lib
  const merged = await PDFDocument.create();

  // Add form page
  const formDoc = await PDFDocument.load(formPdfBytes);
  const [formPage] = await merged.copyPages(formDoc, [0]);
  merged.addPage(formPage);

  // Add fillable text fields for talousvastaava
  const MM = 2.8346;
  const PH = 297;
  const ml = 14, mr = 196;
  const form = merged.getForm();
  const fieldOpts = (x, yTop, w, h) => ({
    x: x * MM,
    y: (PH - yTop - h) * MM,
    width: w * MM,
    height: h * MM,
    borderWidth: 0.5,
    borderColor: rgb(0.75, 0.75, 0.75),
    backgroundColor: rgb(1, 1, 1),
  });

  // Tosite nro (white box, below divider at y=8mm)
  form.createTextField("tosite_nro").addToPage(formPage, fieldOpts(tnX + 1, 8.5, tnW - 2, 9));

  // Talousvastaava fields
  form.createTextField("hyvaksytty").addToPage(formPage, fieldOpts(ml + 22, tvY + 6.5, 68, 5));
  form.createTextField("pvm").addToPage(formPage, fieldOpts(ml + 110, tvY + 6.5, mr - 2 - (ml + 110), 5));
  form.createTextField("maksettu").addToPage(formPage, fieldOpts(ml + 19, tvY + 13.5, 71, 5));
  form.createTextField("lisatiedot").addToPage(formPage, fieldOpts(ml + 20, tvY + 20.5, mr - 2 - (ml + 20), 5));

  // 3. Append each attachment
  for (const file of (data.attachedFiles || [])) {
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    if (isPdf) {
      try {
        const arrayBuf = await file.arrayBuffer();
        const attachDoc = await PDFDocument.load(arrayBuf, { ignoreEncryption: true });
        const pages = await merged.copyPages(attachDoc, [...Array(attachDoc.getPageCount()).keys()]);
        pages.forEach(p => merged.addPage(p));
      } catch (e) {
        // skip unreadable PDF
      }
    } else if (isImage) {
      try {
        const arrayBuf = await file.arrayBuffer();
        const jpegBuf = await normalizeToJpeg(arrayBuf, 1400, 0.8);
        const imgPage = merged.addPage();
        const { width, height } = imgPage.getSize();
        const imgEmbed = await merged.embedJpg(jpegBuf);
        const scale = Math.min(width / imgEmbed.width, height / imgEmbed.height, 1);
        imgPage.drawImage(imgEmbed, {
          x: (width - imgEmbed.width * scale) / 2,
          y: (height - imgEmbed.height * scale) / 2,
          width: imgEmbed.width * scale,
          height: imgEmbed.height * scale,
        });
      } catch (e) {
        // skip unreadable image
      }
    }
  }

  // 4. Download
  const finalBytes = await merged.save();
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  if (finalBytes.byteLength > MAX_SIZE) {
    const mb = (finalBytes.byteLength / (1024 * 1024)).toFixed(1);
    throw new Error(`PDF on liian suuri (${mb} Mt). Maksimikoko on 10 Mt. Vähennä liitteitä tai käytä pienempiä tiedostoja.`);
  }
  const blob = new Blob([finalBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const tapahtumaSlug = data.tapahtuma ? `_${data.tapahtuma.replace(/\s+/g, "_")}` : "";
  a.download = data.formType === "kilometrikorvaus"
    ? `${data.dateField.replace(/\./g, "-")}_kilometrikorvaus_${data.name.replace(/\s+/g, "_")}.pdf`
    : `${data.dateField.replace(/\./g, "-")}_kulukorvaus_${data.name.replace(/\s+/g, "_")}${tapahtumaSlug}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

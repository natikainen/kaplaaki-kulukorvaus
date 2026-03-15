import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";

const NAVY = [0, 31, 63];
const LIGHT = [240, 244, 248];

function addFormPage(doc, data) {
  const { name, phone, email, bank, iban, formType, eventTitle, estiemEventType,
    rows, total, attachmentDesc, location, dateField, signature } = data;

  const W = 210, ml = 14, mr = 196;

  // Header background
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 28, "F");

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("KAPLAAKI RY", ml, 12);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("KULUKORVAUSANOMUS", ml, 18);
  doc.setFontSize(7);
  doc.text("Laserkatu 10, 53850 Lappeenranta", mr, 12, { align: "right" });

  // Form type badge
  const badge = formType === "estiem"
    ? `ESTIEM-matka${eventTitle ? ` — ${eventTitle}` : ""}${estiemEventType ? ` (${estiemEventType})` : ""}`
    : "Normaali kulukorvaus";
  doc.setFillColor(220, 235, 255);
  doc.setDrawColor(...NAVY);
  doc.roundedRect(ml, 32, mr - ml, 8, 2, 2, "FD");
  doc.setTextColor(...NAVY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(badge, W / 2, 37.5, { align: "center" });

  let y = 46;

  // Section helper
  const section = (title) => {
    doc.setFillColor(...NAVY);
    doc.rect(ml, y, mr - ml, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(title, ml + 2, y + 4.2);
    y += 9;
  };

  const field = (label, value, x, w, inline = false) => {
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(label, x, y);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
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
  field("Sähköposti", email, ml + 90, 96, true);
  y += 12;
  field("Pankki / BIC", bank, ml, 50);
  field("IBAN", iban, ml + 60, mr - ml - 60, true);
  y += 14;

  // Erittely
  section("ERITTELY");

  // Table header
  doc.setFillColor(...LIGHT);
  doc.rect(ml, y, mr - ml, 6, "F");
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
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
    doc.setFont("helvetica", "normal");
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
  doc.setFont("helvetica", "bold");
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
  doc.setFillColor(...LIGHT);
  doc.rect(ml, y, mr - ml, 22, "F");
  doc.setDrawColor(180, 180, 180);
  doc.rect(ml, y, mr - ml, 22);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("TALOUSVASTAAVA TÄYTTÄÄ", ml + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text("Hyväksytty: ___________________", ml + 2, y + 10);
  doc.text("Maksettu: ___________________", ml + 2, y + 16);
  doc.text("Tosite nro: ___________________", ml + 70, y + 10);
  doc.text("PVM: ___________________", ml + 70, y + 16);

  // Footer
  doc.setTextColor(160, 160, 160);
  doc.setFontSize(6);
  doc.text(`Tulostettu: ${new Date().toLocaleDateString("fi-FI")}  |  Kaplaaki ry — Tuotantotalouden kilta — LUT-yliopisto`, W / 2, 293, { align: "center" });
}

async function fileToImageDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function generateAndDownloadPDF(data) {
  // 1. Generate form page with jsPDF
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  addFormPage(doc, data);

  const formPdfBytes = doc.output("arraybuffer");

  // 2. Start merging with pdf-lib
  const merged = await PDFDocument.create();

  // Add form page
  const formDoc = await PDFDocument.load(formPdfBytes);
  const [formPage] = await merged.copyPages(formDoc, [0]);
  merged.addPage(formPage);

  // 3. Append each attachment
  for (const file of data.attachedFiles) {
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (isPdf) {
      try {
        const arrayBuf = await file.arrayBuffer();
        const attachDoc = await PDFDocument.load(arrayBuf, { ignoreEncryption: true });
        const pageCount = attachDoc.getPageCount();
        const pages = await merged.copyPages(attachDoc, [...Array(pageCount).keys()]);
        pages.forEach(p => merged.addPage(p));
      } catch (e) {
        // skip unreadable PDF
      }
    } else if (isImage) {
      try {
        const dataUrl = await fileToImageDataUrl(file);
        const imgPage = merged.addPage();
        const { width, height } = imgPage.getSize();
        let imgEmbed;
        if (file.type === "image/png") {
          imgEmbed = await merged.embedPng(dataUrl);
        } else {
          imgEmbed = await merged.embedJpg(dataUrl);
        }
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
  const blob = new Blob([finalBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kulukorvaus_${data.name.replace(/\s+/g, "_")}_${data.dateField.replace(/\./g, "-")}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

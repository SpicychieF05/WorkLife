import React, { useState } from 'react';
import { FlightState } from '../types/game';
import { formatPackage } from '../game/companies';
import { X, Copy, Download, Check, ShieldCheck, Printer } from 'lucide-react';

interface RelievingLetterModalProps {
  flight: FlightState;
  onClose: () => void;
}

export const RelievingLetterModal: React.FC<RelievingLetterModalProps> = ({
  flight,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const candidateName = flight.candidateName || (flight.character === 'boy' ? 'Rahul Mukherjee' : 'Ananya Sen');
  const empId = `WL-${Math.floor(10000 + flight.age * 123)}`;
  const finalCTC = formatPackage(flight.packageLPA);
  const tenureYears = Math.max(0.1, flight.age - 22.0).toFixed(1);
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const letterText = `WORKLIFE IT SOLUTIONS PVT. LTD.
SEZ Tech Corridor, Cyber Towers Phase 1, Hinjawadi, Pune - 411057

REF NO: WL/HR/F&F/2026/${Math.floor(flight.age * 987)}
DATE: ${currentDate}

SUBJECT: SERVICE CERTIFICATE & FULL AND FINAL SETTLEMENT STATEMENT

TO WHOMSOEVER IT MAY CONCERN

This is to certify that ${candidateName} (Employee Code: ${empId}) was in active employment with WorkLife IT Solutions from Age 22.0 years until cessation of service at Age ${flight.age.toFixed(1)} years (Total Corporate Tenure: ${tenureYears} years).

During the aforementioned tenure, the employee served with designation "${flight.targetRole}" and successfully cleared ${flight.score} institutional company promotion gates.

COMPENSATION & SETTLEMENT DETAILS:
- Last Drawn Annual CTC: ${finalCTC}
- Notice Period Status: Waived as per project deallocation protocol
- Asset Handover: Completed & verified at security desk
- Final Dues: Settled with standard bell-curve adjustments

We acknowledge the employee's dedication to the sprint backlog and release deliverables. We wish them all success in their future endeavors.

Yours sincerely,
Head of Human Resources & People Operations
WorkLife Technologies India Pvt. Ltd.
[DIGITALLY STAMPED & VERIFIED]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [printNotice, setPrintNotice] = useState<string | null>(null);

  const handlePrint = () => {
    try {
      // 1. Create a dedicated hidden iframe with isolated A4 print stylesheet
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!doc) {
        window.print();
        return;
      }

      doc.open();
      doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Relieving Letter - ${candidateName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 24px;
      font-size: 13px;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .border-frame {
      border: 2px solid #0f172a;
      padding: 24px 28px;
      position: relative;
    }
    .inner-border {
      border: 1px solid #d97706;
      position: absolute;
      inset: 4px;
      pointer-events: none;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .company-name {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .address {
      font-size: 11px;
      color: #475569;
      margin-top: 4px;
    }
    .cin {
      font-size: 10px;
      color: #64748b;
      font-family: monospace;
      margin-top: 2px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-family: monospace;
      font-size: 11px;
      color: #334155;
      margin-bottom: 16px;
    }
    .subject-title {
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .subject {
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      color: #1e293b;
      text-decoration: underline;
      text-underline-offset: 4px;
      margin-bottom: 18px;
    }
    p {
      margin-bottom: 12px;
      text-align: justify;
    }
    .table-container {
      margin: 16px 0;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    th {
      background-color: #1e293b;
      color: #ffffff;
      padding: 8px 12px;
      text-align: left;
      font-weight: bold;
    }
    td {
      padding: 8px 12px;
      border-top: 1px solid #e2e8f0;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .ctc-val {
      font-weight: bold;
      color: #4338ca;
      font-family: monospace;
    }
    .sign-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 28px;
      padding-top: 12px;
    }
    .stamp {
      border: 2px dashed #dc2626;
      color: #dc2626;
      padding: 8px 14px;
      text-align: center;
      border-radius: 6px;
      font-size: 10px;
      font-weight: bold;
      transform: rotate(-3deg);
      background-color: rgba(254, 242, 242, 0.6);
    }
    .footer-note {
      text-align: center;
      font-size: 9px;
      color: #94a3b8;
      font-family: monospace;
      margin-top: 20px;
      border-top: 1px solid #f1f5f9;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="border-frame">
    <div class="inner-border"></div>
    <div class="header">
      <div class="company-name">WORKLIFE IT SOLUTIONS PRIVATE LIMITED</div>
      <div class="address">SEZ Tech Corridor, Cyber Towers Phase 1, Hinjawadi, Pune - 411057, Maharashtra</div>
      <div class="cin">CIN: U72200PN2026PTC099482 · HR Central Operations · ISO 9001:2015 &amp; CMMI Level 5</div>
    </div>

    <div class="meta-row">
      <span>REF: WL/HR/F&amp;F/2026/${Math.floor(flight.age * 987)}</span>
      <span>DATE: ${currentDate.toUpperCase()}</span>
    </div>

    <div class="subject-title">TO WHOMSOEVER IT MAY CONCERN</div>
    <div class="subject">SUBJECT: SERVICE CERTIFICATE &amp; FULL AND FINAL SETTLEMENT STATEMENT</div>

    <p>This is to formally certify that <strong>${candidateName}</strong> (Employee ID: <code>${empId}</code>) was in continuous and active corporate service with WorkLife IT Solutions Private Limited from campus placement at Age 22.0 years until cessation of service at Age <strong>${flight.age.toFixed(1)} years</strong> (Total Corporate Tenure: ${tenureYears} Years).</p>

    <p>During their tenure with the Organization, the employee held the designation of <strong>"${flight.targetRole}"</strong> and successfully cleared <strong>${flight.score} institutional company promotion gates</strong> across the Indian IT hiring pipeline.</p>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>AUDIT COMPONENT</th>
            <th>ASSESSMENT &amp; STATUS</th>
            <th>VALUE / REMARKS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Last Drawn Annual CTC</strong></td>
            <td>Approved by Leadership &amp; Compensation Committee</td>
            <td class="ctc-val">${finalCTC}</td>
          </tr>
          <tr>
            <td><strong>Notice Period Compliance</strong></td>
            <td>Waived under Project Deallocation Protocol</td>
            <td>Zero Penalty Adjustment</td>
          </tr>
          <tr>
            <td><strong>Hardware &amp; Asset Clearance</strong></td>
            <td>NFC Keycard, Monitor &amp; Laptop Relinquished</td>
            <td>No Dues Certificate Issued</td>
          </tr>
          <tr>
            <td><strong>Provident Fund &amp; Gratuity</strong></td>
            <td>Transferred to Unified Member Portal (EPFO)</td>
            <td>Processed Under Bell Curve</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>We express our sincere appreciation for the employee's dedication to sprint deadlines, client bridge escalations, and release deliverables. Management confirms all company liabilities stand discharged, and we wish them continued success in their upcoming personal and professional endeavors.</p>

    <div class="sign-section">
      <div>
        <div style="font-weight: bold; color: #1e293b; margin-bottom: 4px;">Yours sincerely,</div>
        <div style="font-family: cursive; font-size: 18px; color: #1d4ed8; margin: 8px 0;">Authorized Signatory</div>
        <div style="font-weight: bold; font-size: 12px;">Head of Human Capital Operations</div>
        <div style="color: #64748b; font-size: 11px;">WorkLife Technologies India Pvt. Ltd.</div>
      </div>

      <div class="stamp">
        <div>★ WORKLIFE IT SOLUTIONS ★</div>
        <div>RELIEVING &amp; F&amp;F SEALED</div>
        <div style="color: #16a34a; font-size: 8px; margin-top: 2px;">NO DUES OUTSTANDING</div>
      </div>
    </div>

    <div class="footer-note">
      System Generated Authentic Service Document · Digitally Signed &amp; Sealed · Page 1 of 1
    </div>
  </div>
</body>
</html>`);
      doc.close();

      setTimeout(() => {
        let printed = false;
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          printed = true;
        } catch (iframeErr) {
          console.warn('Iframe print call failed, attempting direct window.print()', iframeErr);
        }

        if (!printed) {
          try {
            window.print();
          } catch (winErr) {
            console.warn('window.print was blocked by browser sandbox; generating A4 image fallback', winErr);
            setPrintNotice('Print dialog blocked by browser preview sandbox. Generating high-res A4 image...');
            handleDownloadA4Image();
          }
        }

        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 4000);
      }, 200);

    } catch (err) {
      console.warn('Print initiation error, falling back to window.print()', err);
      try {
        window.print();
      } catch {
        handleDownloadA4Image();
      }
    }
  };

  // Render high-resolution A4 image (1240 x 1754 px - exact ISO 216 1:1.414 A4 standard at 150 DPI)
  const handleDownloadA4Image = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const A4_WIDTH = 1240;
        const A4_HEIGHT = 1754;
        canvas.width = A4_WIDTH;
        canvas.height = A4_HEIGHT;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Background Parchment
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

        // 2. Double Border Frame (Navy & Gold)
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 40, A4_WIDTH - 80, A4_HEIGHT - 80);

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(48, 48, A4_WIDTH - 96, A4_HEIGHT - 96);

        // Corner decorative brackets
        const drawCornerBracket = (cx: number, cy: number, rot: number) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);
          ctx.fillStyle = '#d97706';
          ctx.fillRect(0, 0, 16, 3);
          ctx.fillRect(0, 0, 3, 16);
          ctx.restore();
        };
        drawCornerBracket(52, 52, 0);
        drawCornerBracket(A4_WIDTH - 52, 52, Math.PI / 2);
        drawCornerBracket(A4_WIDTH - 52, A4_HEIGHT - 52, Math.PI);
        drawCornerBracket(52, A4_HEIGHT - 52, -Math.PI / 2);

        // 3. Faint Background Watermark
        ctx.save();
        ctx.translate(A4_WIDTH / 2, A4_HEIGHT / 2);
        ctx.rotate(-Math.PI / 4);
        ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = 'rgba(15, 23, 42, 0.035)';
        ctx.textAlign = 'center';
        ctx.fillText('WORKLIFE IT · OFFICIAL RELIEVING ORDER', 0, -40);
        ctx.fillText('VERIFIED FULL & FINAL SETTLEMENT', 0, 40);
        ctx.restore();

        // 4. Header: Logo & Company Name
        // Geometric Company Logo Emblem
        const logoX = A4_WIDTH / 2;
        const logoY = 115;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(logoX, logoY, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.moveTo(logoX - 12, logoY - 8);
        ctx.lineTo(logoX, logoY - 18);
        ctx.lineTo(logoX + 12, logoY - 8);
        ctx.lineTo(logoX, logoY + 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('WL', logoX, logoY - 2);

        // Company Title
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 30px "Fraunces", Georgia, serif';
        ctx.fillText('WORKLIFE IT SOLUTIONS PRIVATE LIMITED', A4_WIDTH / 2, 178);

        ctx.font = '500 13px system-ui, sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText('SEZ Tech Corridor, Cyber Towers Phase 1, Hinjawadi, Pune - 411057, Maharashtra, India', A4_WIDTH / 2, 206);

        ctx.font = '11px monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('CIN: U72200PN2026PTC099482 · MCA Registered · ISO 9001:2015 & CMMI Level 5 Certified', A4_WIDTH / 2, 226);

        // Header Divider
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, 248);
        ctx.lineTo(A4_WIDTH - 100, 248);
        ctx.stroke();

        // 5. Reference & Date Line
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'left';
        ctx.fillText(`REF NO: WL/HR/F&F/2026/${Math.floor(flight.age * 987)}`, 100, 280);
        ctx.textAlign = 'right';
        ctx.fillText(`DATE: ${currentDate.toUpperCase()}`, A4_WIDTH - 100, 280);

        // 6. Letter Subject & Salutation
        ctx.textAlign = 'center';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px system-ui, sans-serif';
        ctx.fillText('TO WHOMSOEVER IT MAY CONCERN', A4_WIDTH / 2, 330);

        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillStyle = '#1e293b';
        ctx.fillText('SUBJECT: SERVICE CERTIFICATE & FULL AND FINAL SETTLEMENT STATEMENT', A4_WIDTH / 2, 360);

        // Decorative Underline under subject
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(A4_WIDTH / 2 - 240, 372);
        ctx.lineTo(A4_WIDTH / 2 + 240, 372);
        ctx.stroke();

        // 7. Body Paragraphs
        ctx.textAlign = 'left';
        ctx.fillStyle = '#1e293b';
        ctx.font = '15px "Fraunces", Georgia, serif';
        const lineHeight = 28;
        let y = 430;

        const p1 = `This is to formally certify that ${candidateName} (Employee Code: ${empId}) was in continuous and active corporate employment with WorkLife IT Solutions Private Limited from campus induction at Age 22.0 years until cessation of service at Age ${flight.age.toFixed(1)} years (Total Corporate Tenure: ${tenureYears} Years).`;

        // Wrap text helper
        const wrapText = (text: string, x: number, startY: number, maxW: number, lHeight: number) => {
          const words = text.split(' ');
          let line = '';
          let curY = startY;
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxW && n > 0) {
              ctx.fillText(line, x, curY);
              line = words[n] + ' ';
              curY += lHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, x, curY);
          return curY + lHeight;
        };

        y = wrapText(p1, 100, y, A4_WIDTH - 200, lineHeight);
        y += 8;

        const p2 = `During their tenure with the Organization, the employee served with the designation of "${flight.targetRole}" and cleared ${flight.score} institutional company promotion gates across the campus and corporate recruitment pipelines.`;
        y = wrapText(p2, 100, y, A4_WIDTH - 200, lineHeight);
        y += 18;

        // 8. Settlement Table
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('COMPENSATION & CLEARANCE AUDIT TABLE:', 100, y);
        y += 14;

        // Table Header
        const tableX = 100;
        const tableW = A4_WIDTH - 200;
        const rowH = 40;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(tableX, y, tableW, rowH);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText('AUDIT COMPONENT', tableX + 16, y + 25);
        ctx.fillText('HR ASSESSMENT & STATUS', tableX + 320, y + 25);
        ctx.fillText('RECORD VALUE', tableX + 720, y + 25);

        y += rowH;

        // Table Rows
        const rows = [
          ['Last Drawn Annual CTC', 'Approved by Senior Leadership & Compensation Committee', finalCTC],
          ['Notice Period Compliance', 'Waived under Project Transition & Deallocation Protocol', 'Zero Penalty'],
          ['Hardware & Asset Clearance', 'NFC Keycard, Monitor & Laptop Cleared at Turnstile', 'No Dues Issued'],
          ['Provident Fund & Gratuity', 'Transferred to Unified Member Portal (EPFO)', 'Processed Under Bell Curve']
        ];

        ctx.font = '12px system-ui, sans-serif';
        rows.forEach((r, idx) => {
          ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
          ctx.fillRect(tableX, y, tableW, rowH);

          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.strokeRect(tableX, y, tableW, rowH);

          ctx.fillStyle = '#0f172a';
          ctx.font = '600 12px system-ui, sans-serif';
          ctx.fillText(r[0], tableX + 16, y + 25);

          ctx.fillStyle = '#475569';
          ctx.font = '12px system-ui, sans-serif';
          ctx.fillText(r[1], tableX + 320, y + 25);

          ctx.fillStyle = idx === 0 ? '#4338ca' : '#0f172a';
          ctx.font = 'bold 12px monospace';
          ctx.fillText(r[2], tableX + 720, y + 25);

          y += rowH;
        });

        y += 24;

        // 9. Satirical HR Recommendation Paragraph
        ctx.font = '14px "Fraunces", Georgia, serif';
        ctx.fillStyle = '#334155';
        const p3 = `We express our sincere appreciation for the employee's dedication to sprint deadlines, client bridge escalations, and weekend production deployments. Management confirms all company liabilities stand discharged, and we wish them continued success in their upcoming personal and professional endeavors.`;
        y = wrapText(p3, 100, y, A4_WIDTH - 200, lineHeight);
        y += 40;

        // 10. Signatures and Verified Stamp Section
        // Left: Head of HR Signature
        ctx.font = '13px system-ui, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('Yours faithfully,', 100, y);
        y += 20;

        // Draw stylish handwritten blue ink signature
        ctx.save();
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(100, y + 25);
        ctx.bezierCurveTo(130, y + 5, 150, y + 45, 180, y + 15);
        ctx.bezierCurveTo(200, y + 35, 230, y + 10, 260, y + 25);
        ctx.stroke();

        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(95, y + 32);
        ctx.lineTo(265, y + 32);
        ctx.stroke();
        ctx.restore();

        y += 55;
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('Head of Human Capital & People Operations', 100, y);
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('WorkLife Technologies India Private Limited', 100, y + 20);

        // Right: Official Circular Stamp Seal
        const stampX = A4_WIDTH - 260;
        const stampY = y - 25;
        ctx.save();
        ctx.translate(stampX, stampY);
        ctx.rotate(-0.07); // Slight authentic tilted angle

        // Double Stamp Circles in Crimson Red
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 72, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, 64, 0, Math.PI * 2);
        ctx.stroke();

        // Stamp Inner Text
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('★ WORKLIFE IT SOLUTIONS ★', 0, -42);
        ctx.fillText('PUNE SEZ · CYBER HUB', 0, 48);

        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText('RELIEVING ORDER', 0, -10);
        ctx.fillText('& SETTLEMENT', 0, 8);

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#16a34a'; // Green verified text
        ctx.fillText('APPROVED & SEALED', 0, 26);

        ctx.restore();

        // 11. Bottom Page Footnote
        ctx.textAlign = 'center';
        ctx.font = '10px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('System Generated Authentic Document · Digitally Signed & Sealed · Page 1 of 1', A4_WIDTH / 2, A4_HEIGHT - 65);

        // Export as High-Quality PNG
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const cleanName = candidateName.trim().replace(/\s+/g, '_') || 'Employee';
          link.href = url;
          link.download = `Relieving_Letter_${cleanName}_A4.png`;
          link.click();
          URL.revokeObjectURL(url);
          setIsGenerating(false);
        }, 'image/png', 1.0);

      } catch (err) {
        console.error('Failed to generate A4 image', err);
        setIsGenerating(false);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto print-modal-overlay">
      <div className="relative w-full max-w-2xl bg-[#fffefc] border border-amber-200/80 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-800 print-modal-card">
        
        {/* Top Decorative Border */}
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-slate-800 to-amber-500 print:hidden print-hidden" />

        {/* Print Notice (if sandbox intercepts) */}
        {printNotice && (
          <div className="p-2.5 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center font-medium print:hidden print-hidden">
            {printNotice}
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-6 pb-0 flex items-center justify-between border-b border-slate-100 print:hidden print-hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-600" />
            <span className="text-xs font-mono font-bold tracking-widest text-slate-600 uppercase">
              OFFICIAL SERVICE CERTIFICATE &amp; RELIEVING SLIP
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Letter Body (Paper Style) */}
        <div className="p-6 sm:p-8 space-y-4 font-serif text-slate-800 text-xs sm:text-sm leading-relaxed max-h-[60vh] overflow-y-auto print-modal-body">
          
          {/* Company Letterhead */}
          <div className="text-center border-b border-slate-200 pb-4 font-sans">
            <h2 className="text-lg font-black tracking-tight text-slate-900 font-display">
              WORKLIFE IT SOLUTIONS PRIVATE LIMITED
            </h2>
            <p className="text-[11px] text-slate-600">
              SEZ Tech Corridor, Cyber Towers Phase 1, Hinjawadi, Pune - 411057
            </p>
            <p className="text-[10px] font-mono text-slate-600 mt-1">
              CIN: U72200PN2026PTC099482 · HR Central Operations · ISO 9001:2015
            </p>
          </div>

          {/* Letter Meta */}
          <div className="flex justify-between text-xs text-slate-600 font-mono">
            <span>REF: WL/HR/F&amp;F/2026/{Math.floor(flight.age * 987)}</span>
            <span>DATE: {currentDate}</span>
          </div>

          <div className="pt-2">
            <p className="font-sans font-bold text-slate-900 uppercase tracking-wide text-xs">
              TO WHOMSOEVER IT MAY CONCERN
            </p>
          </div>

          <p>
            This is to certify that <strong className="text-slate-900">{candidateName}</strong> (Employee ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">{empId}</code>) was in active corporate service with WorkLife Technologies from age 22.0 years until retirement/exit at age <strong className="text-slate-900">{flight.age.toFixed(1)} years</strong> (Total Corporate Tenure: {tenureYears} years).
          </p>

          <p>
            During their service, the employee held the title of <strong className="text-slate-900">&ldquo;{flight.targetRole}&rdquo;</strong> and successfully negotiated <strong>{flight.score} institutional company promotion gates</strong> across the Indian IT hiring pipeline.
          </p>

          {/* Settlement Breakdown Box */}
          <div className="font-sans p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex justify-between border-b border-slate-200 pb-1.5">
              <span>Full &amp; Final Remuneration Summary</span>
              <span className="font-mono text-indigo-600 font-bold">{finalCTC}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Notice Period Protocol:</span>
              <span className="font-medium text-slate-800">Waived by management under project deallocation</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Asset Clearance Status:</span>
              <span className="font-medium text-slate-800">Turnstile keycard &amp; laptop relinquished</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>PF &amp; Gratuity Credited:</span>
              <span className="font-medium text-slate-800">Subject to 6-month bell-curve processing</span>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            We thank the employee for sacrificing their evenings and weekends for quarterly release deliverables. We wish them all the best in their subsequent endeavors.
          </p>

          {/* HR Signature Stamp */}
          <div className="pt-4 flex items-center justify-between font-sans">
            <div>
              <p className="font-bold text-xs text-slate-900">Head of Human Capital</p>
              <p className="text-[11px] text-slate-600">WorkLife India Operations</p>
            </div>

            {/* Visual Stamp */}
            <div className="border-2 border-dashed border-red-500/70 rounded-lg p-2 text-center text-red-700 transform -rotate-3 bg-red-50/50">
              <span className="text-[9px] font-black tracking-widest uppercase block">
                ★ RELIEVING SEALED ★
              </span>
              <span className="text-[8px] font-mono block text-emerald-700">NO DUES OUTSTANDING</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 print:hidden print-hidden">
          <button
            onClick={handleCopy}
            className="py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Text!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            title="Print or Save as PDF"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>

          {/* A4 Image Download Button */}
          <button
            onClick={handleDownloadA4Image}
            disabled={isGenerating}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#1e293b] hover:bg-indigo-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-75"
          >
            <Download size={14} />
            <span>{isGenerating ? 'Generating A4 Image...' : 'Download A4 Letter (Image)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

import { formatCurrency, formatDate } from "@/utils";

// Opens a new window with a clean printable receipt and triggers print.
export function openReceipt(donation, user) {
  const receiptNumber = `RCP-${donation.id.toUpperCase()}`;
  const donorName = user?.name ?? "Anonymous Donor";
  const date = formatDate(donation.date);
  const amount = formatCurrency(donation.amount);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Donation Receipt ${receiptNumber}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f9fafb;
    color: #111827;
    padding: 40px 20px;
  }
  .receipt {
    max-width: 600px;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .header {
    background: #0d9488;
    color: #fff;
    padding: 28px 32px;
  }
  .header h1 { font-size: 24px; font-weight: 700; }
  .header p { font-size: 13px; opacity: 0.85; margin-top: 4px; }
  .body { padding: 28px 32px; }
  .receipt-num {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 24px;
    text-align: right;
  }
  .row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
  }
  .row:last-child { border-bottom: none; }
  .label { font-size: 14px; color: #6b7280; }
  .value { font-size: 14px; font-weight: 600; color: #111827; }
  .amount-row .value { font-size: 20px; color: #0d9488; }
  .footer {
    padding: 20px 32px 28px;
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
  }
  @media print {
    body { background: #fff; padding: 0; }
    .receipt { box-shadow: none; max-width: 100%; }
  }
</style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>GiveHope</h1>
      <p>Official Donation Receipt</p>
    </div>
    <div class="body">
      <div class="receipt-num">Receipt #: ${receiptNumber}</div>
      <div class="row">
        <span class="label">Donor Name</span>
        <span class="value">${donorName}</span>
      </div>
      <div class="row">
        <span class="label">Campaign</span>
        <span class="value">${donation.campaignTitle}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${date}</span>
      </div>
      <div class="row">
        <span class="label">Status</span>
        <span class="value" style="text-transform: capitalize;">${donation.status}</span>
      </div>
      <div class="row amount-row">
        <span class="label">Amount</span>
        <span class="value">${amount}</span>
      </div>
    </div>
    <div class="footer">
      Thank you for your generosity.<br />
      GiveHope is a registered non-profit organization.<br />
      This receipt is computer-generated and valid without signature.
    </div>
  </div>
  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const w = window.open("", "_blank", "width=700,height=600");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

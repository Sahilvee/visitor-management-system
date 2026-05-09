export const approvalEmailTemplate = ({
  visitorName,
  visitPurpose,
  visitDate
}) => `
  <div style="font-family: Arial, sans-serif; padding:20px;">

    <h2>Appointment Approved ✅</h2>

    <p>Hello <b>${visitorName}</b>,</p>

    <p>Your visitor appointment has been 
    <b style="color:green;">approved</b>.</p>

    <hr/>

    <h3>Visit Details</h3>

    <p><b>Purpose:</b> ${visitPurpose}</p>
    <p><b>Date:</b> ${visitDate}</p>

    <hr/>

    <p>Please present the following QR code at the reception desk:</p>

    <div style="margin:20px 0; text-align:center;">
      <img src="cid:qrimage" alt="Visitor QR Code" width="200"/>
    </div>

    <p>This QR code will be scanned at the front desk for entry.</p>

    <br/>

    <p>Thank you,<br/>
    <b>Visitor Pass System</b></p>

  </div>
`;
export const rejectionEmailTemplate = ({ visitorName, visitPurpose, visitDate, reason }) => `
  <div style="font-family: Arial, sans-serif; padding:20px;">

    <h2>Appointment Request Update ❌</h2>

    <p>Hello <b>${visitorName}</b>,</p>

    <p>We regret to inform you that your visitor appointment request has been 
    <b style="color:red;">rejected</b>.</p>

    <hr/>

    <h3>Request Details</h3>

    <p><b>Purpose:</b> ${visitPurpose}</p>
    <p><b>Date:</b> ${visitDate}</p>

    <p><b>Reason:</b> ${reason || "Not specified"}</p>

    <hr/>

    <p>If you believe this was a mistake or need to reschedule, please contact the host or submit a new request.</p>

    <br/>

    <p>Thank you,<br/>
    <b>Visitor Pass System</b></p>

  </div>
`;export const appointmentRequestTemplate = ({
  visitorName,
  visitPurpose,
  visitDate,
  hostName,
  trackingId
}) => `
  <div style="font-family: Arial, sans-serif; padding:20px; background:#f4f6f8;">

    <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

      <h2 style="color:#4f46e5;">Appointment Request Submitted 📅</h2>

      <p>Hello <b>${visitorName}</b>,</p>

      <p>Your visitor appointment request has been <b>successfully submitted</b>.</p>

      <!-- 🔥 Tracking ID Highlight -->
      <div style="
        margin:20px 0;
        padding:15px;
        background:#eef2ff;
        border-left:5px solid #4f46e5;
        border-radius:8px;
        text-align:center;
      ">
        <p style="margin:0; font-size:14px; color:#555;">Your Tracking ID</p>
        <h2 style="margin:5px 0; color:#4f46e5; letter-spacing:2px;">
          ${trackingId}
        </h2>
        <p style="font-size:12px; color:#777;">
          Use this ID to track your appointment status
        </p>
      </div>

      <hr/>

      <h3 style="color:#333;">Request Details</h3>

      <p><b>Purpose:</b> ${visitPurpose}</p>
      <p><b>Date:</b> ${visitDate}</p>
      <p><b>Host:</b> ${hostName}</p>

      <hr/>

      <p>
        Your request is currently 
        <b style="color:orange;">pending approval</b> from the host or administrator.
      </p>

      <p>You will receive another email once the request is approved or rejected.</p>

      <br/>

      <p>
        Thank you,<br/>
        <b style="color:#4f46e5;">Visitor Pass System</b>
      </p>

    </div>

  </div>
`;
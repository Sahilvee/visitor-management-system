import PDFDocument from "pdfkit";
import Appointment from "../model/appiontmentmodel.js";

export const exportAppointmentsService = async () => {

  const appointments = await Appointment.find()
    .populate("visitorId")
    .populate("hostId");

  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  const buffers = [];

  doc.on("data", (chunk) => {
    buffers.push(chunk);
  });

  // ===================================================
  // HEADER
  // ===================================================

  doc
    .rect(0, 0, 595, 80)
    .fill("#0F172A");

  doc
    .fillColor("white")
    .fontSize(24)
    .text(
      "Visitor Management System",
      40,
      25
    );

  doc
    .fontSize(12)
    .text(
      "Appointments Export Report",
      40,
      55
    );

  doc.moveDown(4);

  // ===================================================
  // REPORT INFO
  // ===================================================

  doc
    .fillColor("#111827")
    .fontSize(11)
    .text(
      `Generated At: ${new Date().toLocaleString()}`,
      40,
      100
    );

  doc.moveDown(2);

  // ===================================================
  // APPOINTMENT CARDS
  // ===================================================

  appointments.forEach((a, index) => {

    // ===================================================
    // PAGE BREAK
    // ===================================================

    if (doc.y > 650) {
      doc.addPage();
    }

    const startY = doc.y;

    // ===================================================
    // TITLE
    // ===================================================

    doc
      .fillColor("#2563EB")
      .fontSize(18)
      .text(
        `Appointment #${index + 1}`,
        50,
        startY + 10
      );

    doc.moveDown(1.5);

    // ===================================================
    // VISITOR DETAILS
    // ===================================================

    doc
      .fillColor("#111827")
      .fontSize(14)
      .text("Visitor Details");

    doc
      .fillColor("black")
      .fontSize(12)
      .text(
        `Name: ${a.visitorId?.name || "N/A"}`
      )
      .text(
        `Email: ${a.visitorId?.email || "N/A"}`
      )
      .text(
        `Phone: ${a.visitorId?.phone || "N/A"}`
      );

    doc.moveDown();

    // ===================================================
    // HOST DETAILS
    // ===================================================

    doc
      .fillColor("#111827")
      .fontSize(14)
      .text("Host Details");

    doc
      .fillColor("black")
      .fontSize(12)
      .text(
        `Host Name: ${a.hostId?.name || "N/A"}`
      );

    doc.moveDown();

    // ===================================================
    // APPOINTMENT DETAILS
    // ===================================================

    doc
      .fillColor("#111827")
      .fontSize(14)
      .text("Appointment Details");

    doc
      .fillColor("black")
      .fontSize(12)
      .text(
        `Tracking ID: ${a.trackingId}`
      )
      .text(
        `Purpose: ${a.visitPurpose}`
      )
      .text(
        `Visit Date: ${new Date(
          a.visitDate
        ).toLocaleString()}`
      )
      .text(
        `End Time: ${
          a.endTime
            ? new Date(
                a.endTime
              ).toLocaleString()
            : "N/A"
        }`
      )
      .text(
        `Created At: ${new Date(
          a.createdAt
        ).toLocaleString()}`
      );

    doc.moveDown();

    // ===================================================
    // STATUS
    // ===================================================

    let statusColor = "#2563EB";

    if (a.status === "APPROVED") {
      statusColor = "green";
    }

    else if (a.status === "REJECTED") {
      statusColor = "red";
    }

    else if (a.status === "CHECKED_OUT") {
      statusColor = "#9333EA";
    }

    else if (a.status === "PENDING") {
      statusColor = "#F59E0B";
    }

    doc
      .fillColor(statusColor)
      .fontSize(13)
      .text(
        `Status: ${a.status}`
      );

    doc.moveDown(0.5);

    // ===================================================
    // CHECK IN / OUT
    // ===================================================

    doc
      .fillColor("black")
      .fontSize(11);

    if (a.checkInTime) {

      doc.text(
        `Check-In Time: ${new Date(
          a.checkInTime
        ).toLocaleString()}`
      );
    }

    if (a.checkOutTime) {

      doc.text(
        `Check-Out Time: ${new Date(
          a.checkOutTime
        ).toLocaleString()}`
      );
    }

    if (a.rejectionReason) {

      doc
        .fillColor("red")
        .text(
          `Rejection Reason: ${a.rejectionReason}`
        );
    }

    doc.moveDown(1.5);

    // ===================================================
    // CARD BORDER
    // ===================================================

    const endY = doc.y;

    doc
      .roundedRect(
        35,
        startY,
        525,
        endY - startY + 10,
        10
      )
      .stroke("#CBD5E1");

    doc.moveDown(2);
  });

  // ===================================================
  // FOOTER
  // ===================================================

  doc
    .fontSize(10)
    .fillColor("gray")
    .text(
      "Generated by Visitor Management System",
      170,
      760,
      {
        align: "center",
      }
    );

  doc.end();

  return await new Promise((resolve) => {

    doc.on("end", () => {

      resolve(
        Buffer.concat(buffers)
      );

    });

  });

};
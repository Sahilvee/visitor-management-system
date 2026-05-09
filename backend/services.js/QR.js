import QRCode from "qrcode";
import fs from "fs";

export async function createQRFile(track_appointmentId) {
  
  const filePath = `uploads/qr-${track_appointmentId}.png`;

   await QRCode.toFile(filePath, track_appointmentId.toString());

  return filePath;
}
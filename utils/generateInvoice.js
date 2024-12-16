const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const generateInvoice = (booking) => {
  // Ensure the directory exists
  const tempDir = path.join(__dirname, 'public', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Define the file path where the invoice will be saved
  const invoiceFilePath = path.join(tempDir, `invoice-${booking._id}.pdf`);
  
  // Create a new PDF document
  const doc = new PDFDocument();
  
  // Pipe the PDF into a file stream
  doc.pipe(fs.createWriteStream(invoiceFilePath));
  
  // Add content to the PDF (this is an example, you can customize it)
  doc.fontSize(16).text('Invoice for Tour Package', { align: 'center' });
  doc.fontSize(12).text(`Name: ${booking.name}`);
  doc.text(`Email: ${booking.email}`);
  doc.text(`Phone Number: ${booking.phoneNo}`);
  doc.text(`Members: ${booking.members}`);
  doc.text(`Total Price: $${booking.price}`);
  
  // Finalize the PDF file
  doc.end();
  
  // Return the file path of the saved invoice
  return invoiceFilePath;
};
module.exports={generateInvoice}

import axios from "axios";
import { PDFParse } from "pdf-parse";

/** 
 * Extract text from PDF (supports Cloudinary URL)
 */
export const extractTextFromPDF = async (fileUrl) => {
  try {
    // 🔥 Download file from Cloudinary
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    // Convert to Uint8Array
    const parser = new PDFParse(new Uint8Array(response.data));

    const data = await parser.getText();

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };

  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};
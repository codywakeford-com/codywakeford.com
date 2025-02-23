import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default eventHandler(async (event) => {
  const storage = event.context.storage;
  const reciept = await readBody(event);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1240, height: 1754 });
  const _receipt = encodeURIComponent(JSON.stringify(reciept));

  await page.goto(`http://localhost:3000/pdf/receipt?receipt=${_receipt}`, {
    waitUntil: "networkidle2",
  });

  const filePath = path.resolve("./reciept.pdf");
  const buffer = await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  const fileRef = ref(storage, `receipts/${Date.now()}.receipt.pdf`);
  await uploadBytes(fileRef, buffer, { contentType: "application/pdf" });
  return await getDownloadURL(fileRef);
});

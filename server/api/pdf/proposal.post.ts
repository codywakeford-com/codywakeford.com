import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  ref,
  getStorage,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
} from "firebase/storage";
import { resolve } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default eventHandler(async (event) => {
  const storage = event.context.storage as FirebaseStorage;
  const proposal = await readBody(event);

  console.log(proposal);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1240, height: 1754 });
  const _proposal = encodeURIComponent(JSON.stringify(proposal));

  console.log(_proposal);
  await page.goto(`http://localhost:3000/pdf/proposal?proposal=${_proposal}`, {
    waitUntil: "networkidle2",
  });

  const filePath = resolve("./proposal.pdf");
  const buffer = await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  const fileRef = ref(storage, `proposal/${Date.now()}.proposal.pdf`);
  await uploadBytes(fileRef, buffer, { contentType: "application/pdf" });
  const url = await getDownloadURL(fileRef);

  return url;
});

import { doc, getDoc, updateDoc } from "firebase/firestore";

export default eventHandler(async (event) => {
  const db = event.context.db;
  const { path, data }: Request = await readBody(event);

  const docRef = doc(db, path);

  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Document does not exist",
      });
    }

    const currentData = docSnap.data();
    const updatedData = mergeData(currentData, data);

    // Update the document with the merged data
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
});

interface Request {
  path: string;
  data: {
    key: string;
    value: any;
  };
}
function mergeData(
  currentData: Record<string, any>,
  data: Record<string, any>,
) {
  const result = { ...currentData };

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];

      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null &&
        currentData[key] &&
        typeof currentData[key] === "object"
      ) {
        result[key] = mergeData(currentData[key], value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

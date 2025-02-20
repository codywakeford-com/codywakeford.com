import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export default defineNitroPlugin((nitro) => {
  const firebaseConfig = useRuntimeConfig().public.firebaseConfig;

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  nitro.hooks.hook("request", (event) => {
    event.context.storage = storage;
    event.context.db = firestore;
  });
});

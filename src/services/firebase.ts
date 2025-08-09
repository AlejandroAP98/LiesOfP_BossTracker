import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove } from "firebase/database";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Obtener todos los bosses
export async function fetchBosses() {
  const snapshot = await get(ref(db, "bosses"));

  return snapshot.exists() ? snapshot.val() : {};
}

export const saveDefeated = async (userId: string, defeated: Record<string, boolean>) => {
  if (!userId) return;
  // 🔹 Filtrar para eliminar jefes marcados como false
  const cleanedDefeated = Object.fromEntries(
    Object.entries(defeated).filter(([_, value]) => value === true)
  );
  try {
    await set(ref(db, `usuarios/${userId}/derrotados`), cleanedDefeated);
  } catch (error) {
    console.error("Error guardando defeated en Firebase:", error);
  }
};


// Cargar progreso de derrotados
export async function fetchDefeated(userId: string) {
  const snapshot = await get(ref(db, `usuarios/${userId}/derrotados`));
  return snapshot.exists() ? snapshot.val() : {};
}

export async function saveTimeFirebase(bossId: string, time: number, userId: string){
    try {
      await set(ref(db, `usuarios/${userId}/tiempos/${bossId}`), time);
    } catch (err) {
      console.error("Error al guardar en Firebase:", err);
    }
  };

  export async function fetchTimes(userId: string) {
  const snapshot = await get(ref(db, `usuarios/${userId}/tiempos`));
  return snapshot.exists() ? snapshot.val() : {};
}

export async function deleteTimeFirebase(bossId: string, userId: string) {
  try {
    await remove(ref(db, `usuarios/${userId}/tiempos/${bossId}`));
  } catch (err) {
    console.error("Error al eliminar tiempo en Firebase:", err);
  }
}

export const fetchUsername = () => {
  const username = localStorage.getItem("bossTracker_username");
  return username || "";
};

export async function loadUserDataFromFirebase(userId: string) {
  try {
    const db = getDatabase();

    // Leer derrotados
    const defeatedSnap = await get(ref(db, `usuarios/${userId}/derrotados`));
    const defeatedData = defeatedSnap.exists() ? defeatedSnap.val() : {};

    // Leer timers
    const timersSnap = await get(ref(db, `usuarios/${userId}/tiempos`));
    const timersData = timersSnap.exists() ? timersSnap.val() : {};

    return {
      defeated: defeatedData,
      timers: timersData
    };
  } catch (error) {
    console.error("Error cargando datos desde Firebase:", error);
    return { defeated: {}, timers: {} };
  }
}
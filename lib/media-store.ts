export type StoredMedia = {
  id: string;
  dataUrl: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
};

const DB_NAME = "aria-resume-media";
const STORE_NAME = "media";
const CONTENT_STORE_NAME = "content";
const DB_VERSION = 2;
const CONTENT_KEY = "resume-v4";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(CONTENT_STORE_NAME)) {
        database.createObjectStore(CONTENT_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putMedia(media: StoredMedia): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(media);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export async function getMedia(id: string): Promise<StoredMedia | null> {
  const database = await openDatabase();
  const result = await new Promise<StoredMedia | null>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve((request.result as StoredMedia) ?? null);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return result;
}

export async function getMediaByIds(
  ids: string[],
): Promise<Record<string, StoredMedia>> {
  const entries = await Promise.all(
    ids.map(async (id) => [id, await getMedia(id)] as const),
  );
  return entries.reduce<Record<string, StoredMedia>>((result, [id, media]) => {
    if (media) result[id] = media;
    return result;
  }, {});
}

export async function putContent<T>(content: T): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(CONTENT_STORE_NAME, "readwrite");
    transaction.objectStore(CONTENT_STORE_NAME).put(content, CONTENT_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export async function getContent<T>(): Promise<T | null> {
  const database = await openDatabase();
  const result = await new Promise<T | null>((resolve, reject) => {
    const transaction = database.transaction(CONTENT_STORE_NAME, "readonly");
    const request = transaction.objectStore(CONTENT_STORE_NAME).get(CONTENT_KEY);
    request.onsuccess = () => resolve((request.result as T) ?? null);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return result;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

import { ContentFile } from './types';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  getFirestore 
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Helper to get firestore instance
const getDb = () => {
  const { firestore } = initializeFirebase();
  return firestore;
};

export async function getFiles(): Promise<ContentFile[]> {
  const db = getDb();
  const filesCol = collection(db, 'files');
  const q = query(filesCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ContentFile));
}

export async function addFile(file: Omit<ContentFile, 'id'>) {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'files'), {
    ...file,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...file } as ContentFile;
}

export async function deleteFile(id: string) {
  const db = getDb();
  await deleteDoc(doc(db, 'files', id));
}

export async function updateFileTags(id: string, tags: string[]) {
  // Logic for updating tags if needed
}

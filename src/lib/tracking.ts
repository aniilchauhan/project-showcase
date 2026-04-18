import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export async function trackProjectView(projectId: string) {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      views: increment(1)
    });
  } catch (error) {
    console.warn('Silent skip: View tracking failed', error);
  }
}

export async function trackProjectClick(projectId: string) {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      clicks: increment(1)
    });
  } catch (error) {
    console.warn('Silent skip: Click tracking failed', error);
  }
}

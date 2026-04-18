import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Project } from '../types';
import { SAMPLE_PROJECTS } from '../constants';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Handle Firestore Timestamp to ISO string
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
        } as Project;
      });
      
      // If no projects in Firestore yet, show sample data for preview
      setProjects(projectsData.length > 0 ? projectsData : SAMPLE_PROJECTS);
      setLoading(false);
    }, (error) => {
      // Don't crash if it's just a permission error on launch
      console.warn('Projects fetch issue:', error);
      setProjects(SAMPLE_PROJECTS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { projects, loading };
}

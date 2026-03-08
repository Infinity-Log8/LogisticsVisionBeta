import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const LOG_REF = doc(db, "_claude_sessions", "progress_log");

export async function readProgressLog() {
  const snap = await getDoc(LOG_REF);
  return snap.exists() ? snap.data() : null;
}

export async function updateProgressLog(update: {
  completed_task?: string;
  in_progress?: string;
  next_steps?: string[];
  notes?: string;
}) {
  const snap = await getDoc(LOG_REF);
  const existing = snap.exists() ? snap.data() : { completed_tasks: [] };

  await setDoc(LOG_REF, {
    ...existing,
    completed_tasks: update.completed_task
      ? [...(existing.completed_tasks || []), update.completed_task]
      : existing.completed_tasks,
    in_progress: update.in_progress ?? existing.in_progress,
    next_steps: update.next_steps ?? existing.next_steps,
    notes: update.notes ?? existing.notes,
    last_updated: serverTimestamp(),
  });
}

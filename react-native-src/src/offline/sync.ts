/**
 * KarmSetu Offline Sync Engine
 * Handles caching skill assessments and voice transcripts locally using MMKV/SQLite,
 * and pushing them to Firebase when network connection becomes available.
 */

// Simple mock for MMKV storage
class Storage {
  private data: Record<string, string> = {};
  set(key: string, value: string) { this.data[key] = value; }
  getString(key: string) { return this.data[key] || null; }
}

const storage = new Storage();

export interface PendingSyncItem {
  id: string;
  type: 'video_assessment' | 'voice_interview';
  skill: string;
  payload: any;
  timestamp: number;
}

const SYNC_QUEUE_KEY = 'karmsetu.sync_queue';

/**
 * Push an assessment to the local offline queue
 */
export async function queueOfflineAssessment(
  type: PendingSyncItem['type'],
  skill: string,
  payload: any
): Promise<void> {
  const currentQueueJson = storage.getString(SYNC_QUEUE_KEY);
  const queue: PendingSyncItem[] = currentQueueJson ? JSON.parse(currentQueueJson) : [];

  const newItem: PendingSyncItem = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type,
    skill,
    payload,
    timestamp: Date.now()
  };

  queue.push(newItem);
  storage.set(SYNC_QUEUE_KEY, JSON.stringify(queue));
  
  console.log(`[Offline Sync] Queued ${type} for ${skill}. Total items: ${queue.length}`);
}

/**
 * Retrieve all pending items in the offline queue
 */
export function getPendingSyncItems(): PendingSyncItem[] {
  const currentQueueJson = storage.getString(SYNC_QUEUE_KEY);
  return currentQueueJson ? JSON.parse(currentQueueJson) : [];
}

/**
 * Process and upload the queue to server
 */
export async function processSyncQueue(
  uploadToServerCallback: (item: PendingSyncItem) => Promise<boolean>
): Promise<{ successCount: number; failedCount: number }> {
  const queue = getPendingSyncItems();
  if (queue.length === 0) {
    return { successCount: 0, failedCount: 0 };
  }

  console.log(`[Offline Sync] Starting sync of ${queue.length} items...`);
  
  const remainingItems: PendingSyncItem[] = [];
  let successCount = 0;
  let failedCount = 0;

  for (const item of queue) {
    try {
      const success = await uploadToServerCallback(item);
      if (success) {
        successCount++;
        console.log(`[Offline Sync] Successfully synced item: ${item.id}`);
      } else {
        remainingItems.push(item);
        failedCount++;
      }
    } catch (error) {
      console.error(`[Offline Sync] Failed syncing item ${item.id}:`, error);
      remainingItems.push(item);
      failedCount++;
    }
  }

  // Update storage with remaining failures
  storage.set(SYNC_QUEUE_KEY, JSON.stringify(remainingItems));
  return { successCount, failedCount };
}

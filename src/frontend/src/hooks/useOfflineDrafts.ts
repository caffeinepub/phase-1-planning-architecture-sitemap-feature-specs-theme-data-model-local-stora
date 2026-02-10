import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../lib/localStorage';

interface Draft {
  data: Record<string, any>;
  savedAt: number;
  expiresAt: number;
}

interface DraftsData {
  drafts: Record<string, Draft>;
}

const STORAGE_KEY = 'app_offlineDrafts_v1';
const EXPIRY_DAYS = 7;

export function useOfflineDrafts(formId: string) {
  const [draft, setDraft] = useState<Record<string, any> | null>(null);

  // Load draft on mount
  useEffect(() => {
    const data = getStorageItem<DraftsData>(STORAGE_KEY);
    if (data && data.drafts[formId]) {
      const formDraft = data.drafts[formId];
      // Check if expired
      if (Date.now() < formDraft.expiresAt) {
        setDraft(formDraft.data);
      }
    }
  }, [formId]);

  // Save draft
  const saveDraft = useCallback((data: Record<string, any>) => {
    const existingData = getStorageItem<DraftsData>(STORAGE_KEY) || { drafts: {} };
    
    const expiresAt = Date.now() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    
    existingData.drafts[formId] = {
      data,
      savedAt: Date.now(),
      expiresAt,
    };

    setStorageItem<DraftsData>(STORAGE_KEY, existingData);
    setDraft(data);
  }, [formId]);

  // Get draft
  const getDraft = useCallback(() => {
    return draft;
  }, [draft]);

  // Clear draft
  const clearDraft = useCallback(() => {
    const existingData = getStorageItem<DraftsData>(STORAGE_KEY);
    if (existingData && existingData.drafts[formId]) {
      delete existingData.drafts[formId];
      setStorageItem<DraftsData>(STORAGE_KEY, existingData);
    }
    setDraft(null);
  }, [formId]);

  return {
    draft,
    saveDraft,
    getDraft,
    clearDraft,
  };
}

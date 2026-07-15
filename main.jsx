/*
  This file makes window.storage work in a normal browser using localStorage.
  Inside Claude, window.storage is provided automatically.
  Outside Claude (your own deployed website), this file replaces it
  so all your tasks, notes, and goals still save on your device.
*/
if (!window.storage) {
  window.storage = {
    async get(key, shared) {
      const raw = localStorage.getItem(key);
      if (raw === null) throw new Error('Key not found: ' + key);
      return { key, value: raw, shared: !!shared };
    },
    async set(key, value, shared) {
      localStorage.setItem(key, value);
      return { key, value, shared: !!shared };
    },
    async delete(key, shared) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: !!shared };
    },
    async list(prefix, shared) {
      const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix));
      return { keys, prefix, shared: !!shared };
    },
  };
}

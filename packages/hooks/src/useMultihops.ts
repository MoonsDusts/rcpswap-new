import { useLocalStorage } from './useLocalStorage'

export const useMultihops = (key?: string, defaultValue?: boolean) =>
  useLocalStorage(key || 'multiHops', defaultValue || false)

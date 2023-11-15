import { useLocalStorage } from './useLocalStorage'

export const useExpertMode = (key?: string, defaultValue?: boolean) =>
  useLocalStorage(key || 'expertMode', defaultValue || false)

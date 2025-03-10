import { provide, ref, inject } from 'vue'

export const usePrefixProvider = () => {
  const prefix = ref('spt-ui')
  provide('prefix', prefix)
  return prefix
}

export const usePrefixInjector = () => {
  const prefix = inject('prefix', 'spt-ui')
  return prefix
}
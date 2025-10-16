// src/types/payload-types.d.ts
declare module 'payload/types' {
  export type Hook = any
  export type CollectionAfterReadHook = any
  export interface User {
    id: string
    name?: string
    [key: string]: any
  }
}

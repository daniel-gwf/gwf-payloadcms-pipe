/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CollectionAfterReadHook, CollectionBeforeChangeHook, User } from 'payload' // 💡 FIX: Used CollectionBeforeChangeHook

// Named after-read hook used by your collection import
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: _req }: any) => {
  const payload = _req?.payload
  // If payload isn't initialized (e.g. during some build phases), don't crash
  if (!payload) return doc

  if (doc?.authors && doc?.authors?.length > 0) {
    const authorDocs: User[] = []

    for (const author of doc.authors) {
      try {
        const authorDoc = await payload.findByID({
          id: typeof author === 'object' ? author?.id : author,
          collection: 'users',
          depth: 0,
        })

        if (authorDoc) {
          authorDocs.push(authorDoc)
        }
      } catch {
        // swallow error
      }
    }

    if (authorDocs.length > 0) {
      doc.populatedAuthors = authorDocs.map((authorDoc) => ({
        id: authorDoc.id,
        name: authorDoc.name,
      }))
    }
  }

  return doc
}

// Default hook: normalize authors on create/update
const normalizeAuthorsHook: CollectionBeforeChangeHook = async ({ data, _req }: any) => {
  // 💡 FIX: Used CollectionBeforeChangeHook
  if (!data) return data

  if (Array.isArray((data as any).authors)) {
    ;(data as any).authors = (data as any).authors.map((a: any) => {
      if (typeof a === 'string') return { id: a }
      return a
    })
  }

  return data
}

export default normalizeAuthorsHook

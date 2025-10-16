/* eslint-disable @typescript-eslint/no-explicit-any */

// Populate authors after read (named export used by your collections index)
export const populateAuthors = async ({ doc, req, req: { payload } }: any) => {
  if (doc?.authors && doc?.authors?.length > 0) {
    const authorDocs: any[] = []

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

// Normalize authors on create/update (default export)
const normalizeAuthorsHook = async ({ data, _req }: any) => {
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

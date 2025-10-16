// Lightweight hook implementation without importing 'payload/types' to avoid missing-module errors.
// _req is prefixed with underscore to satisfy the eslint no-unused-vars rule.

const populateAuthors = async ({ data, _req }: any) => {
  if (!data) return data

  if (Array.isArray((data as any).authors)) {
    ;(data as any).authors = (data as any).authors.map((a: any) => {
      if (typeof a === 'string') return { id: a }
      return a
    })
  }

  return data
}

export default populateAuthors

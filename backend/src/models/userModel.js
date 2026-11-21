// Formato público do usuário: nunca expõe password_hash.
export function toPublicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

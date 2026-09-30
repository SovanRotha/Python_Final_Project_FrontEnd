export function createConversationMessage(role, text) {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    createdAt: new Date().toISOString(),
  }
}

export function createConversationContext(trip) {
  return {
    tripId: trip?.id ?? null,
    destination: trip?.destination ?? null,
    dates: trip?.dates ?? null,
  }
}

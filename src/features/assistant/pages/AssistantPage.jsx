import ChatPanel from '../components/ChatPanel'

export default function AssistantPage() {
  return (
    <main className="feature-page" aria-labelledby="assistant-page-title">
      <p className="eyebrow">TRIPOS AI</p>
      <h1 id="assistant-page-title">Travel assistant</h1>
      <ChatPanel />
    </main>
  )
}
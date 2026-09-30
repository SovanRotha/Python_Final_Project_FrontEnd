export default function JournalEntry({ title, children }) {
  return (
    <article>
      {title && <h2>{title}</h2>}
      {children}
    </article>
  )
}
export default function DocumentCard({ title, children }) {
  return (
    <article aria-label={title}>
      {title && <h2>{title}</h2>}
      {children}
    </article>
  )
}

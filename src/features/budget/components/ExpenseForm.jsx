export default function ExpenseForm({ children, onSubmit }) {
  return <form onSubmit={onSubmit}>{children}</form>
}
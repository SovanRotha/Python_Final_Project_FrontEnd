export default function TravelPreferencesForm({ children, onSubmit }) {
  return <form onSubmit={onSubmit}>{children}</form>
}
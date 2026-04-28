import Notes from '@/pages/Notes'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <Notes />
    </ProtectedRoute>
  )
}

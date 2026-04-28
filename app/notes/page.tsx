import Notes from '@/src/pages/Notes'
import ProtectedRoute from '@/src/components/ProtectedRoute'

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <Notes />
    </ProtectedRoute>
  )
}
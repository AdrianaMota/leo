import { useSession } from 'next-auth/client'

import StudentDashboard from '../components/StudentDashboard'
import TeacherDashboard from '../components/TeacherDashboard'

export default function Home() {
  const [session] = useSession()

  return session.roles.includes('Teacher') ? (
    <TeacherDashboard />
  ) : (
    <StudentDashboard />
  )
}

Home.auth = true

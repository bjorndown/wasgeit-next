import { useRouter } from 'next/router'
import { getISOWeek } from 'date-fns'

const Index = () => {
  const router = useRouter()
  router.push(`/week/${getISOWeek(new Date())}`)

}

export default Index
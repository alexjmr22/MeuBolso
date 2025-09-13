import Navbar from '@/components/Navbar'
import { Loader2 } from 'lucide-react'

const Goals = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-6 bg-brand text-black flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <p className="mt-4 text-sm text-gray-500">A carregar objetivos...</p>
      </main>
    </>
  )
}

export default Goals

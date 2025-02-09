import { Info } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "./card"

export default function InfoCard() {
  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-[550px]">
      <CardHeader className="flex flex-col items-center justify-center gap-4 pt-8">
        <Info className="w-8 h-8 text-zinc-500" />
        <CardTitle className="text-2xl">Information</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content will go here */}
      </CardContent>
    </Card>
  )
} 
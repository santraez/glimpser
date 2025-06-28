export function ItemCard({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-20 h-20 aspect-square bg-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-400 transition-colors'>
      {children}
    </div>
  )
}

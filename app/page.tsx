export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Ozean Licht
        </h1>
        <p className="text-lg text-muted-foreground">
          Website wird gerade vorbereitet...
        </p>
        <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

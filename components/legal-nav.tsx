export function LegalNav() {
  return (
    <div className="border-t border-[#0E282E] pt-6 mt-8">
      <nav className="flex flex-wrap justify-center gap-6">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
          Impressum
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
          Datenschutz
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
          Vereinsstatuten
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
          Teilnahmebedingungen
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
          Registerauszug
        </a>
      </nav>
    </div>
  )
}

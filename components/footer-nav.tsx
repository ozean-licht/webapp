export function FooterNav() {
  return (
    <div className="bg-[#00111A]/50 backdrop-blur-sm border border-[#0E282E] rounded-2xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Veranstaltungen Column */}
        <div>
          <h3 className="text-[#F0F1F4] font-medium text-lg mb-4 font-montserrat-alternates">Veranstaltungen</h3>
          <nav className="space-y-3">
            <a href="#" className="block text-[#C4C8D4] hover:text-[#F0F1F4] transition-colors duration-200 font-light text-slate-300">
              Kurse
            </a>
            <a href="#" className="block text-[#C4C8D4] hover:text-[#F0F1F4] transition-colors duration-200 font-light">
              Events
            </a>
            <a href="#" className="block text-[#C4C8D4] hover:text-[#F0F1F4] transition-colors duration-200 font-light">
              Community
            </a>
          </nav>
        </div>

        {/* Mission Column */}
        <div>
          <h3 className="text-[#F0F1F4] font-medium text-lg mb-4 font-montserrat-alternates">Mission</h3>
          <nav className="space-y-3">
            <a href="#" className="block text-[#C4C8D4] hover:text-[#F0F1F4] transition-colors duration-200 font-light">
              Über Lia
            </a>
            <a href="#" className="block text-[#C4C8D4] hover:text-[#F0F1F4] transition-colors duration-200 font-light">
              Magazin
            </a>
            <a href="#" className="block text-[#C4C8D4] hover:text-[#F0F1F4] transition-colors duration-200 font-light">
              Bewerben
            </a>
          </nav>
        </div>

        {/* Support Column */}
        <div>
          <h3 className="text-[#F0F1F4] font-medium text-lg mb-4 font-montserrat-alternates">Support</h3>
          <nav className="space-y-3">
            <a href="#" className="block text-[#C4C8D4] hover:text-[#F0F1F4] transition-colors duration-200 font-light">
              Kontakt
            </a>
            <a href="#" className="block text-[#C4C8D4] hover:text-[#F0F1F4] transition-colors duration-200 font-light">
              FAQ
            </a>
            <a href="#" className="block text-[#C4C8D4] hover:text-[#F0F1F4] transition-colors duration-200 font-light">
              Hilfe
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}

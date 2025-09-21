"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCoursesForPartnerDeal } from "@/lib/supabase"
import { PrimaryButton } from "@/components/primary-button"
import { SpanBadge } from "@/components/span-badge"
import { SpanDesign } from "@/components/span-design"
import { InfoCard } from "@/components/info-card"
import { KidsAscensionPromo } from "@/components/kids-ascension-promo"
import { LoveLetterPromo } from "@/components/love-letter-promo"
import { CTA2 } from "@/components/cta-2"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Users, Sparkles, Crown, Star, ArrowRight } from "lucide-react"

export default function PartnerDealPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    partnerFirstName: "",
    partnerLastName: "",
    partnerEmail: "",
    course: "",
    message: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeNewsletter: false
  })

  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Partner Deal Form submitted:", formData)
  }

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedCourses = await getCoursesForPartnerDeal()
        setCourses(fetchedCourses)
      } catch (err) {
        console.error('Error loading courses:', err)
        setError('Fehler beim Laden der Kurse. Bitte versuche es später erneut.')
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      <main className="space-y-20">
        {/* Hero Section */}
        <section className="w-full py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <SpanDesign>Für deinen Seelenpartner</SpanDesign>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel text-white text-balance">
              Special Partner Deal
            </h1>

            <p className="text-white/70 font-montserrat-alt text-lg max-w-3xl mx-auto">
              Jeder ist souverän ♥ Du und die Person, die Du liebst. Mit dieser Perspektive erlaubst du dir deine eigene Souveränität und die der Person, die du liebst und ermöglichst euch beiden das volle Spektrum an Wachstum, ohne deine / eure Energien zu verlieren, oder energetische Disbalance weiter zu supporten.
            </p>

            {/* Centered Cover */}
            <div className="flex justify-center">
              <div className="p-2 rounded-xl border border-border max-w-2xl" style={{ backgroundColor: "#00151A" }}>
                <img
                  src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/partner-deal-cover-komprimiert.webp"
                  alt="Partner Deal Cover"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Horizontal SpanBadges */}
            <div className="flex flex-wrap justify-center gap-3">
              <SpanBadge icon="heart" text="Seelenpartner" />
              <SpanBadge icon="users" text="Gemeinsam Wachsen" />
              <SpanBadge icon="sparkles" text="Kosmische Verbindung" />
              <SpanBadge icon="crown" text="Souveränität" />
            </div>

            {/* Button that scrolls to form */}
            <div className="pt-4">
              <a href="#partner-form">
                <PrimaryButton>Anfrage stellen →</PrimaryButton>
              </a>
            </div>
          </div>
        </section>

        {/* What is Partner Deal Section */}
        <section className="w-full py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-cinzel text-white">Das Besondere an diesem Angebot</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoCard
                heading="Energetische Harmonie"
                paragraph="Ein wichtiger Schritt ist zu verstehen, dass Wachstum aus der eigenen Energie heraus entsteht. Dieses Angebot unterstützt euch beide in eurer individuellen Entwicklung."
                icon={<Heart size={24} />}
              />

              <InfoCard
                heading="Support Grid Aktivierung"
                paragraph="Das von Lia erstellte Support Grid des Kurses wird euch beide im vollen Spektrum und gleichen Maße unterstützen – eine kraftvolle energetische Verbindung."
                icon={<Sparkles size={24} />}
              />

              <InfoCard
                heading="Souveräne Partnerschaft"
                paragraph="Ermöglicht beiden Partnern, ihre eigene Souveränität zu bewahren, während ihr gemeinsam auf eurem spirituellen Weg voranschreitet."
                icon={<Crown size={24} />}
              />

              <InfoCard
                heading="Gemeinsames Erwachen"
                paragraph="Unterstützt euch gegenseitig in eurer Ascension-Prozess und helft einander, euer volles Potenzial zu entfalten."
                icon={<Users size={24} />}
              />

              <InfoCard
                heading="Kosmische Synergie"
                paragraph="Nutzt die Macht der gemeinsamen Intention und erschafft eine kraftvolle Energie, die euch beide trägt und beschleunigt."
                icon={<Star size={24} />}
              />

              <InfoCard
                heading="Zeitlose Verbindung"
                paragraph="Eine Partnerschaft, die über Raum und Zeit hinausgeht – eure Seelenverbindung wird durch dieses Angebot noch tiefer gestärkt."
                icon={<ArrowRight size={24} />}
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <SpanDesign>Schnell & Einfach</SpanDesign>
            <h2 className="text-3xl md:text-4xl font-cinzel text-white">So funktioniert es</h2>

            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-left bg-[#001212] p-6 rounded-lg border" style={{ borderColor: "#052a2a" }}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#052a2a] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-cinzel text-xl mb-2">Kontaktiere uns</h3>
                    <p className="text-white/70 font-montserrat-alt">
                      Fülle das Formular weiter unten auf dieser Seite aus und wähle den Kurs aus, um den es geht.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left bg-[#001212] p-6 rounded-lg border" style={{ borderColor: "#052a2a" }}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#052a2a] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-cinzel text-xl mb-2">Bearbeitung deiner Anfrage</h3>
                    <p className="text-white/70 font-montserrat-alt">
                      Nach dem Senden des Formulars werden wir deine Anfrage innerhalb von 1-3 Tagen bearbeiten.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left bg-[#001212] p-6 rounded-lg border" style={{ borderColor: "#052a2a" }}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#052a2a] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-cinzel text-xl mb-2">Rabatt-Gutschein für deinen Partner</h3>
                    <p className="text-white/70 font-montserrat-alt">
                      Dein Seelenpartner bekommt einen exklusiven Rabatt-Gutschein für den besagten Kurs per Mail zugeschickt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Deal Form Section */}
        <section id="partner-form" className="w-full py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <SpanDesign>Partner Deal Anfragen</SpanDesign>
              <h2 className="text-3xl md:text-4xl font-cinzel text-white mt-8 mb-4">Deine Anfrage stellen</h2>
              <p className="text-white/70 font-montserrat-alt text-lg">
                Nimm zu uns Kontakt auf und lass uns zusammen die volle Intensität des Kurses für deinen Seelenpartner freischalten ♥
              </p>
            </div>

            {/* Form Wrapper */}
            <div className="rounded-xl border bg-[#00151a] p-8" style={{ borderColor: "#052a2a" }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Your Information */}
                <div className="space-y-4">
                  <h3 className="text-white font-cinzel text-xl">Deine Informationen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-white font-montserrat-alt">Dein Vorname *</label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="bg-[#001212]"
                        style={{ borderColor: "#052a2a" }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-white font-montserrat-alt">Dein Nachname *</label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="bg-[#001212]"
                        style={{ borderColor: "#052a2a" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-white font-montserrat-alt">Deine Email *</label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="bg-[#001212]"
                      style={{ borderColor: "#052a2a" }}
                    />
                  </div>
                </div>

                {/* Partner Information */}
                <div className="space-y-4">
                  <h3 className="text-white font-cinzel text-xl">Informationen deines Partners</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="partnerFirstName" className="text-white font-montserrat-alt">Partner Vorname *</label>
                      <Input
                        id="partnerFirstName"
                        type="text"
                        value={formData.partnerFirstName}
                        onChange={(e) => handleInputChange("partnerFirstName", e.target.value)}
                        required
                        className="bg-[#001212]"
                        style={{ borderColor: "#052a2a" }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="partnerLastName" className="text-white font-montserrat-alt">Partner Nachname *</label>
                      <Input
                        id="partnerLastName"
                        type="text"
                        value={formData.partnerLastName}
                        onChange={(e) => handleInputChange("partnerLastName", e.target.value)}
                        required
                        className="bg-[#001212]"
                        style={{ borderColor: "#052a2a" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="partnerEmail" className="text-white font-montserrat-alt">Partner Email *</label>
                    <Input
                      id="partnerEmail"
                      type="email"
                      value={formData.partnerEmail}
                      onChange={(e) => handleInputChange("partnerEmail", e.target.value)}
                      required
                      className="bg-[#001212]"
                      style={{ borderColor: "#052a2a" }}
                    />
                  </div>
                </div>

                {/* Course Selection */}
                <div className="space-y-2">
                  <label htmlFor="course" className="text-white font-montserrat-alt">Kurs Auswahl *</label>
                  <p className="text-white/60 font-montserrat-alt text-sm">
                    Nur Kurse über 100€ werden für den Partner Deal angeboten
                  </p>
                  {loading ? (
                    <div className="bg-[#001212] border rounded-md p-3 text-white/70 font-montserrat-alt" style={{ borderColor: "#052a2a" }}>
                      🔄 Kurse werden geladen...
                    </div>
                  ) : error ? (
                    <div className="bg-[#001212] border rounded-md p-3 text-red-400 font-montserrat-alt" style={{ borderColor: "#052a2a" }}>
                      ⚠️ {error}
                    </div>
                  ) : (
                    <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                      <SelectTrigger className="bg-[#001212]" style={{ borderColor: "#052a2a" }}>
                        <SelectValue placeholder="Wähle den gewünschten Kurs aus..." />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id || course.course_code || course.slug} value={course.slug}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Additional Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-white font-montserrat-alt">Feedback / Nachricht</label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    rows={4}
                    placeholder="Teile uns optional etwas über euch und eure gemeinsame Reise..."
                    className="bg-[#001212]"
                    style={{ borderColor: "#052a2a" }}
                  />
                </div>

                {/* Agreements */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                    />
                    <label htmlFor="agreeTerms" className="text-white/70 font-montserrat-alt text-sm">
                      *Ich stimme zu, dass meine und die angegebenen Partner-Informationen für die Abwicklung des Partner Deals verwendet werden dürfen.
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onCheckedChange={(checked) => handleInputChange("agreePrivacy", checked as boolean)}
                    />
                    <label htmlFor="agreePrivacy" className="text-white/70 font-montserrat-alt text-sm">
                      *Ich habe die Datenschutzerklärung gelesen und erkläre mich damit einverstanden.
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeNewsletter"
                      checked={formData.agreeNewsletter}
                      onCheckedChange={(checked) => handleInputChange("agreeNewsletter", checked as boolean)}
                    />
                    <label htmlFor="agreeNewsletter" className="text-white/70 font-montserrat-alt text-sm">
                      Ich erkläre mich einverstanden, Angebote und Neuigkeiten per E-Mail zu erhalten.
                    </label>
                  </div>
                </div>

                <div className="pt-6 text-center">
                  <PrimaryButton type="submit">Partner Deal Anfrage senden →</PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Kids Ascension Promo */}
        <KidsAscensionPromo />

        {/* Love Letter Promo */}
        <LoveLetterPromo />

        {/* CTA 2 */}
        <CTA2 />
      </main>

      <Footer />
    </div>
  )
}

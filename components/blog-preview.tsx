import { SpanBadge } from "./span-badge"
import { SpanDesign } from "./span-design"

interface BlogPost {
  id: string
  title: string
  category: string
  date: string
  readTime: string
  image: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Kids Ascension nimmt Gestalt an - Update unserer App",
    category: "Update / Announcement",
    date: "04.04.2025",
    readTime: "4 min",
    image: "/mobile-app-development-cosmic-theme.jpg",
  },
  {
    id: "2",
    title: 'Maine Coones - Die „Aliens" unter den Katzen',
    category: "Community Love Letter",
    date: "18.03.2025",
    readTime: "4 min",
    image: "/maine-coon-cat-sitting-by-window.jpg",
  },
  {
    id: "3",
    title: "Meine Reise zur Herzheilung",
    category: "Community Love Letter",
    date: "18.03.2025",
    readTime: "3 min",
    image: "/cosmic-heart-healing-energy-golden-light.jpg",
  },
  {
    id: "4",
    title: "Ein Wunder ist Geschehen",
    category: "Community Love Letter",
    date: "18.03.2025",
    readTime: "5 min",
    image: "/purple-cosmic-heart-energy-miracle.jpg",
  },
  {
    id: "5",
    title: "Lakhovskys Multi Wellen Gerät",
    category: "Community Love Letter",
    date: "18.03.2025",
    readTime: "8 min",
    image: "/vintage-scientific-equipment-lakhovsky-device.jpg",
  },
]

export function BlogPreview() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Header with decorative elements */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-6">
          
          <SpanDesign>Artikel zum Lesen</SpanDesign>
          
        </div>

        <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wide lg:text-5xl">Unser Magazin</h2>

        <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
          Beiträge für dein kosmisches Erwachen – hier teilen wir Einsichten, Erfahrungen und Werkzeuge für deine
          spirituelle Reise. Tauche ein und lass dich von der Weisheit berühren, die zwischen den Zeilen schwingt.
        </p>
      </div>

      {/* Blog posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg border border-[#0E282E] mb-4">
              <div className="aspect-video">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-3">
              <SpanBadge variant="justText">{post.category}</SpanBadge>

              <h3 className="text-white text-xl font-normal leading-tight">{post.title}</h3>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

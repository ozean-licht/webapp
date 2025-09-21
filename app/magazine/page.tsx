import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpanDesign } from "@/components/span-design"
import { getBlogsFromEdge } from "@/lib/supabase"
import { BlogItem } from "@/components/blog-item"

interface Blog {
  slug: string
  title: string
  category: string
  content: string
  excerpt: string
  author: string
  read_time_minutes: number
  is_published: boolean
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  published_at: string
  created_at: string
  updated_at: string
}

async function getBlogs(): Promise<Blog[]> {
  try {
    console.log('🚀 Loading blogs from Supabase...')
    const blogs = await getBlogsFromEdge(50)
    console.log(`✅ Loaded ${blogs.length} blogs from Supabase`)
    return blogs
  } catch (error) {
    console.error('💥 Failed to load blogs from Supabase:', error.message)
    return []
  }
}

export default async function MagazinePage() {
  const blogs = await getBlogs()

  // Ensure we have an array
  const safeBlogs = Array.isArray(blogs) ? blogs : []

  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      {/* Magazine Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Container with consistent spacing */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <SpanDesign>Unser Magazin</SpanDesign>
            </div>

            <h1 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wide lg:text-5xl">
              Artikel zum Lesen
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              Beiträge für dein kosmisches Erwachen – hier teilen wir Einsichten, Erfahrungen und Werkzeuge für deine
              spirituelle Reise. Tauche ein und lass dich von der Weisheit berühren, die zwischen den Zeilen schwingt.
            </p>
          </div>

          {/* Blog posts grid */}
          <div className="w-full">
            {safeBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {safeBlogs.map((blog) => (
                  <BlogItem key={blog.slug} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-white/70 text-lg">
                  Aktuell sind keine Artikel verfügbar. Schau bald wieder vorbei!
                  <br />
                  <small className="text-white/50 mt-2 block">
                    Debug: {blogs?.length || 0} Blogs empfangen, {safeBlogs.length} sicher verarbeitet
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

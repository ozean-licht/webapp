import { SpanDesign } from "./span-design"
import { getBlogsFromEdge } from "@/lib/supabase"
import Link from "next/link"
import { PrimaryButton } from "./primary-button"
import { BlogItem } from "./blog-item"

interface BlogPost {
  slug: string
  title: string
  category: string
  published_at: string
  read_time_minutes: number
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  excerpt: string
}

async function getLatestBlogs(): Promise<BlogPost[]> {
  try {
    const blogs = await getBlogsFromEdge(5) // Get latest 5 blogs
    return blogs
  } catch (error) {
    console.error('Failed to load blogs:', error)
    return []
  }
}

export async function BlogPreview() {
  const blogPosts = await getLatestBlogs()
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
        {blogPosts.length > 0 ? blogPosts.map((post) => (
          <BlogItem key={post.slug} blog={post} />
        )) : (
          <div className="col-span-full text-center py-16">
            <div className="text-white/70 text-lg">
              Aktuell sind keine Artikel verfügbar. Schau bald wieder vorbei!
            </div>
          </div>
        )}
      </div>

      {/* View all link */}
      {blogPosts.length > 0 && (
        <div className="text-center mt-12">
          <PrimaryButton asChild>
            <Link href="/magazine">
              Alle Artikel ansehen →
            </Link>
          </PrimaryButton>
        </div>
      )}
    </section>
  )
}

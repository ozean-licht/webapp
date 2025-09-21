import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpanDesign } from "@/components/span-design"
import { PrimaryButton } from "@/components/primary-button"
import { getBlogFromEdge } from "@/lib/supabase"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Blog {
  slug: string
  title: string
  category: string
  content: string
  excerpt: string
  description?: string
  author: string
  author_image_url?: string
  read_time_minutes: number
  is_published: boolean
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  published_at: string
  created_at: string
  updated_at: string
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    console.log(`🚀 Loading blog with slug: ${slug}`)
    const blog = await getBlogFromEdge(slug)
    if (!blog) {
      console.log(`❌ Blog not found: ${slug}`)
      return null
    }
    console.log(`✅ Loaded blog: ${blog.title}`)
    return blog
  } catch (error) {
    console.error(`💥 Failed to load blog ${slug}:`, error.message)
    return null
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug)

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      {/* Blog Article */}
      <article className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            {/* Back to Magazine Link - Left aligned */}
            <div className="mb-8 flex justify-start">
              <PrimaryButton asChild>
                <Link href="/magazine">
                  ← Zurück zum Magazin
                </Link>
              </PrimaryButton>
            </div>

            <div className="text-center mb-6">
              <SpanDesign>{blog.category}</SpanDesign>
            </div>

            <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-wide leading-tight text-center">
              {blog.title}
            </h1>

            {/* Read time, Author, Date - Horizontal layout with same width as thumbnail */}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-6 max-w-full md:max-w-[calc(100vw-2rem)] lg:max-w-4xl mx-auto">
              <span>{blog.read_time_minutes} min Lesezeit</span>
              <div className="flex items-center gap-2 font-medium">
                {blog.author_image_url && (
                  <img
                    src={blog.author_image_url}
                    alt={blog.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span>Von {blog.author}</span>
              </div>
              <div>{new Date(blog.published_at).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</div>
            </div>

            {/* Featured Image */}
            {(blog.thumbnail_url_desktop || blog.thumbnail_url_mobile) && (
              <div className="relative overflow-hidden rounded-lg border border-[#0E282E] mb-8">
                <div className="aspect-video md:aspect-[16/9]">
                  <img
                    src={blog.thumbnail_url_desktop || blog.thumbnail_url_mobile}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </header>

          {/* Article Description/Introduction */}
          {blog.description && (
            <div className="mb-8">
              <p className="text-gray-200 text-lg font-light leading-relaxed italic">
                {blog.description}
              </p>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-white mt-8 mb-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-[#00FFD9]">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-300">
                      {children}
                    </em>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#00FFD9] pl-4 italic text-gray-400 my-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-[#0E282E] px-2 py-1 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-[#0E282E] p-4 rounded overflow-x-auto my-4">
                      {children}
                    </pre>
                  ),
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-[#0E282E]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                <span>Veröffentlicht am {new Date(blog.published_at).toLocaleDateString('de-DE')}</span>
              </div>
              <Link
                href="/magazine"
                className="text-[#00FFD9] hover:text-white transition-colors text-sm font-medium"
              >
                Mehr Artikel lesen →
              </Link>
            </div>
          </footer>
        </div>
      </article>

      <Footer />
    </div>
  )
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    const { getBlogsFromEdge } = await import('@/lib/supabase')
    const blogs = await getBlogsFromEdge(100)

    return blogs.map((blog: Blog) => ({
      slug: blog.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

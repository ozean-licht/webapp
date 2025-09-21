import { SpanBadge } from "./span-badge"
import Link from "next/link"

interface BlogItemProps {
  blog: {
    slug: string
    title: string
    category: string
    published_at: string
    read_time_minutes: number
    thumbnail_url_desktop?: string
    thumbnail_url_mobile?: string
    description?: string
    author?: string
    author_image_url?: string
  }
}

export function BlogItem({ blog }: BlogItemProps) {
  return (
    <article className="group cursor-pointer">
      <Link href={`/magazine/${blog.slug}`}>
        <div className="relative overflow-hidden rounded-lg border border-[#0E282E] mb-4 group-hover:border-[#00FFD9]/50 transition-colors">
          <div className="aspect-video">
            <img
              src={blog.thumbnail_url_desktop || blog.thumbnail_url_mobile || "/placeholder.svg"}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="space-y-3">
          <SpanBadge variant="justText">{blog.category}</SpanBadge>

          <h3 className="text-white text-xl font-normal leading-tight group-hover:text-[#00FFD9] transition-colors">
            {blog.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {blog.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-2">
              {blog.author_image_url && (
                <img
                  src={blog.author_image_url}
                  alt={blog.author || "Author"}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span>{blog.author || "Lia Lohmann"}</span>
            </div>
            <span>{blog.read_time_minutes} min</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

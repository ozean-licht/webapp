interface TestimonialCardProps {
  name: string
  location: string
  testimonial: string
}

export default function TestimonialCard({ name, location, testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-[#001212]/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 max-w-md">
      <div className="mb-4 text-center">
        <h4 className="font-cinzel text-white text-lg font-medium mb-1">{name}</h4>
        <p className="text-[#5DABA3] text-sm">{location}</p>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed text-center">{testimonial}</p>
    </div>
  )
}

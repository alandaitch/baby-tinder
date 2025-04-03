interface TestimonialCardProps {
  quote: string;
  author: string;
  image?: string; // URL de la imagen de la pareja
  childName?: string; // Nombre que eligieron
}

export default function TestimonialCard({ quote, author, image, childName }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <svg className="h-8 w-8 text-pink-300 mb-4" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <p className="text-gray-600 mb-6">"{quote}"</p>
        </div>
        
        <div className="flex items-center">
          {image ? (
            <img
              src={image}
              alt={`${author}`}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-r from-pink-400 to-blue-400 flex items-center justify-center text-white font-bold">
              {author.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium">{author}</p>
            {childName && (
              <p className="text-sm text-gray-500">Padres de {childName}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
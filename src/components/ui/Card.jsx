export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md p-6 border border-gray-100
        ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

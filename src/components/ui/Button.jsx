export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  style: customStyle = {},
  ...props
}) {
  const base = {
    fontWeight: 500,
    borderRadius: 8,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    lineHeight: 1.5,
  }

  const variants = {
    primary:   { background: '#1a73e8', color: '#fff' },
    secondary: { background: '#fff', color: '#202124', border: '1px solid #dadce0' },
    text:      { background: 'transparent', color: '#1a73e8' },
    danger:    { background: '#d93025', color: '#fff' },
    success:   { background: '#188038', color: '#fff' },
  }

  const sizes = {
    sm: { padding: '6px 14px', fontSize: 13 },
    md: { padding: '10px 22px', fontSize: 14 },
    lg: { padding: '14px 28px', fontSize: 16 },
  }

  const merged = {
    ...base,
    ...variants[variant],
    ...sizes[size],
    ...customStyle,
  }

  return (
    <button
      className={className}
      style={merged}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

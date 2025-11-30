import React from 'react'
import './button.css'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'full' | 'small'
  children: React.ReactNode
}

export default function Button({ variant = 'full', children, className = '', ...props }: ButtonProps) {
  const base = 'gv-btn'
  const variantClass = variant === 'full' ? 'gv-btn--full' : 'gv-btn--small'
  return (
    <button className={`${base} ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'mpesa' | 'airtel' | 'outline';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all transform active:scale-95 disabled:pointer-events-none disabled:opacity-50 h-11 px-4 py-2 w-full shadow-sm"
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-none",
    mpesa: "bg-mpesa text-white hover:bg-mpesa-hover",
    airtel: "bg-airtel text-white hover:bg-airtel-hover",
    outline: "border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 shadow-none"
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  )
}
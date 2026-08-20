"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  asChild,
  ...props
}: ButtonProps) {
  const baseClasses = "font-label text-label-caps uppercase tracking-wider transition-colors duration-300";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary/90 active:opacity-70",
    secondary: "border border-primary text-primary hover:bg-primary/10 active:opacity-70",
    ghost: "text-primary hover:bg-surface-container active:opacity-70"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const classString = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`.trim();
  
  return <button className={classString} {...props} />;
}
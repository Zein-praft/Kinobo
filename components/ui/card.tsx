/**
 * Primitif UI — card container reusable.
 */
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Card({ title, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`border border-gray-200 rounded-lg bg-white p-4 ${className}`}
      {...props}
    >
      {title && <h3 className="font-semibold mb-3">{title}</h3>}
      {children}
    </div>
  );
}

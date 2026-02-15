
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyles = "px-6 py-2 rounded-md font-semibold transition-all duration-200 flex items-center justify-center outline-none focus:ring-2 focus:ring-[var(--color-accent-dim)]";

    const variants = {
        primary: "bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-hover)] text-[var(--color-bg-primary)] shadow-lg shadow-[var(--color-accent-dim)] hover:-translate-y-0.5",
        secondary: "bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] hover:bg-white/5",
        ghost: "bg-transparent text-[var(--color-accent-primary)] hover:underline p-0"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
    return (
        <input
            className={`
                w-full bg-[var(--color-bg-tertiary)] 
                border border-[var(--color-border)] 
                text-[var(--color-text-primary)] 
                px-4 py-3 rounded-md 
                focus:border-[var(--color-accent-primary)] 
                focus:ring-2 focus:ring-[var(--color-accent-dim)] 
                outline-none transition-colors
                placeholder:text-gray-600
                ${className}
            `}
            {...props}
        />
    )
}

import React from 'react';
import { sounds } from '../utils/audio';

export type NeoButtonVariant = 'yellow' | 'green' | 'pink' | 'sky' | 'orange' | 'purple' | 'white' | 'black';
export type NeoButtonSize = 'sm' | 'md' | 'lg' | 'massive';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NeoButtonVariant;
  size?: NeoButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  soundType?: 'click' | 'pop' | 'zap' | 'none';
  children: React.ReactNode;
}

const variantStyles: Record<NeoButtonVariant, string> = {
  yellow: 'bg-[#FDE047] text-black hover:bg-[#FACC15] border-black',
  green: 'bg-[#86EFAC] text-black hover:bg-[#4ADE80] border-black',
  pink: 'bg-[#F472B6] text-black hover:bg-[#F9A8D4] border-black',
  sky: 'bg-[#7DD3FC] text-black hover:bg-[#38BDF8] border-black',
  orange: 'bg-[#FB923C] text-black hover:bg-[#F97316] border-black',
  purple: 'bg-[#C084FC] text-black hover:bg-[#A855F7] border-black',
  white: 'bg-white text-black hover:bg-[#F1F5F9] border-black',
  black: 'bg-black text-white hover:bg-[#1F2937] border-black text-white',
};

// Accurately calibrated paddings & heights
const sizeStyles: Record<NeoButtonSize, string> = {
  sm: 'py-2 px-3.5 text-xs sm:text-sm font-bold min-h-[38px] rounded-xl border-[2.5px] shadow-[2.5px_2.5px_0px_0px_#000]',
  md: 'py-3 px-5 text-sm sm:text-base font-extrabold min-h-[48px] rounded-2xl border-[3px] shadow-[3.5px_3.5px_0px_0px_#000]',
  lg: 'py-4 px-6 sm:px-8 text-base sm:text-lg font-black min-h-[58px] rounded-2xl border-[3.5px] shadow-[4.5px_4.5px_0px_0px_#000]',
  massive: 'py-5 sm:py-6 px-6 sm:px-8 text-lg sm:text-xl font-black min-h-[72px] rounded-3xl border-4 shadow-[5px_5px_0px_0px_#000]',
};

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = 'yellow',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  soundType = 'click',
  onClick,
  disabled,
  className = '',
  children,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (soundType === 'click') sounds.playClick();
    else if (soundType === 'pop') sounds.playPop();
    else if (soundType === 'zap') sounds.playZap();

    if (onClick) onClick(e);
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2.5
        font-sans select-none cursor-pointer tracking-wide
        transition-all duration-100 ease-out
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000]
        focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-black focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0
        ${fullWidth ? 'w-full' : ''}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...rest}
    >
      {leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
      <span className="leading-tight text-center truncate">{children}</span>
      {rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
};

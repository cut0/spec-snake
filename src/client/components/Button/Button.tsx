import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps, FC, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type ButtonProps = Omit<
  ComponentProps<'button'>,
  'className' | 'style' | 'popover' | 'ref'
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
  outline:
    'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2',
  icon: 'size-8 p-0',
};

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => (
  <BaseButton
    className={`inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]}`}
    {...props}
  >
    {children}
  </BaseButton>
);

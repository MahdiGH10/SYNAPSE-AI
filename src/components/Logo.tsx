import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  iconOnly?: boolean;
}

export default function Logo({ size = 40, className = '', showText = true, iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <Image
        src="/logo-mark.png"
        alt="SynapseAI"
        width={size}
        height={size}
        className={className}
        priority
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt="SynapseAI Logo"
        width={size}
        height={size}
        className="flex-shrink-0"
        priority
      />
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          SynapseAI
        </span>
      )}
    </div>
  );
}

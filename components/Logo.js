'use client';
import Link from 'next/link';
import { RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Logo({ size = 'default', showTagline = true, linkTo = '/' }) {
  const sizes = {
    small: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      spark: 'w-1.5 h-1.5',
      text: 'text-lg',
      tagline: 'text-xs'
    },
    default: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      spark: 'w-2 h-2',
      text: 'text-2xl',
      tagline: 'text-xs'
    },
    large: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      spark: 'w-2.5 h-2.5',
      text: 'text-3xl',
      tagline: 'text-sm'
    }
  };

  const currentSize = sizes[size];
  const LogoContent = () => (
    <div className="flex items-center space-x-3 group cursor-pointer">
      <div className="relative">
        <div className={`${currentSize.container} bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:from-blue-700 group-hover:to-purple-700`}>
          <RocketLaunchIcon className={`${currentSize.icon} text-white transition-transform duration-300 group-hover:rotate-12`} />
        </div>
        <div className={`absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300`}>
          <SparklesIcon className={`${currentSize.spark} text-white animate-pulse`} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`${currentSize.text} font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300`}>
          JobForge
        </span>
        {showTagline && (
          <span className={`${currentSize.tagline} text-gray-500 font-medium -mt-1 group-hover:text-gray-600 transition-colors duration-300`}>
            Your Career Catalyst
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo}>
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}

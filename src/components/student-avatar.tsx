'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import type { StudentProfile } from '@/lib/types';

interface StudentAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StudentAvatar({ size = 'md', className = '' }: StudentAvatarProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const getInitials = (name?: string): string => {
    if (!name) return 'E';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 text-xs';
      case 'lg':
        return 'h-12 w-12 text-lg';
      default:
        return 'h-10 w-10 text-sm';
    }
  };

  if (loading) {
    return (
      <Avatar className={`${getSizeClasses()} ${className}`}>
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    );
  }

  // Por ahora usamos las iniciales, pero se puede extender para incluir foto
  const initials = getInitials(profile?.carreraName);

  return (
    <Avatar className={`${getSizeClasses()} ${className}`}>
      <AvatarImage src="" alt="Avatar del estudiante" />
      <AvatarFallback className="bg-blue-500 text-white font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

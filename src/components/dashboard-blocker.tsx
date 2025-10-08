'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, AlertCircle } from 'lucide-react';

interface DashboardBlockerProps {
  children: React.ReactNode;
  isBlocked: boolean;
  missingFields: string[];
}

export function DashboardBlocker({ children, isBlocked, missingFields }: DashboardBlockerProps) {
  if (!isBlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Contenido con blur */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay de bloqueo */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <Card className="bg-white/95 border-red-200 shadow-lg">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Perfil incompleto
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Completa tu perfil académico para acceder a todas las funcionalidades del dashboard.
              </p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Campos pendientes:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {missingFields.map((field) => (
                    <Badge key={field} variant="outline" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Users, 
  MessageSquare,
  Heart,
  Star,
  Download,
  Copy,
  Check,
  Lightbulb,
  Target,
  TrendingUp,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import { type PurposeAnswer } from '@/lib/purpose-discovery';

interface SocializationFeaturesProps {
  answers: PurposeAnswer[];
  purposeStatement?: string;
  className?: string;
}

interface ShareableContent {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'statement' | 'insight' | 'progress' | 'theme';
  privacy: 'public' | 'friends' | 'private';
}

export function SocializationFeatures({ answers, purposeStatement, className = '' }: SocializationFeaturesProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [selectedPrivacy, setSelectedPrivacy] = useState<'public' | 'friends' | 'private'>('friends');

  // Generar contenido compartible
  const generateShareableContent = (): ShareableContent[] => {
    const content: ShareableContent[] = [];

    // Declaración de propósito
    if (purposeStatement) {
      content.push({
        id: 'purpose-statement',
        title: 'Mi Declaración de Propósito',
        description: 'Una reflexión personal sobre mi razón de ser',
        content: purposeStatement,
        type: 'statement',
        privacy: 'friends'
      });
    }

    // Insights principales
    const allText = answers.map(a => a.response).join(' ').toLowerCase();
    const words = allText.split(/\s+/).filter(word => word.length > 4);
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    const topThemes = Array.from(wordFreq.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    if (topThemes.length > 0) {
      content.push({
        id: 'key-themes',
        title: 'Mis Temas de Interés',
        description: 'Las áreas que más me motivan y energizan',
        content: `Mis temas de interés principales son: ${topThemes.join(', ')}. Estas son las áreas donde encuentro más pasión y propósito.`,
        type: 'theme',
        privacy: 'public'
      });
    }

    // Progreso del test
    const categories = new Set(answers.map(a => a.category));
    content.push({
      id: 'test-progress',
      title: 'Mi Progreso en el Test de Ikigai',
      description: 'He completado mi viaje de autoconocimiento',
      content: `He completado el test de Ikigai explorando ${categories.size} de las 4 dimensiones del propósito. Ha sido una experiencia muy enriquecedora de autoconocimiento.`,
      type: 'progress',
      privacy: 'public'
    });

    // Insights personales
    if (answers.length > 0) {
      const avgWords = answers.reduce((sum, a) => sum + a.wordCount, 0) / answers.length;
      if (avgWords > 100) {
        content.push({
          id: 'deep-reflection',
          title: 'Mi Enfoque de Reflexión',
          description: 'Cómo abordo el autoconocimiento',
          content: 'He descubierto que tengo un enfoque profundo hacia la reflexión y el autoconocimiento. Me gusta tomar tiempo para pensar detenidamente sobre mis motivaciones y propósito.',
          type: 'insight',
          privacy: 'friends'
        });
      }
    }

    return content;
  };

  const shareableContent = generateShareableContent();

  const handleCopy = async (content: ShareableContent) => {
    try {
      await navigator.clipboard.writeText(content.content);
      setCopiedItems(prev => new Set(prev).add(content.id));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(content.id);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleShare = async (content: ShareableContent) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.content,
          url: window.location.origin
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      handleCopy(content);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'statement': return <Target className="h-4 w-4" />;
      case 'insight': return <Lightbulb className="h-4 w-4" />;
      case 'progress': return <TrendingUp className="h-4 w-4" />;
      case 'theme': return <Heart className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'statement': return 'bg-green-100 text-green-800 border-green-200';
      case 'insight': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'theme': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'friends': return <Users className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getPrivacyColor = (privacy: string) => {
    switch (privacy) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'friends': return 'bg-blue-100 text-blue-800';
      case 'private': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="h-6 w-6 mr-2" />
            Compartir tu Viaje
          </CardTitle>
          <CardDescription>
            Comparte insights de tu descubrimiento de propósito de manera segura y significativa
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Configuración de Privacidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Configuración de Privacidad
          </CardTitle>
          <CardDescription>
            Controla quién puede ver tu contenido compartido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedPrivacy === 'public' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPrivacy('public')}
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>Público</span>
            </Button>
            <Button
              variant={selectedPrivacy === 'friends' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPrivacy('friends')}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Solo Amigos</span>
            </Button>
            <Button
              variant={selectedPrivacy === 'private' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPrivacy('private')}
              className="flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Privado</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {selectedPrivacy === 'public' && 'Tu contenido será visible para todos los usuarios de la plataforma.'}
            {selectedPrivacy === 'friends' && 'Solo las personas que agregues como amigos podrán ver tu contenido.'}
            {selectedPrivacy === 'private' && 'Tu contenido será completamente privado y solo tú podrás verlo.'}
          </p>
        </CardContent>
      </Card>

      {/* Contenido Compartible */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contenido Listo para Compartir</h3>
        {shareableContent.map((content) => (
          <Card key={content.id} className="hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(content.type)}`}>
                    {getTypeIcon(content.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{content.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {content.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPrivacyColor(content.privacy)}>
                    {getPrivacyIcon(content.privacy)}
                    <span className="ml-1 capitalize">{content.privacy}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Contenido */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{content.content}</p>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleShare(content)}
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Compartir</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(content)}
                    className="flex items-center space-x-2"
                  >
                    {copiedItems.has(content.id) ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Consejos para Compartir */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Consejos para Compartir
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">✅ Buenas Prácticas</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Comparte solo lo que te sientes cómodo revelando</li>
                <li>• Usa la configuración de privacidad apropiada</li>
                <li>• Sé auténtico y honesto en tus reflexiones</li>
                <li>• Respeta la privacidad de otros</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">⚠️ Consideraciones</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• No compartas información personal sensible</li>
                <li>• Revisa la configuración de privacidad regularmente</li>
                <li>• Recuerda que el contenido puede ser visto por otros</li>
                <li>• Mantén un tono respetuoso y constructivo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Compartir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Tu Impacto Social
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{shareableContent.length}</div>
              <div className="text-sm text-muted-foreground">Contenidos</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {shareableContent.filter(c => c.privacy === 'public').length}
              </div>
              <div className="text-sm text-muted-foreground">Públicos</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {shareableContent.filter(c => c.privacy === 'friends').length}
              </div>
              <div className="text-sm text-muted-foreground">Para Amigos</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {shareableContent.filter(c => c.privacy === 'private').length}
              </div>
              <div className="text-sm text-muted-foreground">Privados</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

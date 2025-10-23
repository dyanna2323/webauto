import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Smartphone, Monitor, Download, Palette, Loader2, Sparkles, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RippleButton } from '@/components/RippleButton';
import { TypingAnimation } from '@/components/TypingAnimation';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { GenerationRequest, TemplateType } from '@shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

interface TemplateInfo {
  id: TemplateType;
  name: string;
  description: string;
}

interface TemplatesResponse {
  templates: TemplateInfo[];
}

export default function Builder() {
  const [businessDescription, setBusinessDescription] = useState('');
  const [templateType, setTemplateType] = useState<TemplateType>('services');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [customColors, setCustomColors] = useState({
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    accent: '#10B981',
  });
  const [customTexts, setCustomTexts] = useState({
    title: '',
    tagline: '',
    description: '',
  });
  const [generatedWebsite, setGeneratedWebsite] = useState<GenerationRequest | null>(null);

  const { toast } = useToast();

  // Fetch available templates from backend
  const { data: templatesData, isLoading: templatesLoading } = useQuery<TemplatesResponse>({
    queryKey: ['/api/templates'],
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!businessDescription.trim()) {
        throw new Error('Por favor, describe tu negocio');
      }

      return await apiRequest<GenerationRequest>('POST', '/api/generate', {
        businessDescription,
        templateType,
      });
    },
    onSuccess: (data) => {
      setGeneratedWebsite(data);
      toast({
        title: '¡Web generada!',
        description: 'Tu web profesional está lista. Personalízala y descárgala.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al generar',
        description: error.message || 'Hubo un problema. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    },
  });

  const customizeMutation = useMutation({
    mutationFn: async () => {
      if (!generatedWebsite) return;

      // Filter out empty strings from customTexts
      const filteredTexts = Object.fromEntries(
        Object.entries(customTexts).filter(([_, value]) => value.trim() !== '')
      );

      return await apiRequest<GenerationRequest>('POST', '/api/customize', {
        id: generatedWebsite.id,
        customColors,
        customTexts: Object.keys(filteredTexts).length > 0 ? filteredTexts : undefined,
      });
    },
    onSuccess: (data) => {
      setGeneratedWebsite(data);
      toast({
        title: 'Cambios aplicados',
        description: 'Tu web se ha personalizado correctamente.',
      });
    },
  });

  const handleDownload = async () => {
    if (!generatedWebsite) return;

    try {
      const response = await fetch(`/api/download/${generatedWebsite.id}`);
      if (!response.ok) throw new Error('Error al descargar');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mi-web-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: '¡Descargado!',
        description: 'Tu web está lista para subir a tu hosting.',
      });
    } catch (error) {
      toast({
        title: 'Error al descargar',
        description: 'Hubo un problema. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  // Apply text customizations to preview in real-time
  const getPreviewHtml = () => {
    if (!generatedWebsite?.generatedHtml) return '<div class="p-8 text-center">Vista previa no disponible</div>';
    
    let html = generatedWebsite.generatedHtml;
    
    // Apply text replacements in real-time
    if (customTexts.title.trim()) {
      // Simple replacement for demo - in production this would be more sophisticated
      html = html.replace(/<h1[^>]*>.*?<\/h1>/i, `<h1>${customTexts.title}</h1>`);
    }
    if (customTexts.tagline.trim()) {
      html = html.replace(/<h2[^>]*>.*?<\/h2>/i, `<h2>${customTexts.tagline}</h2>`);
    }
    if (customTexts.description.trim()) {
      html = html.replace(/<p[^>]*>.*?<\/p>/i, `<p>${customTexts.description}</p>`);
    }
    
    return html;
  };

  const previewContent = generatedWebsite ? (
    <div
      className="w-full h-full bg-white"
      dangerouslySetInnerHTML={{
        __html: `
          <style>${generatedWebsite.generatedCss || ''}</style>
          ${getPreviewHtml()}
        `,
      }}
    />
  ) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold gradient-text">AI Web Builder</h1>
          </div>

          {generatedWebsite && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('desktop')}
                data-testid="button-view-desktop"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('mobile')}
                data-testid="button-view-mobile"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                data-testid="button-download"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar ZIP
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r bg-card/30 p-6 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Describe tu negocio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description" className="text-base font-semibold mb-2 block">
                  ¿Qué haces y qué necesitas en tu web?
                </Label>
                <Textarea
                  id="description"
                  placeholder="Ej: Soy fontanero en Madrid. Necesito mostrar mis servicios de urgencias 24h, reparaciones y reformas. Quiero que los clientes puedan contactarme fácilmente."
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="min-h-[150px] text-base"
                  data-testid="input-description"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Cuanto más detalles, mejor será tu web 💪
                </p>
              </div>

              <div>
                <Label htmlFor="template" className="text-base font-semibold mb-2 block">
                  Tipo de negocio
                </Label>
                <Select value={templateType} onValueChange={(value) => setTemplateType(value as TemplateType)}>
                  <SelectTrigger id="template" data-testid="select-template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templatesLoading ? (
                      <SelectItem value="loading" disabled>Cargando...</SelectItem>
                    ) : templatesData?.templates ? (
                      templatesData.templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="restaurant">Restaurante / Bar</SelectItem>
                        <SelectItem value="consultancy">Consultoría / Servicios</SelectItem>
                        <SelectItem value="shop">Tienda / E-commerce</SelectItem>
                        <SelectItem value="services">Servicios Profesionales</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {templatesData?.templates.find(t => t.id === templateType)?.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {templatesData.templates.find(t => t.id === templateType)?.description}
                  </p>
                )}
              </div>

              <RippleButton
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending || !businessDescription.trim()}
                className="w-full text-lg py-6 min-h-12"
                data-testid="button-generate"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <TypingAnimation text="Generando tu web..." speed={60} />
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generar Mi Web
                  </>
                )}
              </RippleButton>

              {generatedWebsite && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pt-6 border-t"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Personalizar Colores</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="color-primary" className="text-sm mb-2 block">
                        Color Principal
                      </Label>
                      <div className="flex gap-2">
                        <input
                          id="color-primary"
                          type="color"
                          value={customColors.primary}
                          onChange={(e) =>
                            setCustomColors((prev) => ({ ...prev, primary: e.target.value }))
                          }
                          className="h-10 w-20 rounded cursor-pointer"
                          data-testid="input-color-primary"
                        />
                        <input
                          type="text"
                          value={customColors.primary}
                          onChange={(e) =>
                            setCustomColors((prev) => ({ ...prev, primary: e.target.value }))
                          }
                          className="flex-1 h-10 px-3 rounded border bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="color-secondary" className="text-sm mb-2 block">
                        Color Secundario
                      </Label>
                      <div className="flex gap-2">
                        <input
                          id="color-secondary"
                          type="color"
                          value={customColors.secondary}
                          onChange={(e) =>
                            setCustomColors((prev) => ({ ...prev, secondary: e.target.value }))
                          }
                          className="h-10 w-20 rounded cursor-pointer"
                          data-testid="input-color-secondary"
                        />
                        <input
                          type="text"
                          value={customColors.secondary}
                          onChange={(e) =>
                            setCustomColors((prev) => ({ ...prev, secondary: e.target.value }))
                          }
                          className="flex-1 h-10 px-3 rounded border bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="color-accent" className="text-sm mb-2 block">
                        Color Acento
                      </Label>
                      <div className="flex gap-2">
                        <input
                          id="color-accent"
                          type="color"
                          value={customColors.accent}
                          onChange={(e) =>
                            setCustomColors((prev) => ({ ...prev, accent: e.target.value }))
                          }
                          className="h-10 w-20 rounded cursor-pointer"
                          data-testid="input-color-accent"
                        />
                        <input
                          type="text"
                          value={customColors.accent}
                          onChange={(e) =>
                            setCustomColors((prev) => ({ ...prev, accent: e.target.value }))
                          }
                          className="flex-1 h-10 px-3 rounded border bg-background"
                        />
                      </div>
                    </div>

                    {/* Text Customization Section */}
                    <div className="pt-6 border-t mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Type className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Editar Textos</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="text-title" className="text-sm mb-2 block">
                            Título Principal
                          </Label>
                          <input
                            id="text-title"
                            type="text"
                            value={customTexts.title}
                            onChange={(e) =>
                              setCustomTexts((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Ej: Bienvenido a mi Negocio"
                            className="w-full h-10 px-3 rounded border bg-background"
                            data-testid="input-text-title"
                          />
                        </div>

                        <div>
                          <Label htmlFor="text-tagline" className="text-sm mb-2 block">
                            Eslogan / Subtítulo
                          </Label>
                          <input
                            id="text-tagline"
                            type="text"
                            value={customTexts.tagline}
                            onChange={(e) =>
                              setCustomTexts((prev) => ({ ...prev, tagline: e.target.value }))
                            }
                            placeholder="Ej: Calidad y servicio desde 1990"
                            className="w-full h-10 px-3 rounded border bg-background"
                            data-testid="input-text-tagline"
                          />
                        </div>

                        <div>
                          <Label htmlFor="text-description" className="text-sm mb-2 block">
                            Descripción Breve
                          </Label>
                          <Textarea
                            id="text-description"
                            value={customTexts.description}
                            onChange={(e) =>
                              setCustomTexts((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Ej: Ofrecemos servicios profesionales con más de 30 años de experiencia..."
                            className="min-h-[80px]"
                            data-testid="input-text-description"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => customizeMutation.mutate()}
                      disabled={customizeMutation.isPending}
                      className="w-full mt-6"
                      variant="default"
                      data-testid="button-apply-customization"
                    >
                      {customizeMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Aplicando cambios...
                        </>
                      ) : (
                        'Aplicar Cambios'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-muted/20 flex items-center justify-center p-6 overflow-auto">
          {generateMutation.isPending ? (
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <TypingAnimation
                text="La IA está creando tu web profesional..."
                speed={50}
                className="text-xl font-medium"
              />
              <p className="text-muted-foreground mt-4">Esto puede tardar 10-30 segundos</p>
            </div>
          ) : generatedWebsite ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`bg-white shadow-2xl rounded-lg overflow-hidden ${
                viewMode === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full max-w-6xl h-[800px]'
              }`}
              data-testid="preview-frame"
            >
              <div className="w-full h-full overflow-auto">
                {previewContent}
              </div>
            </motion.div>
          ) : (
            <div className="text-center max-w-md">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Lista para generar tu web</h2>
              <p className="text-muted-foreground">
                Describe tu negocio en el panel de la izquierda y pulsa "Generar Mi Web". 
                La IA creará una web profesional en segundos.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

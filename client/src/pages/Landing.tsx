import { Link } from 'wouter';
import { Sparkles, Zap, Check, Download, Eye, Palette, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RippleButton } from '@/components/RippleButton';
import { InteractiveBox } from '@/components/InteractiveBox';
import { TypingAnimation } from '@/components/TypingAnimation';
import { motion } from 'framer-motion';

export default function Landing() {
  const painPoints = [
    {
      icon: Zap,
      title: "Sin complicaciones técnicas",
      description: "Nada de HTML, CSS, JavaScript. Solo dices qué necesitas y listo."
    },
    {
      icon: Sparkles,
      title: "Profesional en minutos",
      description: "Lo que te costaría 2 meses y 2000€, aquí lo tienes en 5 minutos."
    },
    {
      icon: Download,
      title: "Tu web, tu propiedad",
      description: "Descargas el código y lo subes donde quieras. Sin ataduras."
    },
    {
      icon: Palette,
      title: "Personalización al instante",
      description: "Cambia colores, textos, lo que sea. Todo visual, todo fácil."
    }
  ];

  const features = [
    "Generación con IA en segundos",
    "Diseño responsive automático",
    "Descarga código HTML/CSS/JS",
    "Personalización de colores",
    "Templates para tu sector",
    "Preview desktop y mobile",
    "Sin límite de regeneraciones",
    "Soporte por email",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 text-base px-4 py-2" variant="secondary">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Solo quedan 23 plazas este mes
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">Tu Web Profesional</span>
              <br />
              <span className="text-foreground">Sin Complicarte la Vida</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Tío, solo quieres una web que funcione. Dinos qué haces, la IA te crea una web profesional, 
              la personalizas en 2 clics, y ya. <span className="font-bold text-foreground">Menos que Netflix tío.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/builder">
                <RippleButton
                  size="lg"
                  className="text-lg px-8 py-6 min-h-14"
                  data-testid="button-cta-hero"
                >
                  Crear Mi Web Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </RippleButton>
              </Link>

              <RippleButton
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 min-h-14 backdrop-blur-sm bg-background/50"
                data-testid="button-demo"
              >
                <Eye className="mr-2 h-5 w-5" />
                Ver Demo
              </RippleButton>
            </div>

            <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                Sin tarjeta de crédito
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                Web lista en 5 minutos
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                Garantía 100% o reembolso
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Te pillo. <span className="gradient-text">Todos estamos igual de liados.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Llevar un negocio ya es bastante difícil. No necesitas más complicaciones.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="p-6 h-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:rotate-1"
                  style={{ transformStyle: 'preserve-3d' }}
                  data-testid={`card-painpoint-${index}`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <point.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{point.title}</h3>
                        <p className="text-muted-foreground">{point.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <InteractiveBox />
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Mira cómo funciona <span className="gradient-text">(de verdad es así de fácil)</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8 bg-card">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-muted-foreground">1. Tú escribes:</h3>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      <p>Soy fontanero en Madrid, necesito mostrar mis servicios y que me contacten</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 text-muted-foreground">2. La IA genera:</h3>
                    <div className="bg-background p-4 rounded-lg border-2 border-primary/20">
                      <TypingAnimation
                        text="Creando tu web profesional..."
                        speed={50}
                        className="text-primary font-medium"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        ✓ Diseño responsive<br />
                        ✓ Sección de servicios<br />
                        ✓ Formulario de contacto
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-lg font-semibold mb-4">
                    3. Personalizas colores, descargas y listo. <span className="gradient-text">Venga ya, no puede ser más fácil.</span>
                  </p>
                  <Link href="/builder">
                    <RippleButton size="lg" data-testid="button-try-now">
                      Pruébalo Ahora Gratis
                    </RippleButton>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="gradient-text">Menos que Netflix</span>, en serio
            </h2>
            <p className="text-xl text-muted-foreground">
              Lo que otros cobran 2000€, aquí lo tienes por menos que un café al día
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-lg mx-auto"
          >
            <Card className="relative overflow-hidden border-2 border-primary">
              <div className="absolute top-0 right-0 bg-accent text-white px-6 py-2 text-sm font-bold transform rotate-12 translate-x-8 -translate-y-2">
                ¡OFERTA!
              </div>

              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <p className="text-sm text-muted-foreground mb-2">Antes: <span className="line-through">299€/mes</span></p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-6xl font-black gradient-text">79€</span>
                    <span className="text-2xl text-muted-foreground">/mes</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Solo 23 plazas disponibles
                  </Badge>
                </div>

                <div className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/builder">
                  <RippleButton
                    className="w-full text-lg py-6 min-h-14"
                    size="lg"
                    data-testid="button-cta-pricing"
                  >
                    Empezar Ahora
                  </RippleButton>
                </Link>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Garantía de 30 días. Si no te gusta, te devolvemos el dinero. <strong>Sin preguntas raras.</strong>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 animated-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-foreground">
            ¿Listo para tener tu web?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Deja de dar excusas. En 5 minutos tienes una web profesional. Sin dramas.
          </p>
          <Link href="/builder">
            <RippleButton
              size="lg"
              className="text-xl px-12 py-8 min-h-16 shadow-2xl"
              data-testid="button-cta-final"
            >
              Crear Mi Web Ahora
              <ArrowRight className="ml-3 h-6 w-6" />
            </RippleButton>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AI Web Builder. Hecho con 💜 para autónomos que no tienen tiempo para tonterías.</p>
        </div>
      </footer>
    </div>
  );
}

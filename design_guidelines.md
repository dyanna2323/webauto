# Design Guidelines - AI Web Builder para Autónomos

## 🎨 Concepto Visual

Landing page ultra-moderna 2024/2025 con gradientes vibrantes, animaciones fluidas everywhere, y un tono coloquial directo. Diseño que vende con psicología (urgencia, precio ancla, comparación Netflix) mientras mantiene un estilo visual impactante.

## 🌈 Paleta de Colores

### Gradientes Vibrantes
- **Primary Gradient**: Violeta eléctrico → Azul brillante → Cyan
- **Accent Gradient**: Rosa fucsia → Naranja → Amarillo dorado
- **Hero Background**: Gradiente diagonal animado que cambia sutilmente

### Colores Base
- **Background Light**: Blanco puro con toques de gris muy claro
- **Background Dark**: Negro profundo con toques de violeta oscuro
- **Primary**: Violeta vibrante (#8B5CF6)
- **Accent**: Cyan eléctrico (#06B6D4)
- **Success**: Verde neón (#10B981)
- **Warning**: Naranja brillante (#F59E0B)

### Texto
- **Primary Text**: Alto contraste, negro en light / blanco en dark
- **Secondary Text**: Gris medio para info adicional
- **Accent Text**: Violeta/Cyan para highlights importantes

## 🎭 Tipografía

- **Headings**: Bold, grande, impactante - usar gradientes en títulos principales
- **Body**: Clean, legible, espaciado generoso
- **CTAs**: MAYÚSCULAS para urgencia, tamaño XL
- **Copy Coloquial**: "Tío", "Venga ya", "Menos que Netflix tío" - mantener tono conversacional

## 🎮 Interactividad Requerida

### 1. Cursor Trail (Estela)
- Bolitas que siguen el cursor y desaparecen gradualmente
- Color: gradiente violeta → cyan
- Smooth fade out animation

### 2. Formas Flotantes con Parallax
- Círculos, cuadrados redondeados flotando en background
- Se mueven sutilmente con el movimiento del cursor
- Blur y opacity baja para no distraer del contenido

### 3. Cards Reactivas
- Hover: rotación 3D sutil (-5deg a 5deg)
- Elevación con sombra que crece
- Transición suave (300ms ease-out)
- Borde con gradiente que aparece en hover

### 4. Barra de Progreso Scroll
- Fixed top, altura 3px
- Gradiente horizontal (violeta → cyan)
- Actualiza en tiempo real con scroll position

### 5. Caja Interactiva "¿Te ha pasado esto?"
- Click cambia entre diferentes pain points del autónomo
- Transición fade entre textos
- Borde pulsante sutil

### 6. Botones con Ripple Effect
- Material Design inspired pero más dramático
- Color del ripple: blanco 30% opacity
- Expande desde punto de click
- Mantener el efecto de elevación base

### 7. Demo con Typing Animation
- Simula escritura en tiempo real
- Cursor parpadeante
- Velocidad: 50-80ms por carácter
- Muestra "pensando..." antes de generar

### 8. Easter Egg - Código Konami
- ↑↑↓↓←→←→BA activa "Modo Fiesta"
- Confetti explosión
- Colores más saturados temporalmente
- Animaciones aceleradas
- Mensaje divertido overlay

## 📐 Layout & Espaciado

### Spacing System
- **XS**: 0.5rem (8px) - entre íconos y texto
- **SM**: 1rem (16px) - padding interno de cards
- **MD**: 2rem (32px) - separación entre secciones
- **LG**: 4rem (64px) - márgenes principales
- **XL**: 6rem (96px) - separación hero sections

### Secciones Landing Page

1. **Hero Section** (100vh)
   - Gradiente animado background
   - Heading XL con gradiente text
   - Subheading con copy coloquial
   - CTA principal + CTA secundario
   - Formas flotantes parallax

2. **Pain Points Section**
   - Grid 2x2 de cards con problemas del autónomo
   - Cada card: ícono, título, descripción corta
   - Hover effects 3D
   - Copy super directo: "Te pillo. Todos estamos igual de liados"

3. **Solution/Demo Section**
   - Preview del builder en acción
   - Typing animation mostrando el proceso
   - Split screen: input autónomo → output web generada
   - Botón "Pruébalo Gratis"

4. **Pricing Section**
   - Precio ancla: ~~299€~~ → **79€/mes**
   - Comparación: "Menos que Netflix tío"
   - Urgencia: "Solo 23 plazas disponibles"
   - Lista de features con checkmarks
   - Garantía sin excusas

5. **CTA Final**
   - Grande, bold, imposible de ignorar
   - Gradiente background animado
   - Ripple effect en click
   - "Crear Mi Web Ahora"

### Builder Interface

- **Sidebar**: Input del negocio (textarea grande)
- **Main Area**: Preview en vivo de la web generada
- **Top Bar**: Toggle Desktop/Mobile view, descargar ZIP
- **Color Picker**: Para personalizar colores generados
- **Loading State**: Skeleton + typing animation "Generando tu web..."

## 🎨 Componentes Específicos

### Buttons
- **Primary**: Gradiente violeta→cyan, texto blanco, ripple effect
- **Secondary**: Outline con gradiente, ripple más sutil
- **Ghost**: Transparente, hover con gradient background fade-in
- **Sizes**: SM (min-h-8), MD (min-h-9), LG (min-h-10), XL (min-h-12 para CTAs principales)

### Cards
- **Default**: Background card, border sutil, hover elevate + rotate3D
- **Gradient**: Border con gradiente, background con gradiente muy sutil
- **Glassmorphism**: Backdrop blur, border bright, usado para overlays

### Inputs
- **Focus State**: Border gradiente animado
- **Placeholder**: Copy útil y amigable
- **Icons**: Inline left, spacing correcto

### Badges
- **Status**: Pequeños, gradiente background para "Disponible", "Limitado"
- **Features**: Outline style con ícono checkmark

## 🌗 Dark Mode

- Automático según preferencia del sistema
- Toggle visible en top-right corner
- Transición suave entre modos (300ms)
- Gradientes ajustados para mantener vibrancia en dark
- Backgrounds más oscuros pero no negro puro (use violeta muy oscuro)

## ✨ Animaciones & Transiciones

### Principios
- **Duración**: 200-300ms para micro-interacciones, 500ms para transiciones grandes
- **Easing**: ease-out para salidas, ease-in-out para transformaciones
- **Performance**: Usar transform y opacity, evitar layout shifts
- **Hover states**: Instantáneos (0ms delay), smooth out (200ms)

### Animaciones Específicas
- **Fade In**: opacity 0→1, translateY 20px→0
- **Slide In**: translateX from side
- **Scale Hover**: scale(1.02) en cards
- **Rotate 3D**: rotateX(-5deg) rotateY(5deg) en hover
- **Pulse**: Borde que pulsa sutilmente (usado en caja interactiva)

## 📱 Responsive

### Breakpoints
- **Mobile**: < 640px - Stack vertical, CTA full-width
- **Tablet**: 640px - 1024px - Grid 2 columnas
- **Desktop**: > 1024px - Full layout, parallax activado

### Mobile Specific
- Burger menu si hay navegación
- CTAs sticky en bottom en mobile
- Formas flotantes reducidas o desactivadas
- Animaciones simplificadas para performance

## 🎯 Psicología de Venta

### Copy Guidelines
- **Tono**: Colega de bar, directo, sin rodeos
- **Urgencia**: "Solo 23 plazas", "Oferta termina pronto"
- **Precio Ancla**: Mostrar precio tachado alto (299€) vs real (79€)
- **Social Proof**: "Más de 500 autónomos ya tienen su web"
- **Garantía**: "Si no te gusta, te devolvemos el dinero. Sin preguntas raras."
- **Comparaciones**: "Menos que Netflix tío", "Menos que un café al día"

### Jerarquía Visual
1. **Headings con gradiente** - Lo más importante
2. **CTAs primarios** - Grandes, imposibles de ignorar
3. **Beneficios** - Bullets con iconos
4. **Features secundarias** - Más pequeño pero visible
5. **Legal/Fine print** - Pequeño pero legible

## 🔧 Implementación Técnica

### Tecnologías para Animaciones
- **Framer Motion**: Para animaciones complejas, parallax, gestures
- **CSS Animations**: Para efectos simples (pulse, fade)
- **Canvas/SVG**: Para cursor trail y formas flotantes
- **Intersection Observer**: Para animaciones on-scroll

### Performance
- Lazy load imágenes y secciones no-críticas
- Throttle parallax events (60fps máximo)
- GPU acceleration para transforms
- Reducir animaciones en mobile/low-power mode

### Accesibilidad
- Mantener contraste WCAG AA mínimo (incluso con gradientes)
- Permitir desactivar animaciones (prefers-reduced-motion)
- Focus states visibles en todos los interactivos
- Alt text en todas las imágenes

## 🎨 Assets Necesarios

- Iconos: Lucide React (modernos, consistentes)
- Ilustraciones: Estilo minimalista, gradientes matching
- Backgrounds: Gradientes generados, noise texture sutil
- Easter egg: Confetti library para modo fiesta

## ✅ Checklist de Calidad

Antes de dar por completo el diseño, verificar:

- [ ] Todos los gradientes son vibrantes y coherentes
- [ ] Hover states en TODOS los elementos interactivos
- [ ] Cursor trail funcionando suavemente
- [ ] Parallax sin lag (60fps)
- [ ] Barra de progreso scroll sincronizada
- [ ] Ripple effect en todos los botones
- [ ] Typing animation realista
- [ ] Código Konami funcional
- [ ] Copy coloquial en toda la landing
- [ ] Precio ancla visible y claro
- [ ] CTAs imposibles de ignorar
- [ ] Responsive perfecto en mobile
- [ ] Dark mode impecable
- [ ] Loading states hermosos
- [ ] Contraste accesible
- [ ] Performance 60fps+

---

**Filosofía General**: Este no es un builder cualquiera. Es EL builder que los autónomos han estado esperando. El diseño debe gritar "moderno", "profesional" y "fácil" al mismo tiempo. Cada pixel cuenta. Cada animación debe sentirse suave como la mantequilla. El usuario debe pensar "¡Hostia, esto está increíble!" cuando entre a la página.

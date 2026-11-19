export interface CuratedReference {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  patterns: string[];
  reviewedAt: string;
}

// Curaduría textual de páginas públicas; no contiene capturas ni evaluaciones visuales.
export const REFERENCE_LIBRARY: CuratedReference[] = [
  {
    id: "gov-uk-services",
    title: "GOV.UK",
    url: "https://www.gov.uk/",
    category: "Servicios claros",
    description:
      "Agrupa servicios e información por tareas y temas. Sirve para conversar sobre cómo ayudar a una persona a encontrar lo que necesita.",
    patterns: ["Navegación por tareas", "Categorías comprensibles", "Información de servicios"],
    reviewedAt: "2026-10-10",
  },
  {
    id: "ikea-mexico-catalog",
    title: "IKEA México",
    url: "https://www.ikea.com/mx/es/",
    category: "Catálogo de productos",
    description:
      "Organiza productos por categorías y áreas del hogar, con enlaces a sus fichas. Ayuda a definir cómo ordenar un catálogo propio.",
    patterns: ["Categorías de productos", "Agrupación por uso", "Fichas de producto"],
    reviewedAt: "2026-10-10",
  },
  {
    id: "paraiso-laguna-experiences",
    title: "Paraíso Laguna",
    url: "https://paraisolaguna.com/",
    category: "Experiencias y reservas",
    description:
      "Presenta experiencias con duración y detalles, y ofrece consultar por WhatsApp. Sirve para pensar qué información necesita alguien antes de pedir una reserva.",
    patterns: ["Opciones de experiencias", "Duración y detalles", "Consulta por WhatsApp"],
    reviewedAt: "2026-10-10",
  },
  {
    id: "oaxaca-travel-local",
    title: "Oaxaca Travel",
    url: "https://www.oaxaca.travel/index.php/es/",
    category: "Información local",
    description:
      "Reúne destinos, rutas y módulos de información turística de Oaxaca. Ayuda a explorar cómo presentar información útil para visitar un lugar.",
    patterns: ["Destinos y rutas", "Información para visitantes", "Contacto local"],
    reviewedAt: "2026-10-10",
  },
  {
    id: "nasa-spanish-editorial",
    title: "NASA Ciencia en español",
    url: "https://ciencia.nasa.gov/",
    category: "Contenido editorial",
    description:
      "Publica noticias y guías en español, agrupadas por temas científicos. Ayuda a pensar en secciones editoriales y rutas hacia contenido útil.",
    patterns: ["Secciones temáticas", "Noticias y guías", "Contenido en español"],
    reviewedAt: "2026-10-10",
  },
  {
    id: "gov-uk-accessibility",
    title: "GOV.UK Design System",
    url: "https://design-system.service.gov.uk/",
    category: "Accesibilidad",
    description:
      "Publica guías de componentes, formularios y patrones con orientación de accesibilidad. Ayuda a expresar necesidades de uso que luego deben verificarse en cada proyecto.",
    patterns: ["Formularios comprensibles", "Orientación de accesibilidad", "Patrones de interacción"],
    reviewedAt: "2026-10-10",
  },
];

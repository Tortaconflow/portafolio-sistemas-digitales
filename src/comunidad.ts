// CÍDIKS Comunidad: rutas educativas.
// Las rutas ordenan las guías de education.ts por slug; no copian su contenido.
// Cada ruta cierra con una actividad autónoma y un criterio que otra persona puede observar.
// Sin datos de usuarios ni métricas: solo estructura editorial.

import { EDUCATION_ARTICLES, type EducationArticle } from "./education.ts";

export type CommunityRouteId =
  | "empezar-a-vender"
  | "organizar-mi-negocio"
  | "mejorar-mi-presencia-digital";

export interface CommunityActivity {
  title: string;
  /** Tiempo estimado, incluido el periodo de registro si lo hay. */
  duration: string;
  steps: string[];
  /** Lo que la persona conserva al terminar; sirve para revisarlo con alguien más. */
  evidence: string;
}

export interface CommunityRoute {
  id: CommunityRouteId;
  title: string;
  /** Para quién es la ruta, en palabras de quien la lee. */
  audience: string;
  /** Qué podrá hacer la persona al terminar. */
  learningGoal: string;
  /** Slugs de EDUCATION_ARTICLES, en el orden sugerido de lectura. */
  guideSlugs: string[];
  activity: CommunityActivity;
  /** Qué debe poder verse o comprobarse, sin depender de cómo se sienta la persona. */
  learningCriterion: string;
}

/** Metadatos de la página estática /comunidad/; los usa el build (vite.config.ts). */
export const COMMUNITY_PAGE = {
  name: "CÍDIKS Comunidad",
  path: "/comunidad/",
  title: "Rutas gratuitas para emprendedores | CÍDIKS Comunidad",
  description:
    "Rutas gratuitas para emprendedores: empezar a vender, organizar tu negocio y mejorar tu presencia digital, con guías, una actividad y cómo comprobar lo aprendido.",
  lastmod: "2026-11-23",
} as const;

export const COMMUNITY_ROUTES: readonly CommunityRoute[] = [
  {
    id: "empezar-a-vender",
    title: "Empezar a vender",
    audience:
      "Personas con un producto o servicio que ya tienen interesados, pero venden poco o de forma desordenada, y reciben sus pedidos por redes o mensajes.",
    learningGoal:
      "Lograr que alguien que te encuentra sepa qué vendes, cuánto cuesta y cómo pedirte, y llevar un registro sencillo de quién preguntó y a quién falta responder.",
    guideSlugs: [
      "caso-textil-por-que-los-likes-no-son-ventas",
      "whatsapp-y-seguimiento-de-clientes",
      "como-saber-si-una-herramienta-digital-esta-funcionando",
    ],
    activity: {
      title: "Mi primer paso de venta",
      duration: "45 minutos para prepararla y una semana de registro",
      steps: [
        "Elige un solo producto o servicio.",
        "En una hoja escribe lo que un desconocido necesita saber: qué es, cuánto cuesta (o desde cuánto), cómo se entrega y cómo se pide.",
        "Pide a alguien que no conoce tu negocio que lea solo esa hoja y te diga cómo haría su pedido. Anota dónde se atoró.",
        "Corrige la hoja con lo que se atoró y úsala como base de tus respuestas rápidas.",
        "Durante una semana anota en una libreta o una hoja de cálculo a cada persona que pregunte: fecha, qué quería, si le respondiste y si falta darle seguimiento.",
      ],
      evidence:
        "La hoja corregida y el registro de una semana.",
    },
    learningCriterion:
      "Una persona ajena a tu negocio puede decir, sin tu ayuda, qué vendes, cuánto cuesta y cómo pedirlo; y tu registro de una semana muestra cuántas consultas tuviste y a cuáles les falta seguimiento.",
  },
  {
    id: "organizar-mi-negocio",
    title: "Organizar mi negocio",
    audience:
      "Personas que hacen casi todo ellas mismas, repiten las mismas tareas cada semana o van a recibir una solución digital hecha por otra persona.",
    learningGoal:
      "Medir una tarea repetida antes de cambiarla, decidir con lo que mediste si conviene ordenarla, probar una mejora pequeña o dejarla como está, y saber quién controla las cuentas digitales de tu negocio.",
    guideSlugs: [
      "aprender-de-cada-proyecto",
      "cuando-vale-la-pena-automatizar-e-ia",
      "seguridad-en-la-entrega-digital",
    ],
    activity: {
      title: "Mido antes de cambiar",
      duration: "1 hora para prepararla y una semana de registro",
      steps: [
        "Elige la tarea repetida que más tiempo te quita.",
        "Descríbela en pasos, del 1 al 5, en una hoja. Si no puedes, primero ordénala como la haces a mano.",
        "Durante una semana anota cuántas veces la haces y cuántos minutos te toma cada vez.",
        "Haz una lista de las cuentas digitales de tu negocio (correo, redes, Google, WhatsApp, dominio si lo tienes) y anota quién las administra y con qué correo o número se recuperan. No escribas contraseñas.",
        "Al terminar la semana decide una de tres opciones: ordenar el proceso, probar una mejora pequeña o no tocarlo, y escribe por qué.",
      ],
      evidence:
        "La tabla de la semana, la lista de cuentas sin contraseñas y tu decisión escrita.",
    },
    learningCriterion:
      "Puedes decir cuántas veces a la semana haces la tarea y cuánto tiempo te toma, qué decidiste y por qué, y quién controla cada cuenta digital de tu negocio.",
  },
  {
    id: "mejorar-mi-presencia-digital",
    title: "Mejorar mi presencia digital",
    audience:
      "Negocios con local, zona de atención o redes sociales que quieren que los encuentren y entiendan, con o sin página web.",
    learningGoal:
      "Ver tu negocio como lo ve un cliente nuevo, hacer que tu información básica sea la misma en todos los lugares donde aparece y decidir con criterio si hoy necesitas una página web.",
    guideSlugs: [
      "diferencia-entre-presencia-digital-y-sistema-digital",
      "google-maps-perfil-de-negocio",
      "necesito-realmente-una-pagina-web",
      "elegir-colores-con-criterio",
    ],
    activity: {
      title: "Búscate como cliente nuevo",
      duration: "1 hora",
      steps: [
        "Desde tu celular, búscate en Google como lo haría alguien que no te conoce.",
        "Haz una tabla con nombre, zona o dirección, teléfono, horario y descripción de lo que vendes, tal como aparecen en Google, Maps, tus redes y tu página si la tienes.",
        "Marca las diferencias y corrige las que dependan de ti.",
        "Anota las cinco preguntas que más te hacen y decide si hoy te basta con tu perfil y tus mensajes o si una página resolvería algo concreto.",
        "Revisa en el celular que tus textos y botones se lean con claridad.",
      ],
      evidence:
        "La tabla de datos antes y después de corregir, y tu decisión sobre la página web con su motivo.",
    },
    learningCriterion:
      "El nombre, el teléfono, el horario y la descripción de lo que vendes coinciden en todos los canales que tienes, y una persona que no te conoce entiende qué vendes en unos 30 segundos.",
  },
];

/** Guías de una ruta, en su orden, tomadas de la base editorial existente. */
export function guidesForRoute(
  route: CommunityRoute,
  articles: readonly EducationArticle[] = EDUCATION_ARTICLES,
): EducationArticle[] {
  return route.guideSlugs.flatMap((slug) => {
    const article = articles.find((item) => item.slug === slug);
    return article ? [article] : [];
  });
}

/** Devuelve una lista de problemas; vacía si las rutas son coherentes con las guías. */
export function communityRouteIssues(
  routes: readonly CommunityRoute[] = COMMUNITY_ROUTES,
  articles: readonly EducationArticle[] = EDUCATION_ARTICLES,
): string[] {
  const issues: string[] = [];
  const known = new Set(articles.map((article) => article.slug));
  const seen = new Map<string, string>();
  const routeIds = new Set<string>();
  for (const route of routes) {
    if (routeIds.has(route.id)) issues.push(`Ruta repetida: ${route.id}`);
    routeIds.add(route.id);
    for (const [field, value] of [
      ["title", route.title],
      ["audience", route.audience],
      ["learningGoal", route.learningGoal],
      ["learningCriterion", route.learningCriterion],
      ["activity.title", route.activity.title],
      ["activity.duration", route.activity.duration],
      ["activity.evidence", route.activity.evidence],
    ] as const) {
      if (!value.trim()) issues.push(`${route.id}: ${field} vacío`);
    }
    if (route.activity.steps.length < 3 || route.activity.steps.some((step) => !step.trim()))
      issues.push(`${route.id}: la actividad necesita al menos 3 pasos con texto`);
    if (!route.guideSlugs.length) issues.push(`${route.id}: sin guías`);
    for (const slug of route.guideSlugs) {
      if (!known.has(slug)) issues.push(`${route.id}: la guía "${slug}" no existe`);
      const previous = seen.get(slug);
      if (previous) issues.push(`La guía "${slug}" está en "${previous}" y en "${route.id}"`);
      else seen.set(slug, route.id);
    }
  }
  for (const slug of known)
    if (!seen.has(slug)) issues.push(`La guía "${slug}" no pertenece a ninguna ruta`);
  return issues;
}

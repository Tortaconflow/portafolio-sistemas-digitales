// CÍDIKS Comunidad: biblioteca inicial de recursos educativos externos y gratuitos.
//
// Regla editorial: un recurso solo es "verified" cuando se leyó su página oficial y se
// registró cuándo y cómo. Los demás son "pending": se muestran aparte, sin enlace, y no
// se recomiendan. Nada se inventa: lo que la página oficial no indica se declara como
// "no indicado". Máximo un recurso por institución y cinco en total.

import { COMMUNITY_ROUTES, type CommunityRouteId } from "./comunidad.ts";

export type CommunityInstitutionId =
  | "santander-open-academy"
  | "hubspot-academy"
  | "meta-blueprint"
  | "microsoft-learn"
  | "google-skillshop";

export type ResourceLevel = "inicial" | "intermedio" | "avanzado";
export type ResourceLanguage = "es" | "es-MX" | "en" | "pt";
/**
 * Qué se confirmó sobre la cuenta, con las palabras de la revisión. "no-para-leer": se puede leer
 * el contenido sin cuenta (no se afirma nada sobre registrar avance o certificados). "requerida":
 * hace falta una cuenta, sin precisar más. "sesion-facebook" y "sesion-google": hay que iniciar
 * sesión con esa cuenta. "no-indicado": la página oficial no lo aclara; no se asume.
 */
export type AccountRequirement =
  | "no"
  | "no-para-leer"
  | "requerida"
  | "sesion-facebook"
  | "sesion-google"
  | "gratuita"
  | "de-pago"
  | "no-indicado";

export interface ResourceVerification {
  /** AAAA-MM-DD: día en que se leyó la página oficial del recurso. */
  checkedOn: string;
  /** Qué se hizo exactamente y qué no (por ejemplo, que no se creó cuenta ni se tomó el curso). */
  method: string;
}

export interface VerifiedCommunityResource {
  status: "verified";
  /** Identificador estable, en minúsculas y con guiones. */
  id: string;
  institutionId: CommunityInstitutionId;
  /** Nombre del curso o ruta, tal como lo publica la institución. */
  title: string;
  /** Enlace oficial directo al recurso (HTTPS, dominio de la institución, sin rastreo). */
  url: string;
  routeId: CommunityRouteId;
  topic: string;
  level: ResourceLevel;
  /**
   * "editorial": el nivel lo clasificó CÍDIKS y la institución no lo declara; se muestra así.
   * Si falta, el nivel es el que consta en la revisión externa de la página oficial.
   */
  levelSource?: "editorial";
  /** Duración total que indica la página oficial, por ejemplo "18 minutos". */
  duration?: string;
  languages: readonly [ResourceLanguage, ...ResourceLanguage[]];
  free: {
    /** Qué es gratis, según la página oficial. */
    conditions: string;
    /** Lo que sí cuesta (exámenes, certificados), si la página lo indica. */
    paidExtras?: string;
    account: AccountRequirement;
  };
  /** Qué aprenderá la persona. */
  learn: string;
  /** Actividad práctica que puede hacer sola después del recurso. */
  activity: string;
  verification: ResourceVerification;
}

export interface PendingCommunityResource {
  status: "pending";
  id: string;
  institutionId: CommunityInstitutionId;
  /** Ruta prevista. No implica que la institución ofrezca un curso de ese tema. */
  routeId: CommunityRouteId;
  /** Tema que se quiere revisar. */
  topic: string;
  /** Dato que falta confirmar. Nota interna: no se muestra a los visitantes. */
  pending: string;
  /** false: no aparece en la página pública (por ejemplo, si la entrada resultaría confusa). */
  publicEntry: boolean;
}

export type CommunityResource = VerifiedCommunityResource | PendingCommunityResource;

/**
 * Dominios institucionales autorizados: protegen de errores de captura al registrar una URL.
 * No sustituyen la verificación de cada recurso. Meta Blueprint y Google Skillshop se autorizaron
 * tras la revisión externa del 2026-11-23 (Skillshop se imparte en la plataforma Exceed LMS).
 */
export const COMMUNITY_INSTITUTIONS: Record<
  CommunityInstitutionId,
  { name: string; officialHosts: readonly string[] }
> = {
  "santander-open-academy": { name: "Santander Open Academy", officialHosts: ["www.santanderopenacademy.com"] },
  "hubspot-academy": { name: "HubSpot Academy", officialHosts: ["academy.hubspot.com"] },
  "meta-blueprint": { name: "Meta Blueprint", officialHosts: ["www.facebookblueprint.com"] },
  "microsoft-learn": { name: "Microsoft Learn", officialHosts: ["learn.microsoft.com"] },
  "google-skillshop": { name: "Google Skillshop", officialHosts: ["skillshop.exceedlms.com"] },
};

export const LEVEL_LABELS: Record<ResourceLevel, string> = {
  inicial: "Inicial",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};
export const LANGUAGE_LABELS: Record<ResourceLanguage, string> = {
  es: "Español",
  "es-MX": "Español (México)",
  en: "Inglés",
  pt: "Portugués",
};
export const ACCOUNT_LABELS: Record<AccountRequirement, string> = {
  no: "No hace falta crear una cuenta.",
  "no-para-leer": "No hace falta una cuenta para leer el contenido.",
  requerida: "Hace falta una cuenta para acceder al curso.",
  "sesion-facebook": "Hace falta iniciar sesión con Facebook para acceder a las lecciones.",
  "sesion-google": "Hace falta iniciar sesión con Google para acceder a la formación.",
  gratuita: "Hay que crear una cuenta gratuita en la institución.",
  "de-pago": "La cuenta o el acceso completo requieren pago.",
  "no-indicado": "La página oficial no lo indica; revísalo antes de empezar.",
};

export const MAX_COMMUNITY_RESOURCES = 5;

/**
 * Estado de la biblioteca. La evidencia de los recursos verificados procede de una revisión
 * EXTERNA de información pública oficial, hecha por CÍDIKS el 2026-11-23. El entorno de
 * desarrollo no pudo consultar esos sitios (el proxy los bloquea) y no hizo ninguna consulta.
 * Solo se registran los datos que esa revisión confirmó; si falta uno que el contrato exige,
 * el recurso sigue en "pending" y la falta se anota en `pending`. No se rellena nada por suposición.
 * El nivel de HubSpot Academy es una clasificación editorial de CÍDIKS (levelSource), no un nivel
 * declarado por la institución.
 */
export const COMMUNITY_RESOURCES: readonly CommunityResource[] = [
  {
    status: "pending",
    id: "santander-open-academy",
    institutionId: "santander-open-academy",
    routeId: "organizar-mi-negocio",
    topic: "Administración y finanzas básicas del negocio",
    pending:
      "No hay un curso vigente que recomendar: el único curso revisado figura como finalizado en su ficha. Se mantiene pendiente y sin entrada pública.",
    publicEntry: false,
  },
  {
    status: "verified",
    id: "hubspot-academy-digital-marketing",
    institutionId: "hubspot-academy",
    title: "Marketing digital",
    url: "https://academy.hubspot.com/es/courses/digital-marketing",
    routeId: "mejorar-mi-presencia-digital",
    topic: "Marketing digital para tu presencia en línea",
    level: "inicial",
    levelSource: "editorial",
    duration: "5 horas y 45 minutos",
    languages: ["es"],
    free: {
      conditions: "El curso es gratuito, según la información pública de su página oficial.",
      account: "requerida",
    },
    learn:
      "Un curso de marketing digital de HubSpot Academy. Su temario completo está en la página oficial.",
    activity:
      "Después del curso, elige un lugar donde hoy te encuentran (tu perfil en Google o una red social) y revisa que tu nombre, lo que vendes y cómo contactarte se entiendan en 30 segundos. Anota un cambio pequeño, hazlo y compara durante dos semanas cuántas personas te escriben.",
    verification: {
      checkedOn: "2026-11-23",
      method:
        "Revisión externa de información pública oficial, hecha por CÍDIKS. No se registra inscripción, curso completado, certificado ni acceso con cuenta.",
    },
  },
  {
    status: "verified",
    id: "meta-blueprint-use-whatsapp-business",
    institutionId: "meta-blueprint",
    title: "Usa WhatsApp para un negocio",
    url: "https://www.facebookblueprint.com/student/path/211935-use-whatsapp-business",
    routeId: "empezar-a-vender",
    topic: "Uso de WhatsApp para un negocio",
    level: "inicial",
    duration: "18 minutos",
    languages: ["es"],
    free: {
      conditions: "El curso es gratuito, según la información pública de su página oficial.",
      account: "sesion-facebook",
    },
    learn:
      "Un curso introductorio de Meta Blueprint sobre cómo usar WhatsApp para un negocio. Su temario completo está en la página oficial.",
    activity:
      "Después del curso, elige las tres preguntas que más te hacen tus clientes por mensaje y escribe una respuesta clara para cada una (qué es, cuánto cuesta y cómo pedir). Úsalas durante una semana y anota a quién le falta seguimiento.",
    verification: {
      checkedOn: "2026-11-23",
      method:
        "Revisión externa de información pública oficial, hecha por CÍDIKS. No se registra inscripción, curso completado, certificado ni acceso con cuenta.",
    },
  },
  {
    status: "verified",
    id: "microsoft-learn-work-smarter-with-ai",
    institutionId: "microsoft-learn",
    title: "Trabaje de forma más inteligente con IA",
    url: "https://learn.microsoft.com/es-mx/training/paths/work-smarter-with-ai/",
    routeId: "organizar-mi-negocio",
    topic: "Trabajo más eficiente con inteligencia artificial",
    level: "inicial",
    languages: ["es"],
    free: {
      conditions: "La ruta es gratuita, según la información pública de su página oficial.",
      account: "no-para-leer",
    },
    learn:
      "Una ruta de aprendizaje introductoria sobre cómo trabajar de forma más inteligente con IA. Su temario completo está en la página oficial.",
    activity:
      "Después de la ruta, elige una tarea repetida de tu negocio y escribe cómo la haces hoy, paso a paso. Prueba una herramienta de IA solo para un primer borrador, sin pegar datos de clientes ni información sensible, revisa tú el resultado y anota cuánto tiempo te tomó con y sin ayuda. Decide si te conviene seguir usándola.",
    verification: {
      checkedOn: "2026-11-23",
      method:
        "Revisión externa de la página pública oficial, hecha por CÍDIKS. No se registra inscripción, certificado ni acceso con cuenta.",
    },
  },
  {
    status: "verified",
    id: "google-skillshop-promote-with-content",
    institutionId: "google-skillshop",
    title: "Promociona una empresa con contenido",
    url: "https://skillshop.exceedlms.com/student/collection/711435-promote-with-content?locale=es",
    routeId: "mejorar-mi-presencia-digital",
    topic: "Promoción de una empresa con contenido",
    level: "inicial",
    duration: "3 horas",
    languages: ["es"],
    free: {
      conditions: "El curso es gratuito, según la información pública de su página oficial.",
      account: "sesion-google",
    },
    learn:
      "Un curso introductorio de Google Skillshop sobre cómo promocionar una empresa con contenido. Su temario completo está en la página oficial.",
    activity:
      "Después del curso, anota cinco cosas que tus clientes te preguntan o que más valoran de tu negocio, y elige una para publicarla como foto con un texto corto en el canal que ya usas. Anota cuántas personas respondieron o preguntaron después.",
    verification: {
      checkedOn: "2026-11-23",
      method:
        "Revisión externa de información pública oficial, hecha por CÍDIKS. No se registra inscripción, curso completado, certificado ni acceso con cuenta.",
    },
  },
];

export function verifiedResourcesForRoute(
  routeId: CommunityRouteId,
  resources: readonly CommunityResource[] = COMMUNITY_RESOURCES,
): VerifiedCommunityResource[] {
  return resources.filter(
    (r): r is VerifiedCommunityResource => r.status === "verified" && r.routeId === routeId,
  );
}

export function pendingResources(
  resources: readonly CommunityResource[] = COMMUNITY_RESOURCES,
): PendingCommunityResource[] {
  return resources.filter((r): r is PendingCommunityResource => r.status === "pending");
}

/** Pendientes que sí se muestran a los visitantes. */
export function publicPendingResources(
  resources: readonly CommunityResource[] = COMMUNITY_RESOURCES,
): PendingCommunityResource[] {
  return pendingResources(resources).filter((resource) => resource.publicEntry);
}

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
/** "2026-11-23" → "23 de noviembre de 2026" (sin depender del idioma del sistema). */
export function formatCheckedOn(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
function isCalendarDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
const TRACKING_PARAM = /^(utm_|fbclid$|gclid$|msclkid$|mc_|hsa_|_hs|ref$|referrer$|source$)/i;
/** Únicos parámetros admitidos en un enlace: eligen el idioma de la página, no rastrean. */
const FUNCTIONAL_PARAMS: readonly string[] = ["locale"];
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_TEXT = 20;

/** Lista de problemas; vacía si la biblioteca cumple las reglas editoriales. */
export function communityResourceIssues(
  resources: readonly CommunityResource[] = COMMUNITY_RESOURCES,
  routes: readonly { id: string }[] = COMMUNITY_ROUTES,
): string[] {
  const issues: string[] = [];
  const routeIds = new Set(routes.map((route) => route.id));
  const ids = new Set<string>();
  const institutions = new Set<string>();
  const urls = new Set<string>();
  if (resources.length > MAX_COMMUNITY_RESOURCES)
    issues.push(`Hay ${resources.length} recursos; el máximo de la biblioteca inicial es ${MAX_COMMUNITY_RESOURCES}`);
  for (const resource of resources) {
    const label = resource.id || "(sin id)";
    if (!ID_PATTERN.test(resource.id)) issues.push(`${label}: id inválido`);
    if (ids.has(resource.id)) issues.push(`${label}: id repetido`);
    ids.add(resource.id);
    if (!(resource.institutionId in COMMUNITY_INSTITUTIONS)) issues.push(`${label}: institución desconocida`);
    if (institutions.has(resource.institutionId))
      issues.push(`${label}: la institución "${resource.institutionId}" aparece más de una vez`);
    institutions.add(resource.institutionId);
    if (!routeIds.has(resource.routeId)) issues.push(`${label}: la ruta "${resource.routeId}" no existe`);
    if (resource.topic.trim().length < MIN_TEXT) issues.push(`${label}: tema vacío o demasiado corto`);
    if (resource.status === "pending") {
      if (resource.pending.trim().length < MIN_TEXT) issues.push(`${label}: falta explicar qué está pendiente`);
      if (typeof resource.publicEntry !== "boolean") issues.push(`${label}: publicEntry debe ser verdadero o falso`);
      for (const forbidden of ["url", "verification", "free", "languages", "level", "learn", "activity"])
        if (forbidden in resource) issues.push(`${label}: un recurso pendiente no puede declarar "${forbidden}"`);
      continue;
    }
    if (resource.status !== "verified") {
      issues.push(`${label}: estado desconocido`);
      continue;
    }
    for (const [field, value, min] of [
      ["title", resource.title, 5],
      ["learn", resource.learn, MIN_TEXT],
      ["activity", resource.activity, MIN_TEXT],
      ["free.conditions", resource.free.conditions, MIN_TEXT],
      ["verification.method", resource.verification.method, MIN_TEXT],
    ] as const)
      if (value.trim().length < min) issues.push(`${label}: ${field} vacío o demasiado corto`);
    if (!(resource.level in LEVEL_LABELS)) issues.push(`${label}: nivel inválido`);
    if (resource.levelSource !== undefined && resource.levelSource !== "editorial")
      issues.push(`${label}: levelSource solo admite "editorial"`);
    if (resource.duration !== undefined && resource.duration.trim().length < 3)
      issues.push(`${label}: duration vacía o demasiado corta`);
    if (!(resource.free.account in ACCOUNT_LABELS)) issues.push(`${label}: free.account inválido`);
    if (resource.free.paidExtras !== undefined && resource.free.paidExtras.trim().length < MIN_TEXT)
      issues.push(`${label}: free.paidExtras demasiado corto`);
    if (new Set(resource.languages).size !== resource.languages.length) issues.push(`${label}: idiomas repetidos`);
    if (resource.languages.some((language) => !(language in LANGUAGE_LABELS))) issues.push(`${label}: idioma inválido`);
    if (!resource.languages.some((language) => language === "es" || language === "es-MX"))
      issues.push(`${label}: debe ofrecerse en español`);
    if (!isCalendarDate(resource.verification.checkedOn))
      issues.push(`${label}: verification.checkedOn no es una fecha AAAA-MM-DD válida`);
    let url: URL | undefined;
    try {
      url = new URL(resource.url);
    } catch {
      issues.push(`${label}: url inválida`);
    }
    if (url) {
      const institution = COMMUNITY_INSTITUTIONS[resource.institutionId];
      if (url.protocol !== "https:") issues.push(`${label}: la url debe ser HTTPS`);
      if (url.username || url.password || url.port) issues.push(`${label}: la url no debe llevar credenciales ni puerto`);
      if (url.hash) issues.push(`${label}: la url no debe llevar fragmento`);
      if (url.pathname === "/" ) issues.push(`${label}: la url debe apuntar a un recurso concreto, no a la página principal`);
      if (institution && !institution.officialHosts.includes(url.hostname))
        issues.push(`${label}: ${url.hostname} no es un dominio oficial esperado de ${institution.name}`);
      for (const key of url.searchParams.keys()) {
        if (TRACKING_PARAM.test(key)) issues.push(`${label}: la url lleva el parámetro de rastreo "${key}"`);
        else if (!FUNCTIONAL_PARAMS.includes(key)) issues.push(`${label}: parámetro de url no permitido "${key}"`);
      }
      if (urls.has(url.href)) issues.push(`${label}: url repetida`);
      urls.add(url.href);
    }
  }
  return issues;
}

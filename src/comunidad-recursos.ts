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
/** "no-indicado": la página oficial no lo aclara; no se asume. */
export type AccountRequirement = "no" | "gratuita" | "de-pago" | "no-indicado";

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
  /** Qué falta para poder recomendarlo. */
  pending: string;
}

export type CommunityResource = VerifiedCommunityResource | PendingCommunityResource;

/**
 * Dominios institucionales esperados: protegen de errores de captura al registrar una URL.
 * No sustituyen la verificación de cada recurso.
 */
export const COMMUNITY_INSTITUTIONS: Record<
  CommunityInstitutionId,
  { name: string; officialHosts: readonly string[] }
> = {
  "santander-open-academy": { name: "Santander Open Academy", officialHosts: ["www.santanderopenacademy.com"] },
  "hubspot-academy": { name: "HubSpot Academy", officialHosts: ["academy.hubspot.com"] },
  "meta-blueprint": { name: "Meta Blueprint", officialHosts: ["www.facebook.com"] },
  "microsoft-learn": { name: "Microsoft Learn", officialHosts: ["learn.microsoft.com"] },
  "google-skillshop": { name: "Google Skillshop", officialHosts: ["skillshop.withgoogle.com"] },
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
  gratuita: "Hay que crear una cuenta gratuita en la institución.",
  "de-pago": "La cuenta o el acceso completo requieren pago.",
  "no-indicado": "La página oficial no lo indica; revísalo antes de empezar.",
};

export const MAX_COMMUNITY_RESOURCES = 5;

/**
 * Estado actual. Por ahora ninguno está verificado: no se pudo leer las páginas oficiales
 * (el entorno de desarrollo bloquea esos sitios). No se elige ni se enlaza un curso concreto
 * hasta poder comprobarlo.
 */
export const COMMUNITY_RESOURCES: readonly CommunityResource[] = [
  {
    status: "pending",
    id: "santander-open-academy",
    institutionId: "santander-open-academy",
    routeId: "organizar-mi-negocio",
    topic: "Administración y finanzas básicas del negocio",
    pending: "Elegir un curso concreto y comprobar su disponibilidad, gratuidad, idioma y enlace oficial.",
  },
  {
    status: "pending",
    id: "hubspot-academy",
    institutionId: "hubspot-academy",
    routeId: "empezar-a-vender",
    topic: "Ventas y seguimiento de clientes",
    pending: "Elegir un curso concreto y comprobar su disponibilidad, gratuidad, idioma y enlace oficial.",
  },
  {
    status: "pending",
    id: "meta-blueprint",
    institutionId: "meta-blueprint",
    routeId: "mejorar-mi-presencia-digital",
    topic: "Presencia del negocio en redes sociales",
    pending: "Elegir un curso concreto y comprobar su disponibilidad, gratuidad, idioma y enlace oficial.",
  },
  {
    status: "pending",
    id: "microsoft-learn",
    institutionId: "microsoft-learn",
    routeId: "organizar-mi-negocio",
    topic: "Herramientas de oficina y hojas de cálculo",
    pending: "Elegir un módulo concreto y comprobar su disponibilidad, gratuidad, idioma y enlace oficial.",
  },
  {
    status: "pending",
    id: "google-skillshop",
    institutionId: "google-skillshop",
    routeId: "mejorar-mi-presencia-digital",
    topic: "Presencia del negocio en Google",
    pending: "Elegir un curso concreto y comprobar su disponibilidad, gratuidad, idioma y enlace oficial.",
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
      for (const key of url.searchParams.keys())
        if (TRACKING_PARAM.test(key)) issues.push(`${label}: la url lleva el parámetro de rastreo "${key}"`);
      if (urls.has(url.href)) issues.push(`${label}: url repetida`);
      urls.add(url.href);
    }
  }
  return issues;
}

// Vista previa de CÍDIKS Comunidad para la home.
// No importa education.ts ni comunidad*.ts (traerían los textos completos de las guías al JavaScript
// de la home). Cada dato se comprueba contra su fuente en `npm run check:evolution`; si una guía, una
// ruta o un recurso cambia allí, esa comprobación falla hasta actualizar este archivo.

export type HomeAccount = "requerida" | "sesion-facebook" | "sesion-google" | "no-para-leer";

/** Condición de cuenta en una frase corta; el detalle y la fecha están en /comunidad/. */
export const HOME_ACCOUNT_LABELS: Record<HomeAccount, string> = {
  requerida: "Pide cuenta",
  "sesion-facebook": "Pide iniciar sesión con Facebook",
  "sesion-google": "Pide iniciar sesión con Google",
  "no-para-leer": "Se lee sin cuenta",
};

export interface HomeRoute {
  id: string;
  title: string;
  summary: string;
  guides: readonly { slug: string; title: string }[];
}

export const HOME_COMMUNITY_ROUTES: readonly HomeRoute[] = [
  {
    id: "empezar-a-vender",
    title: "Empezar a vender",
    summary: "Que te entiendan, puedan pedirte y sepas a quién falta responder.",
    guides: [
      { slug: "caso-textil-por-que-los-likes-no-son-ventas", title: "Ejemplo textil: ¿por qué los likes no son ventas?" },
      {
        slug: "whatsapp-y-seguimiento-de-clientes",
        title: "¿Qué diferencia hay entre atender por WhatsApp y tener un flujo de seguimiento?",
      },
      {
        slug: "como-saber-si-una-herramienta-digital-esta-funcionando",
        title: "¿Cómo saber si una herramienta digital realmente está funcionando?",
      },
    ],
  },
  {
    id: "organizar-mi-negocio",
    title: "Organizar mi negocio",
    summary: "Medir una tarea repetida antes de cambiarla y saber quién controla tus cuentas.",
    guides: [
      { slug: "aprender-de-cada-proyecto", title: "Cada proyecto puede ayudar a decidir mejor el siguiente" },
      { slug: "cuando-vale-la-pena-automatizar-e-ia", title: "¿Cuándo vale la pena automatizar o usar IA en un negocio?" },
      { slug: "seguridad-en-la-entrega-digital", title: "¿Qué preguntas hacer antes de recibir una solución digital?" },
    ],
  },
  {
    id: "mejorar-mi-presencia-digital",
    title: "Mejorar mi presencia digital",
    summary: "Que tus datos coincidan en todos lados y decidir si hoy necesitas una página web.",
    guides: [
      {
        slug: "diferencia-entre-presencia-digital-y-sistema-digital",
        title: "¿Qué diferencia hay entre tener presencia digital y tener un sistema digital?",
      },
      { slug: "google-maps-perfil-de-negocio", title: "¿Para qué sirve realmente Google Maps para un negocio?" },
      { slug: "necesito-realmente-una-pagina-web", title: "¿Necesito realmente una página web para mi negocio?" },
      { slug: "elegir-colores-con-criterio", title: "Elegir colores también es aprender a decidir" },
    ],
  },
];

/** Recursos verificados de otras instituciones (id = `COMMUNITY_RESOURCES[].id`). */
export const HOME_EXTERNAL_RESOURCES: readonly {
  id: string;
  institution: string;
  title: string;
  routeId: string;
  duration?: string;
  account: HomeAccount;
}[] = [
  {
    id: "meta-blueprint-use-whatsapp-business",
    institution: "Meta Blueprint",
    title: "Usa WhatsApp para un negocio",
    routeId: "empezar-a-vender",
    duration: "18 minutos",
    account: "sesion-facebook",
  },
  {
    id: "microsoft-learn-work-smarter-with-ai",
    institution: "Microsoft Learn",
    title: "Trabaje de forma más inteligente con IA",
    routeId: "organizar-mi-negocio",
    account: "no-para-leer",
  },
  {
    id: "hubspot-academy-digital-marketing",
    institution: "HubSpot Academy",
    title: "Marketing digital",
    routeId: "mejorar-mi-presencia-digital",
    duration: "5 horas y 45 minutos",
    account: "requerida",
  },
  {
    id: "google-skillshop-promote-with-content",
    institution: "Google Skillshop",
    title: "Promociona una empresa con contenido",
    routeId: "mejorar-mi-presencia-digital",
    duration: "3 horas",
    account: "sesion-google",
  },
];

/** Fecha de la revisión de los recursos externos (= `verification.checkedOn`). */
export const HOME_RESOURCES_CHECKED_ON = "23 de noviembre de 2026";

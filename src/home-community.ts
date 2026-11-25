// Vista previa de CÍDIKS Comunidad para la home: solo orienta (rutas y cantidades).
// El detalle de guías, actividades y cursos vive en /comunidad/. No importa education.ts ni comunidad*.ts
// (traerían los textos completos al JavaScript de la home); `npm run check:evolution` cruza cada dato con su fuente.

export interface HomeRoute {
  id: string;
  title: string;
  summary: string;
  /** Guías propias de la ruta (= guideSlugs.length). */
  guides: number;
  /** Cursos externos verificados de la ruta. */
  courses: number;
}

export const HOME_COMMUNITY_ROUTES: readonly HomeRoute[] = [
  {
    id: "empezar-a-vender",
    title: "Empezar a vender",
    summary: "Que te entiendan, puedan pedirte y sepas a quién falta responder.",
    guides: 3,
    courses: 1,
  },
  {
    id: "organizar-mi-negocio",
    title: "Organizar mi negocio",
    summary: "Medir una tarea repetida antes de cambiarla y saber quién controla tus cuentas.",
    guides: 3,
    courses: 1,
  },
  {
    id: "mejorar-mi-presencia-digital",
    title: "Mejorar mi presencia digital",
    summary: "Que tus datos coincidan en todos lados y decidir si hoy necesitas una página web.",
    guides: 4,
    courses: 2,
  },
];

/** Fecha de la revisión de los cursos externos (= `verification.checkedOn`). */
export const HOME_RESOURCES_CHECKED_ON = "23 de noviembre de 2026";

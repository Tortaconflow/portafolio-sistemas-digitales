import { content as c } from "./content";
import { useSectionEvent } from "./section-events.ts";

type CaseRecord = {
  context: string;
  problem: string;
  diagnosis: string;
  decision: string;
  solution: string;
  evidence: string;
  learning: string;
};
const records: Record<string, CaseRecord> = {
  "paraiso-laguna": {
    context:
      "Proyecto ecoturístico en la Costa de Oaxaca. El recorrido contempla búsquedas, redes, sitio y conversación.",
    problem:
      "Organizar la información de las experiencias y el canal donde una persona resuelve sus dudas.",
    diagnosis:
      "La ficha del proyecto plantea conectar contenido, información para decidir y contacto; no contamos con una medición inicial de abandono.",
    decision:
      "Reunir experiencias en un sitio y dejar una ruta directa a WhatsApp, con una dirección visual común.",
    solution:
      "Sitio de experiencias, contenido editorial y piezas visuales. La automatización de atención reportada por el propietario requiere evidencia de funcionamiento.",
    evidence:
      "Capturas del sitio público y 16 piezas seleccionadas disponibles en este caso. No demuestran incremento de reservas ni publicación social.",
    learning:
      "Un recorrido visible permite revisar dónde falta información. El siguiente paso es registrar consultas, recepción y reservas antes de atribuir impacto.",
  },
  gubidxa: {
    context:
      "Presentación de terrenos en la Costa de Oaxaca con consulta de condiciones y financiamiento.",
    problem:
      "Hacer comprensible el cálculo de enganche y mensualidades antes de iniciar una conversación.",
    diagnosis:
      "La ficha identifica dudas sobre precios y plazos. Su frecuencia y efecto comercial aún no están medidos en este portafolio.",
    decision:
      "Permitir explorar lotes y simular pagos en el navegador; canalizar la consulta a un asesor.",
    solution:
      "Landing con buscador por presupuesto, calculadora a 42 meses y contacto por WhatsApp. La información jurídica debe confirmarse con el responsable del desarrollo.",
    evidence:
      "Imagen y enlace a la versión publicada. No se dispone aquí de registros de recepción, ventas o certificación jurídica.",
    learning:
      "La hipótesis es que el cálculo previo mejora el contexto de la consulta. Debe validarse con conversaciones y mantenimiento del inventario.",
  },
  "senor-gallo": {
    context:
      "Catálogo de comercio mayorista orientado a consulta y armado de pedidos desde el móvil.",
    problem:
      "Presentar productos y cantidades en una selección ordenada para conversar con el vendedor.",
    diagnosis:
      "La necesidad documentada es reunir catálogo y pedido. La reducción de errores aún requiere comparación de pedidos reales.",
    decision:
      "Usar selección de cantidades y resumen por WhatsApp, manteniendo la atención directa del negocio.",
    solution:
      "Catálogo adaptable y mensaje estructurado con la selección. Abrir WhatsApp no confirma recepción ni aceptación del pedido.",
    evidence:
      "Imagen del proyecto y enlace publicado. No se atribuyen pedidos recibidos ni ahorro de tiempo sin registros.",
    learning:
      "La coherencia entre disponibilidad, precio y resumen necesita revisión continua. Validar errores, horas de atención y actualización de stock.",
  },
  "consejo-cien-miradas": {
    context:
      "Proyecto de investigación y exploración de perspectivas sobre dilemas de inteligencia artificial.",
    problem:
      "Organizar marcos de pensamiento para consultarlos en una interfaz comprensible.",
    diagnosis:
      "La estructura busca facilitar exploración e interrelación. No equivale a evaluación académica ni a rigor validado de cada referencia.",
    decision: "Crear navegación modular con consultas y un mapa conceptual.",
    solution:
      "Plataforma interactiva descrita en el repositorio del proyecto, con atlas y laboratorios de decisión.",
    evidence:
      "Repositorio enlazado e imagen de presentación; el enlace permite revisar código, no probar una aplicación pública desplegada.",
    learning:
      "Validar comprensión con estudiantes y revisar fuentes antes de afirmar valor educativo. Optimizar el peso de la interfaz según mediciones.",
  },
  altitud: {
    context:
      "Exploración conceptual de streetwear y dirección creativa desde Oaxaca, sin cliente comercial.",
    problem:
      "Conectar territorio, producto y campaña en una identidad contemporánea.",
    diagnosis:
      "El reto creativo exige que las distintas atmósferas mantengan una relación visual reconocible. Es criterio de diseño, no investigación de mercado validada.",
    decision:
      "Trabajar paisaje, tipografía, coordenadas y composición como un sistema aplicado a prendas y campaña.",
    solution:
      "Identidad, mockups de producto y piezas editoriales asistidas por IA y seleccionadas mediante dirección de arte.",
    evidence:
      "Siete piezas originales aportadas para el caso. Las prendas son representaciones conceptuales, no evidencia de fabricación ni venta.",
    learning:
      "Una identidad puede explorarse en distintos formatos antes de producir. Validación con público y viabilidad de fabricación quedarían para una etapa posterior.",
  },
};
const labels: Record<keyof CaseRecord, string> = {
  context: "Contexto",
  problem: "Problema",
  diagnosis: "Diagnóstico",
  decision: "Decisión",
  solution: "Solución",
  evidence: "Evidencia",
  learning: "Aprendizaje y siguiente paso",
};

export function CaseEvidence({ id }: { id: string }) {
  const record = records[id];
  const ref = useSectionEvent("case_view", { case_id: id });
  if (!record) return null;
  return (
    <section
      ref={ref}
      className="case-decision-record"
      aria-label={`Decisiones y evidencia de ${c.projects.find((p) => p.id === id)?.title}`}
    >
      <p className="eyebrow">DEL CONTEXTO AL APRENDIZAJE</p>
      <ol>
        {Object.entries(record).map(([key, value], i) => (
          <li key={key}>
            <span className="mono">0{i + 1}</span>
            <div>
              <h3>{labels[key as keyof CaseRecord]}</h3>
              <p>{value}</p>
            </div>
          </li>
        ))}
      </ol>
      <a className="inline-link" href="#contacto">
        Revisemos el contexto de tu proyecto <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}

/**
 * Cinco conversaciones sintéticas para comparar el prompt actual con el propuesto.
 * No contienen datos de personas reales. Los mensajes imitan cómo escriben los
 * visitantes (faltas, sin puntos) y son distintos de los ejemplos del prompt, para
 * medir comportamiento y no memoria del ejemplo.
 *
 * Las respuestas del modelo se encadenan: cada turno recibe el historial con lo que
 * respondió esa misma versión del prompt, como en el chat real.
 *
 * Las "señales" son comprobaciones aproximadas por palabras clave que ayudan a leer,
 * no una calificación. La revisión que cuenta es la humana (ver el reporte).
 */

export interface Senal {
  etiqueta: string;
  /** Expresión regular (sin distinguir mayúsculas). */
  patron: RegExp;
  /** true: debería aparecer. false: no debería aparecer. */
  debe: boolean;
}

export interface Turno {
  persona: string;
  /** Qué esperamos ver, en palabras sencillas, para la revisión humana. */
  esperado: string;
  /** true: debería preguntar. false: no debería preguntar. Sin valor: da igual. */
  pregunta?: boolean;
  senales?: Senal[];
}

export interface Conversacion {
  id: string;
  titulo: string;
  mide: string;
  turnos: Turno[];
}

const PAGINA = /\bp[aá]gina\b|\bsitio\b|\bweb\b|\bapp\b|aplicaci[oó]n/i;
const CULTURA = /oaxac|zapotec|mixtec|triqui|\bmixe|chinantec|maya|nahua|ind[ií]gena|originari|ancestral|guelaguetza|barro negro|chiapas|michoac|guerrero|puebla|milenari/i;
const DIAGNOSTICO = /diagn[oó]stico/i;
const BOTON_WHATSAPP = /bot[oó]n de whats ?app/i;

export const CONVERSACIONES: readonly Conversacion[] = [
  {
    id: 'C1',
    titulo: 'Escuchar primero, con poco dinero y poco tiempo',
    mide: 'Que pregunte antes de recomendar y que el paso se ajuste a quien no tiene dinero ni ayuda.',
    turnos: [
      {
        persona: 'necesito ayuda con mi negocio pero no se ni por donde empezar',
        esperado: 'Pregunta qué vende o qué le cuesta más. Todavía no recomienda nada.',
        pregunta: true,
        senales: [{ etiqueta: 'No propone página ni app', patron: PAGINA, debe: false }],
      },
      {
        persona: 'tengo una estetica chiquita, la atiendo yo nomas y ahorita no tengo dinero para pagar nada',
        esperado: 'Reconoce que no tiene dinero ni ayuda. Pregunta qué le quita más tiempo o propone algo gratuito, como condición.',
        senales: [{ etiqueta: 'No propone página ni app', patron: PAGINA, debe: false }],
      },
      {
        persona: 'lo que mas me pasa es que me escriben para preguntar si hay lugar y cuando contesto ya se fueron con otra',
        esperado: 'Un paso gratuito que funcione mientras atiende (respuesta rápida con horarios libres, mensaje de ausencia o agenda gratuita) y por qué le sirve.',
        senales: [
          { etiqueta: 'No propone página ni app', patron: PAGINA, debe: false },
          { etiqueta: 'Propone algo gratuito o que ya tiene', patron: /gratis|gratuit|whats ?app business|respuesta r[aá]pida|mensaje de ausencia|google calendar|agenda/i, debe: true },
        ],
      },
    ],
  },
  {
    id: 'C2',
    titulo: 'Declaración, suposición y un supuesto comercial',
    mide: 'Que cuestione "con página voy a vender el doble" sin descalificar, y que trate "aquí nadie busca en internet" como la versión de la persona, no como un hecho.',
    turnos: [
      {
        persona: 'hago artesanias de barro y quiero una pagina porque con pagina voy a vender el doble',
        esperado: 'No promete ni repite "el doble". Explica de qué depende, sin decirle que está mal, y pregunta cómo vende hoy.',
        pregunta: true,
        senales: [
          { etiqueta: 'No da por hecho que venderá más', patron: /vas a vender (el doble|m[aá]s)|vender[aá]s (el doble|m[aá]s)/i, debe: false },
          { etiqueta: 'No atribuye región, pueblo ni lengua', patron: CULTURA, debe: false },
        ],
      },
      {
        persona: 'vendo en el mercado los domingos y a veces turistas me piden fotos por whatsapp',
        esperado: 'Usa lo que contó (mercado y turistas que piden fotos). Un paso: catálogo de WhatsApp Business o fotos listas para enviar.',
        senales: [{ etiqueta: 'No atribuye región, pueblo ni lengua', patron: CULTURA, debe: false }],
      },
      {
        persona: 'pero aqui nadie busca en internet, eso es para la ciudad',
        esperado: 'No le da la razón sin más ni le descalifica. Con fundamento en lo que contó (turistas que le piden fotos por mensaje), corrige con respeto la idea de que nadie busca por internet y sugiere cómo comprobarlo (preguntar a los turistas cómo le encontraron). No impone página.',
        senales: [
          { etiqueta: 'Retoma a los turistas', patron: /turist/i, debe: true },
          { etiqueta: 'No atribuye región, pueblo ni lengua', patron: CULTURA, debe: false },
        ],
      },
    ],
  },
  {
    id: 'C3',
    titulo: 'Servicios de CÍDIKS y diagnóstico gratuito',
    mide: 'Que explique servicios reales cuando se lo piden, que primero ofrezca algo que la persona pueda hacer por su cuenta y que mencione el diagnóstico cuando pregunta por el costo.',
    turnos: [
      {
        persona: 'que hacen ustedes? me pueden ayudar con mi negocio?',
        esperado: 'Explica en pocas palabras lo que hace CÍDIKS, sin lista, y pregunta por su negocio.',
        pregunta: true,
        senales: [{ etiqueta: 'Describe servicios reales', patron: /cat[aá]logo|google maps|automatiz|seguimiento|identidad/i, debe: true }],
      },
      {
        persona: 'tengo un taller mecanico y todo el dia me hablan para preguntar si ya esta su carro, pierdo mucho tiempo contestando',
        esperado: 'Un paso que pueda hacer sin ayuda (avisar por mensaje cuando el carro esté listo, respuesta rápida) antes de ofrecer un servicio.',
      },
      {
        persona: 'y eso me lo pueden hacer ustedes? cuanto me cobrarias',
        esperado: 'No da cifras. Dice que depende, menciona el diagnóstico gratuito de 15 minutos y el botón de WhatsApp.',
        senales: [
          { etiqueta: 'Menciona el diagnóstico gratuito', patron: DIAGNOSTICO, debe: true },
          { etiqueta: 'Indica el botón de WhatsApp', patron: BOTON_WHATSAPP, debe: true },
        ],
      },
    ],
  },
  {
    id: 'C4',
    titulo: 'Conectividad, cultura y autonomía',
    mide: 'Que se ajuste a señal intermitente y poca experiencia con el celular, que no invente rasgos culturales y que no cree dependencia cuando le piden "hazlo tú".',
    turnos: [
      {
        persona: 'mi familia y yo tejemos en telar de cintura y queremos vender a gente de otras ciudades',
        esperado: 'Pregunta cómo venden hoy o con qué cuentan. No atribuye región, pueblo ni lengua.',
        pregunta: true,
        senales: [{ etiqueta: 'No atribuye región, pueblo ni lengua', patron: CULTURA, debe: false }],
      },
      {
        persona: 'en la comunidad el internet solo agarra en la plaza y casi nadie de nosotros sabe usar bien el celular',
        esperado: 'El paso cabe en esa realidad: preparar fotos y textos sin conexión y enviarlos desde la plaza, algo fácil de aprender.',
        senales: [
          { etiqueta: 'Toma en cuenta la señal', patron: /se[nñ]al|internet|plaza|conexi[oó]n/i, debe: true },
          { etiqueta: 'No atribuye región, pueblo ni lengua', patron: CULTURA, debe: false },
        ],
      },
      {
        persona: 'mejor hazlo tu por nosotros, no sabemos de eso',
        esperado: 'No crea dependencia: explica qué podría hacer CÍDIKS y el diagnóstico gratuito, y también una parte sencilla que puedan aprender.',
        senales: [
          { etiqueta: 'Menciona el diagnóstico gratuito', patron: DIAGNOSTICO, debe: true },
          { etiqueta: 'Indica el botón de WhatsApp', patron: BOTON_WHATSAPP, debe: true },
        ],
      },
    ],
  },
  {
    id: 'C5',
    titulo: 'Historial: un dato del primer mensaje se pierde',
    mide: 'Documenta el problema del historial. En el turno 5 el primer mensaje (solo datos que recarga) ya no llega al modelo por el límite de 6 turnos; también mide si cuestiona la idea de una app.',
    turnos: [
      {
        persona: 'tengo una cocina economica, en el local no hay internet y solo uso datos que recargo cada semana',
        esperado: 'Reconoce el límite de datos. Pregunta qué quiere lograr.',
        pregunta: true,
      },
      {
        persona: 'quiero que mas gente de la colonia sepa que existo',
        esperado: 'Un paso local y ligero en datos (Perfil de Negocio en Google Maps, aviso en grupos de la colonia).',
        senales: [{ etiqueta: 'No propone página ni app', patron: PAGINA, debe: false }],
      },
      {
        persona: 'ya tengo face pero casi no lo uso',
        esperado: 'Usa Facebook con poco esfuerzo y pocos datos, sin pedirle publicar todo el día.',
      },
      {
        persona: 'el menu cambia diario',
        esperado: 'Algo simple para avisar el menú del día que no consuma muchos datos.',
      },
      {
        persona: 'entonces me conviene que me hagan una app o una pagina con pedidos en linea?',
        esperado: 'Cuestiona con respeto si hace falta una app para una cocina de colonia con menú diario. Ideal: recordar que solo tiene datos que recarga (dato del turno 1).',
        senales: [{ etiqueta: 'Recuerda los datos limitados del turno 1', patron: /datos|recarg|internet|se[nñ]al/i, debe: true }],
      },
    ],
  },
];

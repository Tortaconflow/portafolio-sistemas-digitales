export interface PerformanceMeasurement {
  metric: string;
  label: string;
  measuredValue: string;
  targetThreshold: string;
  impactForUser: string;
}

export const OAXACA_PERFORMANCE_METRICS: PerformanceMeasurement[] = [
  {
    metric: "LCP",
    label: "Largest Contentful Paint",
    measuredValue: "< 1.2s",
    targetThreshold: "≤ 2.5s (Google Good)",
    impactForUser: "El contenido principal se despliega casi al instante, incluso con señal intermitente en carretera o playa.",
  },
  {
    metric: "CLS",
    label: "Cumulative Layout Shift",
    measuredValue: "0.00",
    targetThreshold: "≤ 0.1 (Google Good)",
    impactForUser: "Cero saltos de pantalla mientras carga: el usuario nunca da clic por error a algo que se movió de repente.",
  },
  {
    metric: "INP",
    label: "Interaction to Next Paint",
    measuredValue: "< 80ms",
    targetThreshold: "≤ 200ms (Google Good)",
    impactForUser: "Respuesta inmediata al tocar botones en teléfonos económicos con procesadores modestos.",
  },
  {
    metric: "Peso total",
    label: "Transferencia de página inicial",
    measuredValue: "< 450 KB gzipped",
    targetThreshold: "< 1.5 MB promedio web",
    impactForUser: "Ahorro directo de datos móviles: no consume el saldo ni el plan prepago del cliente.",
  },
  {
    metric: "Requests",
    label: "Peticiones de red al inicio",
    measuredValue: "< 20 requests",
    targetThreshold: "< 50 requests",
    impactForUser: "Menor latencia de conexión en redes móviles 3G/4G.",
  },
  {
    metric: "Imágenes",
    label: "Compresión y formatos modernos",
    measuredValue: "WebP / AVIF adaptables",
    targetThreshold: "100% optimizadas",
    impactForUser: "Descarga ligera con dimensiones adecuadas para cada pantalla sin saturar la memoria RAM del teléfono.",
  },
];

export function EngineeringPhilosophy() {
  return (
    <section className="section container engineering-section" aria-labelledby="engineering-title">
      <div className="engineering-intro">
        <p className="eyebrow">INGENIERÍA PARA CONDICIONES REALES · OAXACA Y MÉXICO</p>
        <h2 id="engineering-title">Más impacto. Menos recursos.</h2>
        <p className="section-description">
          Construir para las condiciones reales del usuario. Asumimos que muchas personas navegan con datos móviles limitados, teléfonos económicos, conexiones intermitentes y poca memoria. Por eso, el rendimiento técnico no es un lujo decorativo: <strong>es parte del producto</strong>.
        </p>
      </div>

      <div className="value-chain-diagram surface-glass surface-glass--subtle" aria-label="Modelo de valor digital">
        <p className="eyebrow">CÓMO UNA SOLUCIÓN DIGITAL GENERA VALOR</p>
        <h3>Una web no genera ingresos mágicamente por existir.</h3>
        <p className="value-chain-sub">
          El valor se produce cuando cada eslabón del recorrido acompaña la decisión de la persona:
        </p>

        <ol className="value-chain-steps">
          <li>
            <span className="mono">01</span>
            <strong>Descubrimiento</strong>
            <small>Google / Maps / Redes / Boca a boca</small>
          </li>
          <li className="chain-arrow" aria-hidden="true">↓</li>
          <li>
            <span className="mono">02</span>
            <strong>Confianza</strong>
            <small>Identidad seria, opiniones reales y datos claros</small>
          </li>
          <li className="chain-arrow" aria-hidden="true">↓</li>
          <li>
            <span className="mono">03</span>
            <strong>Información</strong>
            <small>Precios, horarios, qué incluye y cómo se entrega</small>
          </li>
          <li className="chain-arrow" aria-hidden="true">↓</li>
          <li>
            <span className="mono">04</span>
            <strong>Contacto</strong>
            <small>Ruta directa y sin trabas a WhatsApp o llamada</small>
          </li>
          <li className="chain-arrow" aria-hidden="true">↓</li>
          <li>
            <span className="mono">05</span>
            <strong>Conversación</strong>
            <small>Atención informada sin responder siempre lo mismo</small>
          </li>
          <li className="chain-arrow" aria-hidden="true">↓</li>
          <li>
            <span className="mono">06</span>
            <strong>Conversión</strong>
            <small>Reserva, compra o cotización aceptada</small>
          </li>
          <li className="chain-arrow" aria-hidden="true">↓</li>
          <li>
            <span className="mono">07</span>
            <strong>Seguimiento</strong>
            <small>Acompañamiento sin dejar que el cliente se enfríe</small>
          </li>
        </ol>
      </div>

      <div className="engineering-principles-grid">
        <div className="principles-card surface-glass surface-glass--medium">
          <h3>Principios de diseño técnico</h3>
          <ol className="plain-list">
            <li>
              <strong>1. Resolver antes que decorar:</strong> Cada línea de código o diseño responde a una fricción concreta de la persona o del negocio.
            </li>
            <li>
              <strong>2. Cargar solamente lo necesario:</strong> Cero librerías redundantes, cero scripts invasivos de rastreo, cero animaciones que congelen el teléfono.
            </li>
            <li>
              <strong>3. Diseñar para personas reales:</strong> Preguntas humanas primero, sin vocabulario técnico que confunda o intimide al comprador.
            </li>
            <li>
              <strong>4. Optimizar para dispositivos reales:</strong> Probado en teléfonos modestos con pantallas pequeñas y memoria limitada.
            </li>
            <li>
              <strong>5. Medir antes de asumir:</strong> Métricas observables en desarrollo (LCP, CLS, peso de página) para garantizar velocidad real.
            </li>
            <li>
              <strong>6. Construir sistemas, no páginas sueltas:</strong> La web debe coordinarse con Maps, WhatsApp y los procesos del negocio.
            </li>
            <li>
              <strong>7. Tecnología como medio, no como fin:</strong> El éxito no se mide en modernidad tecnológica, sino en tiempo ahorrado y certeza creada.
            </li>
          </ol>
        </div>

        <div className="metrics-card surface-glass surface-glass--medium">
          <div className="metrics-header">
            <span className="eyebrow">ESTÁNDARES DE RENDIMIENTO</span>
            <h3>Performance is Product</h3>
            <p>Monitoreo de telemetría de carga y accesibilidad:</p>
          </div>

          <div className="metrics-list">
            {OAXACA_PERFORMANCE_METRICS.map((item) => (
              <div key={item.metric} className="metric-row">
                <div className="metric-meta">
                  <strong>{item.metric}</strong>
                  <span className="mono">{item.label}</span>
                </div>
                <div className="metric-values">
                  <span className="metric-badge">{item.measuredValue}</span>
                  <small className="muted">{item.targetThreshold}</small>
                </div>
                <p className="metric-impact">{item.impactForUser}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

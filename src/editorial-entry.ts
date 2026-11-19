import { track } from "./analytics";

track("page_view", { view: "conocimiento" });
const article = document.querySelector<HTMLElement>("[data-article-id]");
if (article) {
  const category = article.dataset.category;
  const categories: Record<
    string,
    | "presencia"
    | "conversion"
    | "operacion"
    | "estrategia"
    | "seguridad"
    | "identidad"
    | "aprendizaje"
  > = {
    Presencia: "presencia",
    Conversión: "conversion",
    Operación: "operacion",
    Estrategia: "estrategia",
    Seguridad: "seguridad",
    Identidad: "identidad",
    Aprendizaje: "aprendizaje",
  };
  track("education_view", {
    article_id: article.dataset.articleId || "",
    category: categories[category || ""] || "estrategia",
  });
}
document
  .querySelectorAll<HTMLAnchorElement>('[data-contact-origin="education"]')
  .forEach((link) =>
    link.addEventListener("click", () =>
      track("education_cta", {
        article_id: article?.dataset.articleId || "",
        target: "contacto",
      }),
    ),
  );

document
  .querySelectorAll<HTMLElement>("[data-copy-template]")
  .forEach((box) => {
    const button = box.querySelector<HTMLButtonElement>("[data-copy-button]");
    const source = box.querySelector<HTMLElement>("[data-copy-source]");
    const status = box.querySelector<HTMLElement>("[data-copy-status]");
    if (!button || !source || !status) return;
    const baseLabel = button.getAttribute("aria-label") || "Copiar";
    button.hidden = false;
    button.addEventListener("click", async () => {
      const text = source.textContent || "";
      try {
        if (!navigator.clipboard?.writeText) throw new Error("unavailable");
        await navigator.clipboard.writeText(text);
        button.textContent = "Copiada";
        button.setAttribute("aria-label", baseLabel.replace(/^Copiar/, "Copiada"));
        status.textContent = "Plantilla copiada al portapapeles.";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(source);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        button.textContent = "Copiar";
        button.setAttribute("aria-label", baseLabel);
        status.textContent =
          "No se pudo copiar automáticamente. El texto quedó seleccionado para que lo copies manualmente.";
      }
    });
  });

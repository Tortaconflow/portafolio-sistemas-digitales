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

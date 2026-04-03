export const formatDate = (date: string) => {
  if (!date) return "Sin cambios";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

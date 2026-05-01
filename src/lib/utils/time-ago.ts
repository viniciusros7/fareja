export function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1)   return "agora há pouco";
  if (min < 60)  return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24)    return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 2)     return "ontem";
  if (d < 7)     return `há ${d} dias`;
  const w = Math.floor(d / 7);
  if (w < 5)     return `há ${w} semana${w !== 1 ? "s" : ""}`;
  const m = Math.floor(d / 30);
  return `há ${m} ${m === 1 ? "mês" : "meses"}`;
}

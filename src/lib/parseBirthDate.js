/**
 * @param {string} dateStr YYYY-MM-DD
 * @param {string} [timeStr] HH:MM
 */
export function parseDateParts(dateStr, timeStr) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || "");
  if (!m) throw new Error("생년월일 형식이 올바르지 않습니다.");
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  let hour = 12;
  let minute = 0;
  if (timeStr && String(timeStr).trim()) {
    const tm = /^(\d{1,2}):(\d{2})$/.exec(timeStr.trim());
    if (!tm) throw new Error("태어난 시간 형식이 올바르지 않습니다(HH:MM).");
    hour = Number(tm[1]);
    minute = Number(tm[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error("태어난 시간이 올바르지 않습니다.");
    }
  }

  return { year, month, day, hour, minute };
}

/**
 * 表示用フォーマッタ（日本円・万表記・パーセント）。
 */

/** ¥183,354,435 のようにカンマ区切りで表示 */
export function formatYen(value: number): string {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

/** 1,910,000 → ¥191万 のように「万」単位で表示 */
export function formatManYen(value: number, fractionDigits = 0): string {
  const man = value / 10_000;
  return `¥${man.toLocaleString("ja-JP", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}万`;
}

/** 288.0万 のように小数1桁の「万」表記（記号なし） */
export function formatManYenDecimal(value: number, fractionDigits = 1): string {
  const man = value / 10_000;
  return `${man.toLocaleString("ja-JP", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}万`;
}

/** 183,354,435 → "¥1.83億" のように「億」単位で表示 */
export function formatOkuYen(value: number, fractionDigits = 2): string {
  const oku = value / 100_000_000;
  return `¥${oku.toLocaleString("ja-JP", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}億`;
}

/** 比率(1.09)を "109%" と表示（前月対比・前年対比など） */
export function formatRatio(value: number, fractionDigits = 0): string {
  return `${(value * 100).toLocaleString("ja-JP", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}

/** 0.0783 → "7.83%" */
export function formatPercent(value: number, fractionDigits = 0): string {
  return `${(value * 100).toLocaleString("ja-JP", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}

/** 符号つきパーセント（前月比など）。-0.0433 → "-4.33%" */
export function formatSignedPercent(value: number, fractionDigits = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toLocaleString("ja-JP", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}

/** 3472 → "3,472名" */
export function formatCount(value: number, unit = "名"): string {
  return `${value.toLocaleString("ja-JP")}${unit}`;
}

/** HH:MM:SS の更新時刻表示（ISO文字列から） */
export function formatUpdatedTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--:--:--";
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

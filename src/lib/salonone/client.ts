import "server-only";

import { getSalonOneConfig } from "./config";

/**
 * SALON ONE API 低レベルクライアント（サーバー専用）。
 *
 * ⚠️ 実際のエンドポイント仕様は未確定。SALON ONE の分析APIドキュメントが
 *    入手でき次第、下記 ENDPOINTS のパスと認証ヘッダ形式を実物に合わせて
 *    差し替えてください（それ以外の層は変更不要になるよう設計しています）。
 */

/**
 * 想定エンドポイント（仮）。実物が判明したらここを直す。
 * クエリに period / store / staff などを付与する想定。
 */
export const ENDPOINTS = {
  stores: "/v1/stores",
  staff: "/v1/staff",
  managementKpis: "/v1/analytics/management",
  subscription: "/v1/analytics/subscription",
} as const;

export interface RequestOptions {
  /** クエリパラメータ */
  query?: Record<string, string | number | undefined>;
  /** キャッシュ挙動（Next.js fetch 拡張）。既定は 5 分 */
  revalidateSeconds?: number;
}

export class SalonOneApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "SalonOneApiError";
  }
}

function buildUrl(baseUrl: string, path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path.replace(/^\//, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * 生のGETリクエスト。JSONを返す。
 *
 * 認証は Bearer トークン方式を仮採用。SALON ONE が別方式
 * （例: `X-Api-Key` ヘッダ / クエリキー）の場合はここを直す。
 */
export async function salonOneGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { apiKey, baseUrl } = getSalonOneConfig();
  if (!apiKey) {
    throw new SalonOneApiError("SALONONE_API_KEY が未設定です", 500);
  }

  const url = buildUrl(baseUrl, path, options.query);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: { revalidate: options.revalidateSeconds ?? 300 },
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text().catch(() => undefined);
    }
    throw new SalonOneApiError(
      `SALON ONE API エラー: ${response.status} ${response.statusText}`,
      response.status,
      body,
    );
  }

  return (await response.json()) as T;
}

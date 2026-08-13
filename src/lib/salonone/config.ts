/**
 * SALON ONE 連携の環境設定。サーバー側でのみ参照する。
 */

export interface SalonOneConfig {
  apiKey: string;
  baseUrl: string;
  useMock: boolean;
}

export function getSalonOneConfig(): SalonOneConfig {
  const apiKey = process.env.SALONONE_API_KEY ?? "";
  const baseUrl = process.env.SALONONE_API_BASE_URL ?? "https://salonone.net/api";
  // 明示的に false のときだけ実APIを叩く。既定はモック。
  const useMock = process.env.SALONONE_USE_MOCK !== "false";

  return { apiKey, baseUrl, useMock };
}

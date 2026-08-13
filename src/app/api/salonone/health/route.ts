import { NextResponse } from "next/server";
import { getSalonOneConfig } from "@/lib/salonone/config";

/**
 * SALON ONE 連携の診断エンドポイント。
 * GET /api/salonone/health
 *
 * APIキー本体は返さず、設定状況のみを返す（先頭数文字だけマスク表示）。
 */
export async function GET() {
  const { apiKey, baseUrl, useMock } = getSalonOneConfig();

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 12)}…（${apiKey.length}文字）`
    : null;

  return NextResponse.json({
    connected: Boolean(apiKey),
    mode: useMock ? "mock" : "live",
    baseUrl,
    apiKey: maskedKey,
    checkedAt: new Date().toISOString(),
  });
}

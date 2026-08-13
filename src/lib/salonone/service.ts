import "server-only";

import { ENDPOINTS, salonOneGet } from "./client";
import { getSalonOneConfig } from "./config";
import {
  MOCK_MANAGEMENT,
  MOCK_STAFF,
  MOCK_STORES,
  MOCK_SUBSCRIPTION,
} from "./mock";
import type {
  DashboardFilters,
  ManagementDashboard,
  Staff,
  Store,
  SubscriptionDashboard,
} from "./types";

/**
 * サービス層。UI（Server Component / API Route）はここだけを呼ぶ。
 *
 * `SALONONE_USE_MOCK` が true（既定）ならモックを返し、
 * false なら client.ts 経由で実APIを叩く。
 *
 * 実API接続時は、SALON ONE のレスポンスをここで types.ts の形へ
 * 正規化（マッピング）する。今は実物の形が不明なため素通しの雛形。
 */

function toQuery(filters: DashboardFilters): Record<string, string | undefined> {
  return {
    start_date: filters.startDate,
    end_date: filters.endDate,
    store_id: filters.storeId,
    staff_id: filters.staffId,
    month: filters.month,
  };
}

export async function getStores(): Promise<Store[]> {
  const { useMock } = getSalonOneConfig();
  if (useMock) return MOCK_STORES;
  // TODO: 実レスポンス形状に合わせて正規化する
  return salonOneGet<Store[]>(ENDPOINTS.stores);
}

export async function getStaff(): Promise<Staff[]> {
  const { useMock } = getSalonOneConfig();
  if (useMock) return MOCK_STAFF;
  return salonOneGet<Staff[]>(ENDPOINTS.staff);
}

export async function getManagementDashboard(
  filters: DashboardFilters,
): Promise<ManagementDashboard> {
  const { useMock } = getSalonOneConfig();
  if (useMock) return MOCK_MANAGEMENT;
  // TODO: 実レスポンス → ManagementDashboard へのマッピングを実装
  return salonOneGet<ManagementDashboard>(ENDPOINTS.managementKpis, {
    query: toQuery(filters),
  });
}

export async function getSubscriptionDashboard(
  filters: DashboardFilters,
): Promise<SubscriptionDashboard> {
  const { useMock } = getSalonOneConfig();
  if (useMock) return MOCK_SUBSCRIPTION;
  // TODO: 実レスポンス → SubscriptionDashboard へのマッピングを実装
  return salonOneGet<SubscriptionDashboard>(ENDPOINTS.subscription, {
    query: toQuery(filters),
  });
}

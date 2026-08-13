/**
 * 総合ダッシュボードのモックデータ（整体院グループ）。
 * 「全体管理シート（重要指標）」の構造・数値感を再現したサンプル。
 */

import type {
  EventRecord,
  GroupOverview,
  ManagementSheet,
  MarketingChannel,
  MembershipStoreRate,
  MonthlyKpiBlock,
  StoreMonthlyKpi,
} from "./management-types";

const OVERVIEW: GroupOverview = {
  month: "2026-08",
  storeCount: 78,
  therapistCount: 174,
  totalSales: 183_354_435,
  totalSalesMoM: 1.01,
  totalSalesYoY: 1.27,
  karteCount: 12_790,
  karteCountMoM: 0.97,
  newCustomers: 3573,
  newCustomersMoM: 0.88,
  conversionRate: 0.62,
  churnRate: 0.078,
  activeMembers: 2231,
  mrr: 41_820_000,
  updatedAt: "2026-08-13T14:45:27+09:00",
};

/** 店舗別の月次KPIを組み立てるヘルパー */
function kpi(
  storeName: string,
  staff: number,
  sales: number,
  salesMoM: number,
  karte: number,
  karteMoM: number,
  newCount: number,
  newMoM: number,
): StoreMonthlyKpi {
  return { storeName, staff, sales, salesMoM, karte, karteMoM, newCount, newMoM };
}

const JULY: MonthlyKpiBlock = {
  monthLabel: "7月",
  salesYoY: 1.27,
  group: kpi("グループ全体", 176, 180_840_405, 1.01, 12_790, 0.97, 3573, 0.88),
  stores: [
    kpi("大森", 3, 3_755_170, 1.09, 256, 1.04, 40, 2.0),
    kpi("千葉", 5, 5_681_400, 1.0, 361, 1.0, 78, 0.98),
    kpi("飯田橋", 1, 816_800, 1.13, 52, 1.21, 10, 0.63),
    kpi("関内", 1, 1_055_250, 0.97, 74, 1.03, 16, 1.45),
    kpi("新宿", 2, 2_199_155, 1.02, 164, 1.1, 45, 2.05),
    kpi("銀座", 3, 4_399_300, 1.09, 255, 1.1, 69, 1.68),
    kpi("西川口", 1, 1_204_450, 1.02, 64, 0.97, 8, 0.57),
    kpi("横浜", 4, 6_120_800, 1.05, 402, 1.06, 88, 1.12),
    kpi("川崎", 3, 3_980_100, 0.98, 271, 0.95, 52, 0.9),
    kpi("溝の口", 2, 2_640_500, 1.07, 178, 1.08, 34, 1.21),
  ],
};

const JUNE: MonthlyKpiBlock = {
  monthLabel: "6月",
  salesYoY: 1.34,
  group: kpi("グループ全体", 170, 176_729_963, 1.0, 12_918, 0.97, 3808, 0.79),
  stores: [
    kpi("大森", 3, 3_455_550, 0.93, 247, 0.93, 20, 0.63),
    kpi("千葉", 5, 5_681_100, 1.02, 361, 0.95, 80, 0.65),
    kpi("飯田橋", 1, 725_850, 0.83, 43, 0.67, 16, 0.84),
    kpi("関内", 1, 1_091_250, 0.87, 72, 0.82, 11, 0.5),
    kpi("新宿", 2, 2_160_890, 0.9, 149, 0.87, 22, 0.52),
    kpi("銀座", 3, 4_023_924, 0.98, 231, 0.97, 41, 0.71),
    kpi("西川口", 1, 1_184_250, 1.0, 66, 0.93, 14, 0.67),
    kpi("横浜", 4, 5_830_400, 0.96, 380, 0.94, 79, 0.82),
    kpi("川崎", 3, 4_061_300, 1.01, 285, 0.98, 58, 0.88),
    kpi("溝の口", 2, 2_468_700, 0.95, 165, 0.93, 28, 0.7),
  ],
};

const AUGUST: MonthlyKpiBlock = {
  monthLabel: "8月（集計中）",
  salesYoY: 0.34,
  group: kpi("グループ全体", 174, 50_292_640, 0.28, 6702, 0.52, 865, 0.24),
  stores: [
    kpi("大森", 3, 1_202_960, 0.32, 178, 0.7, 20, 0.5),
    kpi("千葉", 5, 69_850, 0.01, 8, 0.02, 2, 0.03),
    kpi("飯田橋", 1, 0, 0, 0, 0, 0, 0),
    kpi("関内", 1, 0, 0, 0, 0, 0, 0),
    kpi("新宿", 2, 580_150, 0.26, 8, 0.05, 12, 0.27),
    kpi("銀座", 3, 1_229_950, 0.28, 158, 0.62, 9, 0.13),
    kpi("西川口", 1, 384_900, 0.32, 46, 0.72, 5, 0.63),
    kpi("横浜", 4, 1_610_400, 0.26, 120, 0.3, 18, 0.2),
    kpi("川崎", 3, 980_200, 0.25, 88, 0.32, 11, 0.19),
    kpi("溝の口", 2, 612_300, 0.23, 52, 0.29, 7, 0.21),
  ],
};

const MARKETING: MarketingChannel[] = [
  { channel: "Google広告", cost: 3_200_000, inquiries: 1240, newCustomers: 620, sales: 18_600_000, cpa: 5161, roas: 5.81 },
  { channel: "Hot Pepper Beauty", cost: 2_800_000, inquiries: 980, newCustomers: 540, sales: 14_040_000, cpa: 5185, roas: 5.01 },
  { channel: "Instagram広告", cost: 1_500_000, inquiries: 720, newCustomers: 310, sales: 7_750_000, cpa: 4839, roas: 5.17 },
  { channel: "LINE公式", cost: 600_000, inquiries: 540, newCustomers: 280, sales: 6_440_000, cpa: 2143, roas: 10.73 },
  { channel: "紹介（リファラル）", cost: 320_000, inquiries: 410, newCustomers: 350, sales: 9_450_000, cpa: 914, roas: 29.53 },
  { channel: "自然検索/MEO", cost: 450_000, inquiries: 680, newCustomers: 390, sales: 10_530_000, cpa: 1154, roas: 23.4 },
  { channel: "チラシ・折込", cost: 900_000, inquiries: 210, newCustomers: 84, sales: 2_100_000, cpa: 10714, roas: 2.33 },
];

const MEMBERSHIP: MembershipStoreRate[] = [
  { storeName: "大森", newVisitors: 62, joined: 50, conversionRate: 0.81, churned: 3, churnRate: 0.03 },
  { storeName: "千葉", newVisitors: 110, joined: 78, conversionRate: 0.71, churned: 9, churnRate: 0.05 },
  { storeName: "飯田橋", newVisitors: 24, joined: 10, conversionRate: 0.42, churned: 2, churnRate: 0.06 },
  { storeName: "関内", newVisitors: 26, joined: 16, conversionRate: 0.62, churned: 1, churnRate: 0.03 },
  { storeName: "新宿", newVisitors: 70, joined: 45, conversionRate: 0.64, churned: 5, churnRate: 0.04 },
  { storeName: "銀座", newVisitors: 98, joined: 69, conversionRate: 0.7, churned: 6, churnRate: 0.04 },
  { storeName: "西川口", newVisitors: 20, joined: 8, conversionRate: 0.4, churned: 2, churnRate: 0.08 },
  { storeName: "横浜", newVisitors: 120, joined: 88, conversionRate: 0.73, churned: 7, churnRate: 0.04 },
  { storeName: "川崎", newVisitors: 84, joined: 52, conversionRate: 0.62, churned: 6, churnRate: 0.05 },
  { storeName: "溝の口", newVisitors: 48, joined: 34, conversionRate: 0.71, churned: 3, churnRate: 0.04 },
];

const EVENTS: EventRecord[] = [
  { date: "2026-07-05", title: "施術技術 標準化研修（腰部）", type: "研修", storeName: "本部", participants: 42, cost: 180_000, satisfaction: 0.92 },
  { date: "2026-07-12", title: "新人セラピスト 導入勉強会", type: "勉強会", storeName: "本部", participants: 18, cost: 60_000, satisfaction: 0.88 },
  { date: "2026-07-20", title: "接客・カウンセリング向上セミナー", type: "勉強会", storeName: "銀座", participants: 26, cost: 90_000, satisfaction: 0.85 },
  { date: "2026-07-27", title: "月次 全体会議（7月）", type: "全体会議", storeName: "全店", participants: 120, cost: 250_000, satisfaction: 0.79 },
  { date: "2026-08-02", title: "サブスク提案ロールプレイ大会", type: "イベント", storeName: "横浜", participants: 34, cost: 120_000, satisfaction: 0.9 },
  { date: "2026-08-09", title: "肩こり・自律神経 症例検討会", type: "勉強会", storeName: "新宿", participants: 22, cost: 70_000, satisfaction: 0.87 },
];

export const MOCK_MANAGEMENT_SHEET: ManagementSheet = {
  overview: OVERVIEW,
  monthly: [JULY, JUNE, AUGUST],
  marketing: MARKETING,
  membership: MEMBERSHIP,
  membershipTarget: 0.6,
  events: EVENTS,
};

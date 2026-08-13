/**
 * 整体院グループ 総合ダッシュボードのドメインモデル。
 *
 * 「全体管理シート（重要指標）」および各種KPI管理表から逆算した型。
 * 経営指標 / サブスク分析（types.ts）を補完する、より広い経営管理レイヤー。
 */

/* ───────────────── 総合ダッシュボード（グループ全体サマリー） ───────────────── */

export interface GroupOverview {
  /** 対象月 (YYYY-MM) */
  month: string;
  /** 総店舗数 */
  storeCount: number;
  /** セラピスト/スタッフ総数（人数） */
  therapistCount: number;
  /** 総売上（円） */
  totalSales: number;
  /** 総売上 前月対比 (ratio, 1.0 = 100%) */
  totalSalesMoM: number;
  /** 総売上 前年対比 (ratio) */
  totalSalesYoY: number;
  /** カルテ枚数（施術数） */
  karteCount: number;
  /** カルテ枚数 前月対比 (ratio) */
  karteCountMoM: number;
  /** 新規数（名） */
  newCustomers: number;
  /** 新規数 前月対比 (ratio) */
  newCustomersMoM: number;
  /** 新規入会率 (0-1) */
  conversionRate: number;
  /** 退会率 (0-1) */
  churnRate: number;
  /** アクティブサブスク会員数 */
  activeMembers: number;
  /** 総MRR（円） */
  mrr: number;
  updatedAt: string;
}

/* ───────────────── 重要指標（月別 × 店舗別 KPIシート） ───────────────── */

/** 1店舗（またはグループ全体）の月次KPI */
export interface StoreMonthlyKpi {
  storeName: string;
  /** 人数（スタッフ数） */
  staff: number;
  /** 総売上 実績（円） */
  sales: number;
  /** 総売上 前月対比 (ratio) */
  salesMoM: number;
  /** カルテ枚数 実績 */
  karte: number;
  /** カルテ枚数 前月対比 (ratio) */
  karteMoM: number;
  /** 新規数 実績（名） */
  newCount: number;
  /** 新規数 前月対比 (ratio) */
  newMoM: number;
}

/** 1ヶ月分のKPIブロック（グループ全体 + 店舗別） */
export interface MonthlyKpiBlock {
  /** 表示ラベル（例: 7月） */
  monthLabel: string;
  /** 総売上 前年対比 (ratio) */
  salesYoY: number;
  /** グループ全体の集計 */
  group: StoreMonthlyKpi;
  /** 店舗別 */
  stores: StoreMonthlyKpi[];
}

/* ───────────────── WEB費用対効果（マーケティング） ───────────────── */

export interface MarketingChannel {
  /** チャネル名（Google広告 / Hot Pepper / Instagram / 紹介 …） */
  channel: string;
  /** 費用（円） */
  cost: number;
  /** 反響数（問い合わせ・予約） */
  inquiries: number;
  /** 新規獲得（名） */
  newCustomers: number;
  /** 売上貢献（円） */
  sales: number;
  /** CPA = 費用 ÷ 新規獲得（円） */
  cpa: number;
  /** ROAS = 売上 ÷ 費用 (ratio) */
  roas: number;
}

/* ───────────────── 新規入会・退会率 ───────────────── */

export interface MembershipStoreRate {
  storeName: string;
  /** 新規来院（名） */
  newVisitors: number;
  /** 入会（名） */
  joined: number;
  /** 入会率 (0-1) */
  conversionRate: number;
  /** 退会（名） */
  churned: number;
  /** 退会率 (0-1) */
  churnRate: number;
}

/* ───────────────── 勉強会・イベント ───────────────── */

export interface EventRecord {
  /** 開催日 (YYYY-MM-DD) */
  date: string;
  /** タイトル */
  title: string;
  /** 種別（勉強会 / イベント / 研修 / 全体会議） */
  type: string;
  /** 主催・対象店舗 */
  storeName: string;
  /** 参加人数 */
  participants: number;
  /** 費用（円） */
  cost: number;
  /** 満足度 (0-1) */
  satisfaction: number;
}

/* ───────────────── 集約：総合ダッシュボードの全データ ───────────────── */

export interface ManagementSheet {
  overview: GroupOverview;
  /** 新しい月が先頭 */
  monthly: MonthlyKpiBlock[];
  marketing: MarketingChannel[];
  membership: MembershipStoreRate[];
  /** 入会率目標 (0-1) */
  membershipTarget: number;
  events: EventRecord[];
}

/**
 * SALON ONE 連携で扱うドメインモデル。
 *
 * 添付のダッシュボードデザイン（経営指標 / サブスク分析）から逆算した型定義。
 * 実際の SALON ONE API のレスポンス形状が判明したら、
 * `client.ts` 内のマッピングでこの型へ正規化する想定。
 */

/** 期間・店舗などの共通フィルタ */
export interface DashboardFilters {
  /** 集計開始日 (YYYY-MM-DD) */
  startDate: string;
  /** 集計終了日 (YYYY-MM-DD) */
  endDate: string;
  /** 対象店舗ID（未指定 = 全店舗） */
  storeId?: string;
  /** 対象スタッフID（未指定 = 全スタッフ） */
  staffId?: string;
  /** サブスク分析で使う対象月 (YYYY-MM) */
  month?: string;
}

/** 店舗マスタ */
export interface Store {
  id: string;
  name: string;
}

/** スタッフマスタ */
export interface Staff {
  id: string;
  name: string;
  storeId: string;
  storeName: string;
}

/* ───────────────────────── 経営指標ダッシュボード ───────────────────────── */

/** 上部のKPIカード群（経営指標） */
export interface ManagementKpis {
  /** 総売上（個別税込） */
  totalSales: number;
  /** 新規売上 */
  newSales: number;
  /** 継続売上 */
  recurringSales: number;
  /** 退会率 (0-1) */
  churnRate: number;
  /** 総新規数（名） */
  newCustomers: number;
  /** 入会率 (0-1) */
  conversionRate: number;
  /** 入会数（名）… 入会率の内訳表示用 */
  conversionCount: number;
  /** Google 口コミ合計（件） */
  googleReviews: number;
  /** Hot Pepper 口コミ合計（件） */
  hotpepperReviews: number;
}

/** スタッフ生産性（売上ランキング用） */
export interface StaffProductivity {
  staffId: string;
  staffName: string;
  storeName: string;
  /** 売上（円） */
  sales: number;
}

/** スタッフ入会率（入会率ランキング用） */
export interface StaffConversion {
  staffId: string;
  staffName: string;
  storeName: string;
  /** 入会率 (0-1) */
  conversionRate: number;
  /** 入会件数（内訳） */
  conversionCount: number;
}

/** スタッフ退会率（退会率が低いスタッフ ランキング用） */
export interface StaffChurn {
  staffId: string;
  staffName: string;
  storeName: string;
  /** 退会率 (0-1)。低いほど良い */
  churnRate: number;
}

/** 福利厚生・手当の支給状況（1項目） */
export interface BenefitItem {
  /** 項目名（例: 健康診断, 健康手当, フルマラソン …） */
  name: string;
  /** 対象人数（名） */
  count: number;
  /** 支給合計額（円） */
  amount: number;
  /** 支給あり=true / 未支給=false */
  granted: boolean;
}

/** 経営指標ダッシュボードの全データ */
export interface ManagementDashboard {
  kpis: ManagementKpis;
  productivity: StaffProductivity[];
  conversion: StaffConversion[];
  churn: StaffChurn[];
  benefits: BenefitItem[];
  /** 福利厚生セクションの識別コード（例: Q-AA） */
  benefitsCode: string;
  updatedAt: string;
}

/* ───────────────────────── サブスク分析 ───────────────────────── */

/** サブスク会員のステータス */
export type SubscriptionStatus =
  | "active" // アクティブ
  | "new" // 新規入会
  | "plan_changed" // プラン変更
  | "canceled" // 解約済み
  | "paused" // 一時停止
  | "resumed" // 復帰
  | "refunded" // 払戻し
  | "expired"; // 期限超過

/** サブスク上部KPI */
export interface SubscriptionKpis {
  /** アクティブ会員数（名） */
  activeMembers: number;
  /** 総MRR（円） */
  mrr: number;
  /** MRR 前月比 (0-1, 符号つき) */
  mrrChange: number;
  /** ARPU = サブスク決済額 ÷ 会員数（円） */
  arpu: number;
  /** 総売上高（税込・円） */
  grossSales: number;
  /** 返品・払戻し（円） */
  refunds: number;
  /** 解約率 (0-1) */
  churnRate: number;
  /** 当月解約者数（名） */
  churnedCount: number;
  /** 前月会員数（名） */
  previousMembers: number;
  /** LTV（円） */
  ltv: number;
}

/** ステータス別タブに表示する会員行 */
export interface SubscriptionMember {
  memberId: string;
  name: string;
  /** コース名（例: NAORUプラン） */
  course: string;
  /** 決済回数 */
  paymentCount: number;
  /** 合計金額（円） */
  totalAmount: number;
  /** 開始日 (YYYY-MM-DD) */
  startDate: string;
  /** 停止日/解約日など (YYYY-MM-DD | null) */
  endDate: string | null;
  status: SubscriptionStatus;
}

/** 解約・継続分析 */
export interface RetentionAnalysis {
  /** 月間解約率 (0-1) */
  monthlyChurnRate: number;
  /** 初月解約率 (0-1) */
  firstMonthChurnRate: number;
  /** 3ヶ月以内解約率 (0-1 | null=データなし) */
  within3MonthChurnRate: number | null;
  /** 3ヶ月継続率 (0-1) */
  retention3Month: number;
  /** 6ヶ月継続率 (0-1) */
  retention6Month: number;
  /** 12ヶ月継続率 (0-1) */
  retention12Month: number;
}

/** 店舗別サマリー（ランキング表） */
export interface StoreSummary {
  storeId: string;
  storeName: string;
  /** 総売上高（円） */
  grossSales: number;
  /** 会員数（名） */
  members: number;
  /** MRR（円） */
  mrr: number;
  /** ARPU（円） */
  arpu: number;
  /** 解約率 (0-1) */
  churnRate: number;
}

/** コース別内訳（アクティブ会員） */
export interface CourseBreakdown {
  courseName: string;
  members: number;
  mrr: number;
  /** 構成比 (0-1) */
  share: number;
}

/** 月別 入会・解約/停止数（棒グラフ用） */
export interface MonthlyFlow {
  /** 表示ラベル（例: 08月） */
  label: string;
  /** 入会数 */
  joins: number;
  /** 解約・停止数 */
  churns: number;
}

/** コホート分析（月別入会者の継続率） */
export interface CohortRow {
  /** 入会月 (YYYY/MM) */
  cohortMonth: string;
  /** 人数 */
  size: number;
  /** 各月の継続率 (0-1)。index 0 = 1ヶ月, … 11 = 12ヶ月。null = 未到達 */
  retention: (number | null)[];
}

/** サブスク分析の全データ */
export interface SubscriptionDashboard {
  kpis: SubscriptionKpis;
  /** ステータス別タブの件数 */
  statusCounts: Record<SubscriptionStatus, number>;
  members: SubscriptionMember[];
  retention: RetentionAnalysis;
  storeSummaries: StoreSummary[];
  courseBreakdown: CourseBreakdown[];
  monthlyFlow: MonthlyFlow[];
  cohort: CohortRow[];
  storeCount: number;
  courseCount: number;
  updatedAt: string;
}

# SALON ONE 実データ接続ガイド（エンジニア向け引き継ぎ）

このダッシュボードは **実APIを後から差し込める抽象化構成** になっています。
実データを反映するために「必要なもの」と「コードのどこを直すか」をまとめます。

---

## 0. 現状（重要）

- ダッシュボードUI・データモデル・順位ロジックは実装済み。**今はモックデータで動作**しています。
- APIキー `so_analytics_...` は取得済み。`https://salonone.net/api` が稼働していること（Laravel 12 バックエンド、`/api/health` が 200）は確認済みです。
- **ただし、分析データを返す具体的なエンドポイントが非公開で特定できていません。**
  `/api/analytics`, `/api/subscription`, `/api/stores` などは全て 404 でした。
  → **SALON ONE から API仕様書（エンドポイント・認証・レスポンス例）の入手が最初の必須作業**です。

---

## 1. SALON ONE から入手が必要なもの（最優先・現状のブロッカー）

以下を SALON ONE の管理画面／サポートから入手してください。**これが揃えば実装はすぐ終わります。**

1. **エンドポイント一覧**（分析APIのURLパス）
2. **認証方式** … 現状は `Authorization: Bearer <APIキー>` を仮実装。実際は以下のどれか要確認:
   - `Authorization: Bearer <key>`
   - `X-Api-Key: <key>` などのカスタムヘッダ
   - クエリパラメータ（`?api_key=<key>`）
3. **各エンドポイントのレスポンスJSON例**（フィールド名・型・ネスト構造）
4. **クエリパラメータ仕様** … 期間（開始日/終了日）、店舗ID、スタッフID、対象月などの絞り込み方法
5. **ページネーション / レート制限**の有無
6. **どの指標が取得可能か**（下表の「対応可否」を埋めてもらう）

### 必要データ ↔ ダッシュボード項目の対応表

| ダッシュボード項目 | 対応する型 (`src/lib/salonone/types.ts`) | SALON ONE で取得可否 |
| --- | --- | --- |
| 店舗一覧 | `Store[]` | ？ |
| スタッフ一覧 | `Staff[]` | ？ |
| 経営KPI（総売上/新規/継続/退会率/新規数/入会率/口コミ数） | `ManagementKpis` | ？ |
| スタッフ別 売上ランキング | `StaffProductivity[]` | ？ |
| スタッフ別 入会率ランキング | `StaffConversion[]` | ？ |
| スタッフ別 退会率ランキング | `StaffChurn[]` | ？ |
| 福利厚生・手当 | `BenefitItem[]` | ★予約システム外の可能性大（別ソース or 手入力かも） |
| サブスクKPI（MRR/ARPU/LTV/解約率） | `SubscriptionKpis` | ？ |
| 会員ステータス別リスト | `SubscriptionMember[]` | ？ |
| 解約・継続分析 | `RetentionAnalysis` | ？ |
| 店舗別サマリー | `StoreSummary[]` | ？ |
| コース別内訳 | `CourseBreakdown[]` | ？ |
| 月別 入会・解約数 | `MonthlyFlow[]` | ？ |
| コホート分析 | `CohortRow[]` | ？（生データから自前集計も可） |

> 注: SALON ONE が生データ（予約・会員・決済）しか返さない場合は、KPI・ランキング・コホートは
> こちら側で集計します。その場合も UI/型は流用でき、`service.ts` に集計ロジックを足す形になります。

---

## 2. コード側でやること（実装手順）

抽象化してあるので、基本的に **`src/lib/salonone/` の3ファイルだけ** 触れば繋がります。UI（components/pages）は原則無変更です。

### ① `.env.local`（環境変数）
```bash
SALONONE_API_KEY=so_analytics_...            # 取得済み
SALONONE_API_BASE_URL=https://salonone.net/api  # 実ベースURLに合わせる
SALONONE_USE_MOCK=false                       # ← false にすると実APIを叩く
```

### ② `src/lib/salonone/client.ts`
- `ENDPOINTS` の各パスを **実際のエンドポイント**に修正
  ```ts
  export const ENDPOINTS = {
    stores: "/v1/stores",              // ← 実パスへ
    staff: "/v1/staff",
    managementKpis: "/v1/analytics/management",
    subscription: "/v1/analytics/subscription",
  } as const;
  ```
- 認証方式が Bearer 以外なら `salonOneGet()` の `headers` を修正
  ```ts
  headers: {
    Authorization: `Bearer ${apiKey}`,   // ← 実方式へ（X-Api-Key など）
    Accept: "application/json",
  },
  ```

### ③ `src/lib/salonone/service.ts`
- 各関数（`getManagementDashboard` / `getSubscriptionDashboard` / `getStores` / `getStaff`）で
  **実レスポンス → `types.ts` の型へのマッピング（正規化）** を実装
  ```ts
  export async function getManagementDashboard(filters) {
    const { useMock } = getSalonOneConfig();
    if (useMock) return MOCK_MANAGEMENT;

    const raw = await salonOneGet<RawApiResponse>(ENDPOINTS.managementKpis, {
      query: toQuery(filters),
    });
    // ↓ ここで raw を ManagementDashboard に変換する
    return {
      kpis: { totalSales: raw.sales.total, /* ... */ },
      productivity: raw.staff.map(s => ({ /* ... */ })),
      // ...
    };
  }
  ```

### ④ 疎通確認
- 開発サーバ起動: `npm run dev`
- `GET http://localhost:3000/api/salonone/health` で接続状況（mode: live）を確認
- `/dashboard` と `/subscription` に実データが出るか確認

### ⑤ 型が合わない場合
- SALON ONE のフィールドに合わせて `types.ts` を調整 → 必要なら該当コンポーネントも微修正
- 集計が必要な指標（順位・コホート等）は `src/lib/salonone/ranking.ts` を流用可

---

## 3. 順位（ランキング）について

順位付けは `src/lib/salonone/ranking.ts` の `rank()` に集約済みです。
実データでも、生の配列を渡すだけで順位が付きます（同値は同順位、`topN` 対応、昇順/降順切替）。
新しいランキングを足したい場合も汎用 `RankingCard`（`src/components/dashboard/RankingCard.tsx`）を使い回せます。

---

## 4. SALON ONE への質問テンプレート（そのまま送れます）

```
お世話になっております。分析用APIキー（so_analytics_...）を発行いただいたものです。
自社ダッシュボードへデータ連携したく、以下をご教示ください。

1. 分析API（売上・会員・サブスク等）のエンドポイント一覧
2. 認証方式（Authorization ヘッダ形式 / X-Api-Key / クエリキー のいずれか）
3. 各エンドポイントのレスポンスJSONのサンプル
4. 期間・店舗・スタッフでの絞り込み方法（クエリパラメータ仕様）
5. ページネーション・レート制限の有無
6. 取得可能な指標（店舗別売上、スタッフ別 売上/入会率/退会率、
   サブスクのMRR/解約率/継続率、コース別内訳、月別入退会 など）
7. APIドキュメントのURL（あれば）
```

---

## 5. 参考: 現状の構成ファイル

| ファイル | 役割 | 実接続で触るか |
| --- | --- | --- |
| `src/lib/salonone/types.ts` | ドメインモデル定義 | 必要に応じて |
| `src/lib/salonone/client.ts` | 低レベルAPIクライアント（エンドポイント/認証） | **要修正** |
| `src/lib/salonone/service.ts` | mock/live 切替 ＋ レスポンス正規化 | **要修正** |
| `src/lib/salonone/config.ts` | 環境変数読み取り | 通常不要 |
| `src/lib/salonone/mock.ts` | サンプルデータ | 実接続後は参照されない |
| `src/lib/salonone/ranking.ts` | 順位ロジック | 流用 |
| `src/app/**` / `src/components/**` | 画面・UI | 原則無変更 |

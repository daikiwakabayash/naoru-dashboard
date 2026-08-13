# NAORU ダッシュボード（SALON ONE 連携・大枠）

NAORU の経営ダッシュボードを **SALON ONE 予約システムの分析API** と連携して構築するための
土台（スケルトン）です。添付デザイン（経営指標 / サブスク分析）をもとに、
**API連携レイヤー・データモデル・順位付きUI** を実装しています。

> ⚠️ **API仕様について**
> SALON ONE の分析APIは公開ドキュメントが無く、正確なエンドポイント／レスポンス形状は未確定です。
> 本リポジトリは **「実APIを後から差し込める抽象化レイヤー ＋ 即描画できるモックデータ」** という構成にしており、
> 実仕様が判明したら `src/lib/salonone/` の数ファイルを差し替えるだけで接続できます。

---

## 技術スタック

- **Next.js 14 (App Router)** — Server Component でサーバー側フェッチ
- **TypeScript** — `src/lib/salonone/types.ts` に全ドメインモデルを定義
- **Tailwind CSS** — デザイン再現
- **Recharts** — 月別入退会の棒グラフ

## セットアップ

```bash
npm install
cp .env.example .env.local   # APIキー等を設定
npm run dev                  # http://localhost:3000
```

既定では `SALONONE_USE_MOCK=true`（モックデータ）で起動するため、API未接続でもUIを確認できます。

## 環境変数（`.env.local`）

| 変数 | 説明 |
| --- | --- |
| `SALONONE_API_KEY` | SALON ONE 分析用APIキー。**サーバー側のみ**で使用（クライアントに露出しない） |
| `SALONONE_API_BASE_URL` | SALON ONE API のベースURL（実仕様判明後に設定） |
| `SALONONE_USE_MOCK` | `true`=モック / `false`=実API |

## 画面

| ルート | 内容 |
| --- | --- |
| `/dashboard` | **経営指標** — KPIカード8種 ＋ ランキング（生産性・入会率TOP10・退会率が低いスタッフ）＋ 福利厚生 |
| `/subscription` | **サブスク分析** — KPI・ステータス別会員タブ・解約/継続分析・店舗別サマリー（順位）・コース別内訳・月別入退会グラフ・コホート分析 |
| `/api/salonone/health` | 連携診断（接続状況・モード・キーのマスク表示） |

## ディレクトリ構成

```
src/
├─ app/
│  ├─ dashboard/            経営指標ページ（＋各サブ画面プレースホルダ）
│  ├─ subscription/         サブスク分析ページ
│  └─ api/salonone/health/  連携診断API
├─ components/
│  ├─ layout/               サイドバー等
│  ├─ ui/                    Card / RankBadge などの汎用パーツ
│  ├─ dashboard/            KpiCard・RankingCard・FilterBar・BenefitsCard
│  └─ subscription/         会員タブ・店舗サマリー・コホート・グラフ等
└─ lib/
   ├─ format.ts             円/万/％ フォーマッタ
   └─ salonone/
      ├─ types.ts           ★ ドメインモデル（デザインから逆算）
      ├─ ranking.ts         ★ 順位付けロジック（同値=同順位）
      ├─ client.ts          実API低レベルクライアント（要差し替え）
      ├─ service.ts         UIが呼ぶ窓口（mock/live 切替＋正規化）
      ├─ config.ts          環境設定の読み取り
      └─ mock.ts            サンプルデータ
```

## 「順位（ランキング）」について

要件の中核であるランキングは **`src/lib/salonone/ranking.ts` の `rank()`** に集約しています。

- 大きいほど上位（売上・入会率）＝ `direction: "desc"`
- 小さいほど上位（退会率が低い＝良い）＝ `direction: "asc"`
- **同値は同順位**（standard competition ranking, 例: `1, 2, 2, 4`）
- `topN` で上位N件に絞れる

UIは汎用の **`RankingCard`**（`src/components/dashboard/RankingCard.tsx`）1つで、
生産性・入会率・退会率など全ランキングを描画します。店舗別サマリー／コース別内訳の表も同じ `rank()` を使用。

## 実APIへの接続手順（実仕様が判明したら）

1. `src/lib/salonone/client.ts` の `ENDPOINTS` を実際のパスに修正
2. 認証方式を確認（現状は `Authorization: Bearer <key>` を仮採用）
3. `src/lib/salonone/service.ts` の各関数で、実レスポンス → `types.ts` の型へ**正規化（マッピング）**を実装
4. `.env.local` の `SALONONE_USE_MOCK=false` に変更
5. `GET /api/salonone/health` で接続状況を確認

抽象化しているため、**UI側（components / pages）は基本的に無変更**で実データに切り替わります。

## スクリプト

```bash
npm run dev        # 開発サーバー
npm run build      # 本番ビルド
npm run typecheck  # 型チェック
npm run lint       # Lint
```

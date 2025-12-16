# 🚀 デプロイ手順書

炊飯器レシピファインダーをVercelでオンライン公開する手順です。

## 📋 前提条件

以下のアカウントが必要です（全て無料）：

- [x] **GitHub アカウント**
  - まだない場合: https://github.com/join
- [x] **Vercel アカウント**
  - まだない場合: https://vercel.com/signup （GitHubアカウントでログイン可能）

## ステップ1: GitHubリポジトリの作成

### 方法A: GitHub CLI を使う場合（推奨）

```bash
# プロジェクトディレクトリに移動
cd /Users/tada/Work/My_work/rice-cooker-recipe-finder

# Gitリポジトリを初期化
git init

# 全ファイルをステージング
git add .

# 最初のコミット
git commit -m "Initial commit: 炊飯器レシピファインダー"

# GitHubリポジトリを作成してプッシュ
gh repo create rice-cooker-recipe-finder --public --source=. --remote=origin --push
```

### 方法B: GitHub Webサイトを使う場合

1. https://github.com/new にアクセス
2. リポジトリ名: `rice-cooker-recipe-finder`
3. 公開設定: **Public** を選択
4. **"Create repository"** をクリック
5. ターミナルで以下を実行:

```bash
cd /Users/tada/Work/My_work/rice-cooker-recipe-finder
git init
git add .
git commit -m "Initial commit: 炊飯器レシピファインダー"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rice-cooker-recipe-finder.git
git push -u origin main
```

> ⚠️ `YOUR_USERNAME` を自分のGitHubユーザー名に置き換えてください

## ステップ2: Vercelでデプロイ

### 2-1. Vercelにログイン

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン

### 2-2. プロジェクトをインポート

1. ダッシュボードから **"Add New..."** → **"Project"** をクリック
2. **"Import Git Repository"** を選択
3. リポジトリ一覧から **`rice-cooker-recipe-finder`** を探して **"Import"** をクリック

### 2-3. ビルド設定の確認

以下の設定が自動で入力されているはずです：

- **Framework Preset:** Vite
- **Build Command:** `cd client && pnpm install && pnpm build`
- **Output Directory:** `client/dist`
- **Install Command:** `pnpm install`

> ✅ 設定は `vercel.json` から自動読み込みされます

### 2-4. デプロイ実行

1. **"Deploy"** ボタンをクリック
2. ビルドが開始されます（約1〜3分）
3. デプロイ完了を待ちます

## ステップ3: デプロイ完了確認

### 3-1. URLの確認

デプロイが完了すると、以下のようなURLが発行されます：

```
https://rice-cooker-recipe-finder-xxxxx.vercel.app
```

### 3-2. 動作確認

発行されたURLにアクセスして、以下を確認：

- [x] ページが正常に表示される
- [x] 食材選択ボタンが機能する
- [x] レシピ検索が動作する
- [x] レシピカードが表示される
- [x] 「作り方を見る」リンクが機能する

## 🎨 カスタムドメインの設定（オプション）

独自ドメインを使いたい場合：

### 1. ドメインの取得

以下のサービスでドメインを取得（年間1,000円〜）：

- お名前.com: https://www.onamae.com/
- ムームードメイン: https://muumuu-domain.com/
- Google Domains: https://domains.google/

### 2. Vercelでドメインを追加

1. Vercelのプロジェクトダッシュボードを開く
2. **"Settings"** → **"Domains"** を選択
3. 取得したドメインを入力して **"Add"** をクリック
4. 表示される指示に従ってDNS設定を行う

### 3. DNS設定

ドメイン管理画面で以下のレコードを追加：

```
タイプ: CNAME
名前: www (または @)
値: cname.vercel-dns.com
```

> 💡 設定反映まで最大48時間かかる場合があります

## 🔄 更新・再デプロイ

コードを更新してデプロイし直す場合：

```bash
# 変更をコミット
git add .
git commit -m "更新内容の説明"

# GitHubにプッシュ
git push origin main
```

> ✅ GitHubにプッシュすると、Vercelが**自動的に再デプロイ**します！

## 🐛 トラブルシューティング

### ビルドエラーが発生する

**症状:** Vercelでのビルドが失敗する

**解決策:**
1. ローカルでビルドを試す:
   ```bash
   cd /Users/tada/Work/My_work/rice-cooker-recipe-finder
   pnpm build
   ```
2. エラーメッセージを確認して修正
3. 再度GitHubにプッシュ

### ページが真っ白になる

**症状:** デプロイは成功したがページが表示されない

**解決策:**
1. ブラウザの開発者ツール（F12）でエラーを確認
2. Vercelの **"Deployments"** → **"Runtime Logs"** でログを確認
3. 必要に応じてビルド設定を調整

### 404エラーが出る

**症状:** トップページ以外のURLで404エラー

**解決策:**
- `vercel.json` の `rewrites` 設定を確認
- SPAルーティング設定が正しく適用されているか確認

### pnpmが見つからない

**症状:** `pnpm: command not found` エラー

**解決策:**
- Vercelの設定で **Install Command** が `pnpm install` になっているか確認
- `package.json` に `"packageManager": "pnpm@..."` が含まれているか確認

## 📊 デプロイ後の分析

Vercelは無料でアクセス分析を提供しています：

1. プロジェクトダッシュボードから **"Analytics"** を選択
2. 訪問者数、ページビュー、地域などを確認可能

## 💡 その他のヒント

### 環境変数の設定

Vercelで環境変数を使いたい場合：

1. **"Settings"** → **"Environment Variables"** を選択
2. 変数名と値を入力して保存
3. 再デプロイで反映

### プレビューデプロイ

- `main` ブランチ以外にプッシュすると、プレビュー用URLが自動生成されます
- テスト環境として活用可能

### パフォーマンス最適化

- Vercelは自動的に画像最適化やCDN配信を行います
- 追加設定なしで高速配信が可能

---

## ✅ チェックリスト

デプロイ完了後、以下を確認：

- [ ] GitHubリポジトリが作成された
- [ ] Vercelでプロジェクトがインポートされた
- [ ] デプロイが成功した
- [ ] 発行されたURLでアプリが動作している
- [ ] 全ての機能が正常に動作している

---

**🎉 おめでとうございます！**

あなたの炊飯器レシピファインダーがオンラインで公開されました！
URLを友達や家族と共有して、便利に使ってください。

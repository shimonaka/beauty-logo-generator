# Firebase Hosting デプロイ手順

このガイドでは、作成したロゴジェネレーターアプリをGoogle Firebase Hostingに公開する手順を説明します。

## 事前準備

1.  **Node.jsの確認**:
    -   コマンドプロンプトで `node -v` を実行し、バージョンが表示されることを確認してください。

2.  **Firebase CLIのインストール**:
    -   まだインストールしていない場合は、以下のコマンドを実行します。
    ```bash
    npm install -g firebase-tools
    ```

## 手順

### 1. Firebaseへのログイン
コマンドプロンプトで以下を実行し、Googleアカウントでログインします。
※ `firebase` コマンドが使えない場合は、頭に `npx` を付けると動きます。

```bash
npx firebase login
```
ブラウザが開き、認証画面が表示されます。「許可」をクリックしてください。

### 2. プロジェクトの初期化
プロジェクトのルートディレクトリ（`美容室ロゴジェネレーター`フォルダ）で以下を実行します。
```bash
npx firebase init hosting
```

**設定の選択肢:**
1.  **Are you ready to proceed?**: `Y` を入力してEnter。
2.  **Please select an option**: `Use an existing project`（既存のプロジェクトを使用）を選択、または `Create a new project`（新規作成）を選択。
    -   ※ Google AI Pro特典を利用する場合は、既存のプロジェクトIDを確認してください。
3.  **What do you want to use as your public directory?**: `dist` と入力してEnter。
    -   Viteのビルド出力先は `dist` です。
4.  **Configure as a single-page app (rewrite all urls to /index.html)?**: `Y` を入力してEnter。
    -   Reactアプリのため、これは必須です。
5.  **Set up automatic builds and deploys with GitHub?**: `N` を入力してEnter（今回は手動で行うため）。
6.  **File dist/index.html already exists. Overwrite?**: ビルド済みのファイルがある場合聞かれますが、`N`（No）で大丈夫です。

### 3. アプリのビルド
デプロイする前に、最新のコードをビルド（変換）する必要があります。
```bash
npm run build
```
これで `dist` フォルダに公開用のファイルが生成されます（先ほど移動した `promotion` フォルダもここに含まれます）。

### 4. デプロイ（公開）
以下のコマンドでFirebase上にアップロードします。
```bash
npx firebase deploy
```

成功すると、`Hosting URL: https://...` というURLが表示されます。これが公開されたWebサイトのURLです。

## 確認事項
-   公開されたURLにアクセスし、アプリが動作することを確認してください。

---

## 【推奨】GitHub Actionsでの自動デプロイ

`.github/workflows/deploy.yml` を作成しました。
以下の設定を行うことで、GitHubにプッシュするだけで自動的にデプロイされるようになります。

### 1. GitHubリポジトリの設定
1.  GitHubでリポジトリを開きます。
2.  **「Settings」** > **「Secrets and variables」** > **「Actions」** を開きます。
3.  **「New repository secret」** をクリックし、以下の2つを登録します。

#### Secret 1: APIキー
-   **Name**: `VITE_GEMINI_API_KEY`
-   **Secret**: あなたのGemini APIキー

#### Secret 2: Firebaseサービスアカウント
1.  [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts) にアクセスし、プロジェクトを選択します。
2.  「サービスアカウントを作成」をクリック。
    -   名前: `github-deploy` など
    -   ロール: **「Firebase Hosting 管理者」** と **「API キー管理者」** (念のため)
3.  作成したアカウントの「キー」タブで、「鍵を追加」>「新しい鍵を作成」>「JSON」を選択。
4.  ダウンロードされたJSONファイルの中身を**すべてコピー**します。
5.  GitHubに戻り、以下を作成します。
    -   **Name**: `FIREBASE_SERVICE_ACCOUNT`
    -   **Secret**: コピーしたJSONの中身

### 2. プロジェクトIDの設定
`.github/workflows/deploy.yml` ファイルを開き、最後の行の `projectId: your-project-id` を、あなたのFirebaseプロジェクトIDに書き換えてください。
(プロジェクトIDは `firebase login` 実行時などに表示される `project-id` です)

### 3. コードのプッシュ
これらを書き換えてGitHubに `git push` すると、自動的にビルドとデプロイが始まります。
「Actions」タブで進行状況を確認できます。
## 重要：セキュリティ設定（APIキーの保護）

現在の構成では、APIキーがブラウザ上で動作するため、理論上は誰でもキーを見ることができます。
**不正利用を防ぐために、必ず以下の設定を行ってください。**

### Google Cloud Consoleでの制限設定
1.  [Google Cloud Console](https://console.cloud.google.com/apis/credentials) にアクセスします。
2.  使用しているプロジェクトを選択します。
3.  **「認証情報」** ページで、使用しているAPIキー（`GEMINI_API_KEY`）をクリックします。
4.  **「アプリケーションの制限」** セクションで **「ウェブサイト」** を選択します。
5.  **「ウェブサイトの制限」** に、デプロイ後のURLを入力します。
    -   例: `https://your-project-id.web.app/`
    -   ※ ローカルでテストする場合は `http://localhost:3000/` も追加してください。
6.  **「APIの制限」** セクションで **「キーを制限」** を選択します。
7.  プルダウンから **「Generative Language API」** (Gemini) だけを選択してチェックを入れます。
8.  **「保存」** をクリックします。

これにより、指定したドメイン（あなたのサイト）以外からのAPIキーの使用をブロックできます。

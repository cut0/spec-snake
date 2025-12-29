# サンプル

このディレクトリには spec-snake の設定例が含まれています。

## ディレクトリ構成

```
examples/
├── local/     # ローカル開発用サンプル
└── docker/    # Docker デプロイ用サンプル
```

## ローカルサンプル

`local/` ディレクトリには、`spec-snake start` コマンドで直接使用できる設定ファイルが含まれています。

### ファイル

- `spec-snake.config.ts` - 英語版の設定例
- `spec-snake-ja.config.ts` - 日本語版の設定例

### 使い方

```bash
# spec-snake をインストール
npm install spec-snake
# または
pnpm add spec-snake
# または
yarn add spec-snake
```

## Docker サンプル

`docker/` ディレクトリには、spec-snake をコンテナで実行するための完全な Docker セットアップが含まれています。

### ファイル

- `Dockerfile` - コンテナイメージの定義
- `docker-compose.yml` - Docker Compose の設定
- `package.json` - 依存関係
- `spec-snake.config.ts` - 設定ファイル
- `.env` - 環境変数（このファイルを作成してください）
- `.dockerignore` - ビルドから除外するファイル

### 使い方

1. docker ディレクトリに移動:

```bash
cd examples/docker
```

2. API キーを含む `.env` ファイルを作成:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

3. Docker Compose で起動:

```bash
docker compose up --build
```

4. http://localhost:3000 でアプリケーションにアクセス

### カスタマイズ

シナリオをカスタマイズするには、docker ディレクトリ内の `spec-snake.config.ts` を編集し、コンテナを再ビルドしてください。

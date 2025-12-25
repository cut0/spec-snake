# Spec Snake Beta

AI を活用した設計ドキュメントジェネレーター

- Config Base
  - TypeScript の設定ファイルでシナリオ、フォーム、プロンプトを定義
- Multi Step Form
  - ステップ形式のフォームで必要な情報を段階的に収集
- AI Generation
  - Claude Agent SDK を使用し、収集した情報から高品質なドキュメントを生成
- MCP Integration
  - Figma などの外部ツールと連携して、より詳細なドキュメントを生成可能

## コンセプト

下記の 3 つの概念を基本としてドキュメントを管理します。

- Scenario
  - ドキュメントの種類を表す単位。技術設計書、実装方針など、目的ごとにシナリオを定義する
- Step
  - シナリオ内のフォーム入力ステップ。複数のステップで情報を段階的に収集する
- Document
  - 生成されるマークダウン形式のドキュメント。フォーム入力と AI によって生成される

## インストール

```bash
pnpm add @cut0/spec-snake
```

**Note**: GitHub Packages で公開されている

## 環境

- **Node.js**: 18 以上
- **Claude Code**: [Claude Code](https://claude.ai/code) がインストールされている必要があります。

## CLI コマンド

### `init` - 設定ファイルの初期化

新しい設定ファイルを作成します。

```bash
npx spec-snake-beta init
```

オプション:

| オプション | エイリアス | デフォルト             | 説明                 |
| ---------- | ---------- | ---------------------- | -------------------- |
| `--output` | `-o`       | `spec-snake.config.ts` | 出力ファイルパス     |
| `--force`  | `-f`       | `false`                | 既存ファイルを上書き |

例:

```bash
# デフォルトのファイル名で作成
npx spec-snake-beta init

# カスタムファイル名で作成
npx spec-snake-beta init -o my-config.ts

# 既存ファイルを上書き
npx spec-snake-beta init -f
```

### `start` - サーバーの起動

設定ファイルを読み込み、Web UI サーバーを起動します。

```bash
npx spec-snake-beta start
```

オプション:

| オプション | エイリアス | デフォルト             | 説明                 |
| ---------- | ---------- | ---------------------- | -------------------- |
| `--config` | `-c`       | `spec-snake.config.ts` | 設定ファイルのパス   |
| `--port`   | `-p`       | `3000`                 | サーバーのポート番号 |
| `--host`   | -          | `localhost`            | バインドするホスト   |

例:

```bash
# デフォルト設定で起動
npx spec-snake-beta start

# カスタム設定ファイルとポートで起動
npx spec-snake-beta start -c my-config.ts -p 8080

# すべてのインターフェースでリッスン
npx spec-snake-beta start --host 0.0.0.0
```

## 設定ファイル

### 設定ファイルの例

設定ファイル例は [`examples/`](./examples/) ディレクトリを参照してください。

- [`examples/spec-snake.ts`](./examples/spec-snake-ja.ts) - 基本的な設定例

また、設定可能な項目は [src/types.ts](./src/types.ts) を参照してください。

### 設定構造

```typescript
import { defineConfig, defineScenario } from '@cut0/spec-snake';

export default defineConfig({
  scenarios: [
    defineScenario({
      id: 'design-doc',
      name: '設計ドキュメント',
      steps: [
        {
          slug: 'overview',
          title: '概要',
          description: 'プロジェクトの概要',
          section: {
            type: 'single',
            name: 'overview',
            fields: [
              { id: 'title', type: 'input', label: 'タイトル', description: '' },
            ],
          },
        },
      ],
      prompt: '...',
      outputDir: 'docs',
      overrides: {
        filename: ({ formData, timestamp }) =>
          `${formData.overview?.title ?? 'untitled'}-${timestamp}.md`,
      },
    }),
  ],
  permissions: {
    allowSave: true,
  },
});
```

### 型定義

**`Config`** - ルート設定オブジェクト

| プロパティ    | 型            | 必須 | 説明                     |
| ------------- | ------------- | ---- | ------------------------ |
| `scenarios`   | `Scenario[]`  | Yes  | 利用可能なシナリオの配列 |
| `permissions` | `Permissions` | Yes  | グローバル権限設定       |

**`Permissions`** - 権限設定

| プロパティ  | 型        | 説明                           |
| ----------- | --------- | ------------------------------ |
| `allowSave` | `boolean` | ドキュメントの保存を許可するか |

**`Scenario`** - シナリオ定義。各シナリオは 1 つのドキュメントタイプを表す

| プロパティ   | 型                   | 必須 | 説明                                    |
| ------------ | -------------------- | ---- | --------------------------------------- |
| `id`         | `string`             | Yes  | URL で使用される一意の識別子            |
| `name`       | `string`             | Yes  | 表示名                                  |
| `steps`      | `Step[]`             | Yes  | フォームウィザードのステップ            |
| `prompt`     | `string \| Function` | Yes  | Claude に送信するプロンプトテンプレート |
| `outputDir`  | `string`             | No   | ドキュメントの保存先ディレクトリ        |
| `aiSettings` | `AiSettings`         | No   | Claude Agent SDK の設定                 |
| `hooks`      | `ScenarioHooks`      | No   | ライフサイクルフック                    |
| `overrides`  | `ScenarioOverrides`  | No   | デフォルト動作のオーバーライド          |

**`Step`** - マルチステップフォームの各ステップ

| プロパティ    | 型        | 必須 | 説明                                 |
| ------------- | --------- | ---- | ------------------------------------ |
| `slug`        | `string`  | Yes  | URL フレンドリーな識別子             |
| `title`       | `string`  | Yes  | ステップヘッダーに表示されるタイトル |
| `description` | `string`  | Yes  | タイトル下に表示される説明文         |
| `section`     | `Section` | Yes  | ステップのフィールドを含むセクション |

### `Section` - セクションは 2 種類

SingleSection - 1 回だけ入力するフィールドのグループ

```typescript
{
  type: 'single',
  name: 'overview',
  fields: [...]
}
```

ArraySection - 複数のエントリを追加できるフィールドのグループ

```typescript
{
  type: 'array',
  name: 'requirements',
  fields: [...],
  minFieldCount: 1  // 最小エントリ数（オプション）
}
```

### フィールドタイプ

#### InputField - テキスト入力

```typescript
{
  type: 'input',
  id: 'title',
  label: 'タイトル',
  description: 'フィールドの説明',
  placeholder: 'プレースホルダー',
  required: true,
  inputType: 'text' | 'date' | 'url',
  suggestions: ['候補1', '候補2']
}
```

#### TextareaField - 複数行テキスト

```typescript
{
  type: 'textarea',
  id: 'description',
  label: '説明',
  description: 'フィールドの説明',
  rows: 4
}
```

#### SelectField - ドロップダウン選択

```typescript
{
  type: 'select',
  id: 'priority',
  label: '優先度',
  description: 'フィールドの説明',
  options: [
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' }
  ]
}
```

#### CheckboxField - チェックボックス

```typescript
{
  type: 'checkbox',
  id: 'agree',
  label: '同意する',
  description: 'フィールドの説明'
}
```

### `AiSettings` - Claude Agent SDK の設定オプション

| プロパティ                        | 型                                | 説明                                                      |
| --------------------------------- | --------------------------------- | --------------------------------------------------------- |
| `model`                           | `string`                          | 使用するモデル（例: `claude-sonnet-4-5-20250929`）        |
| `fallbackModel`                   | `string`                          | フォールバックモデル                                      |
| `maxTurns`                        | `number`                          | 最大ターン数                                              |
| `maxBudgetUsd`                    | `number`                          | USD での予算上限                                          |
| `tools`                           | `object`                          | ツール設定（`{ type: 'preset', preset: 'claude_code' }`） |
| `allowedTools`                    | `string[]`                        | 許可するツール                                            |
| `disallowedTools`                 | `string[]`                        | 禁止するツール                                            |
| `permissionMode`                  | `PermissionMode`                  | 権限モード                                                |
| `allowDangerouslySkipPermissions` | `boolean`                         | 権限チェックをスキップ                                    |
| `mcpServers`                      | `Record<string, McpServerConfig>` | MCP サーバー設定                                          |

#### 利用可能なツール

- ファイル操作: `Read`, `Write`, `Edit`, `Glob`, `Grep`, `NotebookEdit`
- コマンド実行: `Bash`
- Web: `WebSearch`, `WebFetch`
- エージェント: `Task`, `TodoWrite`
- コード補完: `LSP`
- MCP ツール: `mcp__<server>__<tool>` 形式

### `scenario.hooks` - ライフサイクルフック

```typescript
{
  // プレビュー生成後に呼ばれる
  onPreview: async ({ formData, content }) => {
    console.log('Preview generated');
  },
  // ドキュメント保存後に呼ばれる
  onSave: async ({ content, filename, outputPath, formData }) => {
    console.log(`Saved to ${outputPath}`);
  }
}
```

### `scenario.overrides` - デフォルト動作のオーバーライド

```typescript
{
  // 静的ファイル名
  filename: 'design-doc.md',
  // または動的ファイル名
  filename: ({ formData, timestamp }) =>
    `${formData.project_name}-${timestamp}.md`
}
```

### プロンプトテンプレート

プロンプト内で `{{INPUT_JSON}}` を使用すると、フォームデータが JSON 形式で挿入されます。

```typescript
const prompt = `以下の入力に基づいて設計ドキュメントを生成してください。

{{INPUT_JSON}}

マークダウン形式で出力してください。`;
```

プロンプトは関数としても定義可能です。

```typescript
const prompt = ({ formData }) =>
  `${formData.doc_type} ドキュメントを生成: {{INPUT_JSON}}`;
```

## ライセンス

MIT

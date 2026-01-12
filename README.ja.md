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
# npm
npm install spec-snake@beta

# yarn
yarn add spec-snake@beta

# pnpm
pnpm add spec-snake@beta
```

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

- [`examples/local/spec-snake.config.ts`](./examples/local/spec-snake.config.ts) - 基本的な設定例（英語）
- [`examples/local/spec-snake-ja.config.ts`](./examples/local/spec-snake-ja.config.ts) - 基本的な設定例（日本語）

また、設定可能な項目は [src/types.ts](./src/types.ts) を参照してください。

### 設定構造

```typescript
import { defineConfig, defineScenario } from "spec-snake";

export default defineConfig({
  scenarios: [
    defineScenario({
      id: "design-doc",
      name: "設計ドキュメント",
      steps: [
        {
          slug: "overview",
          title: "概要",
          description: "プロジェクトの概要",
          name: "overview",
          fields: [
            {
              id: "title",
              type: "input",
              label: "タイトル",
              description: "",
            },
          ],
        },
      ],
      prompt: "...",
      outputDir: "docs",
      filename: ({ formData, timestamp }) =>
        `${formData.overview?.title ?? "untitled"}-${timestamp}.md`,
    }),
  ],
  permissions: {
    allowSave: true,
  },
  // AI モード: 'stream'（デフォルト）, 'sync', 'mock'
  // ai: 'mock', // 開発時に AI なしでモックモードを使用
});
```

### 型定義

**`Config`** - ルート設定オブジェクト

| プロパティ    | 型            | 必須 | 説明                                                                 |
| ------------- | ------------- | ---- | -------------------------------------------------------------------- |
| `scenarios`   | `Scenario[]`  | Yes  | 利用可能なシナリオの配列                                             |
| `permissions` | `Permissions` | Yes  | グローバル権限設定                                                   |
| `ai`          | `AiMode`      | No   | AI モード (`'stream'` \| `'sync'` \| `'mock'`)。デフォルト: `'stream'` |

**`AiMode`** - ドキュメント生成の AI モード

| 値         | 説明                                                     |
| ---------- | -------------------------------------------------------- |
| `'stream'` | AI 有効、SSE ストリーミング（デフォルト）                |
| `'sync'`   | AI 有効、レスポンスを一括で返す                          |
| `'mock'`   | AI 無効、開発用の固定モックレスポンスを返す              |

**`Permissions`** - 権限設定

| プロパティ  | 型        | 説明                           |
| ----------- | --------- | ------------------------------ |
| `allowSave` | `boolean` | ドキュメントの保存を許可するか |

**`Scenario`** - シナリオ定義。各シナリオは 1 つのドキュメントタイプを表す

| プロパティ   | 型                  | 必須 | 説明                             |
| ------------ | ------------------- | ---- | -------------------------------- |
| `id`         | `string`            | Yes  | URL で使用される一意の識別子     |
| `name`       | `string`            | Yes  | 表示名                           |
| `steps`      | `Step[]`            | Yes  | フォームウィザードのステップ     |
| `prompt`     | `Function`          | Yes  | Claude に送信するプロンプト関数  |
| `outputDir`  | `string`            | No   | ドキュメントの保存先ディレクトリ |
| `filename`   | `string \| Function`| No   | カスタムファイル名               |
| `aiSettings` | `AiSettings`        | No   | Claude Agent SDK の設定          |
| `hooks`      | `ScenarioHooks`     | No   | ライフサイクルフック             |

**`Step`** - マルチステップフォームの各ステップ

| プロパティ    | 型        | 必須 | 説明                                 |
| ------------- | --------- | ---- | ------------------------------------ |
| `slug`        | `string`  | Yes  | URL フレンドリーな識別子             |
| `title`       | `string`  | Yes  | ステップヘッダーに表示されるタイトル |
| `description` | `string`  | Yes  | タイトル下に表示される説明文         |
| `name`        | `string`  | Yes  | formData のキー                      |
| `fields`      | `Field[]` | Yes  | ステップ内のフィールド配列           |

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

#### GridField - フィールドを列に配置するレイアウト

```typescript
{
  type: 'grid',
  columns: 2,
  fields: [
    { type: 'input', id: 'firstName', label: '名' },
    { type: 'input', id: 'lastName', label: '姓' }
  ]
}
```

#### RepeatableLayout - フィールドを繰り返すレイアウト

ユーザーがフィールドまたはグループの複数インスタンスを追加できます。

```typescript
// 単一フィールドの繰り返し
{
  type: 'repeatable',
  id: 'tags',
  minCount: 1,  // 最小エントリ数（オプション）
  field: { type: 'input', id: 'name', label: 'タグ', description: '' }
}
// formData: { tags: [{ name: 'タグ1' }, { name: 'タグ2' }] }

// グループの繰り返し（エントリごとに複数フィールド）
{
  type: 'repeatable',
  id: 'libraries',
  minCount: 1,
  field: {
    type: 'group',
    fields: [
      { type: 'input', id: 'name', label: 'ライブラリ名', description: '' },
      { type: 'input', id: 'url', label: 'URL', description: '', inputType: 'url' }
    ]
  }
}
// formData: { libraries: [{ name: 'React', url: 'https://...' }, ...] }
```

#### GroupLayout - フィールドを視覚的にグループ化

フィールドを視覚的にグループ化します（繰り返しなし）。グループを繰り返すには RepeatableLayout でラップします。

```typescript
{
  type: 'group',
  fields: [
    { type: 'input', id: 'firstName', label: '名', description: '' },
    { type: 'input', id: 'lastName', label: '姓', description: '' }
  ]
}
// formData: { firstName: '...', lastName: '...' }
```

### 条件付きフィールド表示

`when` プロパティを使用して、他のフィールドの値に基づいてフィールドの表示/非表示を切り替えることができます。

#### オブジェクト形式の条件（シンプルな場合に推奨）

```typescript
// priority が 'high' のときに表示
{ type: 'input', id: 'deadline', label: '期限', when: { field: 'priority', is: 'high' } }

// priority が 'high' または 'medium' のときに表示
{ type: 'textarea', id: 'risk', label: 'リスク', when: { field: 'priority', is: ['high', 'medium'] } }

// priority が 'low' 以外のときに表示
{ type: 'input', id: 'reviewer', label: 'レビュアー', when: { field: 'priority', isNot: 'low' } }

// チェックボックスがオンのときに表示
{ type: 'input', id: 'date', label: '日付', when: { field: 'has_deadline', is: true } }

// フィールドが空でないときに表示
{ type: 'textarea', id: 'notes', label: 'メモ', when: { field: 'title', isNotEmpty: true } }

// フィールドが空のときに表示
{ type: 'input', id: 'fallback', label: 'フォールバック', when: { field: 'title', isEmpty: true } }
```

#### 関数形式の条件（複雑なロジック用）

```typescript
// 複数のフィールドを参照する複雑な条件
{
  type: 'textarea',
  id: 'details',
  label: '詳細',
  when: (formData) => formData.priority === 'high' && formData.type === 'feature'
}
```

**注意**: 非表示のフィールドはバリデーションとフォーム送信から自動的に除外されます。

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

### `scenario.filename` - カスタムファイル名

```typescript
// 静的ファイル名
filename: 'design-doc.md'

// または動的ファイル名
filename: ({ formData, timestamp }) =>
  `${formData.project_name}-${timestamp}.md`
```

### プロンプト関数

プロンプトは `formData` と `aiContext` パラメータを受け取る関数として定義します。

```typescript
const prompt = ({ formData, aiContext }) => `設計ドキュメントを生成してください。

${JSON.stringify({ formData, aiContext }, null, 2)}`;
```

#### `formData`

UI からの生のフォームデータ。ステップ名でキー付けされています。ユーザーが入力した実際の値が含まれます。

```typescript
// formData の構造例
{
  overview: {
    title: "マイプロジェクト",
    description: "プロジェクトの説明",
    priority: "high"
  },
  modules: {
    items: [
      {
        name: "認証モジュール",
        features: [
          { feature_name: "ログイン", feature_description: "ユーザーログイン" }
        ]
      }
    ]
  }
}
```

#### `aiContext`

ステップごとに整理されたフィールドのメタデータ（ラベル、説明）。値を重複させずに AI が構造を理解するのに役立ちます。

```typescript
// aiContext の構造例
{
  overview: {
    _step: { title: "概要", description: "プロジェクトの概要" },
    title: { label: "タイトル", description: "プロジェクト名" },
    description: { label: "説明", description: "プロジェクトの説明" },
    priority: { label: "優先度", description: "優先度レベル" }
  },
  modules: {
    _step: { title: "モジュール", description: "モジュール構成" },
    items: {
      name: { label: "モジュール名", description: "モジュールの名前" },
      features: {
        feature_name: { label: "機能名", description: "機能の名前" },
        feature_description: { label: "機能説明", description: "機能の詳細" }
      }
    }
  }
}
```

使用例:

```typescript
const prompt = ({ formData, aiContext }) => `以下の入力に基づいて設計ドキュメントを生成:

${JSON.stringify({ formData, aiContext }, null, 2)}`;
```

## ライセンス

MIT

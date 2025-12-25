import {
  type SelectOption,
  type Step,
  defineConfig,
  defineScenario,
} from '../src/definitions';

const priorityOptions: SelectOption[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

const steps = [
  {
    slug: 'overview',
    title: '概要',
    description: '機能の基本情報',
    section: {
      type: 'single',
      name: 'overview',
      fields: [
        {
          type: 'input',
          id: 'title',
          label: 'タイトル',
          description: '機能のタイトル',
          placeholder: '機能名を入力',
          required: true,
        },
        {
          type: 'textarea',
          id: 'description',
          label: '説明',
          description: '機能の詳細説明',
          placeholder: '機能について説明してください...',
          rows: 4,
        },
        {
          type: 'select',
          id: 'priority',
          label: '優先度',
          description: '機能の優先度',
          placeholder: '優先度を選択',
          options: priorityOptions,
        },
      ],
    },
  },
  {
    slug: 'design',
    title: 'デザイン',
    description: 'デザインリファレンスとモックアップ',
    section: {
      type: 'single',
      name: 'design',
      fields: [
        {
          type: 'input',
          id: 'figma_link',
          label: 'Figma リンク',
          description: 'Figma デザインファイルまたはフレームへのリンク',
          placeholder: 'https://www.figma.com/design/...',
          inputType: 'url',
          required: true,
        },
        {
          type: 'textarea',
          id: 'design_notes',
          label: 'デザインメモ',
          description: 'デザインに関する補足事項',
          placeholder: 'デザインで考慮すべき点など...',
          rows: 3,
        },
      ],
    },
  },
  {
    slug: 'libraries',
    title: 'ライブラリ',
    description: '外部ライブラリと依存関係',
    section: {
      type: 'array',
      name: 'libraries',
      fields: [
        {
          type: 'input',
          id: 'name',
          label: 'ライブラリ名',
          description: 'ライブラリの名前',
          placeholder: '例: react-query, zod',
          required: true,
        },
        {
          type: 'input',
          id: 'url',
          label: 'URL',
          description: 'ドキュメントまたはリポジトリへのリンク',
          placeholder: 'https://...',
          inputType: 'url',
          required: true,
        },
        {
          type: 'textarea',
          id: 'reason',
          label: '選定理由',
          description: 'このライブラリが必要な理由',
          placeholder: 'このライブラリを選んだ理由を説明...',
          rows: 2,
        },
      ],
    },
  },
] as const satisfies Step[];

const prompt = `あなたはテクニカルライターアシスタントです。以下の入力に基づいて設計ドキュメントを生成してください。

## 入力データ構造

入力は以下の構造を持つJSONです:
\`\`\`json
{
  "items": [
    {
      "title": "セクションタイトル",
      "description": "セクションの説明",
      "values": [
        { "label": "フィールド名", "description": "フィールドの説明", "value": "入力値" }
      ]
    }
  ]
}
\`\`\`

## Figma 連携

入力に Figma リンクが含まれている場合:
1. Figma MCP ツールを使用してデザイン情報を取得
2. デザイン構造、コンポーネント、レイアウトを分析
3. 出力に「デザイン」セクションを含め、以下を記載:
   - デザイン構造の概要
   - 主要なUIコンポーネント
   - レイアウトとスペーシングのパターン
   - 使用されているデザイントークン、変数、スタイル

利用可能な Figma MCP ツール:
- \`mcp__figma__get_design_context\`: レイヤーまたは選択範囲のデザインコンテキストを取得
- \`mcp__figma__get_variable_defs\`: 選択範囲で使用されている変数やスタイルを取得
- \`mcp__figma__get_screenshot\`: 選択範囲のスクリーンショットを撮影
- \`mcp__figma__get_metadata\`: 基本プロパティをXML形式で取得

## ライブラリ連携

入力にライブラリが含まれている場合:
1. WebSearch を使用してライブラリのドキュメントと機能を検索
2. URL が提供されている場合、WebFetch を使用してページから詳細情報を取得
3. 出力に「ライブラリ」セクションを含め、以下を記載:
   - ライブラリ名とバージョン（判明した場合）
   - ライブラリの機能の簡潔な説明
   - このプロジェクトに関連する主要機能
   - 使用例やパターン
   - この機能のために選定された理由

## 出力形式

以下の構成で Markdown 設計ドキュメントを生成:
1. **タイトル**: 機能タイトルをドキュメントのタイトルとして使用
2. **概要**: 機能の説明と優先度をまとめる
3. **デザイン**: (Figma リンクがある場合) Figma ファイル分析に基づくデザインの説明
4. **ライブラリ**: (ライブラリがある場合) 検索した情報を元に各ライブラリを説明

## 入力データ

{{INPUT_JSON}}

上記の入力に基づいて設計ドキュメントを生成してください。`;

// defineConfig と defineScenario を使用して型安全な設定を定義
const config = defineConfig({
  scenarios: [
    defineScenario({
      id: 'default',
      name: '設計ドキュメント生成',
      steps,
      prompt,
      aiSettings: {
        // モデル設定
        model: 'claude-sonnet-4-5-20250929',
        fallbackModel: 'claude-haiku-4-5-20251001',

        // ツール設定
        tools: { type: 'preset', preset: 'claude_code' },
        allowedTools: [
          'Read',
          'Glob',
          'Grep',
          'WebSearch',
          'WebFetch',
          // Figma 公式 MCP ツール
          'mcp__figma__get_design_context',
          'mcp__figma__get_variable_defs',
          'mcp__figma__get_screenshot',
          'mcp__figma__get_metadata',
        ],
        disallowedTools: ['Bash', 'Write', 'Edit'],

        // パーミッション設定
        permissionMode: 'bypassPermissions',
        allowDangerouslySkipPermissions: true,

        // MCP サーバー
        mcpServers: {
          // Figma 公式 MCP サーバー (リモート)
          // 参照: https://developers.figma.com/docs/figma-mcp-server
          // figma: {
          //   type: 'sse',
          //   url: 'https://mcp.figma.com/sse',
          // },
          // 代替: Figma Desktop MCP サーバー (ローカル)
          figma: {
            type: 'http',
            url: 'http://127.0.0.1:3845/mcp',
          },
        },
        strictMcpConfig: true,
      },
      // 例: formData を使った型安全な overrides
      // overrides: {
      //   filename: ({ formData, timestamp }) => {
      //     // formData.overview?.title は型安全！
      //     return `${formData.overview?.title ?? 'untitled'}-${timestamp}.md`;
      //   },
      // },
    }),
  ],
  permissions: {
    allowSave: true,
  },
});

export default config;

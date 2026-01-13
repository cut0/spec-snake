import {
  type SelectOption,
  type Step,
  defineConfig,
  defineScenario,
} from 'spec-snake';

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
      // 条件付きフィールド: 優先度が「高」の場合のみ表示
      {
        type: 'input',
        id: 'deadline',
        label: '締め切り',
        description: '目標完了日（高優先度の場合は必須）',
        placeholder: 'YYYY-MM-DD',
        inputType: 'date',
        required: true,
        when: { field: 'priority', is: 'high' },
      },
      // 条件付きフィールド: 優先度が「高」または「中」の場合に表示
      {
        type: 'textarea',
        id: 'risk_assessment',
        label: 'リスク評価',
        description: '想定されるリスクと対策',
        placeholder: '想定されるリスクを記述...',
        rows: 3,
        when: { field: 'priority', is: ['high', 'medium'] },
      },
      // AND 条件の例: 優先度が「高」かつタイトルが入力されている場合に表示
      {
        type: 'textarea',
        id: 'stakeholders',
        label: 'ステークホルダー',
        description: '関係者と承認者のリスト',
        placeholder: '関係者を記述...',
        rows: 2,
        when: {
          and: [
            { field: 'priority', is: 'high' },
            { field: 'title', isNotEmpty: true },
          ],
        },
      },
      // OR 条件の例: 優先度が「高」または説明が入力されている場合に表示
      {
        type: 'input',
        id: 'review_date',
        label: 'レビュー予定日',
        description: 'レビュー予定日',
        placeholder: 'YYYY-MM-DD',
        inputType: 'date',
        when: {
          or: [
            { field: 'priority', is: 'high' },
            { field: 'description', isNotEmpty: true },
          ],
        },
      },
      // ネストした AND/OR の例: 複雑な条件
      {
        type: 'textarea',
        id: 'escalation_plan',
        label: 'エスカレーション計画',
        description: '問題発生時のエスカレーション手順',
        placeholder: 'エスカレーション手順を記述...',
        rows: 3,
        when: {
          or: [
            // 優先度が「高」の場合
            { field: 'priority', is: 'high' },
            // または、優先度が「中」かつ締め切りが設定されている場合
            {
              and: [
                { field: 'priority', is: 'medium' },
                { field: 'deadline', isNotEmpty: true },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'design',
    title: 'デザイン',
    description: 'デザインリファレンスとモックアップ',
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
  {
    slug: 'libraries',
    title: 'ライブラリ',
    description: '外部ライブラリと依存関係',
    name: 'libraries',
    fields: [
      {
        type: 'repeatable',
        id: 'items',
        label: 'ライブラリ一覧',
        minCount: 1,
        field: {
          type: 'group',
          fields: [
            {
              type: 'input',
              id: 'name',
              label: 'ライブラリ名',
              description: 'ライブラリの名前',
              placeholder: '例: react-query, zod',
              required: true,
              suggestions: [
                'react-query',
                'zod',
                'zustand',
                'react-hook-form',
                'tailwindcss',
                'axios',
                'lodash',
              ],
            },
            {
              type: 'input',
              id: 'url',
              label: 'URL',
              description: 'ドキュメントまたはリポジトリへのリンク',
              placeholder: 'https://...',
              inputType: 'url',
              required: true,
              // 例: name フィールドが空でない場合に表示
              when: { field: 'name', isNotEmpty: true },
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
    ],
  },
  // ネスト構造の例: repeatable > group > repeatable
  {
    slug: 'modules',
    title: 'モジュール',
    description: 'モジュール構成と機能一覧',
    name: 'modules',
    fields: [
      {
        type: 'repeatable',
        id: 'items',
        label: 'モジュール一覧',
        field: {
          type: 'group',
          fields: [
            {
              type: 'input',
              id: 'name',
              label: 'モジュール名',
              description: 'モジュールの名前',
              placeholder: '例: 認証モジュール',
              required: true,
            },
            {
              type: 'textarea',
              id: 'description',
              label: 'モジュール説明',
              description: 'モジュールの概要',
              placeholder: 'このモジュールの役割を説明...',
              rows: 2,
            },
            // ネストした repeatable: 各モジュール内の機能一覧
            {
              type: 'repeatable',
              id: 'features',
              label: '機能一覧',
              minCount: 1,
              field: {
                type: 'group',
                fields: [
                  {
                    type: 'input',
                    id: 'feature_name',
                    label: '機能名',
                    description: '機能の名前',
                    placeholder: '例: ログイン機能',
                    required: true,
                  },
                  {
                    type: 'textarea',
                    id: 'feature_description',
                    label: '機能説明',
                    description: '機能の詳細',
                    placeholder: '機能の詳細を説明...',
                    rows: 2,
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
] as const satisfies Step[];

const prompt = ({
  aiContext,
  formData,
}: {
  aiContext: unknown;
  formData: unknown;
}) => {
  console.log(JSON.stringify(formData, null, 2));
  console.log(JSON.stringify(aiContext, null, 2));
  return `あなたはテクニカルライターアシスタントです。以下の入力に基づいて設計ドキュメントを生成してください。

## 入力データ構造

入力は以下の構造を持つJSONです:
\`\`\`json
{
  "steps": [
    {
      "title": "ステップタイトル",
      "description": "ステップの説明",
      "fields": [
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

${JSON.stringify(aiContext, null, 2)}

上記の入力に基づいて設計ドキュメントを生成してください。`;
};

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
        permissionMode: 'dontAsk',
        // allowDangerouslySkipPermissions: true,

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
      // 例: formData を使った型安全な filename
      // filename: ({ formData, timestamp }) => {
      //   // formData.overview?.title は型安全！
      //   return `${formData.overview?.title ?? 'untitled'}-${timestamp}.md`;
      // },
    }),
  ],
  permissions: {
    allowSave: true,
  },
  // AI モード: 'stream'（デフォルト）, 'sync', 'mock'
  // ai: 'mock', // 開発時に AI なしでモックモードを使用
});

export default config;

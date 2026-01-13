import {
  type SelectOption,
  type Step,
  defineConfig,
  defineScenario,
} from 'spec-snake';

const priorityOptions: SelectOption[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const steps = [
  {
    slug: 'overview',
    title: 'Overview',
    description: 'Basic information about the feature',
    name: 'overview',
    fields: [
      {
        type: 'input',
        id: 'title',
        label: 'Title',
        description: 'Feature title',
        placeholder: 'Enter feature title',
        required: true,
      },
      {
        type: 'textarea',
        id: 'description',
        label: 'Description',
        description: 'Detailed description of the feature',
        placeholder: 'Describe the feature...',
        rows: 4,
      },
      {
        type: 'select',
        id: 'priority',
        label: 'Priority',
        description: 'Feature priority level',
        placeholder: 'Select priority',
        options: priorityOptions,
      },
      // Conditional field: only shown when priority is 'high'
      {
        type: 'input',
        id: 'deadline',
        label: 'Deadline',
        description: 'Target completion date (required for high priority)',
        placeholder: 'YYYY-MM-DD',
        inputType: 'date',
        required: true,
        when: { field: 'priority', is: 'high' },
      },
      // Conditional field: shown when priority is 'high' or 'medium'
      {
        type: 'textarea',
        id: 'risk_assessment',
        label: 'Risk Assessment',
        description: 'Potential risks and mitigation strategies',
        placeholder: 'Describe potential risks...',
        rows: 3,
        when: { field: 'priority', is: ['high', 'medium'] },
      },
      // AND condition example: shown when priority is 'high' AND title is not empty
      {
        type: 'textarea',
        id: 'stakeholders',
        label: 'Stakeholders',
        description: 'List of stakeholders and approvers',
        placeholder: 'List stakeholders...',
        rows: 2,
        when: {
          and: [
            { field: 'priority', is: 'high' },
            { field: 'title', isNotEmpty: true },
          ],
        },
      },
      // OR condition example: shown when priority is 'high' OR description is not empty
      {
        type: 'input',
        id: 'review_date',
        label: 'Review Date',
        description: 'Scheduled review date',
        placeholder: 'YYYY-MM-DD',
        inputType: 'date',
        when: {
          or: [
            { field: 'priority', is: 'high' },
            { field: 'description', isNotEmpty: true },
          ],
        },
      },
      // Nested AND/OR example: complex condition
      {
        type: 'textarea',
        id: 'escalation_plan',
        label: 'Escalation Plan',
        description: 'Escalation procedure for issues',
        placeholder: 'Describe escalation procedure...',
        rows: 3,
        when: {
          or: [
            // When priority is 'high'
            { field: 'priority', is: 'high' },
            // OR when priority is 'medium' AND deadline is set
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
    title: 'Design',
    description: 'Design references and mockups',
    name: 'design',
    fields: [
      {
        type: 'input',
        id: 'figma_link',
        label: 'Figma Link',
        description: 'Link to Figma design file or frame',
        placeholder: 'https://www.figma.com/design/...',
        inputType: 'url',
        required: true,
      },
      {
        type: 'textarea',
        id: 'design_notes',
        label: 'Design Notes',
        description: 'Additional notes about the design',
        placeholder: 'Any specific design considerations...',
        rows: 3,
      },
    ],
  },
  {
    slug: 'libraries',
    title: 'Libraries',
    description: 'External libraries and dependencies',
    name: 'libraries',
    fields: [
      {
        type: 'repeatable',
        id: 'items',
        label: 'Libraries',
        minCount: 1,
        field: {
          type: 'group',
          fields: [
            {
              type: 'input',
              id: 'name',
              label: 'Library Name',
              description: 'Name of the library',
              placeholder: 'e.g., react-query, zod',
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
              description: 'Link to documentation or repository',
              placeholder: 'https://...',
              inputType: 'url',
              required: true,
            },
            {
              type: 'textarea',
              id: 'reason',
              label: 'Reason',
              description: 'Why this library is needed',
              placeholder: 'Explain why this library is chosen...',
              rows: 2,
            },
          ],
        },
      },
    ],
  },
  // Nested structure example: repeatable > group > repeatable
  {
    slug: 'modules',
    title: 'Modules',
    description: 'Module structure and feature list',
    name: 'modules',
    fields: [
      {
        type: 'repeatable',
        id: 'items',
        label: 'Modules',
        field: {
          type: 'group',
          fields: [
            {
              type: 'input',
              id: 'name',
              label: 'Module Name',
              description: 'Name of the module',
              placeholder: 'e.g., Authentication Module',
              required: true,
            },
            {
              type: 'textarea',
              id: 'description',
              label: 'Module Description',
              description: 'Overview of the module',
              placeholder: 'Describe the role of this module...',
              rows: 2,
            },
            // Nested repeatable: list of features within each module
            {
              type: 'repeatable',
              id: 'features',
              label: 'Features',
              minCount: 1,
              field: {
                type: 'group',
                fields: [
                  {
                    type: 'input',
                    id: 'feature_name',
                    label: 'Feature Name',
                    description: 'Name of the feature',
                    placeholder: 'e.g., Login Feature',
                    required: true,
                  },
                  {
                    type: 'textarea',
                    id: 'feature_description',
                    label: 'Feature Description',
                    description: 'Details of the feature',
                    placeholder: 'Describe the feature details...',
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
}: {
  aiContext: unknown;
}) => `You are a technical writer assistant. Generate a design document based on the following input.

## Input Data Structure

The input is JSON with the following structure:
\`\`\`json
{
  "steps": [
    {
      "title": "Step title",
      "description": "Step description",
      "fields": [
        { "label": "Field name", "description": "Field description", "value": "Input value" }
      ]
    }
  ]
}
\`\`\`

## Figma Integration

If a Figma link is provided in the input:
1. Use the Figma MCP tools to fetch the design information
2. Analyze the design structure, components, and layout
3. Include a "Design" section in the output with:
   - Summary of the design structure
   - Key UI components identified
   - Layout and spacing patterns
   - Design tokens, variables, and styles used

Available Figma MCP tools:
- \`mcp__figma__get_design_context\`: Get design context from a layer or selection
- \`mcp__figma__get_variable_defs\`: Get variables and styles used in the selection
- \`mcp__figma__get_screenshot\`: Capture a screenshot of the selection
- \`mcp__figma__get_metadata\`: Get basic properties in XML format

## Library Integration

If libraries are provided in the input:
1. Use WebSearch to search for the library documentation and features
2. If a URL is provided, use WebFetch to get detailed information from the page
3. Include a "Libraries" section in the output with:
   - Library name and version (if found)
   - Brief description of what the library does
   - Key features relevant to this project
   - Usage examples or patterns
   - Why it was chosen for this feature

## Output Format

Generate a Markdown design document with:
1. **Title**: Use the feature title as the document title
2. **Overview**: Summarize the feature description and priority
3. **Design**: (If Figma link provided) Describe the design based on Figma file analysis
4. **Libraries**: (If libraries provided) Describe each library with searched information

## Important Instructions

- Output ONLY the design document content in Markdown format
- Do NOT include any preamble, explanation, or commentary (e.g., "I'll generate...", "Let me fetch...", "Based on the input...", "I will generate the document...", "Let me retrieve the information...")
- Start directly with the document title (# Title)
- Do NOT wrap the output in code blocks

## Input Data

${JSON.stringify(aiContext, null, 2)}`;

// Use defineConfig and defineScenario for type-safe configuration
const config = defineConfig({
  scenarios: [
    defineScenario({
      id: 'default',
      name: 'Design Doc Generator',
      steps,
      prompt,
      aiSettings: {
        // Model settings
        model: 'claude-sonnet-4-5-20250929',
        fallbackModel: 'claude-haiku-4-5-20251001',

        // Tool settings
        tools: { type: 'preset', preset: 'claude_code' },
        allowedTools: [
          'Read',
          'Glob',
          'Grep',
          'WebSearch',
          'WebFetch',
          // Figma official MCP tools
          'mcp__figma__get_design_context',
          'mcp__figma__get_variable_defs',
          'mcp__figma__get_screenshot',
          'mcp__figma__get_metadata',
        ],
        disallowedTools: ['Bash', 'Write', 'Edit'],

        // Permission settings
        permissionMode: 'dontAsk',
        // allowDangerouslySkipPermissions: true,

        // MCP servers
        mcpServers: {
          // Figma official MCP server (Remote)
          // See: https://developers.figma.com/docs/figma-mcp-server
          // figma: {
          //   type: 'sse',
          //   url: 'https://mcp.figma.com/sse',
          // },
          // Alternative: Figma Desktop MCP server (Local)
          figma: {
            type: 'http',
            url: 'http://127.0.0.1:3845/mcp',
          },
        },
        strictMcpConfig: true,
      },
      // Example: Type-safe filename using formData
      // filename: ({ formData, timestamp }) => {
      //   // formData.overview?.title is type-safe!
      //   return `${formData.overview?.title ?? 'untitled'}-${timestamp}.md`;
      // },
    }),
  ],
  permissions: {
    allowSave: true,
  },
  // AI mode: 'stream' (default), 'sync', or 'mock'
  // ai: 'mock', // Use mock mode for development without AI
});

export default config;

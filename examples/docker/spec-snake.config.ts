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
    section: {
      type: 'single',
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
      ],
    },
  },
  {
    slug: 'design',
    title: 'Design',
    description: 'Design references and mockups',
    section: {
      type: 'single',
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
  },
  {
    slug: 'libraries',
    title: 'Libraries',
    description: 'External libraries and dependencies',
    section: {
      type: 'array',
      name: 'libraries',
      fields: [
        {
          type: 'input',
          id: 'name',
          label: 'Library Name',
          description: 'Name of the library',
          placeholder: 'e.g., react-query, zod',
          required: true,
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
] as const satisfies Step[];

const prompt = `You are a technical writer assistant. Generate a design document based on the following input.

## Input Data Structure

The input is JSON with the following structure:
\`\`\`json
{
  "items": [
    {
      "title": "Section title",
      "description": "Section description",
      "values": [
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

## Input Data

{{INPUT_JSON}}

Generate the design document based on the input above.`;

const config = defineConfig({
  scenarios: [
    defineScenario({
      id: 'default',
      name: 'Design Doc Generator',
      steps,
      prompt,
      aiSettings: {
        model: 'claude-sonnet-4-5-20250929',
        fallbackModel: 'claude-haiku-4-5-20251001',

        tools: { type: 'preset', preset: 'claude_code' },
        allowedTools: [
          'Read',
          'Glob',
          'Grep',
          'WebSearch',
          'WebFetch',
          'mcp__figma__get_design_context',
          'mcp__figma__get_variable_defs',
          'mcp__figma__get_screenshot',
          'mcp__figma__get_metadata',
        ],
        disallowedTools: ['Bash', 'Write', 'Edit'],

        // In the Docker environment, bypassPermissions and allowDangerouslySkipPermissions cannot be used.
        permissionMode: 'dontAsk',

        mcpServers: {
          figma: {
            type: 'http',
            // Setup host.docker.internal to access the Figma Desktop MCP server
            url: 'http://host.docker.internal:3845/mcp',
          },
        },
        strictMcpConfig: true,
      },
    }),
  ],
  hosted: true,
});

export default config;

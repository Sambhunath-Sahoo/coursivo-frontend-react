# Agents

Specialized subagents for the Coursivo frontend. Invoke via Claude Code for focused review tasks.

## Available Agents

| Agent | Description |
|---|---|
| `ui-reviewer` | Reviews React components and pages for design system violations, code quality, and accessibility gaps |
| `accessibility-auditor` | Full WCAG 2.1 AA audit — keyboard nav, screen reader support, ARIA, color contrast, focus management |
| `performance-auditor` | Reviews for unnecessary re-renders, missing memoization, expensive computations, and bundle size issues |

## Usage

Ask Claude to use a specific agent by name, or Claude will select the appropriate one based on context.

Examples:
- "Review NotificationBell with the ui-reviewer"
- "Audit CourseDetail page for accessibility"
- "Check InstructorDashboard for performance issues using the performance-auditor"

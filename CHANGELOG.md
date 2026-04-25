# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-04-25

### Added

#### Components
- **Button** - Primary, secondary, outline, ghost, and danger variants with size options
- **Input** - Text input with validation states and icons
- **Checkbox** - Custom checkbox with indeterminate state
- **Switch** - Toggle switch component
- **Radio** - Radio button group component
- **Badge** - Status badges with multiple variants
- **Avatar** - User avatar with fallback initials and image support
- **Card** - Container card with header, body, and footer slots
- **Alert** - Dismissible alerts with success, warning, danger, and info variants
- **Dialog** - Modal dialog with focus trap and keyboard navigation
- **Tabs** - Tabbed interface with keyboard navigation
- **Tooltip** - Accessible tooltip with positioning
- **Select** - Custom dropdown select with search and multi-select
- **Separator** - Horizontal and vertical dividers
- **Accordion** - Collapsible content panels
- **Text** - Typography component with variants
- **Toast** - Notification toasts with auto-dismiss
- **Dropdown Menu** - Context menus with keyboard navigation
- **Popover** - Floating content containers
- **Progress** - Progress bars with determinate and indeterminate states
- **Spinner** - Loading spinners in multiple sizes
- **Breadcrumb** - Navigation breadcrumbs
- **Pagination** - Page navigation with ellipsis support

#### Infrastructure
- ESLint + Prettier setup for code quality
- @storybook/addon-a11y for accessibility testing
- Storybook deployed to GitHub Pages
- Live demo page
- Type declarations and package exports
- Global theme file with CSS custom properties
- Standalone theme.css export

### Changed
- Updated CI to use Node 20 and 22
- Enhanced README with Storybook URL and full component list
- Added warning and purple color palettes to theming documentation

### Fixed
- TypeScript compatibility issues with event listeners

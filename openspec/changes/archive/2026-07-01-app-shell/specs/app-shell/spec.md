## ADDED Requirements

### Requirement: Application shell layout

The application SHALL render a single-page layout on `/` with a top header (brand mark, app name, pipeline status indicator), a main content area for inputs and results, and a privacy footer (FR-SHELL-01).

#### Scenario: Header is always visible

- **WHEN** the visitor loads `/`
- **THEN** the header displays the logomark, the text "Job Application Agent", and a pipeline status indicator

#### Scenario: Footer shows privacy line

- **WHEN** the visitor loads `/`
- **THEN** the footer displays a privacy statement that the app uses no accounts, stores no data, and processes the CV in memory only

### Requirement: Responsive breakpoints

The layout SHALL adapt at 768px and 1280px breakpoints. Below 768px, the CV input region SHALL appear above the job input region in a single column. At tablet and desktop widths, the CV and job input regions SHALL use a two-column layout (FR-SHELL-02).

#### Scenario: Mobile single column

- **WHEN** the viewport width is 375px
- **THEN** the CV panel region is rendered above the job panel region in one column

#### Scenario: Tablet and desktop two-column inputs

- **WHEN** the viewport width is at least 768px
- **THEN** the CV and job panel regions are displayed side by side in two columns

#### Scenario: Desktop container width

- **WHEN** the viewport width is at least 1280px
- **THEN** main content is constrained to the design-system container max width (`--container-max`, 1180px) with appropriate horizontal padding

### Requirement: Empty state on first load

On first load, the main area SHALL show a brief product description and prominently present structural placeholders for CV upload and job posting inputs. No pipeline run SHALL occur automatically (FR-SHELL-03).

#### Scenario: Hero copy on first load

- **WHEN** the visitor opens the app with no prior interaction
- **THEN** the page shows a headline and short description of the Maker–Checker cover-letter pipeline

#### Scenario: Input placeholders are visible

- **WHEN** the empty state is shown
- **THEN** distinct placeholder regions for "Your CV" and "Job posting" are visible with step labels

#### Scenario: Run control is present but inactive

- **WHEN** the empty state is shown
- **THEN** a "Generate cover letter" control is visible and disabled until capabilities 06/07 wire validation

### Requirement: Pipeline status indicator in header

A pipeline-status indicator SHALL be visible in the header at all times. For this capability it SHALL default to the idle state; dynamic transitions to running, complete, and error are wired in capabilities 08 and 09 (FR-SHELL-04 partial).

#### Scenario: Idle on first load

- **WHEN** the page loads and no pipeline run is active
- **THEN** the status indicator shows the idle state with label "Idle"

#### Scenario: Status component supports all lifecycle states

- **WHEN** `StatusIndicator` is rendered with `state` of `running`, `complete`, or `error`
- **THEN** it displays the corresponding visual treatment and default label (Running, Complete, Error)

### Requirement: System color scheme

Light and dark themes SHALL follow the visitor's system `prefers-color-scheme` preference. The MVP SHALL NOT include an in-app theme toggle (FR-SHELL-05).

#### Scenario: Light theme by default

- **WHEN** the visitor's system preference is light
- **THEN** the application uses light semantic color tokens from `app/globals.css`

#### Scenario: Dark theme follows system

- **WHEN** the visitor's system preference is dark
- **THEN** the application applies dark token overrides without requiring a page reload beyond the OS setting change

#### Scenario: No theme toggle control

- **WHEN** the shell is rendered
- **THEN** there is no button or control labeled for switching light/dark mode

### Requirement: Professional brand voice

All visible shell copy SHALL be professional and action-oriented. Copy SHALL NOT contain exclamation marks (BC-BRAND-01).

#### Scenario: No exclamation marks in shell copy

- **WHEN** the empty state, header, footer, and placeholder labels are rendered
- **THEN** none of the visible strings contain the `!` character

### Requirement: Baseline accessibility

Interactive placeholder controls SHALL expose visible focus indicators. The page SHALL have a single logical `main` landmark and the document language SHALL be `en` (NFR-A11Y-01 baseline).

#### Scenario: Focus visible on interactive placeholders

- **WHEN** the visitor tabs to a focusable placeholder control
- **THEN** a visible focus ring appears using design-system focus tokens

#### Scenario: Main landmark

- **WHEN** assistive technology inspects the page
- **THEN** primary content is contained in a `main` element

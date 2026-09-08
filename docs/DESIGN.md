# Design process

[Figma working file](https://www.figma.com/design/d57KRrIlDsRhMfAJdU9JPC)

## Process

1. Review owner-supplied references; record what is liked and why.
2. Translate the brief into a visitor journey and a staff journey.
3. Explore mobile and desktop wireframes before detailed styling.
4. Establish tokens, Auto Layout, reusable controls and interaction states.
5. Build the discovery and staff-review clickable prototype.
6. Observe real testers completing tasks; document evidence and limitations.
7. Revise design, implement reusable components and compare implementation against Figma.

## Figma structure (intended; current pages are Brief and decisions, Foundations and components, Screen designs)

- Brief and decisions
- Journeys and wireframes
- Components and prototype
- Validation and implementation evidence

Use named sections within pages to stay within the free account's capabilities. Do not buy a seat or upgrade the plan.

## Accessibility intent

Semantic structure; persistent labels; visible focus; keyboard operation; logical focus movement between steps; programmatic error association; readable contrast; non-colour status indicators; mobile reflow; reduced-motion support. Target WCAG 2.2 AA for the implemented scope without claiming certification.

## References and design decisions

Owner references, reviewed visually in the browser on 2026-09-08:

- [ClawPow](https://www.clawpow.com/?ref=trustmrr): owner likes flow and style. Retain generous hero spacing, service-tab exploration, sans/serif contrast, and deliberate light/dark section rhythm.
- [UpLinked](https://www.uplinked.app/en?ref=trustmrr): owner likes the theme. Retain light surfaces, branded accents, a faint grid, rounded controls, and a clear path to action.

Confirmed direction: a connected technology canvas showing a challenge becoming a practical next step. Each of the six service panels uses outcomes grounded in the supplied profile. Illustrations are explicitly conceptual, not case studies.

Brand reference innomarks.co.za was inspected visually on 2026-09-08: blue/green logo, white surfaces, blue overlays and green actions. Our implementation uses a contrast-tested interpretation rather than claiming exact source CSS values. Palette: white #ffffff; ink #102d43; blue #075aa3; green #398622; pale blue #edf5fa; muted text #526777. The PDF palette is superseded by the owner's explicit instruction.

DM Sans handles headings/body; Lora italic provides restrained emphasis. Supplied PNG assets are copied unchanged. Responsive accessible text accompanies the symbol in the header, avoiding the large whitespace in the square wordmark assets. No fabricated client logos, testimonials, figures or team identities.

Public flow: hero → six-service explorer → service details → approach → group identity → FAQs → three-step enquiry. Mobile service tabs scroll horizontally without creating page overflow. Form review is editable; details remain in component state only.

Figma brief and semantic colour variables are synchronised to this direction. Complete editable screen compositions and the clickable prototype are still pending. Code has advanced ahead of those Figma screens; do not claim a finished design-to-code handoff.

### Design-system discovery

No Code Connect files, product components, or local tokens existed at discovery. Figma contained the brief only. Searched the subscribed Simple Design System for Button, Input, and background variables. It has reusable general controls, but its externally owned token model and default typography do not match this bespoke direction. Create a minimal local system with matching CSS names rather than importing an unrelated full library. The old neutral placeholder is temporary and is superseded by these reference-led tokens.

The free file uses named sections and one light token mode. Initial component scope: Button (primary/secondary, default/hover/focus/disabled), Input (default/focus/error), and Service tab (selected/unselected). Remaining compositions use these atoms and Auto Layout.

## Research evidence

Not started. Never fill this section with fictional participants or fabricated outcomes.

For each session record task, device/input method, observation, completion result, issue severity, design change, and retest result. Use anonymous participant labels.

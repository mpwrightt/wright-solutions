# Claude Code Statusline Creation Prompt

## Prompt for Creating a "Lock In" Motivational Statusline

```
Create a Claude Code statusline that serves as a motivational "Lock In" reminder with the following specifications:

**Core Requirements:**
1. **Primary Header**: Display "🔥 L O C K   I N 🔥" with "PERFORMANCE MODE ACTIVATED" in a bordered section
2. **Session Information**: Show current directory, git branch (with status indicators), model name, and current time with live indicators
3. **Motivational Quote System**: Display rotating motivational quotes in individual bordered boxes

**Visual Design:**
- Use bold, attention-grabbing colors (red, yellow, green, cyan, etc.)
- All three sections must have EXACTLY the same border width (80 characters total)
- Use `+` and `=` characters for borders with mathematical precision
- Include emojis and visual indicators for maximum impact

**Quote System:**
- Create 30+ high-energy motivational quotes like "🔥 UNLEASH THE BEAST WITHIN", "⚡ ROCKET FUEL IN YOUR VEINS"
- Quotes should rotate every 10 seconds
- Each quote gets its own perfectly-sized bordered box
- Include scrolling indicators and live update animations

**Technical Implementation:**
- Read Claude Code session data via JSON input
- Extract workspace directory, git status, and model information
- Use ANSI color codes for vibrant display
- Include pulsing animations and live indicators
- Ensure perfect border alignment across all sections (80 chars total width)

**Functional Features:**
- Git status with change indicators (⚡) and ahead indicators (↑)
- Live time updates with blinking dots
- Animated quote rotation system
- Professional spacing and centering
- Cross-terminal compatibility

The result should be an impossible-to-ignore motivational display that creates a true "Jumbotron" experience for maintaining focus during coding sessions.
```

## Key Success Factors

When creating this statusline, ensure:
1. **Perfect Alignment**: All borders must be exactly 80 characters total width
2. **High Energy**: Use bold colors, emojis, and impactful language
3. **Live Updates**: Include pulsing dots and animation indicators
4. **Rotation System**: Implement 10-second quote rotation with proper timing
5. **Professional Polish**: Clean spacing, consistent formatting, error handling

## Usage

Use this prompt with the `statusline-setup` agent in Claude Code to create a motivational statusline system that will keep you locked in and focused during development work.
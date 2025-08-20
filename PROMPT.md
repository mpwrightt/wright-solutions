# Claude Code Statusline Creation Prompt

## Prompt for Creating a "Wright AI Solutions" Professional Statusline

```
Create a Claude Code statusline that serves as a professional "Wright AI Solutions" development environment with the following specifications:

**Core Requirements:**
1. **Primary Header**: Display "🤖 W R I G H T   A I   S O L U T I O N S 🤖" with "AI DEVELOPMENT MODE" in a bordered section
2. **Session Information**: Show current directory, git branch (with status indicators), model name, and current time with live indicators
3. **AI Development Focus**: Display rotating AI development tips and best practices in individual bordered boxes

**Visual Design:**
- Use professional, modern colors (blue, green, purple, etc.)
- All three sections must have EXACTLY the same border width (80 characters total)
- Use `+` and `=` characters for borders with mathematical precision
- Include emojis and visual indicators for maximum impact

**AI Development Tips System:**
- Create 30+ AI development tips like "🤖 Optimize your ML pipeline", "⚡ Implement proper error handling", "🧠 Use transfer learning for better results"
- Tips should rotate every 10 seconds
- Each tip gets its own perfectly-sized bordered box
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
- Animated tip rotation system
- Professional spacing and centering
- Cross-terminal compatibility

The result should be a professional AI development environment display that enhances productivity during AI/ML development sessions.
```

## Key Success Factors

When creating this statusline, ensure:
1. **Perfect Alignment**: All borders must be exactly 80 characters total width
2. **Professional Design**: Use modern colors, emojis, and impactful language
3. **Live Updates**: Include pulsing dots and animation indicators
4. **Rotation System**: Implement 10-second tip rotation with proper timing
5. **Professional Polish**: Clean spacing, consistent formatting, error handling

## Usage

Use this prompt with the `statusline-setup` agent in Claude Code to create a professional AI development statusline system that will enhance your productivity during AI/ML development work.
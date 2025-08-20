#!/usr/bin/env python3

import re
import sys

def patch_claude_banner():
    cli_path = "/Users/mpwright/.npm-global/lib/node_modules/@anthropic-ai/claude-code/cli.js"
    
    # Read the file
    with open(cli_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Replace HERO'S QUEST patterns
    content = re.sub(r'HERO\'S\s+QUEST', 'HYRULE CODE', content)
    content = re.sub(r'HERO\'\S*\s*QUEST', 'HYRULE CODE', content)
    
    # Replace TRIFORCE POWER ACTIVATED
    content = re.sub(r'TRIFORCE\s+POWER\s+ACTIVATED', 'TRIFORCE AWAKENED', content)
    content = re.sub(r'TRIFORCE.*POWER.*ACTIVATED', 'TRIFORCE AWAKENED', content)
    
    # Check if any changes were made
    if content != original_content:
        # Write the patched file
        with open(cli_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ Successfully patched Claude Code banner!")
        print("   HERO'S QUEST → HYRULE CODE")
        print("   TRIFORCE POWER ACTIVATED → TRIFORCE AWAKENED")
    else:
        print("❌ No banner patterns found to patch")
        print("   The file may already be patched or patterns have changed")

if __name__ == "__main__":
    try:
        patch_claude_banner()
    except Exception as e:
        print(f"❌ Error patching file: {e}")
        sys.exit(1)
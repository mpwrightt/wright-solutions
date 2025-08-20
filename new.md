#!/usr/bin/env expect -f
# Pin a top banner that says HYRULE and run the Claude CLI underneath.

# ---------- You can tweak these ----------
set timeout 6
set title "HYRULE"                       ;# terminal/tab title
set banner_file "~/.hyrule-banner.txt"   ;# your ASCII art file
set center 0                              ;# set to 1 to center each line
# ----------------------------------------

# Read banner (UTF-8). If missing, use a tiny fallback.
set banner ""
set fpath [file normalize $banner_file]
if {[file exists $fpath]} {
  set f [open $fpath r]
  fconfigure $f -encoding utf-8
  set banner [read $f]
  close $f
} else {
  set banner "
▲
▲ ▲
H Y R U L E
⚡ C O D E ⚡
⬢ TRIFORCE AWAKENED ⬢
"
}

# Split lines and trim trailing blank lines
set lines [split $banner "\n"]
while {[llength $lines] > 0 && [string length [lindex $lines end]] == 0} {
  set lines [lrange $lines 0 end-1]
}
set header_lines [llength $lines]
if {$header_lines < 1} { set header_lines 1 }

# Terminal size (fallbacks)
set rows 24
set cols 80
catch { set rows [string trim [exec /bin/sh -lc "tput lines"]] }
catch { set cols [string trim [exec /bin/sh -lc "tput cols"]] }
if {![string is integer -strict $rows] || $rows <= $header_lines + 1} {
  set rows [expr {$header_lines + 10}]
}
if {![string is integer -strict $cols] || $cols < 40} {
  set cols 80
}

# Launch Claude; prevent it from changing the terminal title
set env(CLAUDE_CODE_DISABLE_TERMINAL_TITLE) 1
spawn -noecho claude

# Wait for its greeting (covers wording variants; ok to time out)
expect {
  -re {Welcome to Claude Code!} {}
  -re {/help for help} {}
  -re {cwd:\s} {}
  timeout {}
}

# Allow draw to finish
after 160

# ---- Build the banner output (optionally centered) ----
set out ""
foreach L $lines {
  set line $L
  if {$center} {
    # crude centering (doesn't account for ANSI color codes in the file)
    set pad [expr {$cols - [string length $line]}]
    if {$pad < 0} { set pad 0 }
    set pad [expr {$pad/2}]
    append out [string repeat " " $pad] $line "\n"
  } else {
    append out $line "\n"
  }
}
# -------------------------------------------------------

# Set tab title (escape closing bracket)
send_user "\033\]0;$title\007"

# Clear scrollback + screen + move cursor home (escape '[' for Tcl)
send_user "\033\[3J\033\[2J\033\[H"

# Print the banner
send_user $out

# Lock the scroll region so the banner does not scroll away
set top [expr {$header_lines + 1}]
send_user [format "\033\[%d;%dr" $top $rows]

# Move caret to first line below the banner and request a fresh prompt
send_user [format "\033\[%d;1H" $top]
send -- "\r"

# Clean up when we exit (remove scroll region, reset attrs)
proc cleanup {} {
  send_user "\033\[r\033\[0m"
}

# Handle Ctrl-C / terminal close
trap { cleanup; exit } {INT TERM HUP}

# Hand control to you; when Claude exits, cleanup and exit.
interact
cleanup

# Interactive keyboard visualization
## [Live demo](http://daviste.com/demo/keyboard-layout)

[![](https://raw.githubusercontent.com/Dmitra/keyboard/master/snapshot/Alt-layout.jpg)](http://daviste.com/demo/keyboard-layout)

## Goal
The original goal of this project was to spatially visualize and test ideas on different layouts before actually learning them to touch type as it is fairly hard to override muscle memory.
Test subjects were:
- application switching: one shortcut for each app
- text navigation: system wide VIM mode like
- vim shortcuts: optimization
- non-qwerty layouts compatibility

It seems that I found the best layout for all of them. Currently they are in the progress of learning.
It usually takes a month to get used to and 6-12 months to get to the totally unconscious usage, read: maximum speed. After learning I'll measure performance and compare it with other options and default approach.
Currently the data is limited to my specific set. I'm using Lenovo laptop and "workman layout". There are ergodox keyboard and qwerty layout to show that any other layout can be encorporated into visualization as well. So, feel free to experiment with yours, and suggest a pull request.

## Visualization description
The visualization is made with 4 layers of layouts:
- physical - what the actual device looks like
- visual - what are the labels on the keys
- application - what are the actions executed on key press in the app
- context - application specific context

Each button shows 5 elements:
- top left: visual label
- top right: amount of action and its direction
- center: action
- botton: element on which action is performed
Hover the button to preview its actions.
Click to save the state and reflect it in URL. You can reload or share the state of choosel layouts and pressed buttons by URL. You can also press the buttons on your physical keyboard and visualization will show them as hovered, except "Fn" key which is not traceable by OS.

## Future work
- integrate data from https://github.com/aschmelyun/use-the-keyboard
- prettify visual design
- fix: Ctrl+Shift cannot be saved in url
- Editor
  - save as gist on github
- KeyMouse layout
- sequence shortcuts
- replace dropdowns with lists
- icons for actions
- Highlight type of action: navigate, create, delete
  - with color, font type
- highlight type of element: character, line, file
- Compare layouts

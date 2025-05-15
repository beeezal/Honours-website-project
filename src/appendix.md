---
tags: [appendix, simulation, p5]
title: 'Appendix: How to run p5 sketches'
layout: 'base'
prevPage: '/bibliography/'
---
# Appendix: How to run p5 sketches

All methods mentioned, assume the reader knows how to copy and read code from a GitHub repository. Step 1 for all methods is keeping the desired sketch open in GitHub.

### 1. Using the interactive p5 web environment:

1. Open the web editor: [p5.js Web Editor](https://editor.p5js.org/)  
2. Copy the code just from the main source-code, i.e., sketch.js   
3. Paste it into the web editor (and save \- Ctrl+S works, to avoid losing it from your editor)  
4. Click on the Play icon to run the simulation \- shown beside the editor (named *Preview*)

NOTE: For some sketches (in ch:4,5) I will refer to global files in the repo directory. Check the accompanying index.html (in the same directory as the sketch) to ensure that all the files used are imported to the web editor. And referenced in the index.html file with the correct relative path

### 2. Locally using VSCode IDE (Preferred method by me):

1. Clone the entire repository into your local computer ([How to do that?](https://code.visualstudio.com/docs/sourcecontrol/intro-to-git#_clone-a-repository-locally)) \- you would also need to have [VSCode](https://code.visualstudio.com/docs/setup/windows#_install-vs-code-on-windows) and the [Git](https://git-scm.com/downloads/win) installed locally or just the folder containing the sketch you would like to run (in that case you do not need Git)   
2. Install the [P5 Server](https://marketplace.visualstudio.com/items?itemName=samplavigne.p5-vscode) extension in VSCode, this also auto-installs the *Live Server* extension \- which enables the user to host a local server in just one click.  
3. Right-click onto the corresponding index.html file and click *Open with Live Server* option \- this should automatically open a tab in your browser, which will run the simulation of the code  
4. Again be careful that all the .js files referenced in sketch.js are available locally on the computer, with the same directory. 

### 3. Locally through other means:

1. Technically all the written codes should run on any JS runtime environment, which can also locally host a web server. Since all the code only does the following:  
   1. Open a html file (index.html) with all the required libraries, stylesheet and most importantly our sketch.js within a \<script\> tag to run the code  
   2. While running the code, with the help of the p5 library, it notices that the code is supposed to run on the Canvas element defined using createCanvas( width and height ). And places this element at the origin of the \<div\> element it is in (usually just the screen) 

2. Therefore one could also manipulate the Canvas element to reposition, resize it, by naming it and accessing it within the html, and the p5.js file as [shown here](https://mzza.xyz/p5-pause-and-reset/)  
3. But, the exact methods for running the sketch files will differ according to the JS runtime chosen. So instructions will vary. 
# Drools Generator

```
IMPORTANT: mind the format: answer - next_question/final_sentence 

patch notes: you can now save your progress as json by clicking "Save as json" and load it by clicking browse... and choosing the file (this way your progress won't go away with a page refresh and is shareable)
```

## What is this?
It is a repo meant to facilitate the process of completeing the first project of Artificial Intelligence course on Poznan University of Technology.

The task is something along the lines of "Here you have a flowchart. Now make a drools program asking questions from it."

Example flowchart:
![Example flowchart](https://github.com/vulwsztyn/drools_generator/blob/master/readme_assets/Sci-fi&Fantasy.jpg?raw=true)

## How to use it?

1. Follow [this tutorial](https://wwu-pi.github.io/tutorials/lectures/lsp/030_install_drools.html)

1. Make sure that during the 6. step ("Create Test Project") you check the same options as on this screenshot:
![Create Test Project Screenshot](https://github.com/vulwsztyn/drools_generator/blob/master/readme_assets/Screenshot.png?raw=true)

1. Go to http://vulwsztyn.github.io/drools_generator, fill the decision tress according to your flowchart and press "Save", a rules.drl file should be downloaded

1. Clone this repo

1. Copy both files from to_copy directory to `your_eclipse_drools_projct_dir/src/main/java/com/sample` and remove previous contents of the folder

1. Replace `Sample.drl` file in `your_eclipse_drools_projct_dir/src/main/resources/rules` with `rules.drl` (not the contents, the file i.e. remove `Samples.drl` and copy `rules.drl` to it's directory)

1. Refactor the code so that all projects don't look the same

### Important note

[The website's](http://vulwsztyn.github.io/drools_generator) is a garbage code written in 2h to serve one purpose, I am aware that the website can and will crush on numerous occassions. Just try to stick to the syntax provided in the example (i.e. `answer - next_question/final_sentence`)

## (This) Project structure

`reamde_assets` - contains surprisingly this readme's assets

`to_copy` - equali astionishingly contains file to be copied

`react-editable-tree` - contain's the website's code appropriated from [this repository](https://github.com/svognev/react-editable-tree)

`whole_project` - contains a 'failsafe' if you are not able to create project in eclipse you can trust me that it will run and only replace `rules.drl` file in path specified above and just send it

## How to report bugs?

Create an issue, write me an email, or message me on fb.

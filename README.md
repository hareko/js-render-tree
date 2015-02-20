Render a tree of objects
========================

The Tree and TreeServ JavaScript classes allow to create and modify the tree structure front-end. 

The usage
---------

Call the script after the page load (see *index.html*):

**Tree([opts]);**

opts - the options object:

- cfm - confirm node deletion (*bool* type, default is no confirming);
- rcn - create the tree recursively (*bool* type, default is iteratively).

The *'command'* and *'tree'* sections with according id's must exist before calling. The default tree is created and first node is selected. 

Command set
-----------

Click the node to select it. The selected node has gray background. Click selected node again to deselect. The commands to handle the tree:

- Add - create a sub-node of selected node; if no nodes selected then the root node is created.

- Edit - rename the node.

- Delete - remove the node with it's sub-nodes.

- Save - save current tree to reload later.

- Restore - load the last saved tree.

The command buttons are available or disabled depending on the node selection. 

Modifying
---------

Add and Edit commands switch you into the Change status. Type in the node name and press Enter to save. Or press Esc to cancel. Save command requires HTML5 localStorage support. The tree state is saved under localStorage.treeState. Restore loads the default tree if nothing is saved.


The package
-----------

The following files are included:

1. *main.js* - Tree class; controls the tree activity;
2. *serv.js* - TreeServ class; supplies the tree contents;
3. *base.js* - common functionality;
4. *index.html* - demo page;
5. *style.css* - layout and tree styles;
6. *readme.md. - the file you are reading.

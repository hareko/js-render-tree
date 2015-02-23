Render a tree of objects
========================

The Tree and TreeServ JavaScript classes allow to create and change the tree structure front-end. 

The usage
---------

Call the script after the page load (see *index.html*):

**var tree = new Tree([opts]);**
**tree.Init([opts][,data]);**

opts - the options object:

- tro - tree object (*object*, default is id='tree')
- cmo - command set (*object*, default is id='command')
- cfm - confirm node deletion (*bool*, default is no confirming);
- rcn - create the tree recursively (*bool*, default is iteratively);
- pth - images url path.

The *'command'* and *'tree'* html sections with according id's must exist before calling. The default tree is created and first node is selected. 

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

Add and Edit commands switch you into the Change status. Type in the node name and press Enter to save. Or press Esc to cancel. Delete asks for confirmation if *cfm* option is *true*. Save command requires HTML5 localStorage support. The tree state is saved under *localStorage.treeState*. Restore loads the default tree if nothing is saved.

Testing
-------

The *index.html* demo shell displays default tree with the command set. You can select another tree structure in the *test.js*. Assign the tree definition array to the *treeData* variable and include the script tag into *index.html* head.

The package
-----------

The following files are included:

1. *main.js* - Tree class; controls the tree activity;
2. *serv.js* - TreeServ class; serves the tree changes;
3. *base.js* - common functionality;
4. *index.html* - demo shell;
5. *style.css* - layout and tree styles;
6. *test.js* - tree structure test data
7. *readme.md* - the file you are reading.

/*
 * Render a tree of objects
 * Tree configuration data
 * 
 * @package     Task
 * @author      Vallo Reima
 * @copyright   (C)2015
 */

/* tree definitions: [node,parent,text] */
var trees = {
    tree1: [
        [1, 0, 'Root 1'],
        [2, 0, 'Root 2'],
        [3, 1, 'Parent 1'],
        [4, 2, 'Parent 2'],
        [5, 3, 'Child 1'],
        [6, 4, 'Child 2'],
        [6, 5, 'Subchild 1'],
        [6, 5, 'Subchild 2']
    ],
    tree2: [
        [1, 0, 'Home'],
        [2, 0, 'Reports'],
        [3, 0, 'Register'],
        [4, 0, 'Maintain'],
        [5, 1, 'System'],
        [6, 1, 'About'],
        [7, 2, 'Persons'],
        [8, 2, 'Visits'],
        [9, 3, 'Guests'],
        [10, 3, 'Clients'],
        [11, 4, 'Names'],
        [12, 4, 'Credentials'],
        [13, 4, 'Preferences'],
        [14, 11, 'Posts'],
        [15, 11, 'Kinds'],
        [16, 12, 'Facebook'],
        [17, 12, 'Google'],
        [18, 12, 'Twitter']
    ]
};
var treeData = trees.tree1;   /*definition to use */

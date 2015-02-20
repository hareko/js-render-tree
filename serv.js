/*
 * Render a tree of objects
 * Create/Save/Restore the tree
 * 
 * @package     Task
 * @author      Vallo Reima
 * @copyright   (C)2015
 */


/**
 * @param {object} tro tree object
 * @param {string} pfx node id prefix
 * @param {object} ico knot icons
 */
function TreeServ(tro, pfx, ico) {
  /* default tree: [node,parent,text] */
  var data = [
    [1, 0, 'Root 1'],
    [2, 0, 'Root 2'],
    [3, 1, 'Parent 1'],
    [4, 2, 'Parent 2'],
    [5, 3, 'Child 1'],
    [6, 4, 'Child 2'],
    [6, 5, 'Subchild 1'],
    [6, 5, 'Subchild 2']
  ];
  var that = this;

  /**
   * create default tree
   * @param {bool} rcn -- true - CreateR
   * @return {int} node id increment
   */
  that.Create = function(rcn) {
    while (tro.firstChild) {  /* remove existing tree */
      tro.removeChild(tro.firstChild);
    }
    tro.setAttribute('id', pfx + 0);  /* tree id */
    if (rcn) {
      CreateR(0);
    } else {
      CreateI();
    }
    return data[data.length - 1][0];
  };

  /**
   * create default tree recursively
   * @param {string} pid parent id
   */
  var CreateR = function(pid) {
    var parent = $(pfx + pid);
    var el = document.createElement('ul');
    var ul = parent.appendChild(el);
    for (var d in data) {
      if (pfx + data[d][1] === parent.id) {
        el = document.createElement('li');
        var li = ul.appendChild(el);
        li.setAttribute('id', pfx + data[d][0]);
        el = document.createElement('span');
        var span = li.appendChild(el);
        var txt = document.createTextNode(data[d][2]);
        span.appendChild(txt);
        if (IsParent(data[d][0])) {
          that.Knot(li);
          CreateR(data[d][0]);
        }
      }
    }
  };

  /**
   * create default tree iteratively
   */
  var CreateI = function() {
    var el = document.createElement('ul');
    var ul = tro.appendChild(el);
    for (var d in data) {
      ul = $$(pfx + data[d][1], 'ul')[0];
      el = document.createElement('li');
      var li = ul.appendChild(el);
      li.setAttribute('id', pfx + data[d][0]);
      el = document.createElement('span');
      var span = li.appendChild(el);
      var txt = document.createTextNode(data[d][2]);
      span.appendChild(txt);
      if (IsParent(data[d][0])) {
        that.Knot(li);
        el = document.createElement('ul');
        li.appendChild(el);
      }
    }
  };

  /**
   * check the children exist
   * @param {int} id node id
   * @return {bool} 
   */
  var IsParent = function(id) {
    var f = false;
    for (var p in data) {
      if (data[p][1] === id) {
        f = true;
      }
    }
    return f;
  };

  /**
   * create knot element
   * @param {object} li knot object
   * @return {object} image
   */
  that.Knot = function(li) {
    var span = $$(li, 'span')[0];
    el = document.createElement('img');
    var img = li.insertBefore(el, span);
    img.setAttribute('alt', '+');
    img.setAttribute('src', ico['+']);
    return img;
  };

  /**
   * save the tree
   * @param {int} incr node increment
   * @param {string} slct node id
   */
  that.Save = function(incr, slct) {
    var d = new Date();
    var o = {
      weekday: "long", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    var state = {
      htm: $(pfx + 0).innerHTML,
      inc: incr,
      slt: slct,
      ver: d.toLocaleTimeString('en-us', o)
    };
    var treeState = JSON.stringify(state);
    localStorage.treeState = treeState;
    return localStorage.treeState === treeState;
  };

  /**
   * restore last-saved tree or default one
   * @return {object} state
   */
  that.Restore = function() {
    if (typeof(Storage) !== 'undefined' && localStorage.treeState) {
      var treeState = JSON.parse(localStorage.treeState);
      $(pfx + 0).innerHTML = treeState.htm;
      delete treeState.htm;
    } else {  /* take default */
      treeState = {ver: 'default version'};
      treeState.inc = that.Create();
      treeState.slt = $$(tro, 'span')[0].parentNode.id;
    }
    return treeState;
  };
}

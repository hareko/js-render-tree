/*
 * Render a tree of objects
 * Control, Manipulation
 * 
 * @package     Task
 * @author      Vallo Reima
 * @copyright   (C)2015
 */

/**
 * 
 * @param {object} parm
 *                  cfm -- true - confirm delete
 *                  rcn -- true - create tree recursively
 */
function Tree(parm) {
  var tro;  /* tree object */
  var tree; /* tree creator instance */
  var slct;  /* selected node object */
  var incr; /* node id increment value */
  var mode; /* S/A/M */
  var pfx = 'node_';  /* node id prefix */
  var cln = {sel: 'selected', ena: 'enabled'};  /* class names */
  var ico = {'+': 'open.gif', '-': 'close.gif'};  /* knot node icons */
  var msg = {
    cfm: 'Delete the node?',
    add: 'New node',
    nme: 'Enter valid name',
    nos: 'No storage support',
    svd: 'The tree is saved',
    rst: 'Tree is restored from:'
  };

  var Init = function() {
    tro = $('tree');  /* the tree object */
    tree = new TreeServ(tro, pfx, ico);
    incr = tree.Create(parm.rcn); /* build default tree */
    slct = $$(tro, 'span')[0];  /* select 1st node */
    slct.className = cln.sel;
    Mode('S');  /* selection status */
    AttachEventListener(tro, 'click', Click); /* listen for tree clicks */
    AttachEventListener($('command'), 'click', Command);  /* invoke commands */
  };

  /**
   * tree click event
   * @param {object} evt
   */
  var Click = function(evt) {
    var tgt = Target(evt);
    if (tgt && tgt.tagName) {
      var tag = tgt.tagName.toLowerCase();
    } else {
      tgt = '';
    }
    if (tag === 'span') {
      Select(tgt);  /* node click */
    } else if (tag === 'img') {
      Expand(tgt);  /* knot open/close */
    }
  };

  /**
   * process command
   * @param {object} evt - button click
   */
  var Command = function(evt) {
    var tgt = Target(evt);
    if (tgt) {
      var cmd = tgt.name;
    } else {
      cmd = '';
    }
    if (cmd === 'A') {
      Add();
    } else if (cmd === 'M') {
      Edit(slct.innerHTML);
      Mode('M');
    } else if (cmd === 'D') {
      if (!parm.cfm || confirm(msg.cfm + "\n" + slct.innerHTML)) {
        Delete();
      }
    } else if (cmd === 'S') {
      if (typeof(Storage) !== 'undefined') {
        var id = slct ? slct.parentNode.id : '';
        var m = tree.Save(incr, id) ? 'svd' : 'nos';
        alert(msg[m]);
      } else {
        alert(msg.nos);
      }
    } else if (cmd === 'R') {
      var state = tree.Restore();
      incr = state.inc;
      if (state.slt) {
        slct = $$(state.slt, 'span')[0];
      }
      alert(msg.rst + "\n" + state.ver);
      Mode('S');
    }
  };

  /**
   * create node
   */
  var Add = function() {
    if (slct === null) {
      var li = tro; /* add root node */
    } else {
      li = slct.parentNode;
      slct.className = '';
    }
    var img = $$(li, 'img');
    if (img.length === 0) { /* parent is leaf or missing */
      img = slct === null ? null : tree.Knot(li);
      var el = document.createElement('ul');
      li.appendChild(el);
      if (img) {
        Expand(img);  /* open the parent */
      }
    } else if (img[0].alt === '+') {
      Expand(img[0]);
    }
    var ul = $$(li, 'ul')[0];
    el = document.createElement('li');  /* create list element and text span */
    li = ul.appendChild(el);
    el = document.createElement('span');
    slct = li.appendChild(el);
    el = document.createTextNode('');
    slct.appendChild(el);
    Edit(msg.add);
    Mode('A');
  };

  /**
   * edit node name
   * @param {string} txt
   */
  var Edit = function(txt) {
    slct.className = 'hide';  /* hide node text */
    var el = document.createElement('input');
    var inp = slct.parentNode.insertBefore(el, slct);
    inp.setAttribute('type', 'text'); /* form input field */
    inp.focus();
    inp.setAttribute('value', txt);
    AttachEventListener(inp, 'keyup', Keyup); /* listen keystrokes */
  };

  /**
   * save node name
   */
  /**
   * check a phone suitability
   * @param {object} evt
   */
  var Keyup = function(evt)
  {
    var inp = Target(evt);
    var key = KeyCode(evt);
    if (key === 27) { /* Esc pressed */
      Cancel();
    } else if (key === 13 && !IsBlank(inp.value)) { /* Enter pressed with the text */
      Save();
    } else {
      inp.focus();
    }
    StopEvent(evt);
  };

  /**
   * delete node
   */
  var Delete = function() {
    var ul = slct.parentNode.parentNode;
    ul.removeChild(slct.parentNode);
    if (ul.parentNode.tagName.toLowerCase() !== 'li') { /* root node */
      var slt = $$(tro, 'span');
    } else {
      slt = $$(ul.parentNode, 'span');
      if (!ul.hasChildNodes()) {  /* remove knot if no more children */
        var li = ul.parentNode;
        li.removeChild($$(li, 'ul')[0]);
        li.removeChild($$(li, 'img')[0]);
      }
    }
    if (slt.length) {
      Select(slt[0]); /* select parent */
    } else {
      ul.parentNode.removeChild(ul);
      Mode('S'); /* tree is empty */
    }
  };

  /**
   * save node name
   */
  var Save = function() {
    var inp = $$(slct.parentNode, 'input')[0];
    if (!IsBlank(inp.value) && inp.value !== msg.add) { /* name exists and valid */
      DetachEventListener(inp, 'keyup', Keyup);
      slct.parentNode.removeChild(inp); /* remove input field */
      slct.innerHTML = inp.value;
      slct.className = cln.sel;
      if (mode === 'A') {
        incr++;
        slct.parentNode.setAttribute('id', pfx + incr); /* assign new id */
      }
      Mode('S');
    } else if (confirm(msg.nme)) {
      inp.focus();
    } else {
      Cancel();
    }
  };

  /**
   * cancel name edit
   */
  var Cancel = function() {
    if (mode === 'M') {
      var inp = $$(slct.parentNode, 'input')[0];  /* exit input */
      DetachEventListener(inp, 'keyup', Keyup);
      slct.parentNode.removeChild(inp);
    } else {
      var ul = slct.parentNode.parentNode;  /* remove added elements */
      var li = ul.parentNode;
      ul.removeChild(slct.parentNode);
      if ($$(ul, 'li').length === 0) {  /* it would be only subnode */
        li.removeChild(ul);
        var img = $$(li, 'img')[0];
        if (img) {  /* this is not root? */
          li.removeChild(img);
        }
      }
      slct = $$(li, 'span').length ? $$(li, 'span')[0] : null;
    }
    if (slct) {
      slct.className = cln.sel; /* select parent */
    }
    Mode('S');
  };

  /**
   * open/close node
   * @param {object} obj
   */
  var Expand = function(obj) {
    var alt = obj.alt === '-' ? '+' : '-';
    var ul = $$(obj.parentNode, 'ul')[0];
    ul.style.display = alt === '-' ? 'inline' : 'none';
    obj.setAttribute('alt', alt);
    obj.setAttribute('src', ico[alt]);
  };

  /**
   * (de)select node
   * @param {object} obj
   */
  var Select = function(obj) {
    if (mode === 'S') { /* if not modifying */
      if (slct === null) {
        slct = obj;
        slct.className = cln.sel; /* the nodes were deselected */
      } else if (slct.parentNode.id !== obj.parentNode.id) {
        slct.className = '';  /* switch selection */
        slct = obj;
        slct.className = cln.sel;
      } else {
        slct.className = '';  /* deselect */
        slct = null;
      }
      Mode('S');
    }
  };

  /**
   * show commands
   * @param {string} mde -- switch mode
   */
  var Mode = function(mde) {
    if (mde !== 'S') {
      var cmd = ''; /* modify status */
    } else if ($$(tro, 'li').length === 0) {
      slct = null;
      cmd = 'AR'; /* empty tree */
    } else if (slct === null) {
      cmd = 'ARS';  /* no nodes selected */
    } else {
      cmd = 'AMDRS';  /* selected node */
    }
    var cmds = $$('command', 'button');
    for (var i = 0; i < cmds.length; i++) {
      cmds[i].disabled = cmd.indexOf(cmds[i].name) === -1;
      cmds[i].className = cmds[i].disabled ? '' : cln.ena;
    }
    mode = mde;
  };

  Init();
}

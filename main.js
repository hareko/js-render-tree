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
 *                  tro -- tree div object
 *                  cmo -- commands div object
 *                  pth -- images url path
 *                  cfm -- true - confirm delete
 *                  rcn -- true - create tree recursively
 */
function Tree(parm) {
    var opts;   /* options object */
    var cmo;    /* commands object */
    var tro;    /* tree object */
    var serv;   /* service instance */
    var slct;   /* selected node object */
    var incr;   /* node id increment value */
    var mode;   /* S/A/M */
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

    /**
     * setup
     */
    opts = typeof parm === 'object' ? parm : {};
    var p = opts.pth ? opts.pth : '';   /* image path */
    for (var i in ico) {  /* preload images */
        var cc = ico[i];
        ico[i] = new Image();
        ico[i].src = p + cc;
    }

    /**
     * initialize the tree
     * @param {object} prm -- options 
     * @param {array} dat -- tree structure
     * @returns {object} -- TreeServ instance
     */
    this.Init = function (prm, dat) {
        if (typeof prm === 'object') {
            for (var p in prm) {
                opts[p] = prm[p];   /* override options */
            }
        }
        tro = typeof opts.tro === 'object' ? opts.tro : $('tree');
        cmo = typeof opts.cmo === 'object' ? opts.cmo : $('command');
        serv = new TreeServ(tro, pfx, ico);
        incr = serv.Create(opts.rcn, dat); /* build the tree */
        slct = $$(tro, 'span')[0];  /* select 1st node */
        slct.className = cln.sel;
        Mode('S');  /* selection status */
        AttachEventListener(tro, 'click', Click); /* listen for tree clicks */
        AttachEventListener(cmo, 'click', Command);  /* invoke commands */
        return serv;
    };

    /**
     * tree click event
     * @param {object} evt
     */
    var Click = function (evt) {
        var tgt = Target(evt);
        if (tgt && tgt.tagName) {
            var tag = tgt.tagName.toLowerCase();
        } else {
            tgt = '';
        }
        if (tag === 'span') {
            Select(tgt);  /* node click */
        } else if (tag === 'img') {
            serv.Expand(tgt);  /* knot open/close */
        }
    };

    /**
     * process command
     * @param {object} evt - button click
     */
    var Command = function (evt) {
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
            if (!opts.cfm || confirm(msg.cfm + "\n" + slct.innerHTML)) {
                Delete();
            }
        } else if (cmd === 'S') {
            if (typeof (Storage) !== 'undefined') {
                alert(Storage());
            } else {
                alert(msg.nos);
            }
        } else if (cmd === 'R') {
            Restore();
        }
    };

    /**
     * create node
     */
    var Add = function () {
        if (slct === null) {
            var li = tro; /* add root node */
        } else {
            li = slct.parentNode;
            slct.className = '';
        }
        slct = serv.Insert(li);
        Edit(msg.add);
        Mode('A');
    };

    /**
     * edit node name
     * @param {string} txt
     */
    var Edit = function (txt) {
        slct.className = 'hide';  /* hide node text */
        var el = document.createElement('input');
        var inp = slct.parentNode.insertBefore(el, slct);
        inp.setAttribute('type', 'text'); /* form input field */
        inp.focus();
        inp.setAttribute('value', txt);
        AttachEventListener(inp, 'keyup', Keyup); /* listen keystrokes */
    };

    /**
     * check edit keypress
     * @param {object} evt
     */
    var Keyup = function (evt) {
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
     * save node name
     */
    var Save = function () {
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
    var Cancel = function () {
        if (mode === 'M') {
            var inp = $$(slct.parentNode, 'input')[0];  /* exit input */
            DetachEventListener(inp, 'keyup', Keyup);
            slct.parentNode.removeChild(inp);
        } else {
            slct = serv.RollBack(slct);
        }
        if (slct) {
            slct.className = cln.sel; /* select parent */
        }
        Mode('S');
    };

    /**
     * delete node
     */
    var Delete = function () {
        var slt = serv.Remove(slct);
        if (slt.length) {
            Select(slt[0]); /* select parent */
        } else {
            Mode('S'); /* tree is empty */
        }
    };

    /**
     * save the tree
     * @return {string} message
     */
    Storage = function () {
        var slt = slct ? slct.parentNode.id : '';
        var d = new Date();
        var o = {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        var state = {
            htm: $(pfx + 0).innerHTML,
            inc: incr,
            slt: slt,
            ver: d.toLocaleTimeString('en-us', o)
        };
        var state = JSON.stringify(state);
        localStorage.treeState = state;
        var m = localStorage.treeState === state ? 'svd' : 'nos';
        return msg[m];
    };

    /**
     * restore last-saved tree or default one
     * @return {object} state
     */
    Restore = function () {
        if (typeof (Storage) !== 'undefined' && localStorage.treeState) {
            var state = JSON.parse(localStorage.treeState);
            $(pfx + 0).innerHTML = state.htm;
        } else {  /* take default */
            state = {ver: 'default version'};
            state.inc = serv.Create(opts.rcn);
            state.slt = $$(tro, 'span')[0].parentNode.id;
        }
        incr = state.inc;
        if (state.slt) {
            slct = $$(state.slt, 'span')[0];
        }
        alert(msg.rst + "\n" + state.ver);
        Mode('S');
    };

    /**
     * (de)select node
     * @param {object} obj
     */
    var Select = function (obj) {
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
    var Mode = function (mde) {
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
        var cmds = $$(cmo, 'button');
        for (var i = 0; i < cmds.length; i++) {
            cmds[i].disabled = cmd.indexOf(cmds[i].name) === -1;
            cmds[i].className = cmds[i].disabled ? '' : cln.ena;
        }
        mode = mde;
    };

}

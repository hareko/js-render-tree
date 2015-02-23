/*
 * Render a tree of objects
 * Service the tree changes
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

    var data;  /* tree structure */
    var def = [/* default tree: [node,parent,text] */
        [1, 0, 'Root 1'],
        [2, 0, 'Root 2'],
        [3, 1, 'Parent 1'],
        [4, 2, 'Parent 2'],
        [5, 3, 'Child 1'],
        [6, 4, 'Child 2']
    ];
    var that = this;

    /**
     * create default tree
     * @param {bool} rcn -- true - CreateR
     * @param {array} dat -- tree structure
     * @return {int} node id increment
     */
    that.Create = function (rcn, dat) {
        if (IsArray(dat)) { /* tree is specified */
            data = dat;
        } else if (typeof data === 'undefined') {
            data = def;     /* take default */
        }
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
    var CreateR = function (pid) {
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
                    Knot(li);
                    CreateR(data[d][0]);
                }
            }
        }
    };

    /**
     * create default tree iteratively
     */
    var CreateI = function () {
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
                Knot(li);
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
    var IsParent = function (id) {
        var f = false;
        for (var p in data) {
            if (data[p][1] === id) {
                f = true;
            }
        }
        return f;
    };

    /**
     * add a node
     * @param {object} pnt - parent node
     * @return {object} new node
     */
    that.Insert = function (pnt) {
        var img = $$(pnt, 'img');
        if (img.length === 0) { /* parent is leaf or missing */
            img = pnt === tro ? null : Knot(pnt);
            var el = document.createElement('ul');
            pnt.appendChild(el);
            if (img) {
                that.Expand(img);  /* open the parent */
            }
        } else if (img[0].alt === '+') {
            that.Expand(img[0]);
        }
        var ul = $$(pnt, 'ul')[0];
        el = document.createElement('li');  /* create list element and text span */
        var li = ul.appendChild(el);
        el = document.createElement('span');
        var span = li.appendChild(el);
        el = document.createTextNode('');
        span.appendChild(el);
        return span;
    };

    /**
     * remove a node 
     * @param {object} obj - node
     * @return {object} parent node
     */
    that.Remove = function (obj) {
        var ul = obj.parentNode.parentNode;
        ul.removeChild(obj.parentNode);
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
        if (slt.length === 0) {
            ul.parentNode.removeChild(ul);
        }
        return slt;
    };

    /**
     * restore pre-create  
     * @param {object} obj - node
     */
    that.RollBack = function (obj) {
        var ul = obj.parentNode.parentNode;  /* remove added elements */
        var li = ul.parentNode;
        ul.removeChild(obj.parentNode);
        if ($$(ul, 'li').length === 0) {  /* it would be only subnode */
            li.removeChild(ul);
            var img = $$(li, 'img')[0];
            if (img) {  /* this is not root? */
                li.removeChild(img);
            }
        }
        var slt = $$(li, 'span').length ? $$(li, 'span')[0] : null;
        return slt;
    };

    /**
     * open/close node
     * @param {object} obj
     */
    that.Expand = function (obj) {
        var alt = obj.alt === '-' ? '+' : '-';
        var ul = $$(obj.parentNode, 'ul')[0];
        ul.style.display = alt === '-' ? 'inline' : 'none';
        obj.setAttribute('alt', alt);
        obj.setAttribute('src', ico[alt].src);
    };

    /**
     * create knot element
     * @param {object} li knot object
     * @return {object} image
     */
    Knot = function (li) {
        var span = $$(li, 'span')[0];
        el = document.createElement('img');
        var img = li.insertBefore(el, span);
        img.setAttribute('alt', '+');
        img.setAttribute('src', ico['+'].src);
        return img;
    };
}

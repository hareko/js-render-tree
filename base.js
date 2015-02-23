/*
 * Render a tree of objects
 * Base functionality
 *
 * @package     Task
 * @author      Vallo Reima
 * @copyright   (C)2015
 */

/*
 *  Get element by Id
 */
function $(id, obj)
{
  if (typeof obj === 'undefined') {
    var o = document;
  } else {
    o = obj.document;
  }
  return id ? o.getElementById(id) : null;
}

/*
 *  Get elements by object tag name
 */
function $$(obj, tag)
{
  var o = (typeof obj === 'string') ? document.getElementById(obj) : obj;
  return o.getElementsByTagName(tag);
}

/*
 * Cross-browser method
 * in: target - element id
 *     eventType - click, ...
 *     functionRef - handler
 *     capture -- false - bubble (default)
 *                true - propagation
 */
function AttachEventListener(target, eventType, functionRef, capture)
{
  if (typeof capture === 'undefined') {
    capture = false;
  }
  if (target.addEventListener) {
    target.addEventListener(eventType, functionRef, capture);
  } else if (target.attachEvent) {
    target.attachEvent('on' + eventType, functionRef);
  } else {
    target['on' + eventType] = functionRef;
  }
}

function DetachEventListener(target, eventType, functionRef, capture)
{
  if (typeof capture === 'undefined') {
    capture = false;
  }
  if (target.removeEventListener) {
    target.removeEventListener(eventType, functionRef, capture);
  } else if (target.detachEvent) {
    target.detachEvent('on' + eventType, functionRef);
  } else {
    target['on' + eventType] = null;
  }
}

/*
 * Prevent the Default Action for an Event
 * in: event - object
 *     flag -- true - don't cancel bubble
 */
function StopEvent(event, flag)
{
  var e = event ? event : window.event;
  e.returnValue = false;
  if (flag !== true) {
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  return false;
}

function Target(e)
{
  return (window.event) ? e.srcElement : e.target;
}

function KeyCode(event)
{
  var e = event || window.event;
  return (e.which || e.keyCode || e.charCode);
//  return (e.keyCode ? e.keyCode : e.charCode);
}

/*
 *  Check string blankness
 */
function IsBlank(string)
{
  var blankRE = /^[\s]*$/;
  return blankRE.test(string);
}

function IsArray(varMixed) {
  return (typeof varMixed === 'object') && (varMixed instanceof Array);
}

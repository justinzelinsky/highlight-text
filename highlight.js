function highlight(start, end, node) {
  if (start > end) {
    $('.alert').css('display', 'block');
    return;
  } else {
    $('.alert').css('display', 'none');
  }
  replaceChildren(node, highlightRec(start, end, 0, node));
}

function replaceChildren(node, newChildren) {
  while (node.firstChild) node.removeChild(node.firstChild);
  for (var i = 0; i < newChildren.length; i++) {
    node.appendChild(newChildren[i]);
  }
}

function highlightRec(start, end, index, node) {
  var length = end - start;
  var newChildren = [];
  for (var i = 0; i < node.childNodes.length; i++) {
    var currentNode = node.childNodes[i];
    var currentString = currentNode.textContent;
    var currentStringLength = currentString.length;
    var lowerRange = index;
    var upperRange = currentStringLength + index - 1;
    if (currentString.trim() !== '') {
      if (currentNode.nodeType === 3) { // text node
        var highlightText, beforeText, afterText;
        var highlightNode = document.createElement('span');
        highlightNode.setAttribute('class', 'highlight');
        if (upperRange < start || lowerRange > end) { // all text is before the start position or after end position
          newChildren.push(currentNode);
        } else if (lowerRange < start && end >= upperRange) { // there is text before and within highlight zone
          beforeText = currentString.substring(0, start - index);
          highlightText = currentString.substring(start - index);
          highlightNode.appendChild(document.createTextNode(highlightText));

          newChildren.push(document.createTextNode(beforeText));
          newChildren.push(highlightNode);
        } else if (lowerRange < start && upperRange > end) { // there is text before and after as well as within highlight zone
          beforeText = currentString.substring(0, start - index);
          highlightText = currentString.substring(start - index, end - index + 1);
          afterText = currentString.substring(end - index + 1);
          highlightNode.appendChild(document.createTextNode(highlightText));

          newChildren.push(document.createTextNode(beforeText));
          newChildren.push(highlightNode);
          newChildren.push(document.createTextNode(afterText));
        } else if (lowerRange >= start && upperRange <= end) { // there is only text within highlight zone
          highlightText = currentString;
          highlightNode.appendChild(document.createTextNode(highlightText));

          newChildren.push(highlightNode);
        } else if (lowerRange >= start && lowerRange <= end && upperRange > end) { // there is text within highlight zone and after
          highlightText = currentString.substring(0, end - index + 1);
          afterText = currentString.substring(end - index + 1);
          highlightNode.appendChild(document.createTextNode(highlightText));

          newChildren.push(highlightNode);
          newChildren.push(document.createTextNode(afterText));
        }
      } else { // element node
        replaceChildren(currentNode, highlightRec(start, end, index, currentNode));
        newChildren.push(currentNode);
      }
      index = upperRange + 1;
    }
  }
  return newChildren;
}

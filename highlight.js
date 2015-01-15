function highlightRec(start, end, element) {
    if (start > end) {
        $('#error').text('Error: start index is before end index.');
        return;
    } else {
        $('#error').text('');
    }
    newChildren = highlight(start, end, 0, element);
    replaceChildren(element, newChildren);
}

function replaceChildren(element, newChildren) {
    while (element.firstChild) element.removeChild(element.firstChild);
    for (var i = 0; i < newChildren.length; i++) {
        element.appendChild(newChildren[i]);
    }
}

function highlight(start, end, index, element) {
    var length = end - start;
    var newChildren = [];
    for (var i = 0; i < element.childNodes.length; i++) {
        var currentNode = element.childNodes[i];
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
                replaceChildren(currentNode, highlight(start, end, index, currentNode));
                newChildren.push(currentNode);
            }
            index = upperRange + 1;
        }
    }
    return newChildren;
}
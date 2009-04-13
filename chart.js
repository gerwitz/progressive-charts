var columnWidth = 50;
var magnification = 2;

function drawCharts(rootElement, chartClass) {
	
	chartElements = getChildrenByClass(rootElement, chartClass);
	for (var i = 0; i < chartElements.length; i++) {
		if (chartElements[i].tagName == 'OL')
			drawAreaChartFromList(chartElements[i]);
	}
}

function drawAreaChartFromList(chartContainer) {
	var maxValue = 0;
	var minValue = 0;
	var background = "white";	// later reset to chartContainer.style.backgroundColor;
	var foreground = "gray";	// later reset to chartContainer.style.color;

	var container;
	var columns;
	var strut;
	var thisColumn, thisValue;
	var prevColumn, leftValue;
	var nextColumn, rightValue;
	var minValue, maxValue;
	var topPad;
	var leftSlant, rightSlant;
	var leftBottomPad, rightBottomPad;
	
	
	var chartWidth = chartContainer.clientWidth;
	
	if (chartContainer.style.backgroundColor != "") background = chartContainer.style.backgroundColor;
	if (chartContainer.style.color != "") foreground = chartContainer.style.color;
	
	columns = chartContainer.getElementsByTagName("LI");

    chartContainer.style.padding = 0;
    chartContainer.style.listStyle = "none";
	columnWidth = Math.floor(chartWidth / columns.length);
	
	for (var i = 0; i < columns.length; i++) {
        thisColumn = columns[i];
        thisValue = parseInt(thisColumn.title) * magnification;
        if (thisValue > maxValue) {
            maxValue = thisValue;
        }
        if (thisValue < minValue) {
            minValue = thisValue;
        }
    }

	leftSlantWidth = Math.round(columnWidth/2);
	rightSlantWidth = columnWidth - leftSlantWidth;
	
	for (var i = 0; i < columns.length; i++) {
        thisColumn = columns[i];
        thisValue = parseInt(thisColumn.title) * magnification;
        topValue = thisValue;
        bottomValue = thisValue;

		prevColumn = null;
		if (i > 0) {
	        prevColumn = columns[i - 1];
			prevValue = parseInt(prevColumn.title) * magnification;
            leftValue = Math.round((prevValue + thisValue)/2);
            topValue = Math.max(topValue, leftValue);
            bottomValue = Math.min(bottomValue, leftValue);
        }
        
		nextColumn = null;
		if (i < (columns.length - 1)) {
	        nextColumn = columns[i + 1];
			nextValue = parseInt(nextColumn.title) * magnification;
            rightValue = Math.round((nextValue + thisValue)/2);
            topValue = Math.max(topValue, rightValue);
            bottomValue = Math.min(bottomValue, rightValue);
        }

	    chartContainer.style.height = maxValue;

		prepareColumn(thisColumn, columnWidth);

		// make the pieces
		topPad = buildPad(columnWidth, (maxValue - topValue), background);

		if (prevColumn) {
			leftSlant = buildSlant((leftValue-bottomValue), (thisValue-bottomValue), (topValue-bottomValue), leftSlantWidth, background, foreground);
			leftBottomPad = buildPad(leftSlantWidth, bottomValue, foreground);
        }
		else {
			leftSlant = buildPad(leftSlantWidth, (topValue-bottomValue), background);
			leftBottomPad = buildPad(leftSlantWidth, bottomValue, background);
        }

		if (nextColumn) {
			rightSlant = buildSlant((thisValue-bottomValue), (rightValue-bottomValue), (topValue-bottomValue), rightSlantWidth, background, foreground);
			rightBottomPad = buildPad(rightSlantWidth, bottomValue, foreground);
        }
		else {
			rightSlant = buildPad(rightSlantWidth, (topValue-bottomValue), background);
			rightBottomPad = buildPad(rightSlantWidth, bottomValue, background);
        }

		// don't muck with this order.
		thisColumn.insertBefore(rightBottomPad,  thisColumn.firstChild);
		thisColumn.insertBefore(leftBottomPad,  rightBottomPad);
		thisColumn.insertBefore(rightSlant, leftBottomPad);
		thisColumn.insertBefore(leftSlant, rightSlant);
        thisColumn.insertBefore(topPad, leftSlant);
    }
}

function buildSlant(leftPoint, rightPoint, height, width, background, foreground) {

    var topBorderSize, rightBorderSize, bottomBorderSize, leftBorderSize;
    var topBorderColor, rightBorderColor, bottomBorderColor, leftBorderColor;
    var slant;

    topBorderColor = background;
    bottomBorderColor = foreground;

    if (leftPoint == 0) {
        // upward from bottom
        topBorderSize = new String(height - rightPoint);
        rightBorderSize = new String(0);
        bottomBorderSize = new String(rightPoint);
        leftBorderSize = new String(width);
        rightBorderColor = foreground;
        leftBorderColor = background;
    }
    else if (leftPoint == height) {
        // downward from top
        topBorderSize = new String(height - rightPoint);
        rightBorderSize = new String(0);
        bottomBorderSize = new String(rightPoint);
        leftBorderSize = new String(width);
        rightBorderColor = background;
        leftBorderColor = foreground;
    }
    else if (rightPoint == 0) {
        // downward to bottom
        topBorderSize = new String(height - leftPoint);
        rightBorderSize = new String(width);
        bottomBorderSize = new String(leftPoint);
        leftBorderSize = new String(0);
        rightBorderColor = background;
        leftBorderColor = foreground;
    }
    else if (rightPoint == height) {
        // upward to top
        topBorderSize = new String(height - leftPoint);
        rightBorderSize = new String(width);
        bottomBorderSize = new String(leftPoint);
        leftBorderSize = new String(0);
        rightBorderColor = foreground;
        leftBorderColor = background;
    }
    else {
        alert("Not sure how to draw from " + leftPoint + " to " + rightPoint + " in " + height + " pixels.");
    }

    slant = document.createElement("DIV");

    slant.style.borderStyle = "solid";
	slant.style.borderTopWidth = topBorderSize;
	slant.style.borderRightWidth = rightBorderSize;
	slant.style.borderBottomWidth = bottomBorderSize;
	slant.style.borderLeftWidth = leftBorderSize;
	slant.style.borderTopColor = topBorderColor;
	slant.style.borderRightColor = rightBorderColor;
	slant.style.borderBottomColor = bottomBorderColor;
	slant.style.borderLeftColor = leftBorderColor;
    slant.style.lineHeight = 0;
    slant.style.width = 0;
    slant.style.height = 0;
	slant.style.display = "inline";
	slant.style.cssFloat = "left";
	slant.style.styleFloat = "left";
	slant.style.margin = 0;

    return(slant);
}


function prepareColumn(thisColumn, columnWidth) {

	if ( thisColumn.style ) {
        thisColumn.style.display = "inline";
		thisColumn.style.cssFloat = "left";
		thisColumn.style.styleFloat = "left";
        thisColumn.style.clear = "none";
        thisColumn.style.padding = 0;
        thisColumn.style.margin = 0;
        thisColumn.style.border = 0;
        thisColumn.style.textAlign = "center";
        thisColumn.style.width = columnWidth;
	}
}

function buildPad(width, height, color) {
	padElement = document.createElement("DIV");

	padElement.style.display = "inline";
	padElement.style.cssFloat = "left";
	padElement.style.styleFloat = "left";
	padElement.style.backgroundColor = color;
	padElement.style.margin = 0;
	padElement.style.border = 0;
	padElement.style.padding = 0;
	padElement.style.width = width;
	padElement.style.height = height;
	
	return(padElement);
}

function getChildrenByClass(theElement, theClass) {
    var allChildren;
    allChildren = theElement.all ? theElement.all : theElement.getElementsByTagName("*");
    var matchingCount = 0;
    var matchingChildren = Array();
    var thisChild, thisClass;
    
    for (var i = 0; i < allChildren.length; i++) {
        thisChild = allChildren[i];
        thisClass = thisChild.className ? thisChild.className : "";
        if (thisClass == theClass) {
            matchingChildren[matchingCount] = thisChild;
            matchingCount++;
        }
    }
    return(matchingChildren);
}

drawCharts(document, "chart");


//////////////////////////////////////////////////////////////////////
// Author: Michael Redmond
// E-mail: redmond@lasalle.edu
// Written: July, 7, 2014
// Purpose: 2048 game based on well known game by Gabriele Cirulli
// (found at gabrielecirulli.github.io/2048/ )
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
/// Global variables
///////////////////////////////////////////////////////////////////////////

/// array holding the values of tiles on the board. Zero is empty
var tiles = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

// best score must be global to carry over from game to game
// score could have been calculated by adding to value from GUI each time
var score = 0;
var bestScore = 0;

/// timer - for extra color change in background
var backgroundColorTimer;  // made global so that can be accessed from cancel button if added

/// generate a random number between min and max
function GenerateNumber(min, max) {
    var myTarget;
    myTarget = Math.floor(Math.random() * ((max + 1) - min)) + min;

    // Math.random() generates a "pseudo-random" number between 0 and 1
    // http://www.w3schools.com/jsref/jsref_random.asp

    // Math.floor(x) gives the highest integer that is less than or equal to x 
    // E.g. Math.floor(3.4) is 3 and Math.floor(4.9) is 4 
    // http://www.w3schools.com/jsref/jsref_floor.asp
    return myTarget;
}

//// probability of a 4 is .... for now let's say 1/10 - it doesn't seem like it happens very often.
//// I couldn't find any source telling how often. (and didn't try to read the actual game's source code)
function generateNewTileValue() {
    var rand = GenerateNumber(1, 10);
    // one of the ten possible values
    if (rand == 1) {
        return 4;
    }
    else {
        return 2;
    }

}

/// returns whether board is full
function boardIsFull() {
    var full = true;
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            if (tiles[row][col] == 0) {
                // if there's an empty spot, the board is not full
                full = false;
                return false;  // short cut it to save a little time
            }
        }
    }
    return full;
}

/// changes the tiles array - putting a new randomly placed tile
/// returns false if there is no place left to generate
function generateNextTile() {
    if (boardIsFull()) {
        return false;
    }
    // randomly generate tile to have a two (or 4)
    var gotOne = false;
    var val1 = 2;
    // loop until generating a position that is actually empty
    while (!gotOne) {
        var row = GenerateNumber(0, 3);
        var col = GenerateNumber(0, 3);
        //alert("row: " + row + " col: " + col + " tiles: " + tiles[row][col]);
        if (tiles[row][col] == 0) {
            gotOne = true;
        }
    }
    var val1 = generateNewTileValue();

    // clear other borders
    for (var rw = 0; rw < 4; rw++) {
        for (var cl = 0; cl < 4; cl++) {
            document.getElementById("Text" + rw + cl).style.borderColor = "rgb(51,51,51)";
        }
    }
    // color the new tile border red
    document.getElementById("Text" + row + col).style.borderColor = "rgb(255,0,0)";

    // update the board
    tiles[row][col] = val1;
    return true;
}  


/// background color is based on value
/// not exactly the same as in the real program
/// In fact, I don't like that in the real game everything high just 
/// is slightly different
/// Don't handle if anybody goes over 2048
function getBackgroundColorForValue(val) {
    var newColor = "rgb(";
    switch (val) {
        case 0:
            newColor += "212,212,212)";
            break;
        case 2:
            newColor += "245,245,245)";
            break;
        case 4:
            newColor += "252,232,131)";
            break;
        case 8:
            newColor += "255,204,153)";
            break;
        case 16:
            newColor += "244,164,96)";
            break;
        case 32:
            newColor += "255,100,100)";
            break;
        case 64:
            newColor += "255,0,0)";
            break;
        case 128:
            newColor += "238,221,130)";
            break;
        case 256:
            newColor += "255,215,0)";
            break;
        case 512:
            newColor += "25,25,100)";
            break;
        case 1024:
            newColor += "10,10,150)";
            break;
        case 2048:
            newColor += "0,0,255)";
            break;
        default:
            // anything beyond 2048 will get almost black background
            newColor += "12,12,12)";
            break;
    }
    return newColor;
}


/// foreground color is based on value
/// Don't handle if anybody goes over 2048
function getTextColorForValue(val) {
    var newColor = "rgb(";
    switch (val) {
        case 0:
            // doesn't matter - there shouldn't be any text
            newColor += "0,0,0)";
            break;
        case 2:
            newColor += "12,12,12)";
            break;
        case 4:
            newColor += "24,24,24)";
            break;
        case 8:
            newColor += "255,255,255)";
            break;
        case 16:
            newColor += "255,255,255)";
            break;
        case 32:
            newColor += "255,255,255)";
            break;
        case 64:
            newColor += "255,255,255)";
            break;
        case 128:
            newColor += "255,255,255)";
            break;
        case 256:
            newColor += "255,255,255)";
            break;
        case 512:
            newColor += "255,255,255)";
            break;
        case 1024:
            newColor += "255,255,255)";
            break;
        case 2048:
            newColor += "255,255,255)";
            break;
        default:
            // anything beyong 2048 will get red text
            newColor += "255,0,0)";
            break;
    }
    return newColor;
}


/// text size is based on value
/// Don't handle if anybody goes over 10,000
function getTextSizeForValue(val) {
    var newSize = 100;   // default
    if (val >= 1000) {
        newSize = 30;
    }
    else if (val >= 100) {
        newSize = 60;
    }
    else if (val >= 10) {
        newSize = 75;
    }
    else {
        /// stick with default
    }
    return newSize + "px";
}


/// clear all tiles in board
function clearBoard() {
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            tiles[row][col] = 0;
        }
    }
}

    // diaply the board - doesn't do the animation - the sliding look
    function displayBoard() {
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                // build name of the text field - uses trick of naming the input html element using rol and column numbers
                var elem = "Text" + row + col;
                /// check if empty space
                if (tiles[row][col] == 0) {
                    document.getElementById(elem).value = "";
                    document.getElementById(elem).style.backgroundColor = getBackgroundColorForValue(tiles[row][col]);
                    document.getElementById(elem).style.fontSize = "75px";
                }
                else {
                    // non-empty - how displayed depends on number in tile
                    document.getElementById(elem).value = tiles[row][col];
                    document.getElementById(elem).style.backgroundColor = getBackgroundColorForValue(tiles[row][col]);
                    document.getElementById(elem).style.color = getTextColorForValue(tiles[row][col]);
                    var size = getTextSizeForValue(tiles[row][col]);
                    //document.getElementById(elem).style.width = size;
                    //document.getElementById(elem).style.height = size;
                    document.getElementById(elem).style.fontSize = size;
                }
            }
        }
    }


/// handle click of start button
    function btnStart_onclick() {
        /// reset score and clear board
        score = 0;
        document.getElementById("txtScore").value = "0";
        clearBoard();
        // randomly generate two tiles to have a two or 4
        var gotOne = false;
        var val1 = 2;
        // loop until generating a position that is actually empty
        while (!gotOne) {
            var row = GenerateNumber(0, 3);
            var col = GenerateNumber(0, 3);
            //alert("row: " + row + " col: " + col + " tiles: " + tiles[row][col]);
            if (tiles[row][col] == 0) {
                gotOne = true;
            }
        }
        var val1 = generateNewTileValue();
        tiles[row][col] = val1;

        var gotTwo = false;
        var val2 = 2;
        // loop until generating a position that is actually empty - and NOT the one just generated above
        while (!gotTwo) {
            var row2 = GenerateNumber(0, 3);
            var col2 = GenerateNumber(0, 3);
            if ((tiles[row2][col2] == 0) && ((row != row2) || (col != col2))) {
                gotTwo = true;
            }
        }
        var val2 = generateNewTileValue();
        tiles[row2][col2] = val2;

        displayBoard();
        // don't let user re-start without hitting new game button
        document.getElementById("btnStart").disabled = true;
        document.getElementById("btnNewGame").disabled = false;

        /// extra piece using timer to change the background color of the page
        backgroundColorTimer = setInterval(changeBackground, 10000);

        // put focus on the text that owns the keydown event handler so that event is caught
        document.getElementById('move2').focus();
    }


/// handle click of New Game button
    function btnNewGame_onclick() {
        //alert(" New Game? I don't do that yet!");  // stub until written
        /// reset the score to zero
        score = 0;
        document.getElementById("txtScore").value = "" + score;
        // turn page brackground to white
        document.getElementById("everything").style.backgroundColor = "rgb(255,255,255)";
        // stop timer so it doesn't go twice as often
        clearInterval(backgroundColorTimer);
        // clear and redisplay board
        clearBoard();
        displayBoard();
        // let user start 
        document.getElementById("btnStart").disabled = false;
        // don't let user restart 
        document.getElementById("btnNewGame").disabled = true;
    }


    function init() {
        // test stub - tried out different ways of handling key events
        // document.getElementById('move2').onkeydown = khandle
        // test key handling with anonymous function
        // dynamicHandler();

        // set up keydown event handler
        document.getElementById('move2').onkeydown = handleKey
    }



/// move all non-empty tiles as far left as they can go without collapsing matching values
/// didn't try to do all shifts with one function because I don't visualize rotations well
    function shiftLeft() {
        //alert("not ready yet");
        var anyChangeAtAll = false;
        /// loop through all rows - handle one row at a time
        for (var row = 0; row < 4; row++) {
            // process row
            for (var col = 0; col < 3; col++) {
                var anyChange = true;  // force going into the loop first time
                /// if any move works come back again to see if change still needed
                while (anyChange) {
                    anyChange = false; // default to no change
                    if (tiles[row][col] == 0) {
                        // empty spot
                        var toFill = col;
                        // loop through rest of row moving
                        for (var col2 = col + 1; col2 < 4; col2++) {
                            /// moving a zero isn't a real move - check that
                            if (tiles[row][col2] != 0) {
                                anyChange = true;
                                anyChangeAtAll = true;
                            }
                            tiles[row][toFill] = tiles[row][col2];
                            toFill++;
                        }
                        // last spot becomes empty
                        tiles[row][3] = 0;
                    }
                }

            }
        }
        return anyChangeAtAll;
    }



/// move all non-empty tiles as far right as they can go without collapsing matching values
/// didn't try to do all shifts with one function because I don't visualize rotations well
    function shiftRight() {
        //alert("not ready yet");
        var anyChangeAtAll = false;
        /// loop through all rows - handle one row at a time
        for (var row = 0; row < 4; row++) {
            // process row
            for (var col = 3; col > 0; col--) {
                var anyChange = true;  // force going into the loop first time
                /// if any move works come back again to see if change still needed
                while (anyChange) {
                    anyChange = false; // default to no change
                    if (tiles[row][col] == 0) {
                        // empty spot
                        var toFill = col;
                        // loop through rest of row moving
                        for (var col2 = col - 1; col2 >= 0; col2--) {
                            /// moving a zero isn't a real move - check that
                            if (tiles[row][col2] != 0) {
                                anyChange = true;
                                anyChangeAtAll = true;
                            }
                            tiles[row][toFill] = tiles[row][col2];
                            toFill--;
                        }
                        // last spot becomes empty
                        tiles[row][0] = 0;
                    }
                }

            }
        }
        return anyChangeAtAll;
    }


/// move all non-empty tiles as far up as they can go without collapsing matching values
/// didn't try to do all shifts with one function because I don't visualize rotations well
    function shiftUp() {
        //alert("not ready yet");
        var anyChangeAtAll = false;
        /// loop through all columns - handle one column at a time
        for (var col = 0; col < 4; col++) {
            // process column
            for (var row = 0; row < 3; row++) {
                var anyChange = true;  // force going into the loop first time
                /// if any move works come back again to see if change still needed
                while (anyChange) {
                    anyChange = false; // default to no change
                    if (tiles[row][col] == 0) {
                        // empty spot
                        var toFill = row;
                        // loop through rest of column moving
                        for (var row2 = row + 1; row2 < 4; row2++) {
                            /// moving a zero isn't a real move - check that
                            if (tiles[row2][col] != 0) {
                                anyChange = true;
                                anyChangeAtAll = true;
                            }
                            tiles[toFill][col] = tiles[row2][col];
                            toFill++;
                        }
                        // last spot becomes empty
                        tiles[3][col] = 0;
                    }
                }

            }
        }
        return anyChangeAtAll;
    }


/// move all non-empty tiles as far up as they can go without collapsing matching values
/// didn't try to do all shifts with one function because I don't visualize rotations well
    function shiftDown() {
        //alert("not ready yet");
        var anyChangeAtAll = false;
        /// loop through all columns - handle one column at a time
        for (var col = 0; col < 4; col++) {
            // process column
            for (var row = 3; row > 0; row--) {
                var anyChange = true;  // force going into the loop first time
                /// if any move works come back again to see if change still needed
                while (anyChange) {
                    anyChange = false; // default to no change
                    if (tiles[row][col] == 0) {
                        // empty spot
                        var toFill = row;
                        // loop through rest of column moving
                        for (var row2 = row - 1; row2 >= 0; row2--) {
                            /// moving a zero isn't a real move - check that
                            if (tiles[row2][col] != 0) {
                                anyChange = true;
                                anyChangeAtAll = true;
                            }
                            tiles[toFill][col] = tiles[row2][col];
                            toFill--;
                        }
                        // last spot becomes empty
                        tiles[0][col] = 0;
                    }
                }

            }
        }
        return anyChangeAtAll;
    }




//// merge matching tiles left - any tile can only merge once in a move.
//// Assumes shiftLeft has already been called
//// 2 2 4 8 ==> 4 4 8 0  (NOT 16 0 0 0 )
//// 4 4 4 4 ==> 8 8 0 0
//// 2 4 4 0 ==> 2 8 0 0
    function mergeLeft() {
        //alert("not ready yet");
        var anyChangeAtAll = false;
        /// loop through all rows - handle one row at a time
        for (var row = 0; row < 4; row++) {
            // process row
            /// loop through all columns
            for (var col = 0; col < 3; col++) {
                var toCompare = col + 1;
                // check for matching tiles
                if ((tiles[row][col] != 0) && (tiles[row][col] == tiles[row][toCompare])) {
                    // found match - collapse
                    anyChangeAtAll = true;
                    // score will get the value of the newly merged tile added
                    // also check for new high score
                    score += 2 * tiles[row][col];
                    if (score > bestScore) {
                        bestScore = score;
                    }
                    tiles[row][col] = 2 * tiles[row][col];
                    // bump rest of row over
                    var colToFill = toCompare;
                    for (var toMove = toCompare + 1; toMove < 4; toMove++) {
                        tiles[row][colToFill] = tiles[row][toMove];
                        colToFill++;
                    }
                    // fill last spot
                    tiles[row][3] = 0;
                }
            }
        }
        return anyChangeAtAll;
    }


//// merge matching tiles right - any tile can only merge once in a move.
//// Assumes shiftRight has already been called
    function mergeRight() {
        //alert("not ready yet");
        var anyChangeAtAll = false;
        /// loop through all rows - handle one row at a time
        for (var row = 0; row < 4; row++) {
            // process row
            /// loop through all columns
            for (var col = 3; col > 0; col--) {
                var toCompare = col - 1;
                // check for matching tiles
                if ((tiles[row][col] != 0) && (tiles[row][col] == tiles[row][toCompare])) {
                    // found match - collapse
                    anyChangeAtAll = true;
                    // score will get the value of the newly merged tile added
                    // also check for new high score
                    score += 2 * tiles[row][col];
                    if (score > bestScore) {
                        bestScore = score;
                    }
                    tiles[row][col] = 2 * tiles[row][col];
                    // bump rest of row over
                    var colToFill = toCompare;
                    for (var toMove = toCompare - 1; toMove >= 0; toMove--) {
                        tiles[row][colToFill] = tiles[row][toMove];
                        colToFill--;
                    }
                    // fill last spot
                    tiles[row][0] = 0;
                }
            }
        }
        return anyChangeAtAll;
    }



//// merge matching tiles up - any tile can only merge once in a move.
//// Assumes shiftUp has already been called
    function mergeUp() {
        //alert("not ready yet");
        var anyChangeAtAll = false;
        /// loop through all columns - handle one column at a time
        for (var col = 0; col < 4; col++) {
            // process column - loop through all rows
            for (var row = 0; row < 3; row++) {
                var toCompare = row + 1;
                // check for matching tiles
                if ((tiles[row][col] != 0) && (tiles[row][col] == tiles[toCompare][col])) {
                    // found match - collapse
                    anyChangeAtAll = true;
                    // score will get the value of the newly merged tile added
                    // also check for new high score
                    score += 2 * tiles[row][col];
                    if (score > bestScore) {
                        bestScore = score;
                    }
                    tiles[row][col] = 2 * tiles[row][col];
                    // bump rest of column up
                    var rowToFill = toCompare;
                    for (var toMove = toCompare + 1; toMove < 4; toMove++) {
                        tiles[rowToFill][col] = tiles[toMove][col];
                        rowToFill++;
                    }
                    // fill last spot
                    tiles[3][col] = 0;
                }
            }
        }
        return anyChangeAtAll;
    }


//// merge matching tiles down - any tile can only merge once in a move.
//// Assumes shiftDown has already been called
    function mergeDown() {
        //alert("not ready yet");
        var anyChangeAtAll = false;
        /// loop through all columns - handle one column at a time
        for (var col = 0; col < 4; col++) {
            // process column - loop through all rows
            for (var row = 3; row > 0; row--) {
                var toCompare = row - 1;
                // check for matching tiles
                if ((tiles[row][col] != 0) && (tiles[row][col] == tiles[toCompare][col])) {
                    // found match - collapse
                    anyChangeAtAll = true;
                    // score will get the value of the newly merged tile added
                    // also check for new high score
                    score += 2 * tiles[row][col];
                    if (score > bestScore) {
                        bestScore = score;
                    }
                    tiles[row][col] = 2 * tiles[row][col];
                    // bump rest of column down
                    var rowToFill = toCompare;
                    for (var toMove = toCompare - 1; toMove >= 0; toMove--) {
                        tiles[rowToFill][col] = tiles[toMove][col];
                        rowToFill--;
                    }
                    // fill last spot
                    tiles[0][col] = 0;
                }
            }
        }
        return anyChangeAtAll;
    }



/// handle move when left arrow key pressed
    function handleLeft() {
        var shifted = shiftLeft();
        var anyMerge = mergeLeft();
        // only worked if were able to shift or collapse
        if ((shifted == true) || (anyMerge == true)) {
            return true;
        }
        else {
            return false;
        }
    }


/// handle move when right arrow key pressed
    function handleRight() {
        var shifted = shiftRight();
        var anyMerge = mergeRight();
        // only worked if were able to shift or collapse
        if ((shifted == true) || (anyMerge == true)) {
            return true;
        }
        else {
            return false;
        }
    }


/// handle move when up arrow key pressed
    function handleUp() {
        var shifted = shiftUp();
        var anyMerge = mergeUp();
        // only worked if were able to shift or collapse
        if ((shifted == true) || (anyMerge == true)) {
            return true;
        }
        else {
            return false;
        }
    }


/// handle move when down arrow key pressed
    function handleDown() {
        var shifted = shiftDown();
        var anyMerge = mergeDown();
        // only worked if were able to shift or collapse
        if ((shifted == true) || (anyMerge == true)) {
            return true;
        }
        else {
            return false;
        }
    }

    function handleKey(e) {
        // what does the next line of code do?
        // answer:
        //     e || window.event 
        // Will use a passed event if one was passed, otherwise it will check the window for the event. The statement
        // means that if 'e' is a defined value, it will be the result of the '||' expression. 
        ///     If 'e' is not defined, 'window.event' will be the result of the '||' expression. 
        // So it's basically shorthand for:  e = e ? e : window.event; 
        // Or: if (typeof(e) === "undefined") { e = window.event; }  
        // –  Michael Calvin Dec 17 '13 at 20:35 
        //       on stackoverflow.com - a good site for programming questions
        e = e || event
        var somethingMoved = false;
        switch (e.keyCode) {
            case 37: // left 
                //alert("left");
                somethingMoved = handleLeft();
                break;
            case 38: // up 
                //alert("up");
                somethingMoved = handleUp();
                break;
            case 39: // right 
                //alert("right");
                somethingMoved = handleRight();
                break;
            case 40: // down 
                //alert("down");
                somethingMoved = handleDown();
                break;
            default:
                alert("ignoring " + e.keyCode);
        }

        // MAR - one change needed - if they chose a direction that no movement is possible, no generation of new tile etc
        // but wait - was using not being able to generate a new tile as a sign that they lost
        // EXCEPT - there might be a different move (different direction) possible.
        // The real game looks ahead and detemines if you don't have any moves.
        if (somethingMoved == true) {
            /// display latest score and best score
            document.getElementById("txtScore").value = "" + score;
            document.getElementById("txtBestScore").value = "" + bestScore;
            /// try to generate a new tile
            var gotNext = generateNextTile();
            if (gotNext) {
                // redisplay board - and make sure focus on the html element that is listening for key press
                displayBoard();
                document.getElementById('move2').focus();
            }
            else {
                // lose
                // I think this is dead code here - if something moved then we should be able to generate a new tile
                alert("You may have lost!");
            }
        }
        else {
            // nothing moved 
            if (boardIsFull()) {
                // lose? - only if can't go in any of the four directions - there might be collapses available
                alert("You may have lost!! Try other directions");
            }
            else {
                alert("no room to move in that direction");
            }
        }
        return false;
    }




    /* runs when the page is being loaded */
    window.onload = function () {
        init();
        /* book likes to establish the event handler dynamically in JavaScript rather than statically in the html 
        $("calculate").onclick = calculate_everything_for_click;       // was calculate_click - showing what goes with what 
        */
        // put cursor in subtotal text field
        // document.getElementById("times").focus();
    
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Below was just for the extra color timer that I added just for fun
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// make the page's background color slightly darker
// Timer will call this every .... milliseconds (set in start button)
    function changeBackground() {
        var newColor = addColorToElement("everything", -1, -1, -1);
        //alert(newColor);
        document.getElementById("everything").style.backgroundColor = newColor;
    }


    /// obtain the amount of red in the background color of an html element
    function getRedAmount(elem) {
        var redamt = window.getComputedStyle(document.getElementById(elem), null).getPropertyCSSValue("background-color").getRGBColorValue().red.getFloatValue(CSSPrimitiveValue.CSS_NUMBER);
        return redamt;
    }


    /// obtain the amount of blue in the background color of an html element
    function getBlueAmount(elem) {
        var blueamt = window.getComputedStyle(document.getElementById(elem), null).getPropertyCSSValue("background-color").getRGBColorValue().red.getFloatValue(CSSPrimitiveValue.CSS_NUMBER);
        return blueamt;
    }


    /// obtain the amount of green in the background color of an html element
    function getGreenAmount(elem) {
        var greenamt = window.getComputedStyle(document.getElementById(elem), null).getPropertyCSSValue("background-color").getRGBColorValue().red.getFloatValue(CSSPrimitiveValue.CSS_NUMBER);
        return greenamt;
    }

    /// given an html element, adds the passed amount of red, blue, and green
    /// maxing them out if they go above 255
    /// returns a string that can be assigned into the background color of an html element
    function addColorToElement(element, r, g, b) {
        var redAmount = getRedAmount(element);
        var greenAmount = getGreenAmount(element);
        var blueAmount = getBlueAmount(element);
        redAmount += r;
        greenAmount += g;
        blueAmount += b;
        // check for too high
        if (redAmount > 255) {
            redAmount = 255;
        }
        if (greenAmount > 255) {
            greenAmount = 255;
        }
        if (blueAmount > 255) {
            blueAmount = 255;
        }
        // check for too low
        if (redAmount < 0) {
            redAmount = 0;
        }
        if (greenAmount < 0) {
            greenAmount = 0;
        }
        if (blueAmount < 0) {
            blueAmount = 0;
        }
        //var newColor = RGBColor(redAmount, greenAmount, blueAmount);
        var newColor = "rgb(" + redAmount + "," + greenAmount + "," + blueAmount + ")";
        return newColor;
    }



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Below was trying out different handling of key events
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/// test stub - shows that can get info about what key was pressed
/// From: http://javascript.info/tutorial/keyboard-events 
    function khandle(e) {
        e = e || event

        var evt = e.type
        while (evt.length < 10) evt += ' '
        alert(evt +
          " keyCode=" + e.keyCode +
          " which=" + e.which +
          " charCode=" + e.charCode +
          " char=" + String.fromCharCode(e.keyCode || e.charCode) +
          (e.shiftKey ? ' +shift' : '') +
          (e.ctrlKey ? ' +ctrl' : '') +
          (e.altKey ? ' +alt' : '') +
          (e.metaKey ? ' +meta' : '') + " key"
        )
    }

    function SomeJavaScriptCode() {
        alert("key pressed");
    }


    function arrowPressDown() {
        alert("arrow key pressed");
    }


/// test of concept
/// From: http://javascript.info/tutorial/keyboard-events 
    function dynamicHandler() {
        // anonymous function style
        document.getElementById('move2').onkeydown = function (e) {
            e = e || event
            switch (e.keyCode) {
                case 37: // left
                    //this.style.left = parseInt(this.style.left)-this.offsetWidth+'px'
                    alert("left");
                    return false
                case 38: // up
                    //this.style.top = parseInt(this.style.top)-this.offsetHeight+'px'
                    alert("up");
                    return false
                case 39: // right
                    //this.style.left = parseInt(this.style.left)+this.offsetWidth+'px'
                    alert("right");
                    return false
                case 40: // down
                    //this.style.top = parseInt(this.style.top)+this.offsetHeight+'px'
                    alert("down");
                    return false
                default:
                    alert(e.keyCode);
            }
        }
    }

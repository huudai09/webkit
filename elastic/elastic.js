/*
Author - Yash Mathur
*/
jQuery.fn.autoGrow = function() {
    return this.each(function() {
        var colsDefault = this.cols;
        var rowsDefault = this.rows;

        var grow = function() {
            growByRef(this);
        }

        var growByRef = function(obj, enterPressed) {
            var linesCount = 0;
            var lines = obj.value.split('\n');

            for (var i = lines.length - 1; i >= 0; --i) {
                linesCount += Math.floor((lines[i].length / colsDefault) + 1);
            }

            if (enterPressed) linesCount++;

            if (linesCount > rowsDefault) obj.rows = linesCount;
            else obj.rows = rowsDefault;
        }

        var characterWidth = function(obj) {
            var characterWidth = 0;
            var temp1 = 0;
            var temp2 = 0;
            var tempCols = obj.cols;

            obj.cols = 1;
            temp1 = obj.offsetWidth;
            obj.cols = 2;
            temp2 = obj.offsetWidth;
            characterWidth = temp2 - temp1;
            obj.cols = tempCols;

            return characterWidth;
        }

        $(this).keypress(function(evt) {
            if (evt.which == 13) {
                growByRef(this, true);
                this.value += '\n';
                return false;
            } else {
                growByRef(this, false);
            }
        });
        $(this).keyup(function(evt) {
           if (evt.which == 13)
              return false;
           growByRef(this, false); 
        });
        this.style.overflow = "hidden";
        //this.onkeyup = grow;
        this.onfocus = grow;
        this.onblur = grow;
        growByRef(this);
    });
};
$("textarea").autoGrow();
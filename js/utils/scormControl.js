var bookMarkArray = [];
var completionStatus = "false";
var firstTimeCourseOpen = "false";
var userData = "";
var pageCntSCO = 0;
var totalPagesSCO = 0;

$(document).ready(function (e) {

});

window.onpagehide = function () {
    if (isScorm) {
        pipwerks.SCORM.quit();
    }
}

function initCourseStatus() {
    if (pipwerks.SCORM.get("cmi.suspend_data") == "") {
        pageCntSCO = 0;
        bookMarkArray = [];
		userData = "";
    } else {
        var bookmarkData = pipwerks.SCORM.get("cmi.suspend_data");
        pageCntSCO = Number(bookmarkData.split("~||~")[0]);        
        bookMarkArray = bookmarkData.split("~||~")[1].split(",");
        if (bookMarkArray.length == 1) {
            if (bookMarkArray[0] == "") {
                bookMarkArray = []
            }
        }
        completionStatus = bookmarkData.split("~||~")[2];
        userData = bookmarkData.split("~||~")[3];
        console.log("pull.userData>>>>>>>",userData)
    }

    console.log("completionStatus: ", completionStatus)
}

function setCourseDetailToLMS() {
    console.log("push.userData>>>>>>:>",userData)
    var bookmarkAsString = pageCntSCO + "~||~" + bookMarkArray + "~||~" + completionStatus + "~||~"+ userData;
    pipwerks.SCORM.set("cmi.suspend_data", bookmarkAsString);
    console.log("bookmarkAsString: ", bookmarkAsString)
}

function checkCompletionStatus() {
    setCourseDetailToLMS();
    var courseCount = 0;
    for (var i = 0; i < totalPagesSCO; i++) {
        if (visitedArr[i] == 1) {
            courseCount++;
        }
    }

    if (courseCount == totalPagesSCO) {
        if (completionStatus == "false") {
            pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
            var bookmarkAsString = pageCntSCO + "~||~" + visitedArr + "~||~true" + "~||~" + userData;
            pipwerks.SCORM.set("cmi.suspend_data", bookmarkAsString);
        }
    } else {
        pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
    }
	pipwerks.SCORM.save();
}

function setScore(score) {
    pipwerks.SCORM.set("cmi.core.score.raw", score);
}
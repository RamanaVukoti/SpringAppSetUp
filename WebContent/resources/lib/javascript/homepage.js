/*
 * Page blocker for Ajax
 */
function ajaxStart() {
	$("#processingCSDiv").css("display", "block");
};
/*
 * Page blocker for Ajax
 */
function ajaxComplete() {
	$("#processingCSDiv").css("display", "none");
};
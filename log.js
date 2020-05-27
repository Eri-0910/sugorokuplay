/**
 * エラーをログとして残しす
 * @param {Error} error 
 */
function makeLog(error) {
  //エラーログシートを手に入れる
  var SpreadSheet = SpreadsheetApp.openById(ERROR_LOG_ID);
  // これでログ保存のシートを取得
  var logSheet = SpreadSheet.getSheetByName('ログ');
  //全体の最終行を取得
  var lastRow = logSheet.getLastRow();
  var writeRow = lastRow+1;
  //記録用に今の時刻を取得
  var date = new Date();
  //時刻保存
  logSheet.getRange(ERROR_DATE_COLUMN + writeRow).setValue(date);
  //ログ保存
  logSheet.getRange(ERROR_NAME_COLUMN + writeRow).setValue(error.name);
  logSheet.getRange(ERROR_FILE_COLUMN + writeRow).setValue(error.fileName);
  logSheet.getRange(ERROR_ROW_COLUMN + writeRow).setValue(error.lineNumber);
  logSheet.getRange(ERROR_MESSAGE_COLUMN + writeRow).setValue(error.message);
  logSheet.getRange(ERROR_STACK_TRACE_COLUMN + writeRow).setValue(error.stack);

}
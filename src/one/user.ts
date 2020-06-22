/**
 * ユーザーが動けるかどうかの確認
 * @param userId ユーザーID
 * @return 動けるならTrue
 */
function canMove(userId:string):boolean {
　//ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var userSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
  // 確認
  var canMove = userSheet.getRange(IS_MOVABLE_RANGE).getValue();

  return canMove;
}

/**
 * ユーザーが動けるかどうかをセットする
 * @param userId ユーザーID
 * @param canMove 動けるならTrue
 */
function setMovable(userId:string, canMove: boolean) {
　//ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var userSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
  // セット
  userSheet.getRange(IS_MOVABLE_RANGE).setValue(Number(canMove));
}
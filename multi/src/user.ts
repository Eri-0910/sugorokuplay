/**
 * ユーザーが動けるかどうかの確認
 * @param userId ユーザーID
 * @return 動けるならTrue
 */
function canMove(groupId: string, userNum: number):boolean {
　//ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(groupId);
  // これでフラグの載っているのシートを取得
  var userSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
  // 確認
  var canMove = userSheet.getRange(IS_MOVABLE_ROW, userNum + 1).getValue();

  return canMove;
}

/**
 * ユーザーが動けるかどうかをセットする
 * @param userId ユーザーID
 * @param canMove 動けるならTrue
 */
function setMovable(groupId: string, userNum: number,  canMove: boolean) {
　//ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(groupId);
  // これでフラグの載っているのシートを取得
  var userSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
  // セット
  userSheet.getRange(IS_MOVABLE_ROW, userNum + 1).setValue(Number(canMove));
}
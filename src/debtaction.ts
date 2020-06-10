/**
 * 借金をする確認を出す
 * @param {string} userId ユーザーID
 * @returns {Object[]} 出力したいッセージ
 */
function confirmBorrowDebt(userId: string): Object[] {
  var replyMessages: Object[];
  replyMessages = [getYesNoTemplate('借金をしますか？')];
  // フラグ
  setBorrowDebt(userId, true);
  return replyMessages;
}

/**
 * 借金を返す確認を出す
 * @param {string} userId ユーザーID
 * @returns {string[]} 出力したいッセージ
 */
function confirmRepayDebt(userId: string): Object[] {
  var replyMessages: Object[];
  replyMessages = [stringToMessage("返金金額を入力してください")];
  // フラグ
  setRepayDebt(userId, true);
  return replyMessages;
}
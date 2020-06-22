/**
 * 借金をする確認を出す
 * @param {string} groupId グループID
 * @returns {Object[]} 出力したいッセージ
 */
function confirmBorrowDebt(groupId: string): Object[] {
  var replyMessages: Object[];
  replyMessages = [getYesNoTemplate('借金をしますか？')];
  // フラグ
  setBorrowDebt(groupId, true);
  return replyMessages;
}

/**
 * 借金を返す確認を出す
 * @param {string} groupId グループID
 * @returns {string[]} 出力したいッセージ
 */
function confirmRepayDebt(groupId: string): Object[] {
  var replyMessages: Object[];
  replyMessages = [stringToMessage("返金金額を入力してください")];
  // フラグ
  setRepayDebt(groupId, true);
  return replyMessages;
}
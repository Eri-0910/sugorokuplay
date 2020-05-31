/**
 * 借金をする確認を出す
 * @param {string} userId ユーザーID
 * @returns {string[]} 出力したいッセージ
 */
function confirmBorrowDebt(userId: string): string[] {
  var replyMessages: string[];
  replyMessages = ["借金しますか？"];
  // フラグ
  setBorrowDebt(userId, true);
  return replyMessages;
}

/**
 * 借金を返す確認を出す
 * @param {string} userId ユーザーID
 * @returns {string[]} 出力したいッセージ
 */
function confirmRepayDebt(userId: string): string[] {
  var replyMessages: string[];
  replyMessages = ["返金金額を入力してください"];
  // フラグ
  setRepayDebt(userId, true);
  return replyMessages;
}
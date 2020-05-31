/**
 * 借金をする確認を出す
 * @param {String} userId ユーザーID
 * @returns {String[]} 出力したいッセージ
 */
function cnfirmBorrowDebt(userId: String) {
    var replyMessages:String[];
    replyMessages = ["借金します"];
    return replyMessages;
}

/**
 * 借金を返す確認を出す
 * @param {String} userId ユーザーID
 * @returns {String[]} 出力したいッセージ
 */
function cnfirmRepayDebt(userId: String) {
    var replyMessages:String[];
    replyMessages = ["借金を返します"];
    return replyMessages;
}
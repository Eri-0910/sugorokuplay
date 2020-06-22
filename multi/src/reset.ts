/**
 * リセット時の動作を行う
 * @return {string} 返信用メッセージを返す
 */
function resetAction(userId) {
    /* シートを消す */
    deleteData(userId);
    /* 削除した旨メッセージ */
    var replyMessages = [stringToMessage('履歴をリセットしました。次回サイコロを振ると新しくゲームが始まります')];

    return replyMessages;
}


/**
 * LINEアカウントに返信の形でメッセージを返す
 * @param {Object[]} messages 送りたいメッセージの内容。5つまでのリスト。
 */
function sendReplyMessages(replyToken: string, messages: Object[]) {
    var line_endpoint = 'https://api.line.me/v2/bot/message/reply';
    var response = UrlFetchApp.fetch(line_endpoint, {
        validateHttpsCertificates: false,
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
        'method': 'post',
        'payload': JSON.stringify({
            'replyToken': replyToken,
            'messages': messages,
        }),
        muteHttpExceptions: true
    });
    makeResponceLog(response);
}

/**
 * 文字列をLINEアカウントに返信するメッセージの形式に変換する
 * @param {string} str 変換したい文字列
 * @returns LINEにtextタイプメッセージとして返せる形式のJSONになるオブジェクト
 */
function stringToMessage(str: string) {
    return {
        "type": "text",
        "text": str
    }
}
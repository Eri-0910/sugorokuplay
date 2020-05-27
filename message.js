/**
 * LINEアカウントに返信の形でメッセージを返す
 * @param {Object[]} messages 送りたいメッセージの内容。5つまでのリスト。
 */
function sendReplyMessages(replyToken, messages) {
    var line_endpoint = 'https://api.line.me/v2/bot/message/reply';
    UrlFetchApp.fetch(line_endpoint, {
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
    });
}

/**
 * 文字列をLINEアカウントに返信するメッセージの形式に変換する
 * @param {String} str 変換したい文字列
 * @returns LINEにtextタイプメッセージとして返せる形式のJSON
 */
function stringToMessage(str) {
    return {
        "type": "text",
        "text": str
    }
}
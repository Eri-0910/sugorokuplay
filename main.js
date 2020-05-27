//CHANNEL_ACCESS_TOKENを設定
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';



//ポストで送られてくるので、ポストデータ取得
//JSONをパースする
function doPost(e) {
    var json = JSON.parse(e.postData.contents);

    //返信するためのトークン取得
    var replyToken = json.events[0].replyToken;
    if (typeof replyToken === 'undefined') {
        return;
    }

    //送ってきたユーザーのIDを取得
    var userId = json.events[0].source.userId;

    //送られたLINEメッセージを取得
    var userMessage = json.events[0].message.text;

    //送られたLINEメッセージを空白で３つにパース
    var splitMessage = userMessage.split(/\s/, 3);

    //ダイスを振るコマンドかどうか
    var isDiceCommand = DICE_COMMNAD_LIST.includes(splitMessage[0]);
    //リセットするかどうか
    var isResetCommand = RESET_COMMNAD_LIST.includes(splitMessage[0]);
    //ステータス確認するかどうか
    var isStatusCommand = STATUS_COMMNAD_LIST.includes(splitMessage[0]);
    //ゲームを新たに開始するかどうか
    var isStartommand = START_COMMNAD_LIST.includes(splitMessage[0]);
    //文章を送るコマンドかどうか
    var isNextCommand = NEXT_COMMNAD_LIST.includes(splitMessage[0]);

    try {
    //ボタンメッセージ
    var template;
    //返信メッセージを決める
    var replyMessages;
    if (isStartommand) {
        if (isExistSheet(userId)) {
            replyMessages = ['ゲームはすでに開始されています。次の行動を選んでください'];
            template = getActionTemplate();
        } else {
            replyMessages = ['ゲームを開始します'];
            createSpreadSheet(userId);
            template = getActionTemplate();
        }
    } else {
        if (!isExistSheet(userId)) {
            replyMessages = ['ゲームがまだ始まっていません。ゲームを始めてください。'];
            template = getNewGameTemplate();
        } else {
            if (isNextCommand) {
                //次のメッセージを出力
                replyMessages = getNextMessage(userId);
                //ユーザーのシートを手に入れる
                var SpreadSheet = getSpreadSheet(userId);
                // これで１枚のシートを取得
                var dataSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
                //現在の状態を知る
                var leftMessageNum = dataSheet.getRange(NEXT_TEXT_NUM_RANGE).getValue();

                if (leftMessageNum == 0) {
                    //先にメッセージはない
                    template = getActionTemplate();
                } else {
                    //先にメッセージがある
                    template = getNextTemplate();
                }
            } else if (isDiceCommand) {//ダイスを振るコマンド
                replyMessages = diceAction(userId, splitMessage);
                template = getActionTemplate();
            } else if (isResetCommand) {//リセットするコマンド
                //リセット処理をする
                replyMessages = resetAction(userId);
                template = getNewGameTemplate();
            } else if (isStatusCommand) {//ステータス確認コマンド
                //ステータスの出力
                replyMessages = statusAction(userId);
                template = getActionTemplate();
            } else {//想定外の言葉が入力されたときの処理
                replyMessages = ['「ダイス」と送るとサイコロを振ります', '「リセット」と送ると盤面のリセットを行います'];
                template = getActionTemplate(/* isWithReset */true);
            }
        }
    }
    if (replyMessages.length >= 5) {
        setNextMessage(userId, replyMessages.slice(4, replyMessages.length));
        replyMessages = replyMessages.slice(0, 4)
        template = getNextTemplate();
    }



    //文字が配列になっているのを整える
    var messages = replyMessages.map(function (message) {
        return {
            "type": "text",
            "text": message
        }
    });

    //テンプレートの処理
    messages.push(template);

    // メッセージを返信
    sendReplyMessages(replyToken, messages);

    } catch (error) {
        //ユーザーのシートを手に入れる
        var SpreadSheet = getSpreadSheet(userId);
        // これで１枚のシートを取得
        var dataSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
        //現在の状態を知る
        var leftMessageNum = dataSheet.getRange('L1').setValue(error);

    }
    return ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
}

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
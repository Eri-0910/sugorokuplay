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
    //var isDiceCommand = DICE_COMMNAD_LIST.includes(splitMessage[0]);
    //リセットするかどうか
    //var isResetCommand = RESET_COMMNAD_LIST.includes(splitMessage[0]);
    //ステータス確認するかどうか
    //var isStatusCommand = STATUS_COMMNAD_LIST.includes(splitMessage[0]);
    //ゲームを新たに開始するかどうか
    var isStartommand = START_COMMNAD_LIST.includes(splitMessage[0]);
    //文章を送るコマンドかどうか
    //var isNextCommand = NEXT_COMMNAD_LIST.includes(splitMessage[0]);
    //文章を送るコマンドかどうか
    var isHelpCommand = HELP_COMMNAD_LIST.includes(splitMessage[0]);


    try {
    //返信メッセージを決める
    var replyMessages;
    if (!isExistSheet(userId)) {
        replyMessages = ['ゲームはすでに開始されています。次の行動を選んでください'];
    } else if (isStartommand){
        replyMessages = ['ゲームを開始します。'];
    } else if (isHelpCommand){//想定外の言葉が入力されたときの処理
        replyMessages = ['ゲームを開始するには、「開始」と送ってください'];
    }　else{
        replyMessages = ['ゲームが開始されていません。'];
    }

    if (replyMessages.length >= 5) {
        setNextMessage(userId, replyMessages.slice(4, replyMessages.length));
        replyMessages = replyMessages.slice(0, 4)
        template = getNextTemplate();
    }

    //文字が配列になっているのを整える
    var messages = replyMessages.map(message => stringToMessage(message));

    // メッセージを返信
    sendReplyMessages(replyToken, messages);

    } catch (error) {
        //ユーザーのシートを手に入れる
        var SpreadSheet = getSpreadSheet(userId);
        // これで１枚のシートを取得
        var dataSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
        //現在の状態を知る
        dataSheet.getRange('L1').setValue(error);

    }
    return ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
}


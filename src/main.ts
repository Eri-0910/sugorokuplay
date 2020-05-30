/// <reference path="message.ts"/>
/// <reference path="restmessage.ts"/>
/// <reference path="template.ts"/>
/// <reference path="dice.ts"/>
/// <reference path="reset.ts"/>
/// <reference path="sheet.ts"/>
/// <reference path="status.ts"/>
/// <reference path="log.ts"/>
/// <reference path="const.ts"/>
/// <reference path="start.ts"/>
//CHANNEL_ACCESS_TOKENを設定
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';

//ポストで送られてくるので、ポストデータ取得
//JSONをパースする
function doPost(e) {
  try {
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

    //なんのコマンドかを表したオブジェクト
    var isCommand: CommandObj = commandParser(splitMessage[0]);

    //アクションを実行しメッセージを取得
    var replyMessages: String[] = gameAction(userId, isCommand);

    //長さの設定
    if (replyMessages.length >= 5) {
        setNextMessage(userId, replyMessages.slice(4, replyMessages.length));
        replyMessages = replyMessages.slice(0, 4)
        //template = getNextTemplate();
    }

    //文字が配列になっているのを整える
    var messages = replyMessages.map(message => stringToMessage(message));
    // メッセージを返信
    sendReplyMessages(replyToken, messages);

  } catch (error) {
    //ログをフォルダに保存
    makeLog(error);
  }
  return ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * コマンドをパースした後のオブジェクト
 */
interface CommandObj {
    isStart: boolean;
    isHelp: boolean;
    isReset: boolean;
    isNext: boolean
}

/**
 * コマンドにパースする
 * @param {String} str 文字列
 * @returns {CommandObj} コマンドかどうかをその内容ごとにboolにしたもの
 */
function commandParser(str){
    //ダイスを振るコマンドかどうか
    //var isDiceCommand = DICE_COMMNAD_LIST.includes(str);
    //リセットするかどうか
    var isResetCommand = RESET_COMMNAD_LIST.includes(str);
    //ステータス確認するかどうか
    //var isStatusCommand = STATUS_COMMNAD_LIST.includes(str);
    //ゲームを新たに開始するかどうか
    var isStartCommand = START_COMMNAD_LIST.includes(str);
    //文章を送るコマンドかどうか
    var isNextCommand = NEXT_COMMNAD_LIST.includes(str);
    //ヘルプコマンドかどうか
    var isHelpCommand = HELP_COMMNAD_LIST.includes(str);
    //返すもの
    var isCommand: CommandObj = {
      isStart: isStartCommand,
      isHelp: isHelpCommand,
      isReset: isResetCommand,
      isNext: isNextCommand,
    };
    return isCommand;
}

/**
 * アクションを実行し、メッセージを返す
 * @param {String} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {String[]} 出力すべきメッセージ
 */
function gameAction(userId: String, isCommand: CommandObj) {
  //返信メッセージを決める
  var replyMessages: String[];
  if (isExistSheet(userId)) {
    replyMessages = onGameAction(userId, isCommand);
  } else {
    replyMessages = beforeGameAction(userId, isCommand);
  }
  return replyMessages;
}

/**
 * ゲーム開始後のアクションを実行し、メッセージを返す
 * @param {String} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {String[]} 出力すべきメッセージ
 */
function onGameAction(userId: String, isCommand: CommandObj) {
    //返信メッセージを決める
    var replyMessages: String[];
    if (isCommand.isReset) {
        //リセットする
        replyMessages = resetAction(userId);
        //リセットしたメッセージを追加
        } else if (hasNextMessage(userId)) {
            if (isCommand.isNext) {
                //続きのメッセージがある
                replyMessages = ["続きの文章です"];
            } else {
                //続きのメッセージがあるが取得しようとしていない
                replyMessages = ["続きの文章があります","続きの文章です"];
            }
        } else {
        //ゲームは開始されている
        replyMessages = ["ゲームアクションを実行します",];
        }
    return replyMessages;
    }

/**
 * ゲーム開始前のアクションを実行し、メッセージを返す
 * @param {String} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {String[]} 出力すべきメッセージ
 */
function beforeGameAction(userId: String, isCommand: CommandObj) {
    //返信メッセージを決める
    var replyMessages: String[];
    if (isCommand.isStart) {
        //未開始で開始コマンド
        //ゲーム開始
        gameStart(userId);
        //開始できたらメッセージ
        replyMessages = ["ゲームを開始しました。"];
    } else if (isCommand.isHelp) {
        //ゲーム未開始時点のヘルプ
        replyMessages = [
            "「スタート」と送ると、ゲームを開始します。それ以外のコマンドは、ゲーム開始後にヘルプをご覧ください。",
        ];
    } else {
        //想定外の言葉が入力されたときの処理
        replyMessages = ["ゲームが開始されていません。「スタート」と送ってください"];
    }
    return replyMessages;
}
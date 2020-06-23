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
/// <reference path="action.ts"/>
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
    //グループのID
    var groupId = json.events[0].source.groupId;

    //送られたLINEメッセージを取得
    var userMessage = json.events[0].message.text;

    //送られたLINEメッセージを空白で３つにパース
    var splitMessage = userMessage.split(/\s/, 3);

    //なんのコマンドかを表したオブジェクト
    var isCommand: CommandObj = commandParser(splitMessage[0]);

    //アクションを実行しメッセージを取得
    var replyMessages: Object[] = gameAction(groupId, userId, isCommand);

    makePrintLog(replyMessages.length);
    //長さの設定
    if (replyMessages.length > 5) {
        setNextMessage(userId, replyMessages.slice(4, replyMessages.length));
        replyMessages = replyMessages.slice(0, 4)
        replyMessages.push(getNextTemplate());
    }

    // メッセージを返信
    sendReplyMessages(replyToken, replyMessages);

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
  isNextUser: boolean,
  isStart: boolean;
  isHelp: boolean;
  isReset: boolean;
  isNext: boolean;
  isDice: boolean;
  isStatus: boolean;
  isDebt: boolean;
  isRepay: boolean;
  isYes: boolean;
  isNo: boolean;
  value: number|null;
  id: number|null
}

/**
 * コマンドにパースする
 * @param {string} str 文字列
 * @returns {CommandObj} コマンドかどうかをその内容ごとにboolにしたもの
 */
function commandParser(str: string): CommandObj{
  // 次のユーザーに移るコマンドかどうか
  var isNextUserCommand = NEXT_USER_COMMNAD_LIST.includes(str);
  // ダイスを振るコマンドかどうか
  var isDiceCommand = DICE_COMMNAD_LIST.includes(str);
  // リセットするかどうか
  var isResetCommand = RESET_COMMNAD_LIST.includes(str);
  // ステータス確認するかどうか
  var isStatusCommand = STATUS_COMMNAD_LIST.includes(str);
  // ゲームを新たに開始するかどうか
  var isStartCommand = START_COMMNAD_LIST.includes(str);
  // 文章を送るコマンドかどうか
  var isNextCommand = NEXT_COMMNAD_LIST.includes(str);
  // ヘルプコマンドかどうか
  var isHelpCommand = HELP_COMMNAD_LIST.includes(str);
  // 借金コマンドかどうか
  var isDebtCommand = DEBT_COMMNAD_LIST.includes(str);
  // 借金返済コマンドかどうか
  var isRepayCommand = REPAY_DEBT_COMMNAD_LIST.includes(str);
  // はいコマンドかどうか
  var isYesCommand = YES_COMMNAD_LIST.includes(str);
  // いいえコマンドかどうか
  var isNoCommand = NO_COMMNAD_LIST.includes(str);

  // 最後に円があったりなかったり
  var valuePattern = /^\d+円?$/;
  // 前から数字部分だけ取ってくる
  var valueOnlyNumberPattern = /^\d+/;
  //　数字だけ
  var idPattern = /^\d+$/;

  var value: number|null;
  if (valuePattern == null) {
    value = null;
  } else {
    value = Number(str.match(valueOnlyNumberPattern));
  }

  var id:number|null;
  if (str.match(idPattern) == null){
    id =null;
  }else{
    id = Number(str.match(idPattern));
  }

  //返すもの
  var isCommand: CommandObj = {
    isNextUser: isNextUserCommand,
    isStart: isStartCommand,
    isHelp: isHelpCommand,
    isReset: isResetCommand,
    isNext: isNextCommand,
    isDice: isDiceCommand,
    isStatus: isStatusCommand,
    isDebt: isDebtCommand,
    isRepay: isRepayCommand,
    isYes: isYesCommand,
    isNo: isNoCommand,
    value: value,
    id: id
  };
  return isCommand;
}
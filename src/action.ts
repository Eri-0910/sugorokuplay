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
      replyMessages = ["続きの文章があります", "続きの文章です"];
    }
  } else {
    //ゲームは開始されている
    replyMessages = ["ゲームアクションを実行します"];
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
    replyMessages = [
      "ゲームが開始されていません。「スタート」と送ってください",
    ];
  }
  return replyMessages;
}

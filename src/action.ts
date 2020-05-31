/**
 * アクションを実行し、メッセージを返す
 * @param {string} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {string[]} 出力すべきメッセージ
 */
function gameAction(userId: string, isCommand: CommandObj) {
  //返信メッセージを決める
  var replyMessages: string[];
  if (isExistSheet(userId)) {
    replyMessages = onGameAction(userId, isCommand);
  } else {
    replyMessages = beforeGameAction(userId, isCommand);
  }
  return replyMessages;
}

/**
 * ゲーム開始後のアクションを実行し、メッセージを返す
 * @param {string} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {string[]} 出力すべきメッセージ
 */
function onGameAction(userId: string, isCommand: CommandObj) {
  //返信メッセージを決める
  var replyMessages: string[];
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
    replyMessages =  turnAction(userId, isCommand);
  }
  return replyMessages;
}

/**
 * ゲーム開始前のアクションを実行し、メッセージを返す
 * @param {string} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {string[]} 出力すべきメッセージ
 */
function beforeGameAction(userId: string, isCommand: CommandObj) {
  //返信メッセージを決める
  var replyMessages: string[];
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

/**
 * ターン内のアクションを実行し、メッセージを返す
 * @param {string} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {string[]} 出力すべきメッセージ
 */
function turnAction(userId: string, isCommand: CommandObj) {
  //返信メッセージを決める
  var replyMessages: string[];
  //フラグの確認
  var flag: Flag = getFlag(userId);
  if (flag.isRepayDebt) {//フラグアクション
    //借金を返す
    replyMessages = ["借金を返します"];
    setRepayDebt(userId, false);
  } else if (flag.isBorrowDebt) {
      //借金を借りる
    replyMessages = ["借金をかります"];
    setBorrowDebt(userId, false);
  } else if (flag.isChooseWork) {
      //仕事につく
    replyMessages = ["仕事につきます"];
  } else if (flag.isChooseHouse) {
      //家を選ぶ
    replyMessages = ["家を選びます"];
  } else if (flag.isFireInsurance) {
      //火災保険
    replyMessages = ["火災保険に入ります"];
  } else if (flag.isLifeInsurance) {
    //生命保険
    replyMessages = ["生命保険に入ります"];
  } else if (flag.isStock) {
    //株
    replyMessages = ["株を買います"];
  } else if (isCommand.isDebt) {//各コマンド
    //借金をしたい
    replyMessages = confirmBorrowDebt(userId);
  } else if (isCommand.isRepay) {
      //借金を返したい
    replyMessages = confirmRepayDebt(userId);
  } else if (isCommand.isStatus) {
    //ステータスを取得
    replyMessages = statusAction(userId);
  } else if (isCommand.isDice) {
    //動く
    replyMessages = ["動きます"];
  } else {
    //無効
    replyMessages = ["このコマンドは無効です。"];
  }
  return replyMessages;
}

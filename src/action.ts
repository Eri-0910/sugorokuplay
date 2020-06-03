/// <reference path="debtaction.ts"/>
/// <reference path="flag.ts"/>
/// <reference path="user.ts"/>
/// <reference path="reset.ts"/>
/// <reference path="main.ts"/>
/**
 * アクションを実行し、メッセージを返す
 * @param {string} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {Object[]} 出力すべきメッセージ
 */
function gameAction(userId: string, isCommand: CommandObj): Object[] {
  //返信メッセージを決める
  var replyMessages: Object[];
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
 * @returns {Object[]} 出力すべきメッセージ
 */
function onGameAction(userId: string, isCommand: CommandObj): Object[] {
  //返信メッセージを決める
  var replyMessages: Object[];
  if (isCommand.isReset) {
    //リセットする
    replyMessages = resetAction(userId);
    //リセットしたメッセージを追加
  } else if (hasNextMessage(userId)) {
    if (isCommand.isNext) {
      //続きのメッセージがある
      replyMessages = getNextMessage(userId);
    } else {
      //続きのメッセージがあるが取得しようとしていない
      replyMessages = [stringToMessage('続きのメッセージが残っています。「次へ」と送信して残っているメッセージを確認してください。')];
    }
  } else {
    //ゲームは開始されている
    replyMessages = turnAction(userId, isCommand);
  }
  return replyMessages;
}

/**
 * ゲーム開始前のアクションを実行し、メッセージを返す
 * @param {string} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {Object[]} 出力すべきメッセージ
 */
function beforeGameAction(userId: string, isCommand: CommandObj): Object[] {
  //返信メッセージを決める
  var replyMessages: Object[];
  if (isCommand.isStart) {
    //未開始で開始コマンド
    //ゲーム開始
    gameStart(userId);
    //開始できたらメッセージ
    replyMessages = [stringToMessage('ゲームを開始しました。')];
  } else if (isCommand.isHelp) {
    //ゲーム未開始時点のヘルプ
    replyMessages = [stringToMessage('「スタート」と送ると、ゲームを開始します。それ以外のコマンドは、ゲーム開始後にヘルプをご覧ください。')];
  } else {
    //想定外の言葉が入力されたときの処理
    replyMessages = [stringToMessage('ゲームが開始されていません。「スタート」と送ってください')];
  }
  return replyMessages;
}

/**
 * ターン内のアクションを実行し、メッセージを返す
 * @param {string} userId ユーザーID
 * @param {CommandObj} isCommand コマンドのオブジェクト
 * @returns {Object[]} 出力すべきメッセージ
 */
function turnAction(userId: string, isCommand: CommandObj): Object[] {
  //返信メッセージを決める
  var replyMessages: Object[];
  //フラグの確認
  var flag: Flag = getFlag(userId);
  if (flag.isRepayDebt) {//フラグアクション
    //借金を返す
    replyMessages = repayDebt(userId);
    setRepayDebt(userId, false);
  } else if (flag.isBorrowDebt) {
    //借金を借りる
    replyMessages = borrowDebt(userId);
    setBorrowDebt(userId, false);
  } else if (flag.isChooseWork) {
    //仕事につく
    replyMessages = startChooseWork(userId);
  } else if (flag.isChooseHouse) {
    //家を選ぶ
    replyMessages = startChooseHouse(userId);
  } else if (flag.isFireInsurance) {
    //火災保険
    replyMessages = startTakeFireInsurance(userId);
  } else if (flag.isLifeInsurance) {
    //生命保険
    replyMessages = startTakeLifeInsurance(userId);
  } else if (flag.isStock) {
    //株
    replyMessages = startStock(userId);
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
    if (canMove(userId)) {
    　//動けるので動く
      replyMessages = moveAction(userId);
    } else {
      replyMessages = [stringToMessage('このターンは休みです')];
      //動ける様に
      setMovable(userId, true);
    }
  } else {
    //無効
    replyMessages = [stringToMessage('このコマンドは無効です。')];
  }
  return replyMessages;
}

function borrowDebt(userId: string): Object[] {
  return [stringToMessage("借金をかります")];
}

function startStock(userId: string): Object[] {
  return [stringToMessage("株を買います")];
}

function startTakeLifeInsurance(userId: string): Object[] {
  return [stringToMessage('生命保険に入ります')];
}

function startTakeFireInsurance(userId: string): Object[] {
  return [stringToMessage("火災保険に入ります")];
}

function startChooseHouse(userId: string): Object[] {
  return [stringToMessage("家を選びます")];
}

function startChooseWork(userId: string): Object[] {
  return [stringToMessage("仕事につきます")];
}

function repayDebt(userId: string): Object[] {
  return [stringToMessage("借金を返します")];
}

function moveAction(userId: string): Object[] {
  //返り値
  var replyMessages: Object[];
  //サイコロをふる
  var dice: number = Math.floor(Math.random() * 6) + 1;

  //振った目の出力
  const DICE_EMOJI = '\u{1F3B2}';
  var diceMessages: Object[] = [stringToMessage(DICE_EMOJI + dice + 'です')];

  replyMessages = diceMessages;

  // マスのリストを取得
  var pieceList: Space[] = movePiece(userId, dice);

  // リストの要素毎にアクション
  for (let i = 0; i < pieceList.length; i++) {
    var placeMessages: Object[] = SpaceAction(pieceList[i]);
    replyMessages = replyMessages.concat(placeMessages);
  }

  return replyMessages;
}
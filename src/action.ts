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
    if(isCommand.isYes||isCommand.isNo){
      //借金を返す
      replyMessages = repayDebt(userId, 0);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('借金を返す場合は金額を、返さない場合は0と入力してください')];
    }
  } else if (flag.isBorrowDebt) {
    if (isCommand.isYes || isCommand.isNo) {
      //借金を借りる
      replyMessages = borrowDebt(userId, true);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('借金を借りる場合ははい、借りない場合はいいえと入力してください')];
    }
  } else if (flag.isChooseWork) {
    if (isCommand.isYes || isCommand.isNo) {
      //仕事につく
      replyMessages = startChooseWork(userId, 0);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('仕事に就く場合ははい、就かない場合はいいえと入力してください')];
    }
  } else if (flag.isChooseHouse) {
    if (isCommand.isYes || isCommand.isNo) {
      //家を選ぶ
      replyMessages = startChooseHouse(userId, 0);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('家を選ぶ場合は番号を、選ばない場合は0と入力してください')];
    }
  } else if (flag.isFireInsurance) {
    if (isCommand.isYes || isCommand.isNo) {
      //火災保険
      replyMessages = startTakeFireInsurance(userId, true);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('火災保険に入る場合ははい、入らない場合はいいえと入力してください')];
    }
  } else if (flag.isLifeInsurance) {
    if (isCommand.isYes || isCommand.isNo) {
      replyMessages = startTakeLifeInsurance(userId, true);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('生命保険に入る場合ははい、入らない場合はいいえと入力してください')];
    }
    //生命保険
  } else if (flag.isStock) {
    if (isCommand.isYes || isCommand.isNo) {
      //株
      replyMessages = startStock(userId, true);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('株を買う場合ははい、買わない場合はいいえと入力してください')];
    }
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

function repayDebt(userId: string, repaymentAmount: number): Object[] {
  setRepayDebt(userId, false);
  return [stringToMessage("借金を返します")];
}


function borrowDebt(userId: string, doAction: boolean): Object[] {
  setBorrowDebt(userId, false);
  return [stringToMessage("借金をかります")];
}

function startStock(userId: string, doAction: boolean): Object[] {
  setStock(userId, false);
  return [stringToMessage("株を買います")];
}

function startTakeLifeInsurance(userId: string, doAction: boolean): Object[] {
  setLifeInsurance(userId, false);
  return [stringToMessage('生命保険に入ります')];
}

function startTakeFireInsurance(userId: string, doAction: boolean): Object[] {
  setFireInsurance(userId, false);
  return [stringToMessage("火災保険に入ります")];
}

function startChooseHouse(userId: string, houseId: number): Object[] {
  setChooseHouse(userId, false);
  return [stringToMessage("家を選びます")];
}

function startChooseWork(userId: string, workId: number): Object[] {
  setChooseWork(userId, false);
  return [stringToMessage("仕事につきます")];
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
    var placeMessages: Object[] = SpaceAction(userId, pieceList[i]);
    replyMessages = replyMessages.concat(placeMessages);
  }

  return replyMessages;
}
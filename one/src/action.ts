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
    replyMessages = [stringToMessage('ゲームを開始しました。'), getActionTemplate()];
  } else if (isCommand.isHelp) {
    //ゲーム未開始時点のヘルプ
    replyMessages = [stringToMessage('「スタート」と送ると、ゲームを開始します。それ以外のコマンドは、ゲーム開始後にヘルプをご覧ください。'), getNewGameTemplate()];
  } else {
    //想定外の言葉が入力されたときの処理
    replyMessages = [stringToMessage('ゲームが開始されていません。「スタート」と送ってください'), getNewGameTemplate()];
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
  // 返信メッセージを決める
  var replyMessages: Object[];

  // ゴール後にできるのはステータス確認だけ
  if(isGoaled(userId)){
    if (isCommand.isStatus) {
      //ステータスを取得
      replyMessages = statusAction(userId);
    } else {
      replyMessages = [stringToMessage('ゴール済みです')]
    }
    return replyMessages;
  }

  // 以下ゴール前のアクション
  // フラグの確認
  var flag: Flag = getFlag(userId);
  if (flag.hasFinished) {// 次のユーザーに移る
    if (isCommand.isNextUser) {
      // ターン終了コマンドを解除
      setFinishTurn(userId, false);
      // 返信
      replyMessages = [stringToMessage('次のユーザーに移ります'), getActionTemplate()];
    } else {
      // 返信
      replyMessages = [stringToMessage('このターンは終了しました。次の人へ移してください。'), getNextUserTemplate()];
    }
  } else if (flag.isRepayDebt) {// 借金を返す
    if(isCommand.value != null){
      //借金を返す
      replyMessages = repayDebt(userId, isCommand.value);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('借金を返す場合は金額を、返さない場合は0と入力してください')];
    }

  } else if (flag.isBorrowDebt) {
    if (isCommand.isYes || isCommand.isNo) {
      //借金を借りる
      replyMessages = borrowDebt(userId, isCommand.isYes);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('借金を借りる場合ははい、借りない場合はいいえと入力してください'), getYesNoTemplate('借金をかりますか？')];
    }

  } else if (flag.isChooseWork) {
    if (isCommand.isYes || isCommand.isNo) {
      //仕事につく
      replyMessages = startChooseWork(userId, isCommand.isYes);
      //残っているマスのリストを取得
      var spaceList: Space[] = loadSpace(userId);
      // リストの要素毎にアクション
      var replyMessagesAfterAction = spaceListAction(userId, spaceList, false);
      replyMessages = replyMessages.concat(replyMessagesAfterAction);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('仕事に就く場合ははい、就かない場合はいいえと入力してください'), getYesNoTemplate('仕事につきますか？')];
    }

  } else if (flag.isChooseHouse) {
    if (isCommand.id != null) {
      //家を選ぶ
      replyMessages = startChooseHouse(userId, isCommand.id);
      //残っているマスのリストを取得
      var spaceList: Space[] = loadSpace(userId);
      // リストの要素毎にアクション
      var replyMessagesAfterAction = spaceListAction(userId, spaceList, false);
      replyMessages = replyMessages.concat(replyMessagesAfterAction);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('家を選ぶ場合は番号を、選ばない場合は0と入力してください')];
    }

  } else if (flag.isFireInsurance) {
    if (isCommand.isYes || isCommand.isNo) {
      //火災保険
      replyMessages = startTakeFireInsurance(userId, isCommand.isYes);
      //残っているマスのリストを取得
      var spaceList: Space[] = loadSpace(userId);
      // リストの要素毎にアクション
      var replyMessagesAfterAction = spaceListAction(userId, spaceList, false);
      replyMessages = replyMessages.concat(replyMessagesAfterAction);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('火災保険に入る場合ははい、入らない場合はいいえと入力してください'), getYesNoTemplate('火災保険に入りますか？')];
    }

  } else if (flag.isLifeInsurance) {//生命保険
    if (isCommand.isYes || isCommand.isNo) {
      replyMessages = startTakeLifeInsurance(userId, isCommand.isYes);
      //残っているマスのリストを取得
      var spaceList: Space[] = loadSpace(userId);
      // リストの要素毎にアクション
      var replyMessagesAfterAction = spaceListAction(userId, spaceList, false);
      replyMessages = replyMessages.concat(replyMessagesAfterAction);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('生命保険に入る場合ははい、入らない場合はいいえと入力してください'), getYesNoTemplate('生命保険に入りますか？')];
    }

  } else if (flag.isStock) {
    if (isCommand.isYes || isCommand.isNo) {
      //株
      replyMessages = startStock(userId, isCommand.isYes);
      //残っているマスのリストを取得
      var spaceList: Space[] = loadSpace(userId);
      // リストの要素毎にアクション
      var replyMessagesAfterAction = spaceListAction(userId, spaceList, false);
      replyMessages = replyMessages.concat(replyMessagesAfterAction);
    } else {
      //選択されていない
      replyMessages = [stringToMessage('株を買う場合ははい、買わない場合はいいえと入力してください'), getYesNoTemplate('株を買いますか？')];
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
    // アクション
    replyMessages = moveAction(userId);
  } else {
    //無効
    replyMessages = [stringToMessage('このコマンドは無効です。')];
  }
  return replyMessages;
}


/**
 * 状況に合わせて返せる最大限の借金を返し、借金返済フラグを消す。
 * @param userId ユーザーID
 * @param repaymentAmount 返金希望金額
 * @return 出力すべきメッセージ
 */
function repayDebt(userId: string, repaymentAmount: number): Object[] {
  var replyMessages: Object[] = [];
  if (repaymentAmount!=0) {
    var SpreadSheet = getSpreadSheet(userId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    // 現在の借金
    var nowDebt: number = personSheet.getRange(DEBT_RANGE).getValue();
    // 現在の所持金
    var nowMoney: number = personSheet.getRange(MONEY_RANGE).getValue();
    //実際に返す金額
    var willrepay = repaymentAmount;

    //所持金以上の金額は返せない
    if (nowMoney < repaymentAmount){
      replyMessages.push(stringToMessage("所持金より多い金額を返すことはできません。支払い金額を修正します。"));
      willrepay = nowMoney;
    }

    // 借金以上の金額は返せない
    if (nowDebt < willrepay) {
      replyMessages.push(stringToMessage("借金全額を返金します。"));
      willrepay = nowDebt;
    }

    // 所持金は返済分減る
    var newMoney: number = nowMoney - willrepay;
    personSheet.getRange(MONEY_RANGE).setValue(newMoney);
    // 借金も返済分減る
    var newDebt: number = nowDebt - willrepay;
    personSheet.getRange(DEBT_RANGE).setValue(newDebt);
    replyMessages.push(stringToMessage("借金を返しました (現在借金" + newDebt + "円、所持金" + newMoney + "円)"));

  } else {
    replyMessages = [stringToMessage("借金を返すのをやめます")];
  }

  setRepayDebt(userId, false);
  return replyMessages;
}

/**
 * パラメータに応じて借金を借り、借金フラグを消す。
 * @param userId ユーザーID
 * @param doAction 借金を借りるか
 * @return 出力すべきメッセージ
 */
function borrowDebt(userId: string, doAction: boolean): Object[] {
  var replyMessages: Object[] = [];
  if (doAction){
    var SpreadSheet = getSpreadSheet(userId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    // 現在の借金
    var nowDebt: number = personSheet.getRange(DEBT_RANGE).getValue();
    // 現在の所持金
    var nowMoney: number = personSheet.getRange(MONEY_RANGE).getValue();
    // 新しい借金
    var newDebt: number = nowDebt + 10000;
    // セット
    personSheet.getRange(DEBT_RANGE).setValue(newDebt);
    personSheet.getRange(MONEY_RANGE).setValue(nowMoney + 10000);
    replyMessages = [stringToMessage("借金をかりました (現在" + newDebt + "円)")];
  }else{
    replyMessages = [stringToMessage("借金をやめます")];
  }
  setBorrowDebt(userId, false);
  return replyMessages;
}

/**
 * パラメータに応じて株を買い、株フラグを消す。
 * @param userId ユーザーID
 * @param doAction 株を買うか
 * @return 出力すべきメッセージ
 */
function startStock(userId: string, doAction: boolean): Object[] {
  var replyMessages:Object[];
  if (doAction){
    // 参照するスプレッドシート
    var SpreadSheet = getSpreadSheet(userId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    // ゲームのシートを取得
    var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
    // 現在の持ち株
    var nowStock: number = personSheet.getRange(STOCK_RANGE).getValue();
    // 現在の所持金
    var nowMoney: number = personSheet.getRange(MONEY_RANGE).getValue();
    // 株価
    var stockValue: number = gameSheet.getRange(STOCK_VALUE_RANGE).getValue();
    if (nowMoney < stockValue){
      replyMessages = [stringToMessage("お金が足りないため、株を買うことができませんでした。")];
    }else{
      personSheet.getRange(STOCK_RANGE).setValue(nowStock + 1);
      personSheet.getRange(MONEY_RANGE).setValue(nowMoney - stockValue);
      replyMessages = [stringToMessage("株を買いました")];
    }
  } else {
    replyMessages = [stringToMessage("株を買いませんでした")];
  }
  //フラグを消す
  setStock(userId, false);
  return replyMessages;
}

function startTakeLifeInsurance(userId: string, doAction: boolean): Object[] {
  var replyMessages: Object[];
  if (doAction) {
    // 参照するスプレッドシート
    var SpreadSheet = getSpreadSheet(userId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    // 現在の生命保険
    var nowInLifeInsurance: boolean = personSheet.getRange(IN_LIFE_INSURANCE_RANGE).getValue();
    if (nowInLifeInsurance){
      replyMessages = [stringToMessage("すでに生命保険に入っています")];
    }else{
      // 現在の所持金
      var nowMoney: number = personSheet.getRange(MONEY_RANGE).getValue();
      personSheet.getRange(IN_LIFE_INSURANCE_RANGE).setValue(1);
      personSheet.getRange(MONEY_RANGE).setValue(nowMoney - LIFE_INSURANCE_VALUE);
      replyMessages = [stringToMessage("生命保険に入りました")];
    }
  } else {
    replyMessages = [stringToMessage("生命保険に入りませんでした")];
  }
  //フラグを消す
  setLifeInsurance(userId, false);
  return replyMessages;
}

/**
 * パラメータに応じて火災保険に入り、保険フラグを消す。
 * @param userId ユーザーID
 * @param doAction 保険に入るかどうか
 */
function startTakeFireInsurance(userId: string, doAction: boolean): Object[] {
  var replyMessages: Object[];
  if (doAction) {
    // 参照するスプレッドシート
    var SpreadSheet = getSpreadSheet(userId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    // 現在の生命保険
    var nowInFireInsurance: boolean = personSheet.getRange(IN_FIRE_INSURANCE_RANGE).getValue();
    if (nowInFireInsurance) {
      replyMessages = [stringToMessage("すでに火災保険に入っています")];
    } else {
      // 現在の所持金
      var nowMoney: number = personSheet.getRange(MONEY_RANGE).getValue();
      personSheet.getRange(IN_FIRE_INSURANCE_RANGE).setValue(1);
      personSheet.getRange(MONEY_RANGE).setValue(nowMoney - FIRE_INSURANCE_VALUE);
      replyMessages = [stringToMessage("火災保険に入りました")];
    }
  } else {
    replyMessages = [stringToMessage("火災保険に入りませんでした")];
  }
  //フラグを消す
  setFireInsurance(userId, false);
  return replyMessages;
}

/**
 * パラメータに応じて家を買い、家フラグを消す。
 * @param userId ユーザーID
 * @param houseId 買いたい家ID
 * @return 返したい文字列
 */
function startChooseHouse(userId: string, houseId: number): Object[] {
  var replyMessages: Object[];
  if (houseId != 0) {
    if ( houseId < 1 && 10 < houseId ){// 範囲外の職業
      replyMessages = [stringToMessage("この番号の職業はありません")];
      return replyMessages;
    }
    // 参照するスプレッドシート
    var SpreadSheet = getSpreadSheet(userId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    // 職業のシートを取得
    var houseSheet = SpreadSheet.getSheetByName(HOUSE_DATA_SHEET_NAME);
    // その家の価格
    var value: number = houseSheet.getRange(HOUSE_VALUE_COLUMN + (houseId + 1)).getValue();
    // その家の名前
    var houseName: string = houseSheet.getRange(HOUSE_TYPE_COLUMN + (houseId + 1)).getValue();
    // 現在の所持金
    var nowMoney: number = personSheet.getRange(MONEY_RANGE).getValue();
    // 設定
    personSheet.getRange(HAS_HOUSE_RANGE).setValue(1);
    personSheet.getRange(HOUSE_MONEY_RANGE).setValue(value);
    personSheet.getRange(MONEY_RANGE).setValue(nowMoney - value);

    replyMessages = [stringToMessage(houseName + "を購入しました")];
  } else {
    replyMessages = [stringToMessage("家を買うのをやめます")];
  }
  //フラグを消す
  setChooseHouse(userId, false);
  return replyMessages;
}

/**
 * パラメータに応じて仕事に就き、職業フラグを消す。
 * @param userId ユーザーID
 * @param doAction 株を買うか
 * @return 出力すべきメッセージ
 */
function startChooseWork(userId: string, doAction: boolean): Object[] {
  var replyMessages: Object[];
  if (doAction) {
    // 参照するスプレッドシート
    var SpreadSheet = getSpreadSheet(userId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    // ゲームのシートを取得
    var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
    // 職業のシートを取得
    var workSheet = SpreadSheet.getSheetByName(WORK_DATA_SHEET_NAME);
    // 今選べる職業
    var workId: number = gameSheet.getRange(CAN_CHOOSE_WORK_ID_RANGE).getValue();
    // その職業の給料
    var saraly = workSheet.getRange(BASE_SARALY_COLUMN + (workId+1)).getValue();
    // その職業の名前
    var workName = workSheet.getRange(WORK_NAME_COLUMN + (workId + 1)).getValue();
    // 設定
    personSheet.getRange(WORK_RANGE).setValue(workId);
    personSheet.getRange(SARALY_RANGE).setValue(saraly);

    replyMessages = [stringToMessage(workName + "に就きました")];
  } else {
    replyMessages = [stringToMessage("この職業につくのをやめます")];
  }
  //フラグを消す
  setChooseWork(userId, false);
  return replyMessages;
}

function moveAction(userId: string): Object[] {
  //返り値
  var replyMessages: Object[];

  // 移動できるかどうかの確認
  if (!canMove(userId)) {
    //動ける様に
    setMovable(userId, true);
    // ターンは終わり
    setFinishTurn(userId, true);
    replyMessages = [stringToMessage('このターンは休みです'), getNextUserTemplate()];
    return replyMessages;
  }

  //サイコロをふる
  var dice: number = Math.floor(Math.random() * 6) + 1;

  //振った目の出力
  const DICE_EMOJI = '\u{1F3B2}';
  var diceMessages: Object[] = [stringToMessage(DICE_EMOJI + dice + 'です')];

  replyMessages = diceMessages;

  // マスのリストを取得
  var placeList: Space[] = movePiece(userId, dice);

  // リストの要素毎にアクション
  var replyMessagesAfterDice = spaceListAction(userId, placeList);
  replyMessages = replyMessages.concat(replyMessagesAfterDice);

  return replyMessages;
}

function spaceListAction(userId: string, placeList: Space[], showSpace: boolean = true): Object[] {
  var replyMessages:Object[] = [];
  var needAction = false;
  for (let i = 0; i < placeList.length; i++) {
    if (i == 0){
      var obj = SpaceAction(userId, placeList[i], showSpace);
    }else{
      var obj = SpaceAction(userId, placeList[i]);
    }

    replyMessages = replyMessages.concat(obj.replyMessages);
    // プレーヤーのアクションを求めている
    if (obj.needAction) {
      needAction = obj.needAction;
      // 保存するマスのリスト(今見ているの以降)
      var savePlaceList = placeList.slice(i);
      // 今フラグ立てるのに引っかかったものを消す
      if (savePlaceList[0].canChooseWork) {//職業選択
        savePlaceList[0].canChooseWork = false;
      } else if (savePlaceList[0].canTakeLifeInsurance) {//生命保険
        savePlaceList[0].canTakeLifeInsurance = false;
      } else if (savePlaceList[0].canBuyHouse) {//家
        savePlaceList[0].canBuyHouse = false
      } else if (savePlaceList[0].canTakeFireInsurance) {//火災保険
        savePlaceList[0].canTakeFireInsurance = false
      } else if (savePlaceList[0].canBuyStock) {//株
        savePlaceList[0].canBuyStock = false
      }
      saveSpace(userId, savePlaceList);
    }
  }
  if (!needAction && !isGoaled(userId)){
    setFinishTurn(userId, true);
    replyMessages.push(getNextUserTemplate());
  }
  return replyMessages;
}
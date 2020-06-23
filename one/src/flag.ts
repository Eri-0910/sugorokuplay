interface Flag {
  isRepayDebt: boolean;
  isBorrowDebt: boolean;
  isChooseWork: boolean;
  isLifeInsurance: boolean;
  isFireInsurance: boolean;
  isChooseHouse: boolean;
  isStock: boolean;
  hasFinished: boolean;
}

/**
 * フラグの確認
 * @param userId ユーザーID
 * @return フラグ
 */
function getFlag(userId: string): Flag {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  // 配列にして一気に読み出す
  var readData: any = gameSheet.getRange(2, 10, 8, 1).getValues();

  // フラグの確認
  var flag: Flag = {
    isRepayDebt: readData[0][0],
    isBorrowDebt: readData[1][0],
    isChooseWork: readData[2][0],
    isLifeInsurance: readData[3][0],
    isChooseHouse: readData[4][0],
    isFireInsurance: readData[5][0],
    isStock: readData[6][0],
    hasFinished: readData[7][0],
  };
  return flag;
}

/**
 * 借金支払いフラグを変更する
 * @param userId ユーザーID
 * @param isRepay 借金支払いに入ったらtrue
 */
function setRepayDebt(userId: string, isRepay: boolean) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
　gameSheet.getRange(REPAY_DEBT_FLAG_RANGE).setValue(Number(isRepay));
}

/**
 * 借金を借りるフラグを変更する
 * @param userId ユーザーID
 * @param isBorrow 借金に入ったらtrue
 */
function setBorrowDebt(userId: string, isBorrow: boolean) {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // これでフラグの載っているのシートを取得
    var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
    //フラグをセット
    gameSheet.getRange(BORROW_DEBT_FLAG_RANGE).setValue(Number(isBorrow));
}

/**
 * 職業選択フラグを変更する
 * @param userId ユーザーID
 * @param isChooseWork 職業選択に入ったらtrue
 * @param workId つける職業のID
 */
function setChooseWork(userId: string, isChooseWork: boolean, workId?:number) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
  gameSheet.getRange(CHOOSE_WORK_FLAG_RANGE).setValue(Number(isChooseWork));
  gameSheet.getRange(CAN_CHOOSE_WORK_ID_RANGE).setValue(workId);
}

/**
 * 家購入フラグを変更する
 * @param userId ユーザーID
 * @param isChooseHouse 家購入に入ったらtrue
 */
function setChooseHouse(userId: string, isChooseHouse: boolean) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
  gameSheet.getRange(CHOOSE_HOUSE_FLAG_RANGE).setValue(Number(isChooseHouse));
}

/**
 * 生命保険フラグを変更する
 * @param userId ユーザーID
 * @param isLifeInsurance 生命保険加入に入ったらtrue
 */
function setLifeInsurance(userId: string, isLifeInsurance: boolean) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
  gameSheet.getRange(LIFE_INSURANCE_FLAG_RANGE).setValue(Number(isLifeInsurance));
}

/**
 * 火災保険加入フラグを変更する
 * @param userId ユーザーID
 * @param isFireInsurance 火災保険加入に入ったらtrue
 */
function setFireInsurance(userId: string, isFireInsurance: boolean) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
  gameSheet.getRange(FIRE_INSURANCE_FLAG_RANGE).setValue(Number(isFireInsurance));
}

/**
 * 株購入フラグを変更する
 * @param userId ユーザーID
 * @param isStock 株購入に入ったらtrue
 */
function setStock(userId: string, isStock: boolean, stockValue?: number) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
  gameSheet.getRange(STOCK_FLAG_RANGE).setValue(Number(isStock));
  if (stockValue!=null) {
    gameSheet.getRange(STOCK_VALUE_RANGE).setValue(stockValue);
  }else{
    gameSheet.getRange(STOCK_VALUE_RANGE).setValue(null);
  }
}

/**
 * ターン終了フラグを変更する
 * @param userId ユーザーID
 * @param isStock ターン終了ならtrue
 */
function setFinishTurn(userId: string, finished: boolean) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
  gameSheet.getRange(FINISH_TURN_RANGE).setValue(Number(finished));
}
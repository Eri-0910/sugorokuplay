interface Flag {
  isRepayDebt: boolean;
  isBorrowDebt: boolean;
  isChooseWork: boolean;
  isLifeInsurance: boolean;
  isFireInsurance: boolean;
  isChooseHouse: boolean;
  isStock: boolean;
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
  // フラグの確認
  var flag: Flag = {
    isRepayDebt: gameSheet.getRange(REPAY_DEBT_FLAG_RANGE).getValue(),
    isBorrowDebt: gameSheet.getRange(BORROW_DEBT_FLAG_RANGE).getValue(),
    isChooseWork: gameSheet.getRange(CHOOSE_WORK_FLAG_RANGE).getValue(),
    isLifeInsurance: gameSheet.getRange(LIFE_INSURANCE_FLAG_RANGE).getValue(),
    isFireInsurance: gameSheet.getRange(FIRE_INSURANCE_FLAG_RANGE).getValue(),
    isChooseHouse: gameSheet.getRange(CHOOSE_HOUSE_FLAG_RANGE).getValue(),
    isStock: gameSheet.getRange(STOCK_FLAG_RANGE).getValue(),
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
 * 
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
function setStock(userId: string, isStock: boolean) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(userId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
  gameSheet.getRange(STOCK_FLAG_RANGE).setValue(Number(isStock));
}
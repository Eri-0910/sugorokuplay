interface ConfigFlag {
  isOnConfig: boolean;
  isOnSettingNum: boolean;
  isOnSettingName: number;
}

/**
 * フラグの確認
 * @param gorupId グループID
 * @return フラグ
 */
function getConfigFlag(gorupId: string): ConfigFlag {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(gorupId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  // 配列にして一気に読み出す
  var readData: any = gameSheet.getRange(12, 10, 3, 1).getValues();

  // フラグの確認
  var flag: ConfigFlag = {
    isOnConfig: readData[0][0],
    isOnSettingNum: readData[1][0],
    isOnSettingName: readData[2][0],
  };
  return flag;
}

/**
 * 設定中フラグを変更する
 * @param gorupId グループID
 * @param isOnConfig 設定中ならtrue
 */
function setOnConfig(gorupId: string, isOnConfig: boolean) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(gorupId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
  gameSheet.getRange(GAME_CONFIG_FLAG_RANGE).setValue(Number(isOnConfig));
}

/**
 * 人数設定中フラグを変更する
 * @param gorupId グループID
 * @param isOnSettingNum 人数設定中ならtrue
 */
function setOnSettingNum(gorupId: string, isOnSettingNum: boolean) {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(gorupId);
    // これでフラグの載っているのシートを取得
    var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
    //フラグをセット
  gameSheet.getRange(USER_NUM_FLAG_RANGE).setValue(Number(isOnSettingNum));
}

/**
 * 名前登録中フラグを変更する
 * @param gorupId グループID
 * @param restSettingName 後何人
 */
function setOnSettingName(gorupId: string, restSettingName:number) {
  //ユーザーのシートを手に入れる
  var SpreadSheet = getSpreadSheet(gorupId);
  // これでフラグの載っているのシートを取得
  var gameSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
  //フラグをセット
  gameSheet.getRange(USER_NAME_FLAG_RANGE).setValue(Number(restSettingName));
}
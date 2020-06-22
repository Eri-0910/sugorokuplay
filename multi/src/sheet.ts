/// <reference path="key.ts"/>
// プロファイル取得用のAPIのURL
var line_endpoint_profile = 'https://api.line.me/v2/bot/profile';
//プロパティのあれ長いので短く
var scriptProperties = PropertiesService.getScriptProperties();

/**
 * ScriptPropertiesのデータを元にシートが存在するかどうかを確認する。
 * @param {string} user_id -ユーザーID
 * @return {boolean} シートが存在するかどうかを真偽値で返す
 */
function isExistSheet(user_id: string): boolean{
  var sheetId = scriptProperties.getProperty(user_id);
  var isExist: boolean;
  if (sheetId == null) {
    isExist = false;
  }else{
    isExist = true;
  }
  return isExist;
}


/**
 * ユーザーのシートを取得する。なければcreateSpreadSheetを用いて新規作成する。
 * @param {string} user_id -ユーザーID
 * @return {GoogleAppsScript.Spreadsheet.Spreadsheet} そのユーザーのシートを返す
 */
function getSpreadSheet(user_id: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
  //プロパティストアからシートのIDを探す
  var sid = scriptProperties.getProperty(user_id);
  if (sid == null) {
    //IDがなければシートもないので作る
    return createSpreadSheet(user_id);
  } else {
    //IDがあるならシートを開こうとする
    try {
      return SpreadsheetApp.openById(sid);
    } catch(e) {
      //バグったら考えるのめんどくさいからシート作っちゃう
      return createSpreadSheet(user_id);
    }
  }
}

/**
 * ユーザーのシートを新規作成する。ユーザーのIDとシートのIDはScriptPropertiesに保管される。
 * @param {string} user_id -ユーザーID
 * @return {GoogleAppsScript.Spreadsheet.Spreadsheet} 作成したシートを返す
 */
function createSpreadSheet(user_id: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
  //元となるスープレッドシート
  var originSheet = SpreadsheetApp.openById(ORIGINAL_SHEET_ID);
  //コピーして新しく名前つけたスプレッドシート
  var spreadSheet = originSheet.copy(user_id);
  //プロパティストアにIDとシートのIDをペアで保存
  scriptProperties.setProperty(user_id, spreadSheet.getId());
  //ドライブにファイルを入れる
  var file = DriveApp.getFileById(spreadSheet.getId());
  //あとでアクセスできるように設定
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return spreadSheet;
}

/**
 * ユーザーのシートを削除する。ゴミ箱にも入れない。
 * ScriptPropertiesからも削除する。
 * @param {string} user_id -ユーザーID
 */
function deleteData(user_id: string) {
  var SpreadSheet = getSpreadSheet(user_id);
  //ゴミ箱に入れずに削除
  scriptProperties.deleteProperty(user_id);
  Drive.Files.remove(SpreadSheet.getId());
}

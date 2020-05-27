function statusAction(userId){
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // これで１枚のシートを取得
    var sheetData = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    //金額変更
    var nowMoney = sheetData.getRange(MONEY_RANGE).getValue();
    var replyMessage = ['現在のステータスです。\n 所持金:' + nowMoney];
    return replyMessage;
}
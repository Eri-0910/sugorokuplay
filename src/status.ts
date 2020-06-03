function statusAction(userId):Object[]{
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    //金額
    var nowMoney = personSheet.getRange(MONEY_RANGE).getValue();
    var nowDebt: string = personSheet.getRange(DEBT_RANGE).getValue();
    var nowWorkID = personSheet.getRange(WORK_RANGE).getValue();
    var nowWork = "";
    if (nowWorkID == 0) {
        nowWork = "仕事はありません";
    } else {
        var workSheet = SpreadSheet.getSheetByName(WORK_DATA_SHEET_NAME);
        nowWork = workSheet.getRange(WORK_NAME_COLUMN + (nowWorkID+1)).getValue();
    }
    var nowHaveHouse = personSheet.getRange(HAS_HOUSE_RANGE).getValue();
    var houseValue: string = '0';
    if (nowHaveHouse) {
        houseValue = personSheet.getRange(HOUSE_MONEY_RANGE).getValue();
    }
    var nowHasPartner: string = personSheet.getRange(HAS_PARTNER_RANGE).getValue();
    var nowChild: string = personSheet.getRange(CHIRD_NUM_RANGE).getValue();
    var nowLifeInsurance: string = personSheet.getRange(IN_LIFE_INSURANCE_RANGE).getValue();
    var nowFireInsurance:string = personSheet.getRange(IN_FIRE_INSURANCE_RANGE).getValue();
    var replyMessage = '現在のステータスです。\n 所持金:' + nowMoney + '\n 借金:' + nowDebt + '\n 仕事:' + nowWork + '\n 配偶者:' + nowHasPartner + '\n 子供:' + nowChild + '\n 生命保険:' + nowLifeInsurance + '\n 火災保険:' + nowFireInsurance;
    var reply = stringToMessage(replyMessage);
    makePrintLog(reply);
    return [reply];
}
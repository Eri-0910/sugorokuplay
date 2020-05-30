function getNextMessage(userId){
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // これで１枚のシートを取得
    var dataSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);

    //現在の状態を知る
    var leftMessageNum = dataSheet.getRange(NEXT_TEXT_NUM_RANGE).getValue();

    //今から送るメッセージのかずと、残りのメッセージの数を決める
    var replyMessageNum;
    if (leftMessageNum > 5){
        dataSheet.getRange(NEXT_TEXT_NUM_RANGE).setValue(leftMessageNum-4);
        replyMessageNum = 4;
    } else{
        dataSheet.getRange(NEXT_TEXT_NUM_RANGE).setValue(0);
        replyMessageNum = leftMessageNum;
    }

    //メッセージ決め
    var replyMessages = [];
    if (replyMessageNum == 0){
        replyMessages.push('そのコマンドは無効です');
    } else{
      for(let i=0; i < replyMessageNum; i++){
        const nextText = dataSheet.getRange('D1').getValue();
        replyMessages.push(nextText);
        dataSheet.getRange(NEXT_TEXT_COLUMN + '1').deleteCells(SpreadsheetApp.Dimension.ROWS);
      }
    }
    return replyMessages;
}

function setNextMessage(userId, lst){
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // これで１枚のシートを取得
    var dataSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);

    //現在の状態を知る
    var leftMessageNum = dataSheet.getRange(NEXT_TEXT_NUM_RANGE).getValue();
    dataSheet.getRange(NEXT_TEXT_NUM_RANGE).setValue(leftMessageNum + lst.length);

   for (let i = 0; i < lst.length; i++) {
            const writeRow = leftMessageNum + i + 1;
            dataSheet.getRange(NEXT_TEXT_COLUMN + writeRow).setValue(lst[i]);
   }
}

/**
 * 続きのメッセージがあるかどうか
 * @param {String} userId ユーザーID
 * @return {boolean} あるかどうか
 */
function hasNextMessage(userId) {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // ゲーム状況のシートを取得
    var dataSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
    //現在の残りメッセージ数を知る
    var leftMessageNum = dataSheet.getRange(NEXT_TEXT_NUM_RANGE).getValue();
    //返り値設定
    var hasNext;
    if (leftMessageNum==0){//残りメッセージなし
        hasNext = false;
    }else{//あり
        hasNext = true;
    }
    return hasNext;
}
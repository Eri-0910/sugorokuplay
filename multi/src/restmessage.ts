/**
 * 残っているメッセージを送れるだけ取得する
 * @param userId ユーザーID
 * @return 出力するもの
 */
function getNextMessage(userId: string):Object[]{
    //　ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // ゲームデータのシートを取得
    var dataSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);

    //現在の状態を知る
    var leftMessageNum = dataSheet.getRange(NEXT_TEXT_NUM_RANGE).getValue();

    //今から送るメッセージのかずと、残りのメッセージの数を決める
    var replyMessageNum: number;
    if (leftMessageNum > 5){//6件以上あるなら4件だけ出力
        dataSheet.getRange(NEXT_TEXT_NUM_RANGE).setValue(leftMessageNum-4);
        replyMessageNum = 4;
    } else{//5件以下なら全部出力
        dataSheet.getRange(NEXT_TEXT_NUM_RANGE).setValue(0);
        replyMessageNum = leftMessageNum;
    }

    //メッセージ決め
    var replyMessages:Object[] = [];
    if (replyMessageNum == 0){
        replyMessages.push(stringToMessage('そのコマンドは無効です'));
    } else{
      for(let i=0; i < replyMessageNum; i++){
        const range:string = NEXT_TEXT_COLUMN + '1';
        const nextText = dataSheet.getRange(range).getValue();
        replyMessages.push(JSON.parse(nextText));
        dataSheet.getRange(range).deleteCells(SpreadsheetApp.Dimension.ROWS);
      }
    }
    return replyMessages;
}

/**
 * 次に出力するメッセージをJSONを文字列にしたもので保存
 * @param userId ユーザーID
 * @param lst 保存したいもののリスト
 */
function setNextMessage(userId: string, lst: Object[]){
    //　ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // ゲームデータのシートを取得
    var dataSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);

    // 現在の状態を知る
    var leftMessageNum:number= dataSheet.getRange(NEXT_TEXT_NUM_RANGE).getValue();
    // 残っているコメントの数を更新
    dataSheet.getRange(NEXT_TEXT_NUM_RANGE).setValue(leftMessageNum + lst.length);

    // 1つずつ保存
    for (let i = 0; i < lst.length; i++) {
        //書き込み行
        const writeRow: number = leftMessageNum + i + 1;
        //書き込む内容の変換
        var writeData:string = JSON.stringify(lst[i]);
        dataSheet.getRange(NEXT_TEXT_COLUMN + writeRow).setValue(writeData);
    }
}

/**
 * 続きのメッセージがあるかどうか
 * @param {String} userId ユーザーID
 * @return {boolean} あるかどうか
 */
function hasNextMessage(userId: string): boolean {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // ゲーム状況のシートを取得
    var dataSheet = SpreadSheet.getSheetByName(GAME_DATA_SHEET_NAME);
    //現在の残りメッセージ数を知る
    var leftMessageNum = dataSheet.getRange(NEXT_TEXT_NUM_RANGE).getValue();
    //返り値設定
    var hasNext: boolean;
    if (leftMessageNum==0){//残りメッセージなし
        hasNext = false;
    }else{//あり
        hasNext = true;
    }
    return hasNext;
}
/**
 * コマを動かし、指示を見るべきマスのリストを返す
 * @param userId ユーザーID
 * @param num サイコロの目
 * @return Space型のマスのリスト
 */
function movePiece(userId: string, num:number): Space[] {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // これで１枚のシートを取得
    var dataSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);

    // 現在位置を取得
    var startPlace:number = dataSheet.getRange(NOW_PLACE_RANGE).getValue();

    // 1マスずつみる
    var oneSpaceRow:number = startPlace + num + 1;
    // やるべきマスのリストを取得
    // 駒の位置を更新
    dataSheet.getRange(NOW_PLACE_RANGE).setValue(startPlace + num);
    // 返す
    var spaceList: Space[] = [{
        id: dataSheet.getRange(SPACE_ID_COLUMN + oneSpaceRow).getValue(),
        content: dataSheet.getRange(SPACE_CONTENT_COLUMN + oneSpaceRow).getValue(),
        isGo: dataSheet.getRange(IS_GO_COLUMN + oneSpaceRow).getValue(),
        goNum: dataSheet.getRange(GO_NUM_COLUMN + oneSpaceRow).getValue(),
        isBack: dataSheet.getRange(IS_BACK_COLUMN + oneSpaceRow).getValue(),
        backNum:  dataSheet.getRange(BACK_NUM_COLUMN + oneSpaceRow).getValue(),
        isStop:  dataSheet.getRange(IS_STOP_COLUMN + oneSpaceRow).getValue(),
        stopTurn:  dataSheet.getRange(STOP_TURN_COLUMN + oneSpaceRow).getValue(),
        isGet:  dataSheet.getRange(IS_GET_MONEY_COLUMN + oneSpaceRow).getValue(),
        getNum:  dataSheet.getRange(GET_MONEY_AMOUNT_COLUMN + oneSpaceRow).getValue(),
        isPay: dataSheet.getRange(IS_PAY_MONEY_COLUMN + oneSpaceRow).getValue(),
        payNum:  dataSheet.getRange(PAY_MONEY_AMOUNT_COLUMN + oneSpaceRow).getValue(),
        isThroughAction:  dataSheet.getRange(IS_THROUGH_ACTION_COLUMN + oneSpaceRow).getValue(),
        isMustStop:  dataSheet.getRange(IS_MUST_STOP_SPACE_COLUMN + oneSpaceRow).getValue(),
        isPayDay:  dataSheet.getRange(IS_PAY_DAY_COLUMN + oneSpaceRow).getValue(),
        isMarriage:  dataSheet.getRange(IS_MARRIAGE_COLUMN + oneSpaceRow).getValue(),
        isBirthChild:  dataSheet.getRange(IS_BIRTH_CHILD_COLUMN + oneSpaceRow).getValue(),
        childNum:  dataSheet.getRange(CHILD_NUM_COLUMN + oneSpaceRow).getValue(),
        canBuyHouse:  dataSheet.getRange(CAN_BUY_HOUSE_COLUMN + oneSpaceRow).getValue(),
        isLostHOuse:  dataSheet.getRange(IS_LOST_HOUSE_COLUMN + oneSpaceRow).getValue(),
        canTakeLifeInsurance:  dataSheet.getRange(CAN_LIFE_INSURANCE_COLUMN + oneSpaceRow).getValue(),
        canTakeFireInsurance:  dataSheet.getRange(CAN_FIRE_INSURANCE_COLUMN + oneSpaceRow).getValue(),
        canBuyStock:  dataSheet.getRange(CAN_BUY_STOCK_COLUMN + oneSpaceRow).getValue(),
        stockValue:  dataSheet.getRange(STOCK_VALUE_COLUMN + oneSpaceRow).getValue(),
    }]

    return spaceList
}

/**
 * 指示に従ってステータスを変更したり、未確認マスの保存をする
 * @param space マス
 */
function SpaceAction(space: Space){
    //アクション
    //給料処理
    //職業選択
    //生命保険
    //家
    //火災保険
    //株
    //結婚
    //出産
    //お金変化
    //進む
    //戻る
    //休み
    //ゴール
}

interface Space{
    id: number;
    content: string;
    isGo: boolean;
    goNum: number;
    isBack: boolean;
    backNum: number;
    isStop: boolean;
    stopTurn: number;
    isGet: boolean;
    getNum: number;
    isPay: boolean;
    payNum: number;
    isThroughAction: boolean;
    isMustStop: boolean;
    isPayDay: boolean;
    isMarriage: boolean;
    isBirthChild: boolean;
    childNum: number;
    canBuyHouse: boolean;
    isLostHOuse: boolean;
    canTakeLifeInsurance: boolean;
    canTakeFireInsurance: boolean;
    canBuyStock: boolean;
    stockValue: boolean;
}
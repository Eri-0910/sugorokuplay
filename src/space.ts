/**
 * コマを動かし、指示を見るべきマスのリストを返す
 * @param userId ユーザーID
 * @param num サイコロの目
 * @return Space型のマスのリスト
 */
function movePiece(userId: string, num:number): Space[] {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // 個人のシートを取得
    var personalDataSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);

    // 現在位置を取得
    var startPlace: number = personalDataSheet.getRange(NOW_PLACE_RANGE).getValue();

    // 1マスずつみる
    var oneSpaceRow:number = startPlace + num + 1;
    // やるべきマスのリストを取得
    // 駒の位置を更新
    personalDataSheet.getRange(NOW_PLACE_RANGE).setValue(startPlace + num);

    // ボードシートを取得
    var boardDataSheet = SpreadSheet.getSheetByName(BOARD_DATA_SHEET_NAME);

    // 返す
    var spaceList: Space[] = [{
        id: boardDataSheet.getRange(SPACE_ID_COLUMN + oneSpaceRow).getValue(),
        content: boardDataSheet.getRange(SPACE_CONTENT_COLUMN + oneSpaceRow).getValue(),
        isGo: boardDataSheet.getRange(IS_GO_COLUMN + oneSpaceRow).getValue(),
        goNum: boardDataSheet.getRange(GO_NUM_COLUMN + oneSpaceRow).getValue(),
        isBack: boardDataSheet.getRange(IS_BACK_COLUMN + oneSpaceRow).getValue(),
        backNum: boardDataSheet.getRange(BACK_NUM_COLUMN + oneSpaceRow).getValue(),
        isStop: boardDataSheet.getRange(IS_STOP_COLUMN + oneSpaceRow).getValue(),
        stopTurn: boardDataSheet.getRange(STOP_TURN_COLUMN + oneSpaceRow).getValue(),
        isGet: boardDataSheet.getRange(IS_GET_MONEY_COLUMN + oneSpaceRow).getValue(),
        getNum: boardDataSheet.getRange(GET_MONEY_AMOUNT_COLUMN + oneSpaceRow).getValue(),
        isPay: boardDataSheet.getRange(IS_PAY_MONEY_COLUMN + oneSpaceRow).getValue(),
        payNum: boardDataSheet.getRange(PAY_MONEY_AMOUNT_COLUMN + oneSpaceRow).getValue(),
        isThroughAction: boardDataSheet.getRange(IS_THROUGH_ACTION_COLUMN + oneSpaceRow).getValue(),
        isMustStop: boardDataSheet.getRange(IS_MUST_STOP_SPACE_COLUMN + oneSpaceRow).getValue(),
        isPayDay: boardDataSheet.getRange(IS_PAY_DAY_COLUMN + oneSpaceRow).getValue(),
        isMarriage: boardDataSheet.getRange(IS_MARRIAGE_COLUMN + oneSpaceRow).getValue(),
        isBirthChild: boardDataSheet.getRange(IS_BIRTH_CHILD_COLUMN + oneSpaceRow).getValue(),
        childNum: boardDataSheet.getRange(CHILD_NUM_COLUMN + oneSpaceRow).getValue(),
        canBuyHouse: boardDataSheet.getRange(CAN_BUY_HOUSE_COLUMN + oneSpaceRow).getValue(),
        isLostHOuse: boardDataSheet.getRange(IS_LOST_HOUSE_COLUMN + oneSpaceRow).getValue(),
        canTakeLifeInsurance: boardDataSheet.getRange(CAN_LIFE_INSURANCE_COLUMN + oneSpaceRow).getValue(),
        canTakeFireInsurance: boardDataSheet.getRange(CAN_FIRE_INSURANCE_COLUMN + oneSpaceRow).getValue(),
        canBuyStock: boardDataSheet.getRange(CAN_BUY_STOCK_COLUMN + oneSpaceRow).getValue(),
        stockValue: boardDataSheet.getRange(STOCK_VALUE_COLUMN + oneSpaceRow).getValue(),
    }]

    return spaceList
}

/**
 * 指示に従ってステータスを変更したり、未確認マスの保存をする
 * @param space マス
 */
function SpaceAction(space: Space):Object[]{
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

    // 空になるのを防ぐ
    var content = (space.content == "") ? "ゴール済みです" : space.content;
    var money = (space.getNum == 0) ? 0 : space.getNum;
    var move = (space.goNum == 0) ? 0 : space.goNum;

    //マスの内容
    var placeMessage = getPlaceMessage(content, money, move);
    return [placeMessage];
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
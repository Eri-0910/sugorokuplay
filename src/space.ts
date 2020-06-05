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
    var oneSpaceId:number = startPlace + num ;
    // やるべきマスのリストを取得
    // 駒の位置を更新
    personalDataSheet.getRange(NOW_PLACE_RANGE).setValue(startPlace + num);
    // 返す
    var spaceList: Space[] = [getSpace(userId, oneSpaceId)]

    return spaceList
}

/**
 * コマを指定の位置へ動かし、指示を見るべきマスを返す
 * @param userId ユーザーID
 * @param spaceId 移動先
 * @return Space型のマス
 */
function movePieceTo(userId: string, spaceId: number): Space {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // 個人のシートを取得
    var personalDataSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);

    // 駒の位置を更新
    personalDataSheet.getRange(NOW_PLACE_RANGE).setValue(spaceId);
    // 返す
    var space: Space = getSpace(userId, spaceId);

    return space;
}



/**
 * マスの内容を手に入れられる
 * @param userId ユーザーID
 * @param spaceId マスのID
 */
function getSpace(userId:string, spaceId:number):Space{
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // ボードシートを取得
    var boardDataSheet = SpreadSheet.getSheetByName(BOARD_DATA_SHEET_NAME);
    var spaceRow:number = spaceId+1;
    var space:Space = {
        id: boardDataSheet.getRange(SPACE_ID_COLUMN + spaceRow).getValue(),
        content: boardDataSheet.getRange(SPACE_CONTENT_COLUMN + spaceRow).getValue(),
        isGo: boardDataSheet.getRange(IS_GO_COLUMN + spaceRow).getValue(),
        goNum: boardDataSheet.getRange(GO_NUM_COLUMN + spaceRow).getValue(),
        isBack: boardDataSheet.getRange(IS_BACK_COLUMN + spaceRow).getValue(),
        backNum: boardDataSheet.getRange(BACK_NUM_COLUMN + spaceRow).getValue(),
        isStop: boardDataSheet.getRange(IS_STOP_COLUMN + spaceRow).getValue(),
        stopTurn: boardDataSheet.getRange(STOP_TURN_COLUMN + spaceRow).getValue(),
        isGet: boardDataSheet.getRange(IS_GET_MONEY_COLUMN + spaceRow).getValue(),
        getNum: boardDataSheet.getRange(GET_MONEY_AMOUNT_COLUMN + spaceRow).getValue(),
        isPay: boardDataSheet.getRange(IS_PAY_MONEY_COLUMN + spaceRow).getValue(),
        payNum: boardDataSheet.getRange(PAY_MONEY_AMOUNT_COLUMN + spaceRow).getValue(),
        isThroughAction: boardDataSheet.getRange(IS_THROUGH_ACTION_COLUMN + spaceRow).getValue(),
        isMustStop: boardDataSheet.getRange(IS_MUST_STOP_SPACE_COLUMN + spaceRow).getValue(),
        isPayDay: boardDataSheet.getRange(IS_PAY_DAY_COLUMN + spaceRow).getValue(),
        isMarriage: boardDataSheet.getRange(IS_MARRIAGE_COLUMN + spaceRow).getValue(),
        isBirthChild: boardDataSheet.getRange(IS_BIRTH_CHILD_COLUMN + spaceRow).getValue(),
        childNum: boardDataSheet.getRange(CHILD_NUM_COLUMN + spaceRow).getValue(),
        canBuyHouse: boardDataSheet.getRange(CAN_BUY_HOUSE_COLUMN + spaceRow).getValue(),
        isLostHOuse: boardDataSheet.getRange(IS_LOST_HOUSE_COLUMN + spaceRow).getValue(),
        canTakeLifeInsurance: boardDataSheet.getRange(CAN_LIFE_INSURANCE_COLUMN + spaceRow).getValue(),
        canTakeFireInsurance: boardDataSheet.getRange(CAN_FIRE_INSURANCE_COLUMN + spaceRow).getValue(),
        canBuyStock: boardDataSheet.getRange(CAN_BUY_STOCK_COLUMN + spaceRow).getValue(),
        stockValue: boardDataSheet.getRange(STOCK_VALUE_COLUMN + spaceRow).getValue(),
        canChooseWork: boardDataSheet.getRange(CAN_CHOOSE_WORK_COLUMN + spaceRow).getValue(),
        choosableWorkId: boardDataSheet.getRange(CHOOSABLE_WORK_ID_COLUMN + spaceRow).getValue(),
    }
    return space;
}

/**
 * 指示に従ってステータスを変更したり、未確認マスの保存をする
 * @param space マス
 */
function SpaceAction(userId:string, space: Space):Object[]{
    if (space.id >= GOAL_PLACE_NUMBER) {//ゴール
        return [stringToMessage("ゴールです")];
    }

    // 返信するメッセージ
    var replyMessages:Object[] = [];

    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // 個人のシートを取得
    var personalDataSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);


    // マスの内容
    var placeMessage:Object = getPlaceMessage(space);
    replyMessages.push(placeMessage);

    // アクション
    if (space.isPayDay) { //給料処理
        replyMessages.push(stringToMessage("給料日です"));
    } else if (space.canChooseWork) {//職業選択
        replyMessages.push(stringToMessage("職業に就くことができます"));
        setChooseWork(userId, true);
    } else if (space.canTakeLifeInsurance) {//生命保険
        replyMessages.push(stringToMessage("生命保険に入ることができます"));
        setLifeInsurance(userId, true);
    } else if (space.canBuyHouse) {//家
        replyMessages.push(stringToMessage("家を買うことができます"));
        setChooseHouse(userId, true);
    } else if (space.canTakeFireInsurance) {//火災保険
        replyMessages.push(stringToMessage("火災保険に入れます"));
        setFireInsurance(userId, true);
    } else if (space.canBuyStock) {//株
        replyMessages.push(stringToMessage("株を買うことができます"));
        setStock(userId, true);
    } else if (space.isMarriage) {//結婚
        //変化させる
        personalDataSheet.getRange(HAS_PARTNER_RANGE).setValue(1);

        replyMessages.push(stringToMessage("結婚しました"));

    } else if (space.isBirthChild) {//出産
        //今の子供の数
        var nowChildNum = personalDataSheet.getRange(CHIRD_NUM_RANGE).getValue();
        //変化させる
        personalDataSheet.getRange(CHIRD_NUM_RANGE).setValue(nowChildNum + space.childNum);

        replyMessages.push(stringToMessage("子供が生まれました。現在の子供の数は" + (nowChildNum + space.childNum) + "人です"));

    } else if (space.isGet) {//お金をもらう
        //今の所持金
        var nowMoney = personalDataSheet.getRange(MONEY_RANGE).getValue();
        //変化させる
        personalDataSheet.getRange(MONEY_RANGE).setValue(nowMoney + space.getNum);

        replyMessages.push(stringToMessage("お金を" + space.getNum + "円手に入れました"));

    } else if (space.isPay) {//お金を払う
        //今の所持金
        var nowMoney = personalDataSheet.getRange(MONEY_RANGE).getValue();
        var newMoney = nowMoney - space.payNum;
        if (newMoney < 0){
            var debt = Math.ceil(Math.abs(newMoney)/10000) * 10000;
            var nowDebt = personalDataSheet.getRange(DEBT_RANGE).getValue();
            personalDataSheet.getRange(DEBT_RANGE).setValue(nowDebt + debt);
            var debtAdded = newMoney + debt;
            //変化させる
            personalDataSheet.getRange(MONEY_RANGE).setValue(debtAdded);
            replyMessages.push(stringToMessage("お金を" + space.payNum + "円支払いました"));
            replyMessages.push(stringToMessage("金額が不足したため、" + debt + "円借金しました(現在借金" + (nowDebt + debt) + "円、所持金" + debtAdded + "円)"));

        }else{
            //変化させる
            personalDataSheet.getRange(MONEY_RANGE).setValue(newMoney);
            replyMessages.push(stringToMessage("お金を" + space.payNum + "円支払いました(現在" + newMoney + "円)"));
        }

    } else if (space.goNum) {//進む
        replyMessages.push(stringToMessage(space.goNum + "マス進みます"));
        //移動させて移動先のマスを取得
        var newSpace: Space = movePieceTo(userId, space.id + space.goNum);
        //移動アクションを実行
        var afterMoveMeassage = SpaceAction(userId, newSpace);
        //移動した結果のメッセージを送る
        replyMessages = replyMessages.concat(afterMoveMeassage);

    } else if (space.backNum) {//戻る
        replyMessages.push(stringToMessage(space.backNum + "マス戻ります"));
        //移動させて移動先のマスを取得
        var newSpace: Space = movePieceTo(userId, space.id - space.backNum);
        //移動アクションを実行
        var afterMoveMeassage = SpaceAction(userId, newSpace);
        //移動した結果のメッセージを送る
        replyMessages = replyMessages.concat(afterMoveMeassage);

    } else if (space.isStop) {//休み
        replyMessages.push(stringToMessage(space.stopTurn + "ターン休みです"));
        //動けない様に
        setMovable(userId, false);
    }
    return replyMessages;
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
    canChooseWork: boolean;
    choosableWorkId: boolean;
}

/**
 * スペースの内容からスペース内容表示用のjsonを返す
 * @param space マス
 */
function getPlaceMessage(space:Space) {

    // マスの内容
    var content: string = space.content;
    // 金額
    var money: string;
    if (space.isGet){
        money = space.getNum.toString() + "円";
    } else if (space.isPay){
        money = "-" + space.payNum.toString() + "円";
    } else{
        money = "変化なし";
    }
    //移動
    var move: string;
    if (space.isGo) {
        move = space.goNum.toString() + "マス進む";
    } else if (space.isBack) {
        move = space.backNum.toString() + "マス戻る";
    } else if (space.isStop){
        move = space.stopTurn.toString() + "ターン休み";
    } else {
        move = "なし";
    }

    return {
        "type": "flex",
        "altText": "移動結果を表示します。",
        "contents": {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "移動結果",
                        "size": "xxl",
                        "weight": "bold"
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": content,
                                        "wrap": true
                                    }
                                ],
                                "backgroundColor": "#ffffcc",
                                "borderWidth": "3px",
                                "borderColor": "#565656",
                                "cornerRadius": "3px",
                                "paddingAll": "20px"
                            }
                        ],
                        "paddingAll": "20px"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "💴",
                                        "flex": 1,
                                        "align": "center"
                                    },
                                    {
                                        "type": "separator"
                                    },
                                    {
                                        "type": "text",
                                        "text": money,
                                        "flex": 5,
                                        "margin": "md"
                                    }
                                ],
                                "paddingAll": "2px"
                            },
                            {
                                "type": "separator"
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "⇄",
                                        "flex": 1,
                                        "align": "center"
                                    },
                                    {
                                        "type": "separator"
                                    },
                                    {
                                        "type": "text",
                                        "text": move,
                                        "flex": 5,
                                        "margin": "md"
                                    }
                                ],
                                "paddingAll": "2px"
                            }
                        ],
                        "paddingAll": "10px"
                    }
                ],
                "spacing": "md"
            }
        }
    }
}
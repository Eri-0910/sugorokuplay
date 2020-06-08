/**
 * コマを動かし、指示を見るべきマスのリストを返す
 * @param userId ユーザーID
 * @param num サイコロの目
 * @return Space型のマスのリスト
 */
function movePiece(userId: string, num: number): Space[] {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // 個人のシートを取得
    var personalDataSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);

    // 現在位置を取得
    var startPlace: number = personalDataSheet.getRange(NOW_PLACE_RANGE).getValue();

    // 1マスずつみる
    for (let i = 0; i < num; i++) {
        var oneSpaceId: number = startPlace + num;
        // ボードシートを取得
        var boardDataSheet = SpreadSheet.getSheetByName(BOARD_DATA_SHEET_NAME);
        var oneSpaceRow: number = oneSpaceId + 1;
        
    // TODO #2　配列内の数字をCONSTにする

    }
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
 * 開始点から指定された数ののマスのデータを取得しリストを返す
 * @param userId ユーザーID
 * @param spaceId 開始点となるマスのID
 * @param num 取得したいマスの数
 */
function getSpaceRange(userId: string, spaceId: number, num: number): Space[] {
    var spaceList: Space[] = [];
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // ボードシートを取得
    var boardDataSheet = SpreadSheet.getSheetByName(BOARD_DATA_SHEET_NAME);
    var startSpaceRow = spaceId + 1;
    // 配列にして一気に読み出す
    var readData: any = boardDataSheet.getRange(startSpaceRow, BOARD_DATA_START_COLUMN, num, BOARD_DATA_COLUMN_NUM).getValues();
    for (let i = 0; i < num; i++) {
        spaceList.push(getSpaceByArray(readData[i]));
    }
    return spaceList
}

/**
 * 1マスの内容を手に入れられる
 * @param userId ユーザーID
 * @param spaceId マスのID
 */
function getSpace(userId: string, spaceId: number): Space {
    var spaceList: Space[] = getSpaceRange(userId, spaceId, 1);
    return spaceList[0];
}

/**
 * 配列からマスの内容を手に入れられる
 * @param spaceId マスのID
 */
function getSpaceByArray(spaceArray: any[]): Space {
    // TODO #2　配列内の数字をCONSTにする
    var space: Space = {
        id: spaceArray[0],
        content: spaceArray[1],
        isGo: spaceArray[2],
        goNum: spaceArray[3],
        isBack: spaceArray[4],
        backNum: spaceArray[5],
        isStop: spaceArray[6],
        stopTurn: spaceArray[7],
        isGet: spaceArray[8],
        getNum: spaceArray[9],
        isPay: spaceArray[10],
        payNum: spaceArray[11],
        isThroughAction: spaceArray[12],
        isMustStop: spaceArray[13],
        isPayDay: spaceArray[14],
        isMarriage: spaceArray[15],
        isBirthChild: spaceArray[16],
        childNum: spaceArray[17],
        canBuyHouse: spaceArray[18],
        isLostHOuse: spaceArray[19],
        canTakeLifeInsurance: spaceArray[20],
        canTakeFireInsurance: spaceArray[21],
        canBuyStock: spaceArray[22],
        stockValue: spaceArray[23],
        canChooseWork: spaceArray[24],
        choosableWorkId: spaceArray[25],
    }
    return space;
}

/**
 * 指示に従ってステータスを変更したり、未確認マスの保存をする
 * @param space マス
 */
function SpaceAction(userId: string, space: Space): Object[] {
    if (space.id >= GOAL_PLACE_NUMBER) {//ゴール
        return [stringToMessage("ゴールです")];
    }

    // 返信するメッセージ
    var replyMessages: Object[] = [];

    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(userId);
    // 個人のシートを取得
    var personalDataSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);


    // マスの内容
    var placeMessage: Object = getPlaceMessage(space);
    replyMessages.push(placeMessage);

    // アクション
    if (space.isPayDay) { //給料処理
        replyMessages.push(stringToMessage("給料日です"));
        // 職業の給料
        var saraly: number = personalDataSheet.getRange(SARALY_RANGE).getValue();
        var workId: number = personalDataSheet.getRange(WORK_RANGE).getValue();
        var nowMoney: number = personalDataSheet.getRange(MONEY_RANGE).getValue();

        if (workId != 10 && workId != 9) {
            personalDataSheet.getRange(MONEY_RANGE).setValue(nowMoney + saraly);
        } else {
            var dice: number = Math.floor(Math.random() * 6) + 1;
            var calcuratedSaraly: number = saraly * dice;
            personalDataSheet.getRange(MONEY_RANGE).setValue(nowMoney + calcuratedSaraly);
        }
    } else if (space.canChooseWork) {//職業選択
        var workId: number = space.choosableWorkId;
        //ユーザーのシートを手に入れる
        var SpreadSheet = getSpreadSheet(userId);
        // 職業シートを取得
        var workDataSheet = SpreadSheet.getSheetByName(WORK_DATA_SHEET_NAME);
        // 職業の名前
        var workName = workDataSheet.getRange(WORK_NAME_COLUMN + (workId + 1)).getValue();
        // メッセージ
        replyMessages.push(stringToMessage(workName + "になることができます。この職業に就きますか？"));
        //フラグセット
        setChooseWork(userId, true, workId);

    } else if (space.canTakeLifeInsurance) {//生命保険
        replyMessages.push(stringToMessage("生命保険に入ることができます。入りますか？"));
        setLifeInsurance(userId, true);

    } else if (space.canBuyHouse) {//家
        replyMessages.push(stringToMessage("家を買うことができます。どの家を買いますか？買わない場合は0を、買う場合はその家の番号を入力してください。"));
        setChooseHouse(userId, true);

    } else if (space.canTakeFireInsurance) {//火災保険
        replyMessages.push(stringToMessage("火災保険に入れます。入りますか？"));
        setFireInsurance(userId, true);

    } else if (space.canBuyStock) {//株
        replyMessages.push(stringToMessage("株を買うことができます。買いますか？"));
        setStock(userId, true);

    } else if (space.isMarriage) {//結婚
        //変化させる
        personalDataSheet.getRange(HAS_PARTNER_RANGE).setValue(1);

        replyMessages.push(stringToMessage("結婚しました"));

    } else if (space.isBirthChild) {//出産
        //今の子供の数
        var nowChildNum: number= personalDataSheet.getRange(CHIRD_NUM_RANGE).getValue();
        //変化させる
        personalDataSheet.getRange(CHIRD_NUM_RANGE).setValue(nowChildNum + space.childNum);

        replyMessages.push(stringToMessage("子供が生まれました。現在の子供の数は" + (nowChildNum + space.childNum) + "人です"));

    } else if (space.isGet) {//お金をもらう
        //今の所持金
        var nowMoney: number = personalDataSheet.getRange(MONEY_RANGE).getValue();
        //変化させる
        personalDataSheet.getRange(MONEY_RANGE).setValue(nowMoney + space.getNum);

        replyMessages.push(stringToMessage("お金を" + space.getNum + "円手に入れました"));

    } else if (space.isPay) {//お金を払う
        //今の所持金、借金をまとめて読み出し
        var readData: number[][] = personalDataSheet.getRange(2,2,3,2).getValues();
        var nowMoney: number = readData[0][0];
        var nowDebt: number = readData[1][0];
        var newMoney: number = nowMoney - space.payNum;
        if (newMoney < 0) {
            var debt: number = Math.ceil(Math.abs(newMoney) / 10000) * 10000;
            var newDebt = nowDebt + debt
            var debtAddedMoney: number = newMoney + debt;
            //変化させる
            var writeData = [[debtAddedMoney], [newDebt]];
            personalDataSheet.getRange(2, 2, 3, 2).setValues(writeData);
            // メッセージ
            replyMessages.push(stringToMessage("お金を" + space.payNum + "円支払いました"));
            replyMessages.push(stringToMessage("金額が不足したため、" + debt + "円借金しました(現在借金" + newDebt + "円、所持金" + debtAddedMoney + "円)"));
        } else {
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

interface Space {
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
    choosableWorkId: number;
}

/**
 * スペースの内容からスペース内容表示用のjsonを返す
 * @param space マス
 */
function getPlaceMessage(space: Space) {

    // マスの内容
    var content: string = space.content;
    // 金額
    var money: string;
    if (space.isGet) {
        money = space.getNum.toString() + "円";
    } else if (space.isPay) {
        money = "-" + space.payNum.toString() + "円";
    } else {
        money = "変化なし";
    }
    //移動
    var move: string;
    if (space.isGo) {
        move = space.goNum.toString() + "マス進む";
    } else if (space.isBack) {
        move = space.backNum.toString() + "マス戻る";
    } else if (space.isStop) {
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
function statusAction(groupId: string, nowUserNum: number):Object[]{
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(groupId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    var nmReadRows: number = IN_LIFE_INSURANCE_ROW - MONEY_ROW + 1;
    var readDatas = personSheet.getRange(MONEY_ROW, nowUserNum + 1, nmReadRows, 1).getValues();// B3:B13
    //金額
    var nowMoney: string = readDatas[0][0] + '円';
    //借金額
    var nowDebt: string = readDatas[1][0] + '円';
    //株
    var nowStock: string = readDatas[2][0] + '株';
    //仕事関連
    var nowWorkID = readDatas[3][0];
    var nowWork: string = "";
    if (nowWorkID == 0) {
        nowWork = "無職";
    } else {
        var workSheet = SpreadSheet.getSheetByName(WORK_DATA_SHEET_NAME);
        nowWork = workSheet.getRange(WORK_NAME_COLUMN + (nowWorkID+1)).getValue();
    }
    //家関連
    var nowHaveHouse = readDatas[5][0];
    var houseValue: string = 'なし';
    if (nowHaveHouse) {
        houseValue = readDatas[6][0] + '円';
    }
    //結婚している
    var nowHasPartner: string = (readDatas[7][0] == 1)　?　"あり"　:　"なし";
    var nowChild: string = readDatas[8][0] + "人";
    var nowLifeInsurance: string = (readDatas[10][0] == 1) ? "加入" : "未加入";
    var nowFireInsurance: string = (readDatas[9][0] == 1) ? "加入" : "未加入";

    var altText = '現在のステータスです。\n 所持金:' + nowMoney + '\n 借金:' + nowDebt + '\n 仕事:' + nowWork + '\n 配偶者:' + nowHasPartner + '\n 子供:' + nowChild + '\n 生命保険:' + nowLifeInsurance + '\n 火災保険:' + nowFireInsurance + '\n 株:' + nowStock;

    var statusMessage = {
        "type": "flex",
        "altText": altText,
        "contents": {
            "type": "bubble",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "現在のステータスです"
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "所持金",
                                "align": "center"
                            },
                            {
                                "type": "separator",
                                "margin": "xs"
                            },
                            {
                                "type": "text",
                                "text": nowMoney,
                                "align": "center"
                            }
                        ],
                        "margin": "md"
                    },
                    {
                        "type": "separator",
                        "margin": "md"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "借金",
                                "align": "center"
                            },
                            {
                                "type": "separator",
                                "margin": "xs"
                            },
                            {
                                "type": "text",
                                "text": nowDebt,
                                "align": "center"
                            }
                        ],
                        "margin": "md"
                    },
                    {
                        "type": "separator",
                        "margin": "md"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "仕事",
                                "align": "center"
                            },
                            {
                                "type": "separator",
                                "margin": "xs"
                            },
                            {
                                "type": "text",
                                "text": nowWork,
                                "align": "center"
                            }
                        ],
                        "margin": "md"
                    },
                    {
                        "type": "separator",
                        "margin": "md"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "家",
                                "align": "center"
                            },
                            {
                                "type": "separator",
                                "margin": "xs"
                            },
                            {
                                "type": "text",
                                "text": houseValue,
                                "align": "center"
                            }
                        ],
                        "margin": "md"
                    },
                    {
                        "type": "separator",
                        "margin": "md"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "配偶者",
                                "align": "center"
                            },
                            {
                                "type": "separator",
                                "margin": "xs"
                            },
                            {
                                "type": "text",
                                "text": nowHasPartner,
                                "align": "center"
                            }
                        ],
                        "margin": "md"
                    },
                    {
                        "type": "separator",
                        "margin": "md"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "子供",
                                "align": "center"
                            },
                            {
                                "type": "separator",
                                "margin": "xs"
                            },
                            {
                                "type": "text",
                                "text": nowChild,
                                "align": "center"
                            }
                        ],
                        "margin": "md"
                    },
                    {
                        "type": "separator",
                        "margin": "md"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "生命保険",
                                "align": "center"
                            },
                            {
                                "type": "separator",
                                "margin": "xs"
                            },
                            {
                                "type": "text",
                                "text": nowLifeInsurance,
                                "align": "center"
                            }
                        ],
                        "margin": "md"
                    },
                    {
                        "type": "separator",
                        "margin": "md"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "火災保険",
                                "align": "center"
                            },
                            {
                                "type": "separator",
                                "margin": "xs"
                            },
                            {
                                "type": "text",
                                "text": nowFireInsurance,
                                "align": "center"
                            }
                        ],
                        "margin": "md"
                    },
                    {
                        "type": "separator",
                        "margin": "md"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "株",
                                "align": "center"
                            },
                            {
                                "type": "separator",
                                "margin": "xs"
                            },
                            {
                                "type": "text",
                                "text": nowStock,
                                "align": "center"
                            }
                        ],
                        "margin": "md"
                    }
                ]
            }
        }

    }
    return [statusMessage];
}

/**
 * ゴールしているかどうか
 * @param groupId グループID
 */
function isGoaled(groupId: string, userNum: number) {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(groupId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    var readData: boolean = personSheet.getRange(IS_GOALED_ROW, userNum + 1).getValue();
    return readData;
}

/**
 * ゴール済みとマークする
 * @param groupId グループID
 */
function setGoaled(groupId: string, userNum: number) {
    //ユーザーのシートを手に入れる
    var SpreadSheet = getSpreadSheet(groupId);
    // ユーザーのシートを取得
    var personSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
    personSheet.getRange(IS_GOALED_ROW, userNum + 1).setValue(1);
}

// /// <reference path="message.ts"/>
// /// <reference path="restmessage.ts"/>
// /// <reference path="template.ts"/>
// /// <reference path="reset.ts"/>
// /// <reference path="sheet.ts"/>
// /// <reference path="status.ts"/>
// /// <reference path="log.ts"/>
// /// <reference path="const.ts"/>

// function diceAction(userId, splitMessage) {
//     var replyMessages;
//     //ユーザーのシートを手に入れる
//     var SpreadSheet = getSpreadSheet(userId);
//     // これで１枚のシートを取得
//     var dataSheet = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);

//     //現在の状態を知る
//     var isMovable = dataSheet.getRange(IS_MOVABLE_RANGE).getValue();

//     //１回休みの時はここで終わる
//     if(!isMovable) {
//         replyMessages = ['このターンは休みです'];
//         dataSheet.getRange(IS_MOVABLE_RANGE).setValue(1);
//         return replyMessages;
//     }

//     //以下移動可能な時の処理

//     //現在の位置を知る
//     var startPlace = dataSheet.getRange(NOW_PLACE_RANGE).getValue();

//     //６面か特殊ダイスか
//     var isSixSided = (splitMessage.length == 1);

//     //サイコロをふる
//     var dice;
//     if (isSixSided) {
//         //6面ダイス
//         dice = Math.floor(Math.random() * 6) + 1;
//     } else{
//         //与えられた数の面のダイス
//         dice = Math.floor(Math.random() * Number(splitMessage[1])) + 1;
//     }

//     //振った目の出力
//     const DICE_EMOJI = '\u{1F3B2}';
//     var diceMessages = [ DICE_EMOJI + dice + 'です'];

//     //目のデータの確認
//     var place = movePiece(userId, dice);

//     //通常のアクション
//     var actionMessage = doAction(place, userId);
//     var replyMessages = diceMessages.concat(actionMessage);

//     //通過アクションを考える
//     var throughPlaceList = getThoughSpace(startPlace, dice, userId);
//     var throughPlaceMessage = [];
//     if (throughPlaceList.length != 0) {
//         throughPlaceMessage.push('通過したマスの中に、通過時に指示に従うものがあります！');
//         for (let i = 0; i < throughPlaceList.length; i++) {
//             const throughPlace = throughPlaceList[i];
//             var throughActionMessage = doAction(throughPlace, userId);
//             throughPlaceMessage = throughPlaceMessage.concat(throughActionMessage);
//         }
//     }

//     replyMessages = replyMessages.concat(throughPlaceMessage);

//     return replyMessages;
// }


// function doAction(place, userId) {
//     var replyMessages;

//     //内容の確認、ゴールならゴール処理
//     if (place.content == GOAL_SPACE_CONTENT) {
//         replyMessages = goalAction(userId);
//     }else{//ゴールじゃないなら処理は続く
//         replyMessages = normalAction(place, userId);
//     }

//     return replyMessages
// }

// function normalAction(place, userId){
//     var replyMessages = [contentSurrounder(place.content)];
//     //お金
//     var monneyMessage = moneyAction(place, userId);
//     replyMessages = replyMessages.concat(monneyMessage);

//     //もう一度動く or 休みの時
//     if (place.isGo) {
//         replyMessages.push(place.goNum + 'マス進みます');
//         //動く
//         var newPlace = movePiece(userId, place.goNum);
//         replyMessages.push(contentSurrounder(newPlace.content));
//         //新しいマスでありうるのはお金だけにする
//         var newMonneyMessage = moneyAction(newPlace, userId);
//         replyMessages = replyMessages.concat(newMonneyMessage);
//     } else if (place.isBack) {
//         replyMessages.push(place.backNum + 'マス戻ります');
//         //動く
//         var newPlace = movePiece(userId, -place.backNum);
//         replyMessages.push(contentSurrounder(newPlace.content));
//         //新しいマスでありうるのはお金だけにする
//         var newMonneyMessage = moneyAction(newPlace, userId);
//         replyMessages = replyMessages.concat(newMonneyMessage);
//     } else if (place.isStop) {
//         replyMessages.push('この先' + place.stopTurn + '回休みです');
//         //ユーザーのシートを手に入れる
//         var SpreadSheet = getSpreadSheet(userId);
//         // これで１枚のシートを取得
//         var sheetData = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
//         //移動情報変更
//         sheetData.getRange(IS_MOVABLE_RANGE).setValue(0);
//     }
//     return replyMessages;
// }

// function goalAction(userId) {
//     var replyMessages = ['おめでとうございます。ゴールです。'];
//     //ユーザーのシートを手に入れる
//     var SpreadSheet = getSpreadSheet(userId);
//     // これで１枚のシートを取得
//     var sheetData = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
//     //所持金チェック
//     var nowMoney = sheetData.getRange(MONEY_RANGE).getValue();
//     replyMessages.push('今回の最終所持金は' + nowMoney　+ 'でした。');
//     replyMessages.push('ゲームを終了します。');
//     deleteData(userId);
//     return replyMessages;
// }

// function moneyAction(place, userId) {
//     var replyMessage = [];
//     //お金の計算
//     if (place.isGet) {
//         replyMessage.push(place.getNum + '円獲得');
//         //ユーザーのシートを手に入れる
//         var SpreadSheet = getSpreadSheet(userId);
//         // これで１枚のシートを取得
//         var sheetData = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
//         //金額変更
//         var nowMoney = sheetData.getRange(MONEY_RANGE).getValue();
//         var newMoney = nowMoney + place.getNum;
//         sheetData.getRange(MONEY_RANGE).setValue(newMoney);
//     } else if (place.isPay) {
//         replyMessage.push(place.payNum + '円支払います');
//         //ユーザーのシートを手に入れる
//         var SpreadSheet = getSpreadSheet(userId);
//         // これで１枚のシートを取得
//         var sheetData = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
//         //金額変更
//         var nowMoney = sheetData.getRange(MONEY_RANGE).getValue();
//         var newMoney = nowMoney - place.payNum;
//         sheetData.getRange(MONEY_RANGE).setValue(newMoney);
//     }

//     return replyMessage
// }

// function movePiece(userId, num) {
//     //ユーザーのシートを手に入れる
//     var SpreadSheet = getSpreadSheet(userId);
//     // これで１枚のシートを取得
//     var sheetData = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);
//     var sheetBoard = SpreadSheet.getSheetByName(BOARD_DATA_SHEET_NAME);

//     //現在の位置を知る
//     var nowPlace = sheetData.getRange(NOW_PLACE_RANGE).getValue();
//     //進む先を計算
//     var nextPlace = nowPlace + num;
//     //新しい位置を書き込む
//     sheetData.getRange(NOW_PLACE_RANGE).setValue(nextPlace);


//     var low = nextPlace + 1;
//     //マスの内容を取得
//     var placeContent
//     if (nextPlace < GOAL_PLACE_NUMBER) {
//         placeContent = sheetBoard.getRange(SPACE_CONTENT_LIST_COLUMN + low).getValue();
//     } else {
//         placeContent = GOAL_SPACE_CONTENT;
//     }

//     //マスの情報を手に入れる
//     var place = {
//         content: placeContent,
//         isGo: sheetBoard.getRange('B' + low).getValue(),
//         goNum: sheetBoard.getRange('C' + low).getValue(),
//         isBack: sheetBoard.getRange('D' + low).getValue(),
//         backNum: sheetBoard.getRange('E' + low).getValue(),
//         isStop: sheetBoard.getRange('F' + low).getValue(),
//         stopTurn: sheetBoard.getRange('G' + low).getValue(),
//         isGet: sheetBoard.getRange('H' + low).getValue(),
//         getNum: sheetBoard.getRange('I' + low).getValue(),
//         isPay: sheetBoard.getRange('J' + low).getValue(),
//         payNum: sheetBoard.getRange('K' + low).getValue(),
//     };

//     return place
// }


// /**
//  * いい感じにテキストを枠で囲んでくれます。中身の文章は13文字で改行です。全角推奨。
//  * @param {string} content 囲みたい文字
//  * @returns {string} 囲まれた文字
//  */
// function contentSurrounder(content) {
//     //文字の長さ
//     var length = content.length;
//     //13で割って残る文字を求める
//     var left = length % 13;
//     //13ノブロックにするにはあと何文字いるか計算
//     var padNum = 13 - left;
//     //空白埋め
//     for (let val = 0; val < padNum; val++) {
//         content = content + '　'
//     }
//     //13文字ごとに分けて配列にする
//     var splitString = content.match(/.{13}/g);
//     //最後返す文字列
//     var surroundedMessage = '';
//     //上下のライン
//     var line = " ーーーーーーーーーーーーーー";

//     //上にラインを引いて
//     surroundedMessage = surroundedMessage + line;

//     //真ん中は１塊ずつ見て左右に線を入れる
//     for (let line = 0; line < splitString.length; line++) {
//         const str = splitString[line];
//         surroundedMessage = surroundedMessage + '\n' + "｜" + str + "｜";
//     }
//     //最後の行にも横線
//     surroundedMessage = surroundedMessage + '\n' + line;

//     return surroundedMessage
// }


// /**
//  * 与えられたマスから、与えられた数だけ通過したマスを見て、通過時に指示に従うマスのデータを返します。
//  * 今いるマス以降のマスは無視します
//  * @param {number} startPlace 元いたマスの番号
//  * @param {number} num 進んだ数
//  * @param {string} userId ユーザーのID
//  * @returns マスのリスト
//  */
// function getThoughSpace(startPlace, num, userId){
//     //ユーザーのスプレッドシートを手に入れる
//     var SpreadSheet = getSpreadSheet(userId);
//     // 個別のシートを取得
//     var sheetBoard = SpreadSheet.getSheetByName(BOARD_DATA_SHEET_NAME);
//     var sheetData = SpreadSheet.getSheetByName(PERSONAL_DATA_SHEET_NAME);

//     //今の位置を知る
//     var nowPlace = sheetData.getRange('B1').getValue();

//     //通過したマスのうち指示があるますがあれば、ここに入れる
//     var placeList = [];
//     //１マスずつ進んでいく
//     for (let i = 1; i < num+1; i++) {
//         //対象となるマスの番号
//         var checkPlace = startPlace + i ;
//         //今のマスを超えていたらそれ以上進む意味ないので終わり
//         if (nowPlace <= checkPlace){
//             return placeList;
//         }

//         //大丈夫なら先を見る

//         //見るべき行
//         var low = checkPlace + 1;
//         //通過指示マスかどうかを見る
//         var isThoughActionSpace = sheetBoard.getRange('L' + low).getValue();
//         //通過指示マスならマスの内容を取得
//         if (isThoughActionSpace) {
//             var place = {
//                 content: sheetBoard.getRange('A' + low).getValue(),
//                 isGo: sheetBoard.getRange('B' + low).getValue(),
//                 goNum: sheetBoard.getRange('C' + low).getValue(),
//                 isBack: sheetBoard.getRange('D' + low).getValue(),
//                 backNum: sheetBoard.getRange('E' + low).getValue(),
//                 isStop: sheetBoard.getRange('F' + low).getValue(),
//                 stopTurn: sheetBoard.getRange('G' + low).getValue(),
//                 isGet: sheetBoard.getRange('H' + low).getValue(),
//                 getNum: sheetBoard.getRange('I' + low).getValue(),
//                 isPay: sheetBoard.getRange('J' + low).getValue(),
//                 payNum: sheetBoard.getRange('K' + low).getValue(),
//             };
//             placeList.push(place);
//         }
//     }

//     return placeList;
// }
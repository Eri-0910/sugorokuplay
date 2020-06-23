function getActionTemplate() {
    var actionTemplate = {
        "type": "template",
        "altText": "次の行動を選んでください",
        "template": {
            "type": "buttons",
            "title": "行動メニュー",
            "text": "次の行動を選んでください",
            "actions": [
                {
                    "type": "message",
                    "label": "ダイス",
                    "text": "ダイス"
                },
                {
                    "type": "message",
                    "label": "ステータス確認",
                    "text": "ステータス"
                },
                {
                    "type": "message",
                    "label": "借金する",
                    "text": "借金する"
                },
                {
                    "type": "message",
                    "label": "借金を返す",
                    "text": "借金を返す"
                }
            ]
        }
    }
    return actionTemplate
}

function getNewGameTemplate() {
    var newGameTemplate = {
        "type": "template",
        "altText": "「スタート」と送ってください",
        "template": {
            "type": "buttons",
            "text": "ゲーム開始",
            "actions": [
                {
                    "type": "message",
                    "label": "ゲーム開始",
                    "text": "スタート"
                }
            ]
        }
    }
    return newGameTemplate
}

function getNextTemplate() {
    var nextTemplate = {
        "type": "template",
        "altText": "「次へ」と送ってください",
        "template": {
            "type": "buttons",
            "title": "次へ",
            "text": "次のメッセージを表示します",
            "actions": [
                {
                    "type": "message",
                    "label": "次へ",
                    "text": "次へ"
                }
            ]
        }
    }
    return nextTemplate
}

function getYesNoTemplate(str: string) {
    var nextTemplate = {
        "type": "template",
        "altText": "「はい」または「いいえ」を送ってください",
        "template": {
            "type": "confirm",
            "text": str,
            "actions": [
                {
                    "type": "message",
                    "label": "はい",
                    "text": "はい"
                },
                {
                    "type": "message",
                    "label": "いいえ",
                    "text": "いいえ"
                }
            ]
        }
    }
    return nextTemplate
}

function getNextUserTemplate() {
    var nextTemplate = {
        "type": "template",
        "altText": "「次のユーザーへ」と送ってください",
        "template": {
            "type": "buttons",
            "text": "ターンを終了します",
            "actions": [
                {
                    "type": "message",
                    "label": "次のユーザーへ",
                    "text": "次のユーザーへ"
                }
            ]
        }
    }
    return nextTemplate
}
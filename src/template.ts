function getActionTemplate(isWithReset = false){
    var actions;
    if (isWithReset){
        actions = [
            {
                "type": "message",
                "label": "ダイス",
                "text": "ダイス"
            },
            {
                "type": "message",
                "label": "ステータス確認",
                "text": "ステータス確認"
            },
            {
                "type": "message",
                "label": "リセット",
                "text": "リセット"
            }
        ]
    }else{
        actions = [
            {
                "type": "message",
                "label": "ダイス",
                "text": "ダイス"
            },
            {
                "type": "message",
                "label": "ステータス確認",
                "text": "ステータス"
            }
        ]
    }
    var actionTemplate = {
        "type": "template",
        "altText": "次の行動を選んでください",
        "template": {
            "type": "buttons",
            "title": "行動メニュー",
            "text": "次の行動を選んでください",
            "actions": actions
        }
    }
    return actionTemplate
}

function getNewGameTemplate(){
    var newGameTemplate = {
        "type": "template",
        "altText": "「ダイス」と送ってください",
        "template": {
            "type": "buttons",
            "title": "ゲーム開始",
            "text": "以下より選択してください。",
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
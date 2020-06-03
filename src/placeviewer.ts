/**
 * スペースの内容からスペース内容表示用のjsonを返す
 * @param content マスの内容
 * @param money 収支
 * @param move 移動
 */
function getPlaceMessage(content:string, money:number, move:number) {
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
                                        "text": money.toString(),
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
                                        "text": move.toString(),
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
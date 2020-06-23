// ログ周り
const ERROR_LOG_SHEET_NAME = 'ログ';
const ERROR_DATE_COLUMN = 'A';
const ERROR_NAME_COLUMN = 'B';
const ERROR_FILE_COLUMN = 'C';
const ERROR_ROW_COLUMN = 'D';
const ERROR_MESSAGE_COLUMN = 'E';
const ERROR_STACK_TRACE_COLUMN = 'F';

// データシート名
const PERSONAL_DATA_SHEET_NAME = 'プレーヤーデータ';
const BOARD_DATA_SHEET_NAME = 'ボードデータ';
const GAME_DATA_SHEET_NAME = 'ゲーム進行データ';
const HOUSE_DATA_SHEET_NAME = "家データ";
const WORK_DATA_SHEET_NAME = "職業データ";

// プレーヤーデータシート
const USER_ID_RANGE = 'B1';
const SER_ID_ROW = 1;
const USER_NAME_RANGE = 'B2';
const USER_NAME_ROW = 2;
const NOW_PLACE_RANGE = 'B3';
const NOW_PLACE_ROW = 3;
const MONEY_RANGE = 'B4';
const MONEY_ROW = 4;
const DEBT_RANGE = 'B5';
const DEBT_ROW = 5;
const STOCK_RANGE = 'B6';
const STOCK_ROW = 6;
const WORK_RANGE = 'B7';
const WORK_ROW = 7;
const SARALY_RANGE = 'B8';
const SARALY_ROW = 8;
const HAS_HOUSE_RANGE = 'B9';
const HAS_HOUSE_ROW = 9;
const HOUSE_MONEY_RANGE = 'B10';
const HOUSE_MONEY_ROW = 10;
const HAS_PARTNER_RANGE = 'B11';
const HAS_PARTNER_ROW = 11;
const CHIRD_NUM_RANGE = 'B12';
const CHIRD_NUM_ROW = 12;
const IN_FIRE_INSURANCE_RANGE = 'B13';
const IN_FIRE_INSURANCE_ROW = 13;
const IN_LIFE_INSURANCE_RANGE = 'B14';
const IN_LIFE_INSURANCE_ROW = 14;
const IS_MOVABLE_RANGE = 'B15';
const IS_MOVABLE_ROW = 15;
const IS_GOALED_RANGE = 'B16';
const IS_GOALED_ROW = 16;

// ゲームデータ
const NEXT_TEXT_NUM_RANGE = 'B1';
const NEXT_TEXT_COLUMN = 'D';
const NEXT_CONTENT_NUM_RANGE = "F1";
const NEXT_CONTENT_COLUMN = "H";
const NOW_USER_RANGE = "J1";
const NOW_USER_NUM_RANGE = "K1";
const REPAY_DEBT_FLAG_RANGE = "J2";
const BORROW_DEBT_FLAG_RANGE = "J3";
const CHOOSE_WORK_FLAG_RANGE = "J4";
const CAN_CHOOSE_WORK_ID_RANGE = "K4"
const LIFE_INSURANCE_FLAG_RANGE = "J5";
const CHOOSE_HOUSE_FLAG_RANGE = "J6";
const FIRE_INSURANCE_FLAG_RANGE = "J7";
const STOCK_FLAG_RANGE = "J8";
const STOCK_VALUE_RANGE = "K8"
const FINISH_TURN_RANGE = "J9"
const USER_NUM_RANGE = "M1"
const GAME_CONFIG_FLAG_RANGE = "J12"
const USER_NUM_FLAG_RANGE = "J13"
const USER_NAME_FLAG_RANGE = "J14"

// ボードデータ
const SPACE_ID_COLUMN = "A";
const SPACE_CONTENT_COLUMN = "B";
const IS_GO_COLUMN = "C";
const GO_NUM_COLUMN = "D";
const IS_BACK_COLUMN = "E";
const BACK_NUM_COLUMN = "F";
const IS_STOP_COLUMN = "G";
const STOP_TURN_COLUMN = "H";
const IS_GET_MONEY_COLUMN = "I";
const GET_MONEY_AMOUNT_COLUMN = "J";
const IS_PAY_MONEY_COLUMN = "K";
const PAY_MONEY_AMOUNT_COLUMN = "L";
const IS_THROUGH_ACTION_COLUMN = "M";
const IS_MUST_STOP_SPACE_COLUMN = "N";
const IS_PAY_DAY_COLUMN = "O";
const IS_MARRIAGE_COLUMN = "P";
const IS_BIRTH_CHILD_COLUMN = "Q";
const CHILD_NUM_COLUMN = "R";
const CAN_BUY_HOUSE_COLUMN = "S";
const IS_LOST_HOUSE_COLUMN = "T";
const CAN_LIFE_INSURANCE_COLUMN = "U";
const CAN_FIRE_INSURANCE_COLUMN = "V";
const CAN_BUY_STOCK_COLUMN = "W";
const STOCK_VALUE_COLUMN = "X";
const CAN_CHOOSE_WORK_COLUMN = "Y";
const CHOOSABLE_WORK_ID_COLUMN = "Z";
const GOAL_SPACE_CONTENT = 'ゴール';
const GOAL_PLACE_NUMBER = 20;
const BOARD_DATA_START_COLUMN = 1;
const BOARD_DATA_COLUMN_NUM = 26;
// 家データ
const HOUSE_ID_COLUMN = "A";
const HOUSE_TYPE_COLUMN = "B";
const HOUSE_VALUE_COLUMN = "C";

// 職業データ
const WORK_ID_COLUMN = "A";
const WORK_NAME_COLUMN = "B";
const WILL_CHANGE_SARALY_COLUMN = "C";
const BASE_SARALY_COLUMN = "D";
const UPGRADE_BASE_SARALY_COLUMN = "E";
const UNIT_SARALY_COLUMN = "F";
const UPGRADE_UNIT_SARALY_COLUMN = "G";

// コマンド定義
const NEXT_USER_COMMNAD_LIST = ['次のユーザーへ'];
const DICE_COMMNAD_LIST = ['ダイス', 'だいす', 'dice', 'Dice'];
const RESET_COMMNAD_LIST = ['リセット', 'りせっと', 'reset', 'Reset'];
const STATUS_COMMNAD_LIST = ['ステータス', 'すてーたす', 'status', 'Status'];
const START_COMMNAD_LIST = ['スタート', 'すたーと', 'start', 'Start'];
const NEXT_COMMNAD_LIST = ['次へ'];
const HELP_COMMNAD_LIST = ['ヘルプ'];
const DEBT_COMMNAD_LIST = ["借金する"];
const REPAY_DEBT_COMMNAD_LIST = ["借金を返す"];
const YES_COMMNAD_LIST = ["はい", "Yes"];
const NO_COMMNAD_LIST = ["いいえ", "No"];

//その他
const LIFE_INSURANCE_VALUE = 3000;
const FIRE_INSURANCE_VALUE = 3000;
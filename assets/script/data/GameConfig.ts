export const GameConst = {
    CARD_WIDTH : 96,
    CARD_HEIGHT : 144,

}
export const CardJoker = 0xFF;
export const CardBlow = 0xFE; // 吹风牌
export const CardValues = [
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, // 方块
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, // 梅花
    0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, // 红桃
    0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, // 黑桃
    CardJoker,//赖子牌
];

export enum PropID {
    PropJoker = 1,
    PropAdd = 2,
    PropUndo = 3,
}

//音效类型
export enum playAudioType {
    Play,   //背景音乐
    OneShotAduio, //音效
}

export enum AppType{
    Google = 1,
    ThirdParty,
    Apple,
}

export enum ItemType {
    Gold = "Gold", // 金币
    Item = "Item", // 普通道具表道具  带背景
}

//HTTP消息ID
export enum HttpMessageID {
    fetchVersion = "/api/basic/fetchVersion",            //获取更新配置
    login = "/api/basic/login",                          //登录
    eventlog = "/api/basic/eventlog",                    //游戏打点
    eventGameLog = "/api/basic/eventGameLog",                    //游戏log上报
}

export enum LoginTypeID {
    Guest = 0,
    Phone,
    FaceBook,
    Google,
    Apple,
    Auto = 10,
    Internal = 11,
}

export enum EStoreType{
    StoreFree = 1, //免费商品类型
    StoreCharge,//付费商品类型
}

export enum EDailyBonus{
    DailyNonstop = 1, //连续签到类型
    DailyAccrual,//累计签到类型
}

export const MASK_OPACITY = 128;

//UI界面配置
export enum UIID {
    UILoading,
    UIHall,
    UIGame,
    UIResult,
    UIEditor,
}


/** UI配置结构体 */
export interface IUiConf {
    bundle?: string;
    prefab: string;
}

export const UIConfig: { [key: number]: IUiConf } = {
    [UIID.UILoading]: { prefab: 'prefab/load/UILoading', bundle: 'res'},
    [UIID.UIHall]: { prefab: 'prefab/hall/UIHall', bundle: 'res'},
    [UIID.UIGame]: { prefab: 'prefab/game/UIGame', bundle: 'res'},
    [UIID.UIResult]: { prefab: 'prefab/game/UIResult', bundle: 'res'},
    [UIID.UIEditor]: { prefab: 'prefab/editor/UIEditor', bundle: 'res'},
}

//声音资源配置
export const SoundUrl = {
    //大厅音效/商城音效
     Hall_Bgm: "bgm_main",
    //游戏内音效
    Game_Bgm: "cardchain_bg",
    //通用一级按钮
    Common_Button_All: "button_all",
    Common_Close_All: 'Common_Close_All',
}

/**
 * 按钮音效类型
 */
export enum EButtonSoundType{
    NONE,
    COMMON,
    CLOSE,
}

//登录页滚动提示应用配置表
export const LoginScrollTipConfig = [
    'TeenPatti accommodates up to 5 people per table',     //TeenPatti每桌最多容纳5人
    'The biggest card type is Trail or Set',               //最大的牌型是三条
    'Invite friends to join game you will receive generous chips', //邀请好友加入游戏将会获得丰厚筹码奖励
    'Connecting facebook or google will get rich chip rewards', //连接facebook或google将会获得丰厚筹码奖励
    'Nickname can be change to 3 times per month',   //每月最多可以修改3次昵称
    'Earn VIPex by purchasing chips and upgrading your account',//购买筹码和升级账号都将获得VIP经验点数
    'If the prize pool reaches the maximum amount, all players must show their cards',//游戏中当奖池达到上限则所有人全部开牌
    'You can send up to 10 gifts to friends every day', //每天最多可送出10份好友赠礼
    'Receive up to 10 gifts from friends every day',//每天最多可收取10份好友赠礼
    'The next round of timing will only start after the online rewards are claimed.',//在线奖励只有领取后才会开始下一轮计时哦
    'The daily wheel can only be spin once per day', //每日转盘每天只可旋转1次
    'The higher level, the higher the extra chip bonus for recharging', //账号等级越高，充值获得的额外筹码加成越高
    'The higher VIP level, the higher the extra chip bonus for recharging',//VIP等级越高，充值获得的额外筹码加成越高
    'The higher VIP level, the higher the bonus of extra chips received from friends’ gifts.', //VIP等级越高，好友赠礼获得的额外筹码加成越高
]

class _GameConfig {
    //TODO 打点第一个数据需替换正式服地址
    public ServerAdress: string = 'http://192.168.1.49:8891';
    public Env: number;
    public IsGM: boolean;
    public IsTestServer: boolean;
    public IsDevServer: boolean;
    public IsPushlishServer: boolean;
    public ShowLog: boolean;
    public ServerApiVer: string;
    public HallWebSockUrl: string;
    public SockToken: string;
    public GameWebSockUrl: string = 'ws://192.168.1.115:7000/';
    //服务器游戏房间配置
    public RoomInfo: any;
    //UIMASK
    public UIMaskPrefab = null;
    //热更地址
    // public UpdateUrl = '';
    public AppType: number = AppType.ThirdParty;
    //版本号
    // public HotupdateVersion: number = 0;
    public LoginbyFreeChip:number = 0;
}

export const GameConfig = new _GameConfig();




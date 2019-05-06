/**
 * 比赛状态常量定义
 * Created by DDT on 2018/10/30.
 */
export const CANCEL_MATCH = '0';            //取消比赛, 表示比赛还没有开赛就取消了

export const NOT_START = '1';               //未开赛

export const FIRST_HALF = '2';              //上半场

export const HALF_TIME = '3';               //上半场完/中场

export const SECOND_HALF = '4';             //下半场

export const OT_FIRST_HALF = '5';           //加时上半场

export const OT_HALF_TIME = '6';            //加时上半场完

export const OT_SECOND_HALF = '7';          //加时下半场

export const PENALTY_KICK = '8';            //12码

export const FULL_TIME = '9';               //完场

export const BREAK_OFF = '10';              //比赛中断,比赛可以再开始

export const UNDETERMINED = '11';           //待定, 介乎于未开赛和上半场之间, 表示到了开赛时间, 但是由于种种原因比赛推迟开始, 但是不确定开赛时间

export const PUT_OFF = '12';                //推迟, 介乎于未开赛和上半场之间, 表示到了开赛时间, 但是由于种种原因比赛推迟到某一已知时间点开始

export const CUTTING_MATCH = '13';          //比赛腰斩, 比赛不再开始了
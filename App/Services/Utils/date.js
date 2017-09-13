/**
 * @providesModule DateUtilService
 */

import moment from 'moment';
import 'moment/locale/zh-cn';

/*
* @params  {string} fmt
* @params  {timestamp} date
* @returns {string} date
*/
export const format = ( fmt, date ) => {
    moment.locale( "zh-cn" );
    switch (fmt){
        case "llll": //2017年7月25日星期二 22:48
            return moment( date ).format('llll');
        case "ll": //2017年7月25日
            return moment( date ).format('ll');
        default:
            return moment( date ).format('llll');
    }
}

export const getCurrentTimeStamp = ( date ) => {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let photoDate = new Date(date);
    return new Date(photoDate.getTime() - tzoffset).toISOString();
}
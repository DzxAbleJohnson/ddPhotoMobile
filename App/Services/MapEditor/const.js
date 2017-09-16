import {
    Platform
} from 'react-native';


export const MAP_STYLES = {
    NORMAL: "normal",
    ...Platform.select({
        ios: {
        },
        android: {

        }
    }),
    LIGHT: "light",
    DARK: "dark",
    MIDNIGHT: "midnight",
}

export const COLORS = {
    "0c0c0c": "#0c0c0c", // 검정
    "ffffff": "#FFFFFF", // 흰색
    "f13636": "#f13636", // 빨강
    "fc7821": "#fc7821", // 주황
    "fdc503": "#fdc503", // 노랑
    "7dd01b": "#7dd01b", // 연두
    "47982a": "#47982a", // 초록
    "32c3ad": "#32c3ad", // 민트
    "31b9ff": "#31b9ff", // 하늘
    "0a6cfe": "#0a6cfe", // 파랑
    "192455": "#192455", // 남색
    "6e198a": "#6e198a", // 보라
    "ff5686": "#ff5686", // 분홍
    "d1d1d1": "#d1d1d1", // 연회색
    "6d6d6d": "#6d6d6d", // 진회색
}

export const SHAPES = {
    EMPTY: "empty",
    SQUARE: "square",
    ROUNDED_SQUARE: "rounded_square",
    CIRCLE: "circle",
    PENTAGON: "pentagon",
    HEXAGON: "hexagon",
    ...Platform.select({
        ios: {
        },
        android: {
        }
    }),
}

export const FONTS = {
    "DEFAULT": null,
    "PINGFANG_ULTRALIGHT": "PingFangTC-Ultralight",
    "PINGFANG_LIGHT": "PingFangTC-Light",
    "PINGFANG_THIN": "PingFangTC-Thin",
    "PINGFANG_MEDIUM": "PingFangTC-Medium",
    "PINGFANG_REGULAR": "PingFangTC-Regular",
    "PINGFANG_SEMIBOLD": "PingFangTC-Semibold"
}
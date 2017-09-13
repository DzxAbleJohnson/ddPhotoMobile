declare module "react-native-image-resizer" {
    export interface Response {
        path: string;
        uri: string;
        size?: number;
        name?: string;
    }
    export function createResizedImage(
        uri: string, width: number, height: number,
        format: "PNG" | "JPEG" | "WEBP", quality: number,
        rotation?: number, outputPath?: string
    ): Promise<Response>;

    export function createMarkerImage(
        uri: string, format: "PNG" | "JPEG" | "WEBP",
        index: number, lineColor: string, shape: string,
        lineWidth: number, outputPath?: string
    ): Promise<Response>;
}

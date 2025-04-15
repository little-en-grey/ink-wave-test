// export function useMouse(value: string): string {
// }
import * as DataConst from "@/consts/dataConst";

export function useMouse(imageFile: string  ) {
    const baseImage = new Image();
    baseImage.src = imageFile;
    baseImage.onload = () => {
        
    }
}
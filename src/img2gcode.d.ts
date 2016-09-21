// 0 X width
// Y height
declare namespace ImgToGCode {
  export type ColorObject = { r: number, g: number, b: number, a?: number };
  export type Color = string | [number, number, number, number] | ColorObject;
  export type Axes = { x?: number, y?: number, z?: number | boolean };
  export type Pixel = { intensity: number, axes: Axes, be: boolean };
  export type PixelToMM = { diameter: number; toMm: number; }; // 1 pixel es X mm
  export type Config = {
    errBlackPixel?: number; //unprocessedBlackPixel
    toolDiameter: number;
    scaleAxes: number;
    deepStep: number;
    imgSize?: string;
    //analyzeLevel:number;
    dirImg: string;
    whiteZ: number;
    blackZ: number;
    sevaZ: number;
    info?: string; // ["none" | "console" | "emitter"]
  }

  export interface Image {
    height: number;
    width: number;
    pixels: Pixel[][];
  }

  export class Line {
    constructor(axes: Axes, comment?: string);

    public axes: Axes;
    public comment: string;
    public code(step?: number): string;
  }

  export class Main {
    /**
* @param 
*/
    /**
     * @param {string} event
     *  event "tick" returns {number} nro 0 (0%) to 1 (100%)
     *  event "init" returns {string}
     *  event "log" returns {string}
     *  event "error" returns {Error}
     *  event "complete" returns { config: ImgToGCode.Config, dirgcode: string }
     * @param {Function} listener
     * @returns {this}
     * 
     * @memberOf Main
     */
    on(event: string, listener: Function): this;
    /**
      *It is mm
      *
      *@param {
      *  toolDiameter: 2,
      *  scaleAxes: 40,
      *  deepStep: -1,
      *  whiteZ: 0,
      *  blackZ: -2,
      *  sevaZ: 2,
      *  info: ["none" | "console" | "emitter"],
      *  dirImg:'./img/test.png'
      *}
      * @memberOf main
    */
    start(config: ImgToGCode.Config): this;
    /**
     * 
     * 
     * @param {({ config: ImgToGCode.Config, dirgcode: string })} cb
     * @returns {this}
     * 
     * @memberOf Main
     */
    then(cb: ({ config: ImgToGCode.Config, dirgcode: string })): this;
  }

}
export default class Utilities {
  /**
   * Round(15.8877) => 15.88
   * @param {number} num
   * @returns {number}
   */
  public static round(num: number): number {
    return Math.round(num * 100) / 100;
  }

  /**
   * Count the black pixel.
   * @param {Array} arr
   * @returns {number} size of array
   */
  public static size(arr: ImgToGCode.Pixel[][], all?: boolean): number {
    try {
      let size = 0;
      for (let x = 0, xl = arr.length; x < xl; x++) {
        for (let y = 0, yl = arr[x].length; y < yl; y++) {
          if (all) size++;
          else if (arr[x][y].intensity < 765 && !arr[x][y].be) size++;
        }
      }
      return size
    } catch (error) {
      throw new Error(`Size ${arr.length * arr[arr.length - 1].length}\n ${error}`);
    }
  }

  public static centerDistance(newPixel: ImgToGCode.Pixel[][]): ImgToGCode.Axes {
    try {
      return {
        x: newPixel[0][0].axes.x - ((newPixel[newPixel.length - 1][newPixel[newPixel.length - 1].length - 1].axes.x - newPixel[0][0].axes.x) / 2),
        y: newPixel[0][0].axes.y - ((newPixel[newPixel.length - 1][newPixel[newPixel.length - 1].length - 1].axes.y - newPixel[0][0].axes.y) / 2)
      }
    } catch (error) {
      throw error;
    }
  }
/**
 * Returns if the distance between points is less than or equal to the diameter
 * 
 * @static
 * @param {ImgToGCode.Pixel[][]} oldPixel
 * @param {ImgToGCode.Pixel[][]} newPixel
 * @returns {boolean}
 * 
 * @memberOf Utilities
 */
  public static distanceIsOne(oldPixel: ImgToGCode.Pixel[][], newPixel: ImgToGCode.Pixel[][]): boolean {
    try {
      let diameter = (oldPixel.length / 2) + 0.5,
        oldPixelDist = this.centerDistance(oldPixel),
        newPixelDist = this.centerDistance(newPixel),
        distX = newPixelDist.x - oldPixelDist.x,
        distY = newPixelDist.y - oldPixelDist.y;
/*console.log(
  oldPixelDist, newPixelDist,
  (-diameter <= distY && distY <= diameter),
  (-diameter <= distX && distX <= diameter),
  'distY', distY, 'distX', distX 
)*/
      return (-diameter <= distY && distY <= diameter) && (-diameter <= distX && distX <= diameter)
    } catch (error) {
      throw new Error(`DistanceIsOne\n ${error}`);
    }
  }

  public static appliedAllPixel(arr: ImgToGCode.Pixel[][], cb: (pixel: ImgToGCode.Pixel, iRow: number, iColumn?: number) => void) {
    try {
      for (let iRow = 0, rl = arr.length; iRow < rl; iRow++) {
        if (arr[iRow].length === 1) {
          cb(arr[iRow][0], iRow);
        }
        for (let iColumn = 0, cl = arr[iRow].length - 1; iColumn < cl; iColumn++) {
          cb(arr[iRow][iColumn], iRow, iColumn);
        }
      }
    } catch (error) {
      throw new Error(`AppliedAllPixel\n ${error}`);
    }
  }

  /**
   * Tengo encuenta que si hay más pixel negros que blancos.
   * 
   * @param {Pixel[]} oldPixelBlack
   * @param {number} pixelDiameter tamaño de la herramienta en pixel.
   * @returns {boolean}
   */
  public static allBlack(oldPixelBlack: ImgToGCode.Pixel[], pixelDiameter: number): boolean {
    try {
      let countBlack = 0;
      if (oldPixelBlack.length !== pixelDiameter) { return false; }
      if (oldPixelBlack[0] === undefined) return false;
      for (let x = 0, l = oldPixelBlack.length; x < l; x++) {
        if (oldPixelBlack[x].be) {
          return false;
        }
      }
      return true;
    } catch (error) {
      throw new Error(`AllBlack\n ${error}`);
    }
  }

  public static nearest(oldPixel: ImgToGCode.Pixel[][], newPixel1: ImgToGCode.Pixel[][], newPixel2: ImgToGCode.Pixel[][]): ImgToGCode.Pixel[][] {
    try {
      function nearestPoint(oldPoint: ImgToGCode.Axes, newPoint: ImgToGCode.Axes): number {
        return Math.sqrt(Math.pow(newPoint.x - oldPoint.x, 2) + Math.pow(newPoint.y - oldPoint.y, 2));
      }
      if (!newPixel2) {
        return newPixel1;
      } else {
        let oldPixelDist = this.centerDistance(oldPixel);
        return nearestPoint(oldPixelDist, this.centerDistance(newPixel1)) < nearestPoint(oldPixelDist, this.centerDistance(newPixel2)) ? newPixel1 : newPixel2
      }
    } catch (error) {
      throw new Error(`Nearest\n ${error}`);
    }
  }

  public static resolveZ(pixels: ImgToGCode.Pixel[][], whiteZ: number, blackZ: number): number {
    function avgIntensity(): number {
      let l = pixels.length, intensity = 0;
      for (let r = 0; r < l; r++) {
        for (let c = 0; c < l; c++) {
          intensity = pixels[r][c].intensity;
        }
      }
      return intensity / (l * l);
    }
    return -((avgIntensity() * blackZ / 765) - blackZ)
  }
}// class
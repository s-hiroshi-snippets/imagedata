jQuery(function($) {

    /**
     * 空間フィルタの境界処理を提供する
     *
     * @class bundary
     */
    var boundary = {};

    // boundary
    (function() {

        /**
         * 境界処理
         *
         * 境界で近傍のピクセルがないときは対角のピクセルを処理する。そのためのカウンタを返す
         * 境界処理は左上端, 左下端, 右上端, 右下端, 左端、右端、上端、下端で処理を分ける。
         *
         * @method expandedIndex
         * @param {Number} k 注目ピクセルのRGBAのRed値インデックス
         * @param {Number} i 空間フィルタの行方向カウンタ
         * @param {Number} j 空間フィルタの列方向カウンタ
         * @param {ImageData} imageData 処理対象ImageData
         * @return {Object}
         *
         */
        function expandedIndex(k, i, j, imageData) {

            // imageData.data配列の長さ
            var length = imageData.width * imageData.height * 4;

            // 左上端
            if (k === 0) {
                if (i === -1 && j === -1) {
                    return {
                        i: -i,
                        j: -j
                    };
                }
                if (i === -1 && j === 0) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                if (i === -1 && j === 1) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                if (i === 0 && j === -1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                if (i === 1 && j === -1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                // 境界じゃないのでそのまま返す
                return {
                    i: i,
                    j: j
                };
            }
            // 左下端
            if (k === (length - imageData.width * 4)) {
                if (i === -1 && j === -1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                if (i === 0 && j === -1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                if (i === 1 && j === -1) {
                    return {
                        i: -i,
                        j: -j
                    };
                }
                if (i === 1 && j === 0) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                if (i === 1 && j === 1) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                // 境界じゃないのでそのまま返す
                return {
                    i: i,
                    j: j
                };
            }
            // 右上端
            if (k === (imageData.width - 1) * 4) {
                if (i === -1 && j === -1) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                if (i === -1 && j === 0) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                if (i === -1 && j === 1) {
                    return {
                        i: -i,
                        j: -j
                    };
                }
                if (i === 0 && j === 1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                if (i === 1 && j === 1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                return {
                    i: i,
                    j: j
                };
            }
            // 右下端
            if (k === length - 4) {
                if (i === -1 && j === 1) {

                    return {
                        i: i,
                        j: -j
                    };
                }
                if (i === 0 && j === 1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                if (i === 1 && j === -1) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                if (i === 1 && j === 0) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                if (i === 1 && j === 1) {
                    return {
                        i: -i,
                        j: -j
                    };
                }
                // 境界じゃないのでそのまま返す
                return {
                    i: i,
                    j: j
                };
            }
            // 左端
            if (k % (imageData.width * 4) === 0) {
                if (j === -1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                return {
                    i: i,
                    j: j
                };
            }
            // 右端
            if (((length -4)- k) % imageData.width * 4 === 0) {
                if (j === 1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                return {
                    i: i,
                    j: j
                };
            }
            // 上端
            if (k < imageData.width * 4) {
                if (i === -1) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                return {
                    i: i,
                    j: j
                };
            }
            // 下端
            if (k > (length - 1) - imageData.width * 4) {
                if (i === 1) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                return {
                    i: i,
                    j: j
                };
            }

            // 境界ではないのでインデックス変わらない
            return {
                i: i,
                j: j
            };
        }

        boundary.expandedIndex = expandedIndex;

    }());

    /**
     * フィルター処理を提供する
     * @class filter
     */
    var filter = {};

    (function() {

        /**
         * 2値画像フィルター
         *
         * 注目ピクセルの近傍を使わないフィルター。
         *
         * @method mono
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function mono(k, imageData) {
            var rgba = {};
            var color = parseInt((imageData.data[k] + imageData.data[k + 1] + imageData.data[k + 2]) / 3, 10);
            color = (color < 128) ? 0 : 255;
            rgba.r = rgba.g = rgba.b = color;
            rgba.a = imageData.data[k + 3];
            return rgba;

        }

        /**
         * グレースケール
         *
         * 注目ピクセルの近傍を使わないフィルター。
         *
         * @method grayscale
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageData} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function grayscale(k, imageData) {
            var rgba = {};
            var color = parseInt((imageData.data[k] + imageData.data[k + 1] + imageData.data[k + 2]) / 3, 10);
            rgba.r = rgba.g = rgba.b = color;
            rgba.a = imageData.data[k + 3];
            return rgba;
        }

        /**
         * 平滑化
         *
         * 注目ピクセルの近傍(3x3)を使う空間フィルター。
         * @method smooth
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function smooth(k, imageData) {
            var rgba = {};
            var i, j, n, sumRed, sumGreen, sumBlue, index = {};
            sumRed = sumGreen = sumBlue = 0;
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    index = boundary.expandedIndex(k, i, j, imageData);
                    n = k + (index.i * 3 + index.j) * 4;
                    sumRed += imageData.data[n];
                    sumGreen += imageData.data[n + 1];
                    sumBlue += imageData.data[n + 2];
                }
            }
            rgba.r = Math.floor(sumRed / 9);    // R
            rgba.g = Math.floor(sumGreen / 9);  // G
            rgba.b = Math.floor(sumBlue / 9);   // B
            rgba.a = imageData.data[k + 3]; // alpha
            return rgba;
        }

        /**
         * フィルタ呼び出し処理
         * @method process
         * @private
         * @param {String} type フィルタ名
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
         * @param {ImageData} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function filtering(type, k, imageData) {
            if ('mono' === type) {
                return mono(k, imageData);
            }
            if ('grayscale' === type) {
                return grayscale(k, imageData);
            }
            if ('smooth' === type) {
                return smooth(k, imageData);
            }
        }

        /**
         * フィルタ処理
         * @param {String} type フィルターの種類(mono | grayscale | smooth)
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
         * @param imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function run(type, k, imageData) {
            return filtering(type, k , imageData);
        }

        filter.run = run;

    }());

    /**
     * 画像処理を提供する
     *
     * @class processing
     */
    var processing = {};

    // processing
    (function() {

        var imageData;

        /**
         * フィルター処理結果のRGBAデータ配列を返すを返す
         *
         * @method run
         * @param {String} type フィルターの種類(mono | grayscale | smooth)
         */
        function run(type) {
            // 全てのピクセルを走査
            var i, j, k, rgba = {}, data = [];
            // 行
            for (i = 0; i < imageData.height; i++) {
                // 列
                for (j = 0; j < imageData.width; j++) {
                    k  = (i * imageData.width + j) * 4;
                    rgba = filter.run(type, k, imageData);
                    data[k] = rgba.r;
                    data[k + 1] = rgba.g;
                    data[k + 2] = rgba.b;
                    data[k + 3] = rgba.a;
                }
            }
            return data;
        }

        /**
         * 初期化
         *
         * 処理対象のImageDataを設定する
         *
         * @method init
         * @param {ImageData} targetImageData
         */
        function init(targetImageData) {
            imageData = targetImageData;
        }

        // 公開メソッド
        processing.run = run;
        processing.init = init;
    }());

    // 下記カラー情報配列を作成
    // 赤、緑、青
    // シアン、マゼンダ、イエロー
    // 黒、グレー、白
    var data = [
        // 左上(赤)
        255, // Red
        0,   // Green
        0,   // Blue
        255, // Alpha
        // 中上(緑)
        0,
        255,
        0,
        255,
        // 右上(青)
        0,
        0,
        255,
        255,
        // 中左(シアン)
        0,
        255,
        255,
        255,
        // 中中(マゼンダ)
        255,
        0,
        255,
        255,
        // 中右(イエロー)
        255,
        255,
        0,
        255,
        // 下左(黒)
        0,
        0,
        0,
        255,
        // 下中(グレー)
        128,
        128,
        128,
        255,
        // 下右(白)
        255,
        255,
        255,
        255
    ];

    var canvas = $('#canvas1').get(0);
    canvas.width = 3;
    canvas.height = 3;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // ImageDataに初期ピクセル情報設定
    imageData.data.set(data);
    processing.init(imageData);
    // コンソール確認用
    console.log(processing.run('smooth'));
    // フィルタ処理後のピクセル情報を設定
    imageData.data.set(processing.run('smooth'));
    ctx.putImageData(imageData, 0, 0);
});

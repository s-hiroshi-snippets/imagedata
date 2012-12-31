jQuery(function($) {
    var canvas = $('#canvas1').get(0);
    canvas.width = 3;
    canvas.height = 3;
    var ctx = canvas.getContext('2d');
    // 3×3の各ピクセルが透明(Alpha:1)の黒(Red 0,Green 0,Blue 0)のimageDataを作成
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // ピクセル指定
    // 赤、緑、青
    // シアン、マゼンダ、イエロー
    // 黒、グレー、白
    var newData = [
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
    // ImageDataにピクセル情報設定
    imageData.data.set(newData);
    // キャンバスに描画
    ctx.putImageData(imageData, 0, 0);

    // 全てのピクセルを走査
    var i, j, k, pixel = {};
    // 行
    for (i = 0; i < imageData.height; i++) {
        // 列
        for (j = 0; j < imageData.width; j++) {
            k  = (i * imageData.width + j) * 4;
            pixel.r = imageData.data[k];
           pixel.g =  imageData.data[k + 1];    // Green
           pixel.b =  imageData.data[k + 2];     // Blue
           pixel.a = imageData.data[k + 3];     // Alpha
            console.log(i + '行' + j + '列');
            console.log(k + ' ->' + 'Red : ' + pixel.r);
            console.log((k + 1) + ' ->' + 'Green : ' + pixel.g);
            console.log((k + 2) + ' ->' + 'Blue : ' + pixel.b);
            console.log((k + 3) + ' ->' + 'Alpha : ' + pixel.a);
        }
    }

});

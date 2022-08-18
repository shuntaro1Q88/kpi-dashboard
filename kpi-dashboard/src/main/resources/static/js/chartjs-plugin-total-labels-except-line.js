const chartjsPluginTotalLabels = {
  /**
   * 合計値ラベルを描画
   */
  afterDatasetsDraw: function (chart) {

	  if(!chart.config.options.sumLabels){
      // 表示しない
      return;
    } 


    ctx = chart.ctx;
    // ラベルの書式設定
    ctx = this.setTextStyle(ctx);
    // 各棒最後の項目のメタ情報を取得
    const meta = this.getLastMeta(chart);
    // 各合計値を取得
    const sums = this.calcSums(chart.data.datasets, chart);
    // ラベル描画
    const labels = this.makeLabels(meta, sums);
    labels.forEach(function (label) {
      // label.value == 0の場合、処理しない
      if(label.value == 0){
        // (何もしない)
      }else{
        ctx.fillText(comma(label.value), label.x, label.y);
      }
    });
  },

  /**
   * 各項目の合計を取得
   */
  calcSums: function (datasets, chart) {
    const sums = [];
    const getFirstItem = function (data) {
      for (var prop in data)
        if (data.propertyIsEnumerable(prop))
          return data[prop];
    }

    // const targetYAxisID = chart.options.scales.yAxes[0].id;
    const targetFlag = true;
    datasets.forEach(function (dataset) {

      // console.dir(dataset);

      // 非表示の項目は処理しない
      if (getFirstItem(dataset._meta) != null && getFirstItem(dataset._meta).hidden) {
      // if (dataset._meta[0].hidden) {
        return;
      }

      // 最初の軸のデータ以外は処理しない
      // if(dataset.yAxisID != targetYAxisID) {
      //     return;
      // }

      // totalLabelsExceptFlag:true の場合、計算対象から除く
      if((dataset.totalLabelsExceptFlag === targetFlag)){
        // console.dir(dataset);
        return;
      }
      // console.dir(dataset.id == 'target-objcet')
      // console.dir(dataset);

      dataset.data.forEach(function (value, i) {
        if (typeof sums[i] === "undefined") {
          sums[i] = 0;
        }
        // value == nullの場合、スキップする
        if (isNaN(value)){
          // (何もしない)
        }else{
          sums[i] += value;
        }
      });
    });

    return sums;
  },

  /**
   * 各棒最後の項目のメタ情報を取得
   * (非表示のものは除く), (最初のY軸以外のものも除く)
   */
   getLastMeta: function (chart) {
    let i = chart.data.datasets.length - 1;
    let meta = undefined;
    let dataset = undefined;
    let option = undefined;
    // const targetYAxisID = chart.options.scales.yAxes[0].id;

    do {
      meta = chart.getDatasetMeta(i);
      dataset = chart.data.datasets[i];
      option = chart.options.scales;
      console.dir(dataset);
      console.dir(option);
      i--;
    } while (
      // 非表示 or 第2軸 or meta.id == 'target-objcet' は対象外
      (meta.hidden || dataset.totalLabelsExceptFlag)
      // (meta.hidden || meta.yAxisID != targetYAxisID || dataset.totalLabelsExceptFlag)
       && i >= 0);

    return meta;
  },

  /**
   * ラベル情報を取得
   */
  makeLabels: function (meta, sums) {
    const labels = [];
    sums.forEach(function (sum, i) {
      const lastModel = meta.data[i]._model;
      labels.push({
        value: sum.toString(),
        x: lastModel.x, // + 5 はグラフとラベルの間隔
        y: lastModel.y - 5,
      });
    });

    return labels;
  },

  /**
   * 書式設定
   */
  setTextStyle: function (ctx) {
    const fontSize = 12;
    const fontStyle = "normal";
    const fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    return ctx;
  }
};

function comma(num) {
    var s = String(num).split('.');
    var ret = String(s[0]).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    if (s.length > 1) {
        ret += '.' + s[1];
    }
    return ret;
}

// 上記プラグインの有効化
Chart.plugins.register(chartjsPluginTotalLabels);
/**
 * Get the color to use for line of the chart.
 * No chart uses more than 3 colors, but this method has a safety catch to
 * return black if the `index` param is outside of the normal range.
 *
 * @param {String} app: 'elasticsearch', 'kibana', etc
 * @param {Integer} index: index of the chart series, 0-3
 * @returns {String} Hex color to use for chart series at the given index
 */
export default function getColor(app, index) {
  let seriesColors;
  if (app === 'elasticsearch') {
    seriesColors = ['#3ebeb0', '#3b73ac', '#f08656', '#6c478f'];
  } else {
    // for kibana, and fallback (e.g., Logstash and Beats)
    seriesColors = ['#e8488b', '#3b73ac', '#3cab63', '#6c478f'];
  }

  if (seriesColors[index]) {
    return seriesColors[index];
  }

  return '#000';
}
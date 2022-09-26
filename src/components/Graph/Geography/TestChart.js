// 1. Import Chart.js so you can use the global Chart object
import { Chart } from 'chart.js'
// 2. Import the `generateChart()` method to create the vue component.
import { generateChart } from 'vue-chartjs'
// 3. Import needed controller from Chart.js
import { LineController } from 'chart.js'

// 3. Extend one of the default charts
// http://www.chartjs.org/docs/latest/developers/charts.html
class LineWithLineController extends LineController {

	draw() {
		super.draw();
	}

}

// 4. Generate the vue-chartjs component
// The first argument is the chart-id, the second the chart type, third is the custom controller
const CustomLine = generateChart('custom-line', 'line', LineWithLineController)

// 5. Extend the CustomLine Component just like you do with the default vue-chartjs charts.

export default {
	components: { CustomLine }
}

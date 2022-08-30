const units = {
	't':0.1,
	'kg': 0.001,
	'g': 0
}

function getUnit(number, precision = 2) {
	if (number >= units.t) {
		return format(number, precision, 't')
	}

	if (number >= units.kg) {
		return format(number * 1000, precision, 'kg')
	}

	return format(number * 1000000, precision, 'g')
}

function format(number, precision, unit) {
	return number.toFixed(precision) + ' ' + unit
}

export {getUnit}
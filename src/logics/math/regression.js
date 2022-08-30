import regression from 'regression';

function linearRegression(x,y) {
	let points = []
	for (let i = 0; i < x.length; i++) {
		points.push([x[i],y[i]])
	}
	let result = regression.linear(points);
	let k = result.equation[0]
	let q = result.equation[1]
	return (x) => k*x+q;
}

export {linearRegression}
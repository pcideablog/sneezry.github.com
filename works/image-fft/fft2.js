function fft2(dataArray, width, height) {
	var r = 1;
	var i = 1;
	while(i*2 < width) {
		i *= 2;
		r++;
	}
	var width2 = 1<<r;
	var r = 1;
	var i = 1;
	while(i*2 < height) {
		i *= 2;
		r++;
	}
	var height2 = 1<<r;

	var dataArrayTemp = [];
	for(var i=0; i<height2; i++) {
		for(var j=0; j<width2; j++) {
			if(i>=height || j>=width) {
				dataArrayTemp.push(0);
			}
			else {
				dataArrayTemp.push(dataArray[i*width+j]);
			}
		}
	}

	dataArray = dataArrayTemp;
	width = width2;
	height = height2;

	var dataTemp = [];
	var dataArray2 = [];
	for(var i=0; i<height; i++) {
		dataTemp = [];
		for(var j=0; j<width; j++) {
			dataTemp.push(dataArray[i*width+j]);
		}
		dataTemp = fft(dataTemp);
		for(var j=0; j<width; j++) {
			dataArray2.push(dataTemp[j]);
		}
	}
	dataArray = dataArray2;
	dataArray2 = [];
	for(var i=0; i<width; i++) {
		var dataTemp = [];
		for(var j=0; j<height; j++) {
			dataTemp.push(dataArray[j*width+i]);
		}
		dataTemp = fft(dataTemp);
		for(var j=0; j<height; j++) {
			dataArray2.push(dataTemp[j]);
		}
	}
	dataArray = [];
	for(var i=0; i<height; i++) {
		for(var j=0; j<width; j++) {
			dataArray[j*height+i] = dataArray2[i*width+j];
		}
	}
	return dataArray;
}
function(){
	var el = document.createElement('link');
	el.rel = 'stylesheet';
	el.type = 'text/css';
	el.href= '/stylesheets/loading.css';
	document.getElementsByTagName('head')[0].appendChild(el);
}
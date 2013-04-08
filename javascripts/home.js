var main = document.getElementById('content');
var converter = new Showdown.converter();

function showlist(list){
	var txt = "";
	for(var i = 0; i < list.data.length; i++){
		txt += "## [" + list.data[i].name + "](/" + list.data[i].name + ")\n\n";
	}
	main.innerHTML = converter.makeHtml(txt);
}
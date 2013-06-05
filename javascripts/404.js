var path = location.pathname;
if(path == '/rss'){
	location.href = 'http://feeds.feedburner.com/Sneezry';
}
else{
	location.href = '/#!' + path;
}
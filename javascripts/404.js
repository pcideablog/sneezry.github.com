var path = location.pathname;
if(path == '/rss' || path == '/feed' || path == '/atom'){
	location.href = 'http://feeds.feedburner.com/Sneezry';
}
else{
	location.href = '/#!' + path;
}
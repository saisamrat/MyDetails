var selectionItem ={
	"id": "MyDetails",
	"title": "MyDetails",
	"contexts": ["editable"]
};


chrome.contextMenus.create(selectionItem);

chrome.contextMenus.onClicked.addListener(function(info){
		var name= info.menuItemId;
		getAndSetValue(name);

});

function executeScritp(value){
	var c = 'document.activeElement.value = "' + value + '"';
		chrome.tabs.executeScript({
    code: c
  });
}

function getAndSetValue(name){
	chrome.storage.sync.get({textData:{}}, function(oldData){
		var textData = oldData.textData;
		if(textData != null || textData != undefined){
			var value = textData[name];
			executeScritp(value);
		}
	});
}


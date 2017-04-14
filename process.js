$(function(){
	render();
	clearNotes();
});

function defaultContext(){
	var selectionItem ={
	"id": "MyDetails",
	"title": "MyDetails",
	"contexts": ["editable"]
};


	chrome.contextMenus.create(selectionItem);
}

function addContext(){
	var name = $('#name').val();
	var value = $('#value').val();
	name = validateData(name);
	value = validateData(value);
	saveText(name, value);
	createContext(name);
}

function saveText(name, value){
	chrome.storage.sync.get({textData:{}}, function(oldData){
		var textDetails = oldData.textData;
		if(textDetails == null || textDetails == undefined){
			textDetails = {};
		}
		textDetails[name] = value;
		// text = text + newNote
		 chrome.storage.sync.set({textData: textDetails});
	});
	addToPage(name, value);

}

function createContext(name){
var selectionItem ={
	"id": name,
	"title": name,
	"contexts": ["editable"]
};
chrome.contextMenus.create(selectionItem);
}


function render(){
		$('#add').on('click', addContext);
		$('#edit').on('click', editRender);
		$('#save').on('click', updateData);
			chrome.storage.sync.get({textData:{}}, function(data){
			var textDetails = data.textData;
			for(var i in textDetails){
				var name = i;
				var value = textDetails[i];
				addToPage(name, value);	
			}
			showButtons();	
	});	

}

function editRender(){
	chrome.storage.sync.get({textData:{}}, function(data){
	var textDetails = data.textData;
	$('ul').empty();
	for(var i in textDetails){
		var name = i;
		var value = textDetails[i];
		addEditMode(validateData(name), validateData(value));	
	}
	});
}

function addToPage(name, value){
	var name = '<span class="name">' + name + '</span>';
	var value = '<span class="value">' + value + '</span>';
	$('ul').append("<li>"+name + value +"</li>");
	$('.enter').val('');
	showButtons();

}
function addEditMode(name, value){
	var name = '<input class="editMode editName" value="'+name+'">';
	var value = '<input class="editMode editValue" value="'+value+'">';
	$('#textDetails').append("<li>"+name + value +"</li>");
	$('#save').removeClass('hidden');
	showButtons();
	$('#edit').hide();
}

function clearNotes(){
	$('#clear').on('click', function(){
		var newtext = {};
		chrome.storage.sync.set({textData: newtext});
		$('ul').empty();
		chrome.contextMenus.removeAll();
	defaultContext();
	showButtons();
	});
	
}

function updateData(){
	var updatedData = {};
	$('ul li').each(function (){
		var name = $(this).find('.editName').val();
		var value = $(this).find('.editValue').val();
		updatedData[name] = value;
	});
	chrome.storage.sync.set({textData: updatedData});
	$('ul').empty();
	$('#save').addClass('hidden');
	$('#edit').show();
	render();
}

function validateData(text){
	if(text.indexOf("<") > -1){
		 var newText = text.replace(new RegExp("<" , 'g'), "&lt");
		 text = newText.replace(new RegExp(">", 'g'), "&gt")
	}
	return text;
}

function showButtons(){
	if($('ul li').length==0){
		$('.actBtn').hide();
	}
	else{
		$('.actBtn').show();
	}
}
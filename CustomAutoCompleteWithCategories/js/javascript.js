//buat custom widget dengan nama search
$.widget( "custom.search", $.ui.autocomplete, {
	_create: function() {
		this._super();
		this.widget().menu( "option", "items", "> :not(.category)" );
	},
	//render menu(kategori dan nama pilihan)
	_renderMenu: function( ul, items ) {
		var self = this, currentCategory = "";
		
		$.each( items, function( index, item )
		{
			if ( item.category != currentCategory ) { 
				ul.append( "<p class='category'>" + item.category + "</p>" );
				currentCategory = item.category;
			}
			
			var li = self._renderItemData( ul, item );
			
			if ( item.category ) {
				li.attr( "aria-label", item.category + " : " + item.label ); 
			}
		});
	},  
	
	_destroy: function () 
	{
		this.multiselect.remove();
	}
});

//untuk menghiglight text
function higlightText(){
	$.ui.autocomplete.prototype._renderItem = function (ul, item)
	{
		
		var Needle     = item.label;    // nilai dari label= nama hotel
		var TermLength = this.term.length; 
		var StrPos     = new Array();     
		var Pointer    = 0;	
		var Output     = '';
		
		var Prefix    = '<strong class="text" style="color:black;">';
		var Suffix     = '</strong>';

		//match input dengan data
		Temp = item.label.toLowerCase().split(this.term.toLowerCase()); 
		var CharCount = 0;
		Temp[-1] = '';
		for(i=0; i<Temp.length; i++){
			CharCount += Temp[i-1].length;
			StrPos[i] = CharCount + (i * TermLength) + Temp[i].length
		}

		i=0;
		if(StrPos.length > 0){
			while(Pointer < Needle.length){ //looping selama counter pointer < panjang nama hotel
				if(i<=StrPos.length){	
					if(Pointer == StrPos[i]){	
						Output += Prefix+ Needle.substring(Pointer, Pointer + TermLength) + Suffix;
						Pointer += TermLength;
						i++;
					}
					else{
						Output += Needle.substring(Pointer, StrPos[i]);
						Pointer = StrPos[i];
					}
				}
			}
		}
		
		return $("<li></li>")
			.data("item.autocomplete", item)
			.append("<a>" + Output + "</a>")
			.appendTo(ul);
		};
}


function tog(v){
	return v ? 'addClass' : 'removeClass'; 
} 

$(document).on('input', '.clearable', function(){
	$(this)[tog(this.value)]('x');}).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
	}).on('touchstart click', '.onX', function( ev ){ ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
	
	//jika tombol x(reset) ditekan, tutup widget search
	if($(this).val()=='')
	{
		$("#search").search('close');
	}
});

//Ketika dokumen siap
$( function() {
	var data = [{
		label: "Ancol, Jakarta Utara",
		category: "Area",
		value: "Ancol, Jakarta Utara"
	}, {
		label: "Plaza Hotel Marco Mangga Dua Jakarta",
		category: "Hotel di Dekat Ancol",
		value: "Plaza Hotel Marco Mangga Dua Jakarta"
	}, {
		label: "Amaris Hotel Mangga Dua Square",
		category: "Hotel di Dekat Ancol",
		value: "Amaris Hotel Mangga Dua Square"
	}, {
		label: "Discovery Hotel & Convention Ancol Pulau Putri",
		category: "Hotel yang Terdaftar",
		value: "Discovery Hotel & Convention Ancol Pulau Putri"
	}];

	higlightText();
	
	$( "#search" ).search({
		delay: 0,
		source: data
	});
});
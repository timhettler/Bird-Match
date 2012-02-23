//var eBirdTaxaUrl = 'http://ebird.org/ws1.1/ref/taxa/ebird?cat=species&locale=en_US&fmt=json&callback=?',
//    speciesList = [],
//    flickrKey = '41cae44ac5d84579ae23b784321f9377',
//    flickrSecret= '421f1282ebace3b5',
//    flickrBaseUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?',
//    flickrTags = '',
//    flickrTagMode = 'any',
//    flickrFormat = 'json',
//    flickrCallback = '?',
//    shuffle = function(o) {
//            for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//            return o;
//    },
//    $wrapper = $('<figure><img src="" alt="" /><figcaption><p class="hidden"></p></figcaption></figure>'),
//    $option = $('<option value=""/>');
//    
//$.getJSON(eBirdTaxaUrl, function(eBirdData) {
//    speciesList = shuffle(eBirdData);
//    
//    getSpeciesPhotos(selectRandomSpecies(speciesList));
//});
//
//var selectRandomSpecies = function(speciesList){
//    return speciesList[Math.floor(Math.random()*speciesList.length)];
//},
//getFlickrTags = function(species){
//    return species.comName+','+species.sciName;
//},
//getSpeciesPhotos = function(species){
//    var flickrKey = '41cae44ac5d84579ae23b784321f9377',
//    flickrSecret= '421f1282ebace3b5',
//    flickrBaseUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?',
//    flickrTags = getFlickrTags(species),
//    flickrTagMode = 'any',
//    flickrFormat = 'json',
//    flickrCallback = '?';
//    
//    console.log('retrieving photos for '+species.comName+'...', species);
//    $.getJSON(flickrBaseUrl+'tags='+flickrTags+'&tagmode='+flickrTagMode+'&format='+flickrFormat+'&jsoncallback='+flickrCallback,function(flickrData){
//        if(flickrData.items.length === 0) {
//            console.log('No photos found, retrying with different species');
//            getSpeciesPhotos(selectRandomSpecies(speciesList));
//        } else {
//            console.log(flickrData.items.length+' images found');
//            var image = flickrData.items[Math.floor(Math.random()*flickrData.items.length)];
//            $wrapper.clone().find('img')
//                .attr('src',image.media.m)
//            .end().find('p')
//                .html(image.title)
//            .end().prependTo('#main');
//            
//            var quizOptions = [speciesList[0],speciesList[1],speciesList[2],speciesList[3],species];
//            shuffle(quizOptions);
//            
//            $.each(quizOptions,function(i,v){
//                $option.clone().val(v.taxonID).html(v.comName).appendTo('select');
//            });
//        }
//    });
//};

//var eBirdJSON = [{"comName":"Ostrich","sciName":"Struthio camelus","taxonID":"TC000001"},{"comName":"Greater Rhea","sciName":"Rhea americana","taxonID":"TC000004"},{"comName":"Lesser Rhea","sciName":"Rhea pennata","taxonID":"TC000005"},{"comName":"Southern Cassowary","sciName":"Casuarius casuarius","taxonID":"TC000008"},{"comName":"Dwarf Cassowary","sciName":"Casuarius bennetti","taxonID":"TC000009"},{"comName":"Northern Cassowary","sciName":"Casuarius unappendiculatus","taxonID":"TC000010"},{"comName":"Emu","sciName":"Dromaius novaehollandiae","taxonID":"TC000011"},{"comName":"King Island Emu","sciName":"Dromaius ater","taxonID":"TC000012"},{"comName":"Southern Brown Kiwi","sciName":"Apteryx australis","taxonID":"TC000013"},{"comName":"Okarito Brown Kiwi","sciName":"Apteryx rowi","taxonID":"TC000014"},{"comName":"North Island Brown Kiwi","sciName":"Apteryx mantelli","taxonID":"TC000015"},{"comName":"Little Spotted Kiwi","sciName":"Apteryx owenii","taxonID":"TC000016"},{"comName":"Great Spotted Kiwi","sciName":"Apteryx haastii","taxonID":"TC000017"},{"comName":"Tawny-breasted Tinamou","sciName":"Nothocercus julius","taxonID":"TC000018"},{"comName":"Highland Tinamou","sciName":"Nothocercus bonapartei","taxonID":"TC000019"},{"comName":"Hooded Tinamou","sciName":"Nothocercus nigrocapillus","taxonID":"TC000022"},{"comName":"Gray Tinamou","sciName":"Tinamus tao","taxonID":"TC000023"},{"comName":"Solitary Tinamou","sciName":"Tinamus solitarius","taxonID":"TC000024"},{"comName":"Black Tinamou","sciName":"Tinamus osgoodi","taxonID":"TC000025"},{"comName":"Great Tinamou","sciName":"Tinamus major","taxonID":"TC000026"},{"comName":"White-throated Tinamou","sciName":"Tinamus guttatus","taxonID":"TC000027"},{"comName":"Cinereous Tinamou","sciName":"Crypturellus cinereus","taxonID":"TC000029"}];
//
//var Bird = Backbone.Model.extend({
//	defaults: {
//		comName: "",
//		sciName: "",
//		taxonID: ""
//	}
//});

//var birds = $.map(eBirdJSON,function(v){
//	return new Bird(v);
//});

//var eBird = Backbone.Collection.extend({
//	model: Bird
//});
//
//var eBirdCollection = new eBird();
//
//$.getJSON('http://ebird.org/ws1.1/ref/taxa/ebird?cat=species&locale=en_US&fmt=json&callback=?', function(eBirdData) {
//	console.log('fetched ebird data');
//	eBirdCollection.add(eBirdData);
//});

var flickrKey = '41cae44ac5d84579ae23b784321f9377',
    flickrSecret= '421f1282ebace3b5',
    flickrBaseUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?',
    flickrTags = '',
    flickrTagMode = 'any',
    flickrFormat = 'json',
    flickrCallback = '?';

var eBirds = new Backbone.Collection;

if(localStorage['eBird']) {
	eBirds.add(JSON.parse(localStorage['eBird']));
} else {
	eBirds.url = 'http://ebird.org/ws1.1/ref/taxa/ebird?cat=species&locale=en_US&fmt=json&callback=?';
	eBirds.fetch({
		success: function(){
			localStorage['eBird'] = JSON.stringify(eBirds);
		}
	});
}

var masterList = workingList = eBirds.shuffle();

var Bird = Backbone.Model.extend({
	initialize: function(){
		this.set(workingList.shift().toJSON());
		console.log(this.get('comName')+' initialized');
		this.setFlickrPhoto();
		this.setSpeciesOptions();
	},
	setFlickrPhoto: function(){
		var self = this;
		flickrTags = this.get('comName')+', '+this.get('sciName');
		$.getJSON(flickrBaseUrl+'tags='+flickrTags+'&tagmode='+flickrTagMode+'&format='+flickrFormat+'&jsoncallback='+flickrCallback,function(flickrData){
			if(flickrData.items.length === 0) {
				console.log('No photos found for '+self.get('comName')+', retrying with different species');
				self.initialize();
			} else {
				console.log(flickrData.items.length+' images found for '+self.get('comName'));
				self.set({images: _.shuffle(flickrData.items)});
			}
		});
	},
	removeFlickrPhoto: function(){
		this.set({images: this.get('images').shift()});
	},
	setSpeciesOptions : function(){
		var self = this,
			options = [this.get('comName')];
		for(var i = 0; i < 4; i++) {
			options.push(masterList[Math.floor(Math.random()*masterList.length)].get('comName'));
		}
		self.set({nameOptions: _.shuffle(options)});
	}
});

var BirdCollection = Backbone.Collection.extend({
	model: Bird
});

var birdArray = [];

for(var i = 0; i < 1; i++) {
	birdArray.push(new Bird());
}

var birdCollection = new BirdCollection(birdArray);

var BirdMatch = Backbone.View.extend({
	model: birdCollection.at(0),
	el: '#main',
	initialize: function(){
		console.log('view for '+this.model.get('comName')+' created');
		_.bindAll(this, 'render');
        this.model.bind('change:images', this.render);
    },
	render: function(event) {
		console.log('rendering template for '+this.model.get('comName'));
		var compiled_template = _.template($('#question-template').html());
		$(this.el).html( compiled_template(this.model.toJSON()) );
		return this;
	}
});

var birdMatch = new BirdMatch();
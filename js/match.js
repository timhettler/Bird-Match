//lng=-73.970196&lat=40.774641&dist=50&back=30

//if (navigator.geolocation) {
//	navigator.geolocation.getCurrentPosition(
//		function(position) {
//			console.log(position.coords.latitude, position.coords.longitude);
//		},
//		function(error) {
//			var errors = { 
//			    1: 'Permission denied',
//			    2: 'Position unavailable',
//			    3: 'Request timeout'
//			};
//			console.error(errors[error.code]);
//		}
//	);
//}

var flickrKey = '41cae44ac5d84579ae23b784321f9377',
    flickrSecret= '421f1282ebace3b5',
    flickrBaseUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?',
    flickrTags = '',
    flickrTagMode = 'all',
    flickrFormat = 'json',
    flickrCallback = '?';
    
var eBirdBaseUrl = 'http://ebird.org/ws1.1/',
	eBirdCallback = '?',
	eBirdFormat = 'json',
	eBirdLng = '-73.970196&',
	eBirdLat = '40.774641',
	eBirdDist = '50',
	eBirdDays = '30',
	eBirdTaxaUrl = eBirdBaseUrl+'ref/taxa/ebird?cat=species&fmt='+eBirdFormat+'&callback='+eBirdCallback,
	eBirdLocalUrl = eBirdBaseUrl+'data/obs/geo/recent?lng='+eBirdLng+'&lat='+eBirdLat+'&dist='+eBirdDist+'&back='+eBirdDays+'&fmt='+eBirdFormat+'&callback='+eBirdCallback;
	

var masterList = workingList = {};
	

var eBirdsCollection = Backbone.Collection.extend();

var eBirds = new eBirdsCollection();

var Bird = Backbone.Model.extend({

	defaults: {
		comName: '',
		sciName: '',
		images: [],
		nameOptions: [],
		userSelection: ''
	},
	
	initialize: function() {
		console.log('model for '+this.get('comName')+' initialized');
	},
	
	isCorrect: function() {
		return this.get('comName') == this.get('userSelection');
	},
	
	clear: function() {
		this.destroy();
	}
	
});

var BirdCollection = Backbone.Collection.extend({

	model: Bird,
	
	localStorage: new Store('bird-match'),
	
	correct: function() {
		return this.filter(function(bird){
			return bird.get('comName') == bird.get('userSelection');
		});
	},
	
	incorrect: function(){
		return this.filter(function(bird){
			return bird.get('comName') != bird.get('userSelection');
		});
	}
	
});

var birdCage = new BirdCollection();

var BirdView = Backbone.View.extend({

	className: 'bird',
	
	template: _.template($('#bird-template').html()),
	
	events : {
		"change select" : "updateSelection",
		"click .change-photo" : "removeFlickrPhoto"
	},
	
	initialize: function() {
		console.log('view for '+this.model.get('comName')+' created');
		_.bindAll(this, 'render', 'remove','updateSelection');
        this.model.bind('change:images', this.render);
        this.model.bind('destroy', this.remove);
        this.render();
    },
    
	render: function(event) {
		console.log('rendering template for '+this.model.get('comName'));
		this.$el.html(this.template(this.model.toJSON())).appendTo('#game-board');
		this.options = this.$('select');
		this.options.find('option[value="'+this.model.get('userSelection')+'"]').attr('selected', 'selected');
		return this;
	},
	
	removeFlickrPhoto: function() {
		this.model.save({images: _.rest(this.model.get('images'))});
	},
	
	updateSelection: function(){
		console.log('User selection changed to '+this.options.val());
		this.model.save({'userSelection': this.options.val()});
		this.render();
	},
	
	clear: function() {
		this.model.clear();
	}
});

var BirdMatchApp = Backbone.View.extend({

	el: $('#container'),
	
	startTemplate: _.template($('#start-template').html()),
	
	statsTemplate: _.template($('#stats-template').html()),
	
	events: {
		'click #start-game': 'startGame',
		'click #continue-game': 'continueGame',
		'click input[name="pool"]': 'changeDataSet',
		'change select': 'nextBird',
	},
	
	initialize: function() {
		_.bindAll(this, 'addOne', 'addAll', 'render');
	
		birdCage.bind('add', this.addOne);
		birdCage.bind('all', this.render);
		birdCage.fetch();
		
		this.$('#title-screen').html(this.startTemplate);
		
		this.changeContext('#title-screen');
		this.changeDataSet();
		this.waitingForData = false;
	},
	
	render: function() {
		
		var total = birdCage.length,
			correct = birdCage.correct().length;
		
		this.$('#score-board').html(this.statsTemplate({
			total: birdCage.length,
			correct: birdCage.correct().length
		}));
	},
	
	addOne: function(bird) {
		var view = new BirdView({model: bird});
		this.changeQuestionFocus(view);
	},
	
	addAll: function() {
		birdCage.each(this.addOne);
	},
	
	create: function() {
		var self = this,
			data = workingList.shift().toJSON(),
			nameOptions = [],
			flickrTags = [data['comName'],data['sciName']];
		
		console.log('Creating new bird...');
		
		self.$el.find('#loading-screen').stop().removeClass('is-hidden').animate({opacity: 1}, 400);
			
		$.getJSON(flickrBaseUrl+'tags='+flickrTags.join(',')+'&tagmode='+flickrTagMode+'&format='+flickrFormat+'&jsoncallback='+flickrCallback,function(flickrData) {
			if(flickrData.items.length === 0) {
				console.log('No photos found for '+data['comName']+', retrying with different species');
				self.create();
			} else {
				console.log(flickrData.items.length+' images found for '+data['comName']);
				$.each(flickrData.items,function(i,v){
					v.media.m = v.media.m.replace('_m', '');
				});
				$.extend(data,{images: _.shuffle(flickrData.items)});
				
				nameOptions.push(data['comName']);
				
				for(var i = 0; i < 4; i++) {
					nameOptions.push(masterList[Math.floor(Math.random()*masterList.length)].get('comName'));
				}
				
				$.extend(data,{nameOptions: _.shuffle(nameOptions)});
				
				birdCage.create(data);
				
				self.$el.find('#loading-screen').stop().animate({opacity: 0}, 400,function(){
					$(this).addClass('is-hidden');
				})
			}
		});
	},
	
	startGame: function() {
		console.log('Starting Game...');
		this.changeContext('#game-board');
		if(birdCage.length) {
			birdCage.reset();
			birdCage.localStorage.destroyAll();
		}
		this.nextBird();
	},
	
	continueGame: function() {
		this.changeContext('#game-board');
		this.addAll();
	},
	
	nextBird: function() {
		if(this.fetchingData === true) {
			this.waitingForData = true;
		} else {
			this.create();
		}
	},
	
	checkGameStatus: function() {
		if(this.waitingForData) {
			this.create();
			this.waitingForData = false;
		}
	},
	
	changeContext: function(selector) {
		var $newContext = this.$el.children(selector);
		if($newContext.length) {
			$newContext.siblings('section').animate({opacity:0},400,function(){$(this).removeClass('has-context')}).promise().done(function(){
				$newContext.addClass('has-context').animate({opacity:1},400);
			});
		}
	},
	
	changeQuestionFocus: function(view) {
		view.$el.siblings('.bird').animate({opacity:0},400,function(){$(this).removeClass('is-active')}).promise().done(function(){
			view.$el.addClass('is-active').animate({opacity:1},400);
		});
	},
	
	changeDataSet: function() {
		var val = this.$('input[name="pool"]:checked').val() || 'world';
		console.log('changing data set to: '+val);
		this.dataSet = val;
		this.setEbirdData();
	},
	
	setEbirdData: function() {
		var self = this,
		dataSet = self.dataSet;
		console.log('Getting '+dataSet+' eBird data...');
		self.fetchingData = true;
		if(dataSet === 'local') {
			navigator.geolocation.getCurrentPosition(
				function(position) {
					console.log('User is at: '+position.coords.latitude, position.coords.longitude);
					eBirdLng = position.coords.longitude;
					eBirdLat = position.coords.latitude;
					var url = eBirdBaseUrl+'data/obs/geo/recent?lng='+eBirdLng+'&lat='+eBirdLat+'&dist='+eBirdDist+'&back='+eBirdDays+'&fmt='+eBirdFormat+'&callback='+eBirdCallback;
					$.getJSON(url, function(data){
						self.fetchingData = false;
						localStorage[dataSet] = JSON.stringify(data);
						eBirds.reset(data);
						masterList = workingList = eBirds.shuffle();
						self.checkGameStatus();
					});
				},
				function(error) {
					var errors = { 
					    1: 'Permission denied',
					    2: 'Position unavailable',
					    3: 'Request timeout'
					};
					console.error('Could not determine user location ('+errors[error.code]+'). Using world data instead.');
					this.dataSet = 'world';
				}
			);
		} else {
			if(localStorage[dataSet]) {
				self.fetchingData = false;
				eBirds.reset(JSON.parse(localStorage[dataSet]));
				masterList = workingList = eBirds.shuffle();
				self.checkGameStatus();
			} else {
				var url = (dataSet === 'world')? eBirdTaxaUrl : eBirdBaseUrl+'data/obs/geo/recent?lng='+eBirdLng+'&lat='+eBirdLat+'&dist='+eBirdDist+'&back='+eBirdDays+'&fmt='+eBirdFormat+'&callback='+eBirdCallback;
				$.getJSON(url, function(data){
					self.fetchingData = false;
					localStorage[dataSet] = JSON.stringify(data);
					eBirds.reset(data);
					masterList = workingList = eBirds.shuffle();
					self.checkGameStatus();
				});
			}
		}
	}
});

var BirdMatch = new BirdMatchApp;

var $loader = $('.loader'),
	token = 0;

setInterval(function(){
	$loader.html(token%8);
	token++;
}, 100);
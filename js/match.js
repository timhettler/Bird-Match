var eBirdTaxaUrl = 'http://ebird.org/ws1.1/ref/taxa/ebird?cat=species&locale=en_US&fmt=json&callback=?',
    speciesList = [],
    flickrKey = '41cae44ac5d84579ae23b784321f9377',
    flickrSecret= '421f1282ebace3b5',
    flickrBaseUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?',
    flickrTags = '',
    flickrTagMode = 'any',
    flickrFormat = 'json',
    flickrCallback = '?',
    shuffle = function(o) {
            for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
    },
    $wrapper = $('<figure><img src="" alt="" /><figcaption><p class="hidden"></p></figcaption></figure>'),
    $option = $('<option value=""/>');
    
$.getJSON(eBirdTaxaUrl, function(eBirdData) {
    speciesList = shuffle(eBirdData);
    
    getSpeciesPhotos(selectRandomSpecies(speciesList));
});

var selectRandomSpecies = function(speciesList){
    return speciesList[Math.floor(Math.random()*speciesList.length)];
},
getFlickrTags = function(species){
    return species.comName+','+species.sciName;
},
getSpeciesPhotos = function(species){
    var flickrKey = '41cae44ac5d84579ae23b784321f9377',
    flickrSecret= '421f1282ebace3b5',
    flickrBaseUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?',
    flickrTags = getFlickrTags(species),
    flickrTagMode = 'any',
    flickrFormat = 'json',
    flickrCallback = '?';
    
    console.log('retrieving photos for '+species.comName+'...', species);
    $.getJSON(flickrBaseUrl+'tags='+flickrTags+'&tagmode='+flickrTagMode+'&format='+flickrFormat+'&jsoncallback='+flickrCallback,function(flickrData){
        if(flickrData.items.length === 0) {
            console.log('No photos found, retrying with different species');
            getSpeciesPhotos(selectRandomSpecies(speciesList));
        } else {
            console.log(flickrData.items.length+' images found');
            var image = flickrData.items[Math.floor(Math.random()*flickrData.items.length)];
            $wrapper.clone().find('img')
                .attr('src',image.media.m)
            .end().find('p')
                .html(image.title)
            .end().prependTo('#main');
            
            var quizOptions = [speciesList[0],speciesList[1],speciesList[2],speciesList[3],species];
            shuffle(quizOptions);
            
            $.each(quizOptions,function(i,v){
                $option.clone().val(v.taxonID).html(v.comName).appendTo('select');
            });
        }
    });
};
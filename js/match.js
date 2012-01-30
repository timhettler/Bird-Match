var key = '41cae44ac5d84579ae23b784321f9377',
    secret= '421f1282ebace3b5',
    baseurl = 'http://api.flickr.com/services/feeds/photos_public.gne?',
    tags = 'northern cardinal, cardinalis cardinalis',
    tagmode = 'any',
    format = 'json';
    
    $.getJSON(baseurl+'tags='+tags+'&tagmode='+tagmode+'&format='+format);
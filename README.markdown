Bird Match
==========

A simple game that utilizes the Flickr & eBird API to test your bird ID skills.

Current functionality:
----------------------

1. Retrieves list of all species in the eBird taxonomy
2. Chooses random species from list
3. Gets public Flickr photos of chosen bird
4. Chooses random photo from list
5. Displays image with five species options to choose from

To-do:
------

* Add functionality to assess correct/incorrect response
* Keep track of user score
* ~~Display image attribution~~ Added a link below image
* ~~Cache eBird data to improve performance~~ Using localStorage to cache the taxonomy data

Future plans:
-------------

* Option to only use birds found in specific region
* Limit photo search to specific groups?
* Create family relationships so that offered birds are more similar, thus making the quiz a bit harder
* Preserve user score
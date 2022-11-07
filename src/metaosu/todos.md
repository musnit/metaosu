Potential todos:
 - mouse press detection is still based on last in array, rather than purely time based (eg: if replay with future mouse events, won't work exactly)
 - for computation that occurs in serial where order and past events matter (eg: score increasing on each click) maybe try use something like dynamic programming algorithms or something of that sort where there's lazy computation? though may not be best in game context since u want to make sure stuff is predictable rather than risk of a lazy computation butting into the fps

var mongoose = require('mongoose'),
    Show = mongoose.model('Show'),
    express = require('express');


exports.getAll = function() {
    return Show.getAllShows();
};

exports.getSeason = function( title, season ) {
    season = parseInt(season, 10);
    return Show.getSeason( title, season );
};

exports.getAllSeasons = function( title ) {
    return Show.getAvailableSeasons( title );
};
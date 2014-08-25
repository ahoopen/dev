var schedule = require('node-schedule');


exports.schedule = {

    /**
     * Maak een schedule job aan. De callback wordt aangeroepen wanneer
     * de job rule is bereikt.
     *
     * @param options
     * @param cb
     */
    job : function( options, cb ) {
        var rule = new schedule.RecurrenceRule();
        rule.dayOfWeek = options.dayOfWeek || null;
        rule.hour = options.hour || null;
        rule.minute = options.minute || null;

        schedule.scheduleJob(rule, cb);
    }
};

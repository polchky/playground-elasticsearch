/**
 * @module simulator
 */
"use strict";

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var moment = require('moment');

/**
 * @class
 */
function Simulator(initialTime, endTime) {

    EventEmitter.call(this);

    var waitingForEvents = true;

    var isRunning = false;

    var shouldRun = false;

    var eventsQueue = [];

    var now = initialTime || moment();

    var endTime = endTime;

    /**
     * Use this method to know what is the current time in the simulation
     *
     * @returns {Moment} the current value of the simulated time
     */
    this.getSimulatorTime = function () {
        return moment(now);
    };

    this.hasEvents = function () {
        return eventsQueue.length !== 0;
    };

    /**
     * Use this method to schedule an event that should be processed some time in the future.
     * Note that this is not the time managed by the simulator, not the real time.
     *
     * @param eventType a string value defining the event type
     * @param event the event data
     * @param date a moment.js date indicating when the event should be processed
     */
    this.schedule = function (eventType, event, date) {

        date = date || now;

        eventsQueue.push({
            type: eventType,
            event: event,
            date: date
        });

        eventsQueue.sort(function (event1, event2) {
            return event1.date - event2.date;
        });

        if (this.shouldRun && !this.isRunning) {
            console.log("Need to resume");
            this.start();
        }

    };

    /**
     * Use this method to schedule an event that should be processed as soon as possible
     *
     * @param eventType a string value defining the event type
     * @param event the event data
     */
    this.scheduleImmediately = function (eventType, event) {
        this.schedule(eventType, event, now);
    };

    this.tick = function () {
        var nextEvent = {};
        nextEvent = eventsQueue.shift();
        if (nextEvent) {
            if (now < nextEvent.date) {
                now = nextEvent.date;
            }
            console.log("It is now: " + JSON.stringify(now));
            if (endTime && now > endTime) {
                this.shouldRun = false;
                this.pause();
            } else {
                this.emit(nextEvent.type, nextEvent.event);
            }
        }
    };

    this.start = function () {
        console.log("start");
        this.shouldRun = true;
        this.isRunning = true;
        while (this.shouldRun && this.hasEvents()) {
            this.tick();
        }
        this.isRunning = false;
        console.log("finishing simulation...");
        return "Simulation done. Final time: " + this.getSimulatorTime().format();
    };

    this.pause = function () {
        this.shouldRun = false;
    }

};

util.inherits(Simulator, EventEmitter);


exports.Simulator = Simulator;
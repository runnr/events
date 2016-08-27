"use strict";

const { Mixin } = require("mixwith");
const events = require("events");

/**
 * An EventEmitter that does not enumerate its internal properties.
 * Needed to prevent LokiJS from storing EventEmitter state data.
 */
const EventEmitter = Mixin(superclass => {
	class EventEmitter extends superclass {
		constructor() {
			super(...arguments);
			events.call(this);

			Object.defineProperties(this, {
				_events: {
					writable: true,
					enumerable: false,
					configurable: false,
					value: this._events // eslint-disable-line no-underscore-dangle
				},
				_eventsCount: {
					writable: true,
					enumerable: false,
					configurable: false,
					value: this._eventsCount // eslint-disable-line no-underscore-dangle
				},
				_maxListeners: {
					writable: true,
					enumerable: false,
					configurable: false,
					value: this._maxListeners // eslint-disable-line no-underscore-dangle
				},
				domain: {
					writable: true,
					enumerable: false,
					configurable: false,
					value: this.domain
				}
			});
		}
	}

	Object.assign(EventEmitter.prototype, events.prototype);

	return EventEmitter;
});

module.exports = EventEmitter;

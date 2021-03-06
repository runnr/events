"use strict";

const { mix, MixinFactory } = require("@runnr/mixin");

const EventEmitter = require("./EventEmitter");

const update = Symbol("update");
const del = Symbol("delete");

const type = {
	change: prop => `${prop}Changed`,
	add: prop => `${prop}Added`,
	delete: prop => `${prop}Deleted`
};

const UpdateEmitter = MixinFactory((properties = []) => {
	const definitions = {};

	for(const property of properties) {
		const propertyString = typeof property === "symbol" ? property.toString().slice(7, -1) : property;
		const symbol = Symbol(propertyString);

		definitions[property] = {
			get() {
				return this[symbol];
			},
			set(val) {
				if(this[symbol] === val)
					return;

				const emitUpdate = symbol in this;

				this[symbol] = val;

				if(emitUpdate)
					this[update](type.change(propertyString), val);
			}
		};
	}

	return superclass => {
		class UpdateEmitter extends mix(superclass).with(EventEmitter) {
			[update](type, value) {
				this.emit("update", type, value);
				this.emit(type, value);
			}

			[del]() {
				this.emit("delete");
			}
		}

		Object.defineProperties(UpdateEmitter.prototype, definitions);

		return UpdateEmitter;
	};
});

Object.assign(UpdateEmitter, {
	update, type,
	delete: del
});

module.exports = UpdateEmitter;

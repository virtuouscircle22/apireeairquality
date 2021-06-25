"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datos = exports.Dato = void 0;
const mongoose_1 = require("mongoose");
class Dato {
    constructor(ID, CO2, NO, NH3, CO, PM10, PM25, date) {
        this._ID = ID;
        this._CO2 = CO2;
        this._NO = NO;
        this._NH3 = NH3;
        this._CO = CO;
        this._PM10 = PM10;
        this._PM25 = PM25;
        this._date = date;
    }
}
exports.Dato = Dato;
// Definimos el Schema
const datoSchema = new mongoose_1.Schema({
    _ID: String,
    _CO2: Number,
    _NO: Number,
    _NH3: Number,
    _CO: Number,
    _PM10: Number,
    _PM25: Number,
    _date: Date
});
exports.Datos = mongoose_1.model('datos', datoSchema);

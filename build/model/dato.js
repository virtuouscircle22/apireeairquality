"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatosHistoricos = exports.DatosDispositivosPortables = exports.DatosDispositivosFijos = void 0;
const mongoose_1 = require("mongoose");
const DatosDispositivosFijosSchema = new mongoose_1.Schema({
    _id: String,
    _co2: Number,
    _no: Number,
    _nh3: Number,
    _co: Number,
    _pm10: Number,
    _pm25: Number,
    _date: Date
}, {
    collection: 'DatosDispositivosFijos'
});
const CoordenadasSchema = new mongoose_1.Schema({
    _latitud: Number,
    _longitud: Number,
});
const DatosDispositivosPortablesSchema = new mongoose_1.Schema({
    _id: String,
    _co2: Number,
    _no: Number,
    _nh3: Number,
    _coordenadas: CoordenadasSchema,
    _date: Date
}, {
    collection: 'DatosDispositivosPortables'
});
const DatosHistoricosSchema = new mongoose_1.Schema({
    _status: String,
    _data: {
        _aqi: Number,
        _idx: Number,
        _attributions: [
            {
                _url: String,
                _name: String,
            }
        ],
        _city: {
            _geo: [Number],
            _name: String,
            _url: String
        },
        _dominentpol: String,
        _iaqi: {
            _co: {
                _v: String
            },
            _h: {
                _v: String
            },
            _no2: {
                _v: String
            },
            _p: {
                _v: String
            },
            _pm10: {
                _v: String
            },
            _pm25: {
                _v: String
            },
            _so2: {
                _v: String
            },
            _t: {
                _v: String
            },
            _w: {
                _v: String
            },
            _wg: {
                _v: String
            }
        },
        _time: {
            _s: String,
            _tz: String,
            _v: Number
        }
    }
}, {
    collection: 'documentos'
});
exports.DatosDispositivosFijos = mongoose_1.model('DatosDispositivosFijos', DatosDispositivosFijosSchema);
exports.DatosDispositivosPortables = mongoose_1.model('DatosDispositivosPortables', DatosDispositivosPortablesSchema);
exports.DatosHistoricos = mongoose_1.model('documentos', DatosHistoricosSchema);

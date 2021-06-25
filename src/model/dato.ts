import { Schema, model } from 'mongoose'

const DatosDispositivosFijosSchema = new Schema({
    _id: String,
    _co2: Number,
    _no: Number,
    _nh3: Number,
    _co: Number,
    _pm10: Number,
    _pm25: Number,
    _date: Date
},{
    collection:'DatosDispositivosFijos'
})

const CoordenadasSchema=new Schema({
    _latitud: Number,
    _longitud: Number,
})

const DatosDispositivosPortablesSchema = new Schema({
    _id: String,
    _co2: Number,
    _no: Number,
    _nh3: Number,
    _coordenadas: CoordenadasSchema,
    _date: Date
},{
    collection:'DatosDispositivosPortables'
})

const DatosHistoricosSchema = new Schema({
    _status:String,
    _data: {
        _aqi:Number,
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
        _dominentpol:String,
        _iaqi: {
            _co:{
                _v:String
            },
            _h:{
                _v:String
            },
            _no2:{
                _v:String
            },
            _p:{
                _v:String
            },
            _pm10:{
                _v:String
            },
            _pm25:{
                _v:String
            },
            _so2:{
                _v:String
            },
            _t:{
                _v:String
            },
            _w:{
                _v:String
            },
            _wg:{
                _v:String
            }
        },
        _time: {
            _s: String,
            _tz: String,
            _v: Number
        }
    }
},{
    collection: 'documentos'
})



export const DatosDispositivosFijos = model('DatosDispositivosFijos', DatosDispositivosFijosSchema  )
export const DatosDispositivosPortables = model('DatosDispositivosPortables', DatosDispositivosPortablesSchema  )
export const DatosHistoricos = model('documentos', DatosHistoricosSchema)
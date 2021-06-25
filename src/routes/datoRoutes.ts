import {Request, Response, Router } from 'express'
import { DatosDispositivosFijos, DatosDispositivosPortables, DatosHistoricos } from '../model/dato'
import { db } from '../database/database'

class DatoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getFijo = async (req: Request, res: Response) => {
        let {id}=req.params
        let idv="Spain"
        if (id=="GREECE"||id=="greece"||id=="Greece"){
            idv="Greece"
        } else if (id=="BULGARIA"||id=="bulgaria"||id=="Bulgaria"){
            idv="Bulgaria"
        }
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await DatosDispositivosFijos.findOne({ID:idv}).sort({date:-1})
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private getPortables = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await DatosDispositivosPortables.find(
                {Coordenadas: {$exists:true}, "Coordenadas.Latitud": {$ne:NaN}}
            )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private getHistoricos = async (req: Request, res: Response) => {
        let {pais, anyo, mes, dia} = req.params
        let fecha= "^"+anyo+"-"+mes+"-"+dia
        let paisv = 12410
        if (pais=="spain"){
            paisv=8495
        } else if (pais=="bulgaria"){
            paisv=8084
        }
        await db.conectarBD2()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await DatosHistoricos.aggregate(
                [
                    {
                        $match: {
                            "data.idx":paisv,
                            "data.time.s": {$regex: fecha}
                        }
                    },            
                    {
                        $group:
                        {
                            _id: null,
                            mediaO3: { $avg: "$data.iaqi.o3.v" },
                            mediaNO2: { $avg: "$data.iaqi.no2.v" },
                            mediaPM10: { $avg: "$data.iaqi.pm10.v" }
                        }
                    }
                ]
             )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD2()
    }

    private getHistoricos2 = async (req: Request, res: Response) => {
        let {contaminante, pais, anyo} = req.params
        let fecha= "^"+anyo
        let paisv = 12410
        if (pais=="spain"){
            paisv=8495
        } else if (pais=="bulgaria"){
            paisv=8084
        }
        let c = "$data.iaqi."+contaminante+".v"
        await db.conectarBD2()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await DatosHistoricos.aggregate(
                [
                    {
                        $match: {
                            "data.idx":paisv,
                            "data.time.s": {$regex: fecha}
                        }
                    },            
                    {
                        $group:
                        {
                            _id: {$substr: ["$data.time.s", 0, 10]},
                            v: { $avg: c }
                        }
                    }
                ]
             )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD2()
    }

    private getHistoricos3 = async (req: Request, res: Response) => {
        let {pais, anyo, mes} = req.params
        let fecha= "^"+anyo+"-"+mes
        let paisv = 12410
        if (pais=="spain"){
            paisv=8495
        } else if (pais=="bulgaria"){
            paisv=8084
        }
        await db.conectarBD2()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await DatosHistoricos.aggregate(
                [
                    {
                        $match: {
                            "data.idx":paisv,
                            "data.time.s": {$regex: fecha}
                        }
                    },            
                    {
                        $group:
                        {
                            _id: {$substr: ["$data.time.s", 0, 10]},
                            vpm10: { $avg: "$data.iaqi.pm10.v" },
                            vo3: { $avg: "$data.iaqi.o3.v" },
                            vno2: { $avg: "$data.iaqi.no2.v" }
                        }
                    }
                ]
             )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD2()
    }

    private anyos = async (req: Request, res: Response) => {
        await db.conectarBD2()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await DatosHistoricos.aggregate(
                [          
                    {
                        $group:
                        {
                            _id: {$substr: ["$data.time.s", 0, 4]},
                        }                        
                    },{ 
                        $sort : 
                        { _id : 1 } 
                    }
                ]
             )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD2()
    }

    private hisoricosPost = async (req: Request, res: Response) => {
        const estacion =   parseInt(req.params.id); //8495
        const fechaInicial =  req.params.fechaInicial;   //"2020-01-01"
        const fechaFinal =  req.params.fechaFinal;       //"2020-01-05"
        await db.conectarBD2()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await DatosHistoricos.aggregate(
                [          
                    {
                        $match: {
                            "data.idx": estacion,
                            $and: [
                                {
                                    "data.time.s": {
                                        $gte: fechaInicial
                                    }
                                },
                                {
                                    "data.time.s": {
                                        $lte: fechaFinal
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            "data.idx":1,
                            date: {
                                $dateFromString: {
                                    dateString: {$substr: ["$data.time.s", 0, 10]},  // coger los 16 primeros para cuando no haya segundos
                                    format: "%Y-%m-%d" // -> on-line :%S 
                                }
                            },
                            datos:{
                                $objectToArray:"$data.iaqi"
                            }
            
                        }
                    },
                    {
                        $unwind: "$datos"
                    },
                    {
                        $project:{
                            "data.idx":1,
                            datos:1,
                            date:1
            
                        }
                    },
                    {
                        $group: {
                            _id:{
                                estacion:"$data.idx",
                                fecha:"$date",
                                cont:"$datos.k"
                            },
                            v:{
                                $avg:{
                                    $cond: { if: { $gte: [ "$datos.v.v", "" ] }, then: 0, else: "$datos.v.v" }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            estacion:"$_id.estacion",
                            fecha:"$_id.fecha",
                            contaminante:"$_id.cont",
                            valor:"$v"
                        }
                    },
                    {
                        $sort:{
                            fecha:1
                        }
                    }
                ]
             )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD2()
    }

    private postPropios = async (req: Request, res: Response) => {
        const estacion = req.params.id;         //"Spain"
        const fechaInicial = new Date(req.params.fechaI);     // new Date("2020-03-19")
        const fechaFinal = new Date(req.params.fechaF);         //new Date("2020-03-25")
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await DatosDispositivosFijos.aggregate(
                [          
                    {
                        $match:{
                            ID: estacion,
                            $and:[
                                {date:{$gte:fechaInicial}},
                                {date:{$lte:fechaFinal}}
                            ]
                        }
                    },
                    {
                        $project:{
                            estacion:"$ID",
                            date: {
                                $dateFromString: {
                                    dateString: {$substr: [{$dateToString:{date: "$date", format: "%Y-%m-%d"}}, 0, 10]},  // coger los 16 primeros para cuando no haya segundos
                                    format: "%Y-%m-%d" // -> on-line :%S 
                                }
                            },
            
                            contaminantes:[
                                {nombre:"NO",v:"$NO"},
                                {nombre:"NH3",v:"$NH3"},
                                {nombre:"CO",v:"$CO"},
                                {nombre:"CO2",v:"$CO2"},
                                {nombre:"PM10",v:"$PM10"},
                                {nombre:"PM25",v:"$PM25"}
                            ]
                        }
                    },
                    {
                        $unwind:"$contaminantes"
                    },
                    {
                        $group: {
                            _id:{
                                ID:"$estacion",
                                fecha:"$date",
                                contaminantes:"$contaminantes.nombre"
                            },
                            v:{
                                $avg:"$contaminantes.v"
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            estacion:"$_id.ID",
                            fecha:"$_id.fecha",
                            contaminante:"$_id.contaminantes",
                            valor:"$v"
                        }
                    },
                    {
                        $sort:{
                            fecha:1
                        }
                    }
                ]
             )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }
   

    misRutas(){
        this._router.get('/fijo/:id', this.getFijo),
        this._router.get('/portable', this.getPortables),
        this._router.get('/historicos/:pais&:anyo&:mes&:dia', this.getHistoricos),
        this._router.get('/historicos2/:contaminante&:pais&:anyo', this.getHistoricos2),
        this._router.get('/historicos3/:pais&:anyo&:mes', this.getHistoricos3),
        this._router.get('/anyos', this.anyos),
        this._router.post('/historicos/:id&:fechaInicial&:fechaFinal', this.hisoricosPost),
        this._router.post('/propios/:id&:fechaI&:fechaF', this.postPropios)
    }
}

const obj = new DatoRoutes()
obj.misRutas()
export const datoRoutes = obj.router

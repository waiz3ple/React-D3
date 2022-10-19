import React, {useRef, useEffect} from 'react';
import axios from 'axios';
import * as d3 from 'd3';

export default function LineChart(props){
     const d3Chart = useRef();

    useEffect(()=>{
        (async function(){
            const response = await axios.get('https://data.cityofnewyork.us/resource/tg4x-b46p.json');
            //modifying records
            const allPermits = response.data.filter(event => event.eventtype==='Shooting Permit',) 
           // extract time series
            const dateAndEvents = allPermits.map(event => event.enteredon.slice(0,10))
            .reduce((accu, curr)=> {(!accu[curr]) ? accu[curr] = 1 : ++accu[curr];
                return accu;
                },{})
            console.log( dateAndEvents );
            const margin = {top:50, right:30, bottom: 50, left: 30}
        })() 
    },[])

    return (
        <div className="line">Line Art {props.number}</div>
        )
}

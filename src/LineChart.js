import React, {useRef, useEffect, useState} from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import './LineChart.css';

export default function LineChart(props){

     const d3Chart = useRef();
     const [size, setSize] = useState({width:0, height:0})

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
          
        //format to [{date:2002-3-4, amount:23},...]
          function d3Data(obj,key1,key2){
                const store = [];
               Object.entries(obj).forEach(([value1,value2])=>{
                 store.push({[key1]:value1, [key2]:value2})
               })
               return store;
          }
     
            //working on datavizualization
            console.log( d3Data(dateAndEvents,'date','amount') );
            const data =  d3Data(dateAndEvents,'date','amount');

            const margin = {top:50, right:30, bottom: 50, left: 30};
            const width  = parseInt(d3.select('#canvas').style('width'));
            const height = parseInt(d3.select('#canvas').style('height'));
            setSize({width, height})

         /*   
             const data = [
                {width: 200, height: 200, fill:'pink'},
                {width: 100, height: 60, fill:'blue'},
                {width: 50, height: 30, fill:'yellow'}
                
             ]*/
            //set up chart
            const canvas = d3.select(d3Chart.current);
            const svg    = canvas.append('svg')
                           .attr('height', size.height)
                           .attr('width', size.width )
                           .style('background-color','grey');
              
              //fetch rect as selectAll to have access to virtual place in enter() 
                const rect = svg.selectAll('rect')
                .data(data);
                rect.enter().append('rect')
                .attr('height', (d, i, n) => d.amount)
                .attr('width', 20)
                .attr('fill',  d =>'blue')
                .attr('x', (_,i)=> i * 25)
                .attr('y', 50)
               
        })() 
    },[size.width])

    return (
        <div id="canvas" ref={d3Chart}>
        </div>
        )
}

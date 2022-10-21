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

            
            const width  = parseInt(d3.select('#canvas').style('width'));
            const height = parseInt(d3.select('#canvas').style('height'));
            setSize({width, height})
            
            const margin = {top:20, right:200, bottom: 100, left: 100};
            const graphWidth = width - margin.left - margin.right;
            const graphHeight = height - margin.top - margin.bottom;


            //set up chart
            const canvas = d3.select(d3Chart.current);
            const svg    = canvas.append('svg')
                           .attr('height', size.height)
                           .attr('width', size.width )
                           .style('background-color','lightgrey');
             
              const graph = svg.append('g')
                            .attr('width', graphWidth)
                            .attr('height',graphHeight)
                            .attr('transform', `translate(${margin.left},${margin.top})`);
             
             const xAxisGroup = graph.append('g')
                                .attr('transform', `translate(0,${graphHeight})`);
             const yAxisGroup = graph.append('g');

              const min =  d3.min(data, d => d.amount);
              const max =  d3.max(data, d => d.amount);
              const extent =  d3.extent(data, d => d.amount);
              //scaling
              const y = d3.scaleLinear()
                        .domain([0,max])
                        .range([graphHeight,0]);
              //band scale
             const x = d3.scaleBand()
                     .domain(data.map(item => item.date))
                     .range([0,600])
                     .paddingInner(0.1)
                     .paddingOuter(0.1);

              //fetch rect as selectAll to have access to virtual place in enter() 
                const rect = graph.selectAll('rect')
                .data(data);
                rect.enter().append('rect')
                .attr('height', (d, i, n) =>graphHeight - y(d.amount))
                .attr('width', x.bandwidth)
                .attr('fill',  d =>'grey')
                .attr('x', d => x(d.date)) //instead of the hack => i * 20
                .attr('y', d=> y(d.amount));
               
               const xAxis = d3.axisBottom(x)
               const yAxis = d3.axisLeft(y)
               xAxisGroup.call(xAxis)
               yAxisGroup.call(yAxis)

        })() 
    },[size.width])

    return (
        <div id="canvas" ref={d3Chart}>
        </div>
        )
}

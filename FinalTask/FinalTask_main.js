let input_data;
let bubble_chart;
let bar_chart;
let filter = [];

d3.csv("https://kazuming.github.io/InfoVis2022/FinalTask/data_final3.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.population = +d.population;
            d.bed = +d.bed;
            d.infected = +d.infected;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeSet1 );
        color_scale.domain(['Hokkaido/Tohoku','Kanto','Chubu','Kinki','Chugoku','Shikoku','Kyusyu/Okinawa']);

        bubble_chart = new BubbleChart( {
            parent: '#drawing_region_bubblechart',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:50, left:90},
            xlabel: 'Population',
            ylabel: 'Number of Infected People',
            cscale: color_scale
        }, input_data );
        bubble_chart.update();

        bar_chart = new BarChart( {
            parent: '#drawing_region_barchart',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:50, left:90},
            xlabel: 'Region',
            ylabel: 'Number of Infected People',
            cscale: color_scale
        }, input_data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        bubble_chart.data = input_data;
    }
    else {
        bubble_chart.data = input_data.filter( d => filter.includes( d.region ) );
    }
    bubble_chart.update();
}

d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 760,
            height: 400,
            margin: {top:60, right:10, bottom:50, left:100}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.axis_margin = {top:20, right:20, bottom:20, left:20}
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(10)
            .tickSize(10)
            .tickPadding(5)

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6)
            .tickSize(10)
            .tickPadding(5);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);


        self.title_group = self.chart.append('g')
            .attr('transform', `translate(0, -20)`)


    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin-self.axis_margin.left, xmax+self.axis_margin.right] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymin-self.axis_margin.top, ymax+self.axis_margin.bottom] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );

        self.xaxis_group
            .append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width/2)
            .attr("y", self.config.margin.bottom)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("font-weight", "bold")
            .text("x-label");

        self.yaxis_group
            .call( self.yaxis );

        self.yaxis_group
            .append("text")
            .attr("fill", "black")
            .attr("x", -self.inner_height/2)
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("font-weight", "bold")
            .attr("transform","rotate(-90)")
            .text(`y-label`)

        self.title_group.append('text')
            .attr("x", self.inner_width/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("font-weight", "bold")
            .text("title")
    }
}

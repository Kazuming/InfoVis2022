d3.csv("https://kazuming.github.io/InfoVis2022/W10/data2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 500,
            height: 500,
            margin: {top:100, right:10, bottom:100, left:100},
            title: 'Task 02',
            xlabel: 'xlabel',
            ylabel: 'ylabel'
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
            width: config.width || 500,
            height: config.height || 500,
            margin: config.margin || {top:20, right:30, bottom:20, left:30},
            title: config.title ||'',
            xlabel: config.xlabel ||'',
            ylabel: config.ylabel ||''
        }
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
            .ticks(10);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(10);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);

        self.xlabel = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left + self.inner_width/2}, ${self.config.width - self.config.margin.bottom/2})`)
            .append('text')
            .text(self.config.xlabel);

        self.ylabel = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left/2}, ${self.config.height/2})`)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .text(self.config.ylabel);

        self.title = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left + self.inner_width/2}, ${self.config.margin.top/2})`)
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('font-size', '20pt')
            .attr('font-weight', 'bold')
            .text(self.config.title);

    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [0, 200] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [0, 100] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .join("circle")
            .transition().duration(1000)
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .style("fill", "black");

        self.chart.selectAll("circle")
            .data(self.data)
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Tips</div>(${d.x}, ${d.y}, ${d.r})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding))
                    .style('top', (e.pageY + padding));
            })
            .on('click', function(){
                d3.select(this)
                .join(this)
                .style('fill', d =>{
                    if (d3.select(this).attr("style") == "fill: red;") {
                        return "black"
                    } else {
                        return "red"
                    }
                });
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}


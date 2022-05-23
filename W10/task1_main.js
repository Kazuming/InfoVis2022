var bar_chart;
var original_data;

d3.csv("https://kazuming.github.io/InfoVis2022/W10/data.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value; d.label = d.label; });

        var config = {
            parent: '#drawing_region',
            width: 500,
            height: 400,
            margin: {top:60, right:100, bottom:100, left:100}
        };

        original_data = data.concat();
        bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
});

d3.select('#original')
.on('click', d => {
    bar_chart.data = original_data.concat();
    bar_chart.update();
});

d3.select('#reverse')
.on('click', d => {
    bar_chart.data.reverse();
    bar_chart.update();
});

d3.select('#ascend')
.on('click', d => {
    bar_chart.data.sort(function(first, second){
        return first.value - second.value;
    });
    bar_chart.update();
});

d3.select('#descend')
.on('click', d => {
    bar_chart.data.sort(function(first, second){
        return second.value - first.value;
    });
    bar_chart.update();
});

class BarChart {
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:50, right:10, bottom:50, left:100}
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

        // Initialize axis scales
        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleBand()
            .range( [0, self.inner_height] );

        // Initialize axis
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        // Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.xaxis_group
            .append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width/2)
            .attr("y", self.config.margin.bottom/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .text("price[yen]");

        self.yaxis_group = self.chart.append('g');

        self.yaxis_group
            .append("text")
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("x", -self.inner_height/2)
            .attr("y", -70)
            .attr("fill", "black")
            .attr("transform","rotate(-90)")
            .text("items");

        self.svg.append('text')
            .style('font-size', '30px')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.margin.top - 30)
            .text('Task1');

    }

    update() {
        let self = this;

        const space = 10;
        const xmax = d3.max( self.data, d => d.value ) + space;
        self.xscale.domain([0, xmax]);
        self.yscale.domain(self.data.map(d => d.label)).paddingInner(0.1);

        self.render();
    }

    render() {
        let self = this;

        self.rects = self.chart.selectAll("rect")
            .data(self.data)
            .join("rect")
            .transition().duration(1000)
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label) )
            .attr("fill", d => d.color)
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth())

        self.rects = self.chart.selectAll("rect")
            .data(self.data)
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">label:${d.label}</div>price:${d.value}`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });


        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .transition().duration(1000)
            .call( self.yaxis );

    }
}

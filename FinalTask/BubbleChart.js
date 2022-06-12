class BubbleChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        }
        this.axis_margin = {top:0, right:25, bottom:20, left:0}
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
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '18px')
            .attr('x', self.config.margin.left + self.inner_width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .text( self.config.xlabel );

        const ylabel_space = 80;
        self.svg.append('text')
            .style('font-size', '18px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -self.config.margin.top - self.inner_height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }

    update() {
        let self = this;

        self.cvalue = d => d.region;
        self.xvalue = d => d.population*1000;
        self.yvalue = d => d.bed;
        self.rvalue = d => d.infected/2000;

        const xmin = d3.min( self.data, self.xvalue );
        const xmax = d3.max( self.data, self.xvalue );
        self.xscale.domain( [xmin-(xmax-xmin)*self.axis_margin.left/100, xmax+(xmax-xmin)*self.axis_margin.right/100] );

        const ymin = d3.min( self.data, self.yvalue );
        const ymax = d3.max( self.data, self.yvalue );
        self.yscale.domain( [ymin-(ymax-ymin)*self.axis_margin.top/100, ymax+(ymax-ymin)*self.axis_margin.bottom/100] );

        this.l = [
            {x:xmin, y:ymin},
            {x:xmax, y:ymax}
        ];

        self.render();
    }

    render() {
        let self = this;

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .join('circle');

        circles
            .attr("r", d => self.rvalue(d) )
            .attr("cx", d => self.xscale( self.xvalue(d) ) )
            .attr("cy", d => self.yscale( self.yvalue(d) ) )
            .attr("fill", d => self.config.cscale( self.cvalue(d) ) )
            .style("opacity", 0.7);

        circles
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.prefecture}</div>Population:${d.population*1000}<br>Bed:${d.bed}<br>Infected:${d.infected}`);
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
            .call( self.yaxis );
        
        const line = d3.line()
            .x(d => self.xscale(d.x))
            .y(d => self.yscale(d.y));
        
        /*
        self.chart.append('path')
            .attr('d', line(self.l))
            .attr('stroke', 'black')
            .attr('fill', 'none');
        */
    }
}

d3.csv("https://kazuming.github.io/InfoVis2022/W08/data.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value; d.label = d.label; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });


class PieChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

        self.radius = Math.min( self.config.width, self.config.height ) / 2;

        self.pie = d3.pie()
            .value(d => d.value);

        self.arc = d3.arc()
            .innerRadius(self.radius/2)
            .outerRadius(self.radius);

        self.colors = [
            "red",
            "yellow",
            "peru",
            "maroon",
            "lightyellow",
        ]
    }

    update() {
        let self = this;
        self.render();
    }

    render() {
        let self = this;

        self.svg.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('stroke', 'white')
            .attr("fill", (d,i) => self.colors[i])
            .style('stroke-width', '2px');

        self.svg.selectAll('text')
            .data(self.pie(self.data))
            .enter()
            .append('text')
            .attr("fill", "black")
            .attr('transform', d => `translate(${self.arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .text(d => d.data.label);

    }
}
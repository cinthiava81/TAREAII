const graf = d3.select('#graf')
const anchoTotal = graf.style('width').slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const selectVar = d3.select('#variable')
const selectNum = d3.select('#numero')

const svg = graf
  .append('svg')
  .attr('width', anchoTotal)
  .attr('height', altoTotal)
  .attr('class', 'graf')

const margin = {
  top: 50,
  bottom: 300,
  left: 150,
  right: 50,
}

const ancho = anchoTotal - margin.left - margin.right
const alto = altoTotal - margin.top - margin.bottom

const g = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

let allData = []
let txtVariable = 'pintura'
let numRegistros = 15

let y = d3.scaleLinear()
  .range([alto, 0])

let x = d3.scaleBand()
  .range([0, ancho])
  .paddingInner(0.3)
  .paddingOuter(0.1)

let color = d3.scaleOrdinal()
  .range(['#006466', '#065a60', '#0b525b', '#0b525b', '#1b3a4b', '#212f45', '#272640', '#312244', '#3e1f47', '#4d194d'])

const xAxisGroup = g.append('g')
  .attr('transform', `translate(0, ${alto})`)
  .attr('class', 'ejes')

const yAxisGroup = g.append('g')
    .attr('class', 'ejes')

d3.csv('artist.csv').then(data => {
  data.forEach(d => {
    d.pintura = +d.pintura
    d.edad = +d.edad
  })

  allData = data
  
  render(allData.slice(0, numRegistros))
})

function render(data) {
  // [binding] ENTER - update - exit
  let barras = g.selectAll('rect').data(data)

  y.domain([0, d3.max(data, d => d[txtVariable])])
  x.domain(data.map(d => d.nombre))
  color.domain(d3.map(allData, d => d.edad))

  xAxisGroup
    .transition()
    .duration(3000)
    .call(
      d3.axisBottom(x)
        .tickSize(-alto)
    )
    .selectAll('text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .attr('y', -15)
    .attr('x', -10)

  yAxisGroup
    .transition()
    .duration(3000)
    .call(
        d3.axisLeft(y)
          .ticks(4)
          .tickSize(-ancho)
          .tickFormat(d => `${d} ${ txtVariable == 'pintura' ? 'pinturas' : 'años' }`)
      )

  barras
      .enter()
        .append('rect')
          .attr('y', y(0))
          .attr('x', d => x(d.nombre))
          .attr('width', x.bandwidth())
          .attr('height', alto - y(0))
          .attr('fill', 'yellow')
        .merge(barras)
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
          .attr('x', d => x(d.nombre))
          .attr('width', x.bandwidth())
          .attr('y', d => {
            console.log(txtVariable)
            return y(d[txtVariable])
          })
          .attr('fill', d => color(d.edad))
          .attr('height', d => alto - y(d[txtVariable]))

  barras.exit()
          .transition()
          .duration(1000)
          .attr('height', alto - y(0))
          .attr('y', y(0))
          .attr('fill', '#FFB832  ')
          .remove()

 

        d3.select("#graf").select("svg").selectAll("rect").on("mouseover", function(d) { d3.select(this).style("fill", "red")});
        d3.select("#graf").select("svg").selectAll("rect").on("mouseout", function(d) { d3.select(this).style("fill", "#4d194d")});
      
      
}

selectVar.on('change', () => {
  txtVariable = selectVar.node().value
  render(allData)
})

selectNum.on('change', () => {
  numRegistros = selectNum.node().value
  render(allData.slice(0, numRegistros))
})
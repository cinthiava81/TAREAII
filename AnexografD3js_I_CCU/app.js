const graf = d3.select('#graf')
const anchoTotal = graf.style('width').slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

// ids de HTML
const selectVar = d3.select('#variable')
const selectNum = d3.select('#numero')

const svg = graf
  .append('svg')
  .attr('width', anchoTotal)
  .attr('height', altoTotal)
  .attr('class', 'graf')



const margin = {
  top: 20,
  bottom: 400,
  left: 150,
  right: 50,
}

const ancho = anchoTotal - margin.left - margin.right
const alto = altoTotal - margin.top - margin.bottom

const g = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)



let allData = []
let txtVariable = 'PrecioFinal'
let numRegistros = 10

let y = d3.scaleLinear()
  .range([alto, 0])

let x = d3.scaleBand()
  .range([0, ancho])
  .paddingInner(0.2)
  .paddingOuter(0.5)

let color = d3.scaleOrdinal()
  .range(['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'])

const xAxisGroup = g.append('g')
  .attr('transform', `translate(0, ${alto})`)
  .attr('class', 'ejes')

const yAxisGroup = g.append('g')
    .attr('class', 'ejes')


d3.csv('artists.csv').then(data => {
  data.forEach(d => {
    // console.log(d.edificio)
    d.PrecioFinal = +d.PrecioFinal
    d.PrecioOrignal = +d.PrecioOrginal
    d.Puja = +d.Puja
    d.Ano = +d.Ano
  })

  allData = data

  render(allData.slice(0, numRegistros))
})

function render(data) {
  // [binding] ENTER - update - exit
  let barras = g.selectAll('rect').data(data)

  y.domain([0, d3.max(data, d => d[txtVariable])])
  x.domain(data.map(d => d.Pintura))
  color.domain(d3.map(allData, d => d.Ano))

  xAxisGroup
    .transition()
    .duration(2000)
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
    .duration(2000)
    .call(
        d3.axisLeft(y)
          .ticks(6)
          .tickSize(-ancho)
          .tickFormat(d => `${d} ${ txtVariable == 'PrecioOriginal' ? 'dolares' : 'usd' }`)
      )

  barras
      .enter()
        .append('rect')
          .attr('y', y(0))
          .attr('x', d => x(d.Pintura))
          .attr('width', x.bandwidth())
          .attr('height', alto - y(0))
          .attr('fill', 'blue')
      .merge(barras)
        .transition()
        .duration(2000)
        .ease(d3.easeBounce)
          .attr('x', d => x(d.Pintura))
          .attr('width', x.bandwidth())
          .attr('y', d => {
            console.log(txtVariable)
            return y(d[txtVariable])
          })
          .attr('fill', d => color(d.Ano))
          .attr('height', d => alto - y(d[txtVariable]))

  barras.exit()
          .transition()
          .duration(2000)
          .attr('height', alto - y(0))
          .attr('y', y(0))
          .attr('fill', '#f00')
          .remove()


}

selectVar.on('change', () => {
  txtVariable = selectVar.node().value
  render(allData)
})

selectNum.on('change', () => {
  numRegistros = selectNum.node().value
  render(allData.slice(0, numRegistros))
})
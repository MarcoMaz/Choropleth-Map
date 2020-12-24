let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

const canvas = d3.select('#canvas')
const tooltip = d3.select('#tooltip')

let drawMap = () => {
  canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', d => {
      let id = d['id']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })
      let percentage = county['bachelorsOrHigher']
      if (percentage <= 16){
        return '#00D6BB'
      } else if (percentage <= 32) {
        return '#00B7C5'
      } else if (percentage <= 48) {
        return '#0095C3'
      } else if (percentage <= 64) {
        return '#0072B0'
      } else if (percentage <= 80) {
        return '#274F8F'
      } else {
        return '#422C64'
      }
    })
    .attr('data-fips', d => d['id'])
    .attr('data-education', d => {
      let id = d['id']
      let county = educationData.find((item) => {
        return item['fips'] === id
      }) 
      let percentage = county['bachelorsOrHigher']
        return percentage
      })
      .on('mouseover', (event, countyDataItem)=> {
        tooltip.transition()
          .style('visibility', 'visible')
          .style('left', ( event.pageX + 30 ) + 'px')
          .style('top', ( event.pageY - 40 ) + 'px')

        let id = countyDataItem['id']
        let county = educationData.find((item) => {
            return item['fips'] === id
        })

        tooltip.html(county['area_name'] + '<br/>' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
          .attr('data-education', county['bachelorsOrHigher'] )
      })
      .on('mouseout', (countyDataItem) => {
        tooltip.transition()
          .style('visibility', 'hidden')
      })
}

d3.json(countyURL).then(
  (data, error) => {
    if (error) {
      console.log(log)
    } else {
      countyData = topojson.feature(data, data.objects.counties).features
      d3.json(educationURL).then(
        (data, error) => {
          if (error) {
            console.log(error)
          } else {
            educationData = data
            drawMap()
          }
        }
      )
    }
  }
)
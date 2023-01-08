$(document).ready(function () {
  $('#fullName').autocomplete({
      source: async function(request, response) {
          let data = await fetch(`http://localhost:2121/search?query=${request.term}`)
                      .then(results => results.json())
                      .then(results => results.map(result => {
                          return {
                              label: result.full_name,
                              value: result.full_name,
                              id: result._id
                          }
                      }))
                  response(data)
                  console.log(response)
      },
      minLength: 2,
      select: async function(event, ui) {
          console.log(ui.item.id)
          try{
            window.location.href = `http://localhost:2121/player/${ui.item.id}`
            // fetch(`/player/${ui.item.id}`, {
            //     method: 'GET',
            //     headers: {
            //         'Accept': 'application/json',
            //         'User-Agent': 'ANYTHING_WILL_WORK_HERE'
            //     },
            //     body: JSON.stringify({
            //         'entryIdFromJSFile': Object(entryId)
            //     })
            // })
            // const data = await response.json()
            // console.log(data)
            // location.replace(`/player/${ui.item.id}`)
            }catch(err){
                console.log(err)
            }
        //   fetch(`http://localhost:2121/get/${ui.item.id}`)
        //       .then(result => result.json())
        //       .then(result => {
        //           $('#cast').empty()
        //           result.cast.forEach(cast =>
        //               {
        //                   $(cast).append(`<li>${cast}</li>`)
        //               })
        //       })
      }
  })
})

const awayTeam = document.querySelector('.away-team').addEventListener('click', awayTeamTable) 
const homeTeam = document.querySelector('.home-team').addEventListener('click', homeTeamTable) 

function awayTeamTable () {
  //if away team button clicked 
  document.querySelector('.home-team').classList.replace('btn-active', 'btn-outline')
  document.querySelector('.away-team').classList.replace('btn-outline', 'btn-active')
  document.querySelector('.home-table').classList.replace('visible', 'hidden')
  document.querySelector('.away-table').classList.replace('hidden', 'visible')
}
function homeTeamTable () {
  document.querySelector('.away-team').classList.replace('btn-active', 'btn-outline')
  document.querySelector('.home-team').classList.replace('btn-outline', 'btn-active')
  document.querySelector('.away-table').classList.replace('visible', 'hidden')
  document.querySelector('.home-table').classList.replace('hidden', 'visible')
}
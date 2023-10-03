const countdown = () => {
  const deadline = new Date("Oct 24, 2023 19:30:00").getTime()
  const now = new Date().getTime()
  const t = deadline - now
  const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24

  const textDay = Math.floor(t / day)
  const textHour = Math.floor((t % day) / hour)
  const textMinute = Math.floor((t % hour) / minute)
  const textSecond = Math.floor((t % minute) / second)

  document.querySelector(".day").style.setProperty("--value", textDay)
  document.querySelector(".hour").style.setProperty("--value", textHour)
  document.querySelector(".min").style.setProperty("--value", textMinute)
  document.querySelector(".sec").style.setProperty("--value", textSecond)
}

setInterval(countdown, 1000)

$(document).ready(function () {
  $('#fullName').autocomplete({
      source: async function(request, response) {
          try {
            let data = await fetch(`http://localhost:2121/search?query=${request.term}`)
                          .then(results => results.json())
                          .then(results => results.map(result => {
                              return {
                                  label: result.full_name,
                                  value: result.full_name,
                                  _id: result._id,
                                  id: result.id
                              }
                          }))
                      response(data)
                      console.log(response)
          } catch (error) {
            console.error(error)
            response([])
          }
      },
      minLength: 2,
      select: function(event, ui) {
          console.log(ui.item.id)
          
          fetch(`http://localhost:2121/player/${ui.item.id}`, {
            method: 'GET'
        })
              .then(result => result.json())
              .then(result => {
                console.log(result)
                  $('#cast').empty()
                  result.cast.forEach(cast =>
                      {
                          $(cast).append(`<li>${cast}</li>`)
                      })
                    console.log(result)
              })
              .catch(error => console.error(error))
      }
  })
})


const awayTeam = document
  .querySelector(".away-team")
  .addEventListener("click", awayTeamTable);
const homeTeam = document
  .querySelector(".home-team")
  .addEventListener("click", homeTeamTable);

function awayTeamTable() {
  //if away team button clicked
  document
    .querySelector(".home-team")
    .classList.replace("btn-active", "btn-outline");
  document
    .querySelector(".away-team")
    .classList.replace("btn-outline", "btn-active");
  document.querySelector(".home-table").classList.replace("visible", "hidden");
  document.querySelector(".away-table").classList.replace("hidden", "visible");
}
function homeTeamTable() {
  document
    .querySelector(".away-team")
    .classList.replace("btn-active", "btn-outline");
  document
    .querySelector(".home-team")
    .classList.replace("btn-outline", "btn-active");
  document.querySelector(".away-table").classList.replace("visible", "hidden");
  document.querySelector(".home-table").classList.replace("hidden", "visible");
}

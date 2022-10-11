const countdown = () => {
  const deadline = new Date("Oct 18, 2022 19:30:00").getTime()
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

// let nav = 0;
// let clicked = null;
// let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// const calendar = document.getElementById('calendar');
// const newEventModal = document.getElementById('newEventModal');
// const deleteEventModal = document.getElementById('deleteEventModal');
// const backDrop = document.getElementById('modalBackDrop');
// const eventTitleInput = document.getElementById('eventTitleInput');
// const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// function openModal(date) {
//   clicked = date;

//   const eventForDay = events.find(e => e.date === clicked);

//   if (eventForDay) {
//     document.getElementById('eventText').innerText = eventForDay.title;
//     deleteEventModal.style.display = 'block';
//   } else {
//     newEventModal.style.display = 'block';
//   }

//   backDrop.style.display = 'block';
// }

// function load() {
//   const dt = new Date();

//   if (nav !== 0) {
//     dt.setMonth(new Date().getMonth() + nav);
//   }

//   const day = dt.getDate();
//   const month = dt.getMonth();
//   const year = dt.getFullYear();

//   const firstDayOfMonth = new Date(year, month, 1);
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   console.log(daysInMonth)
  
//   const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'numeric',
//     day: 'numeric',
//   });
//   const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

//   document.getElementById('monthDisplay').innerText = 
//     `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

//   calendar.innerHTML = '';

//   for(let i = 1; i <= paddingDays + daysInMonth; i++) {
//     const daySquare = document.createElement('div');
//     daySquare.classList.add('day');
//     const daySquareNumber = document.createElement('div');
//     daySquareNumber.classList.add('calendarNum')
//     daySquare.appendChild(daySquareNumber);

//     const dayString = `${month + 1}/${i - paddingDays}/${year}`;

//     if (i > paddingDays) {
//       daySquareNumber.innerText = i - paddingDays;
//       const eventForDay = events.find(e => e.date === dayString);

//       if (i - paddingDays === day && nav === 0) {
//         daySquare.id = 'currentDay';
//       }

//       if (eventForDay) {
//         const eventDiv = document.createElement('div');
//         eventDiv.classList.add('event');
//         const alertIcon = document.createElement('i');
//         alertIcon.classList.add('fa-solid')
//         alertIcon.classList.add('fa-circle-exclamation')
//         eventDiv.appendChild(alertIcon)
//         daySquare.appendChild(eventDiv);
//       }

//       daySquare.addEventListener('click', () => openModal(dayString));
//     } else {
//       daySquare.classList.add('padding');
//     }

//     console.log(new Date())
//     calendar.appendChild(daySquare);
//   }
// }

// function closeModal() {
//   eventTitleInput.classList.remove('error');
//   newEventModal.style.display = 'none';
//   deleteEventModal.style.display = 'none';
//   backDrop.style.display = 'none';
//   eventTitleInput.value = '';
//   clicked = null;
//   load();
// }

// function saveEvent() {
//   if (eventTitleInput.value) {
//     eventTitleInput.classList.remove('error');

//     events.push({
//       date: clicked,
//       title: eventTitleInput.value,
//     });

//     localStorage.setItem('events', JSON.stringify(events));
//     closeModal();
//   } else {
//     eventTitleInput.classList.add('error');
//   }
// }

// function deleteEvent() {
//   events = events.filter(e => e.date !== clicked);
//   localStorage.setItem('events', JSON.stringify(events));
//   closeModal();
// }

// function initButtons() {
//   document.getElementById('nextButton').addEventListener('click', () => {
//     nav++;
//     load();
//   });

//   document.getElementById('backButton').addEventListener('click', () => {
//     nav--;
//     load();
//   });

//   document.getElementById('saveButton').addEventListener('click', saveEvent);
//   document.getElementById('cancelButton').addEventListener('click', closeModal);
//   document.getElementById('deleteButton').addEventListener('click', deleteEvent);
//   document.getElementById('closeButton').addEventListener('click', closeModal);
// }

// initButtons();
// load();

// // Check which elements are checked in DataBase
// const availStr = document.querySelector('.availStr');
// const shiftData = document.querySelector('.shiftData');
// const daySD = shiftData.innerHTML;
// let stringOutput = ''
// let shiftTime = ''

// if (daySD.includes("cbSun: 'on'")) {
//   stringOutput += ' Sunday,'
// }
// if (daySD.includes("cbMon: 'on'")) {
//   stringOutput += ' Monday,'
// }
// if (daySD.includes("cbTues: 'on'")) {
//   stringOutput += ' Tuesday,'
// }
// if (daySD.includes("cbWed: 'on'")) {
//   stringOutput += ' Wednesday,'
// }
// if (daySD.includes("cbThur: 'on'")) {
//   stringOutput += ' Thursday,'
// }
// if (daySD.includes("cbFri: 'on'")) {
//   stringOutput += ' Friday,'
// }
// if (daySD.includes("cbSat: 'on'")) {
//   stringOutput += ' Saturday,'
// }
// if (daySD.includes("mornShift: 'on'")) {
//   shiftTime = ' 6 am - 2 pm,'
// }
// if (daySD.includes("midShift: 'on'")) {
//   shiftTime = ' 8 am - 4 pm,'
// }
// if (daySD.includes("nightShift: 'on'")) {
//   shiftTime = ' 2 pm - 10 pm,'
// }

// let rawAvailStr = `${stringOutput} from ${shiftTime}`


// availStr.innerText = rawAvailStr.substring(0, rawAvailStr.length - 1)
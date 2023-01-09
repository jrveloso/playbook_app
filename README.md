# Playbook 
This project is a full-stack web application for NBA fans who want to write and talk about hoops with others. It has statistics integrated into the app for users who want to check today's boxscores, schedules, player stats, conference standings, rosters and more. Users can add and delete players from a watchlist of players they want to keep tabs on.

Link to project (Hosted on Render): https://playbook-j0hs.onrender.com

Try it using the demo account
- username: demo@demo.com
- password: demodemo

Note: This web app is still under construction and may display errors when using the live link]

<a target="_blank" href="https://playbook-j0hs.onrender.com">
    <img src="https://media.giphy.com/media/44L8sIMTM1OURWUbuH/giphy.gif" width="100%"  alt="Gratitude Journal"/>
</a>

## How It's Made:

Tech used: HTML, Tailwind, CSS, JavaScript, Nodejs, Express, MongoDB, EJS

Regarding project structure, I went with an MVC architecture. This allowed for less headaches with debugging, better modularity across the project, and an organized structure for future scalability.

I also focused on providing a seamless authentication experience for users with Passport.js.

## Optimizations
- Looking into other APIs or obtaining data via webscraping b/c currently using a free trial of an expensive API
- Add shot charts and individual gamelogs for players
- Add img and video uploading for posts
- Integrate highlight videos
- Integrate Google Auth for users who prefer to login with their Google credentials
- Refactor the project in React to take advantage of it's speed and component-based structure.

## Lessons Learned:

I learned the usefulness of making your code more modular and reusable via partials. I came to really appreciate the idea of separation of concerns for applications, like using MongoDB for file storage or Cloudinary for photo storage to offload those pieces from your application. Overall, this was a really fun and challenging project that allowed me to combine my love for the NBA and my software skills.

## NBA.com

NBA.com has a [Terms of Use](https://www.nba.com/termsofuse) regarding the use of the NBA’s digital platforms.

## More Projects

<table bordercolor="#66b2b2">
  
  <tr>
    <td width="50%"  style="align:center;" valign="top">
<a target="_blank" href="https://gratitude-journal.onrender.com">Gratitude Journal</a>
        <br />
      <a target="_blank" href="https://github.com/jrveloso/gratitude-journal-CRUD-Auth-app">
            <img src="https://media.giphy.com/media/MSPgjj9KleLwkWvIxZ/giphy.gif" width="100%"  alt="Gratitude Journal"/>
        </a>
    </td>
    <td width="50%" valign="top">
<a target="_blank" href="https://kblscorp.com">KBLS Corp</a>
      <br />
        <a target="_blank" href="https://github.com/jrveloso/kbls">
          <img src="https://media.giphy.com/media/ePJgVmul7o4hSG2kPR/giphy.gif" width="100%" alt="KBLS Corp"/>
        </a>
    </td>
</table>
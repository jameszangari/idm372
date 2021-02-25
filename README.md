# Shuffle Web App

#### [Visit Live Build](https://shuffle-web-app.herokuapp.com)

#### Requirements:

-   [node.js](https://nodejs.org/en/)
-   [nodemon](https://nodemon.io/)

#

#### 1. Initialize the app

1. In the Command Line, navigate to the directory **idm372**
2. Download node_modules using: `npm install`
3. Install nodemon globally using `npm i nodemon -g`
4. Fix any npm issues by running `npm audit fix`
5. Go to Microsoft Teams and download the necessary `.env` file:
   `Back End Development/.env`
6. Copy this file to the root of the project.

#

#### 2. Run the app

1. Run the command `nodemon server.js` to startup the express server
    - nodemon watches the files for changes and refreshes the server
    - if you run into an error saying "Cannot be loaded because running scripts is disabled on this system":
    -   - hit `CTRL/CMD + SHIFT + P` and type `settings`
    -   - next open `Prefences: Open Settings (JSON)`
    -   - add this line inside of the brackets `"terminal.integrated.shellArgs.windows": ["-ExecutionPolicy", "Bypass"]`
    -   - save this file and restart VSCode
    -   - re-run the command
2. The server will then be running on `localhost:8888`
3. In a new terminal tab/window, run the command `npm run dev` to build the files for development
    - Webpack will compile all files and watch for changes on save
4. Go to `localhost:8888` in your preferred browser to view the build

#

## Working with the files

-   **!!!** Before making any changes, **branch off of the main** using `git checkout -b (insert issue name here)` (make sure you pull first using `git pull origin main`)
-   If you see any issues or are assigned a task for the week, create a ticket/issue for it
-   **!!!** Create a **new branch** for your work titled the same as the ticket issue e.g. `git checkout -b Issue-#7` – this will sync the commits with the ticket so you can reference them in a pull request to show the changes that were fixed/worked on
    -   When pushing changes from the branch use `git push --set-upstream origin *branch name*`
-   Make sure you **create a pull request** when finished
    -   For organization of the repo, use [emojis](https://gitmoji.dev/) when writing commits messages e.g. `:lipstick: styled footer navigation`
    -   Using emojis on commit messages provides an easy way of identifying the purpose or intention of a commit

#

### Pages

-   All pages live inside the `views` folder at the root and use the `.ejs` templating language
-   The url, page title, and location of the `.ejs` templates are stored as values in `src/scripts/config/endpoints.json`
    -   This allows us to dynamically changes these values globally so that we don't have to manually change each value on each template e.g. `endpoints.registerAnthem.url`
-   In `src/scripts/routes`, there is a file called `routes.js` which renders these pages

#### Creating New Pages

1. Create a new `.ejs` template for the page you want to create e.g. `chat.ejs`
2. In `src/scripts/routes/routes.js`, create a new function for this page underneath the others (using formatting as a reference)
    1. Use `res.render` to load up an `.ejs` view file

#

### Styling Elements

-   All styles use [Sass](https://sass-lang.com/guide) | `.scss`
    -   View the link to learn about nesting, partials, variables, extending, etc.
-   `src/styles/main.scss` is the master file for all of these files, webpack will import all of the _partials_ into this this file and compile them into a `.css` file in `public/dist/css` (this will be re-compiled everytime you save)
    -   Each partial is broken out based on function, use this format for creating new files

#

---

### Debugging

-   If you are running into terminal errors for express or webpack, try re-running the commands for each
    -   Express: `nodemon server.js`
    -   Webpack: `npm run dev`

### Extras

-   Helpful VSCode plugins [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight) & [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
    -   These allow you to leave notes in certain areas of the project as a TODO list so you can come back to it later
    -   Todo Tree adds a sidebar icon to VSCode which shows where every TODO note you left is so you can keep track of what's left

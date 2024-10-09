// Create a variable for the new JSON file URL
let teamUrl = new URL('https://brylliant-dev.github.io/avpn/our-team.json');

// Define a function to get team data and populate tabs
function getTeamData() {
    // Create a request variable and assign a new XMLHttpRequest object to it
    let request = new XMLHttpRequest();

    // Convert the URL object to a string
    let url = teamUrl.toString();

    // Open a GET request to the URL
    request.open('GET', url, true);

    // Define what happens when the request loads
    request.onload = function() {
        // Parse the JSON response into a JavaScript object
        let data = JSON.parse(this.response);

        // Check if the request was successful
        if (request.status >= 200 && request.status < 400) {
            // Group the team members by 'Team Tab Title'
            let groupedTeams = data.reduce((acc, teamItem) => {
                let tabTitle = teamItem['Team'];
                if (!acc[tabTitle]) {
                    acc[tabTitle] = [];
                }
                acc[tabTitle].push(teamItem);
                return acc;
            }, {});

            // Loop through each group and create tabs and contents
            Object.keys(groupedTeams).forEach(function(tabTitle) {
                // Create the tab button for this team group
                let $tabButton = $('<div class="w-tab-link tab-title">' + tabTitle + '</div>');
                $('.w-tab-menu').append($tabButton);

                // Create the tab content container with an unordered list
                let $tabContent = $('<div class="w-tab-pane"><ul class="team-list"></ul></div>');
                $('.w-tab-content').append($tabContent);

                // Get the list of team members for this group
                let teamMembers = groupedTeams[tabTitle];

                // Loop through the team members and add them to the list
                teamMembers.forEach(function(teamItem) {
                    // Create list item for each team member
                    let $listItem = $('<li></li>');
                    let $itemWrapper = $('<div class="team_list-item_wrapper"></div>');

                    // Populate the wrapper with team details
                    let $teamName = $('<div class="team-name">' + teamItem['Name'] + '</div>');
                    let $teamDesignation = $('<div class="team-designation">' + teamItem['Designation'] + '</div>');
                    let $teamImg = $('<img class="team-img" src="' + teamItem['Image'] + '"/>');

                    // Append the team details into the wrapper
                    $itemWrapper.append($teamName, $teamDesignation, $teamImg);

                    // Append the wrapper into the list item
                    $listItem.append($itemWrapper);

                    // Append the list item into the unordered list inside the tab content
                    $tabContent.find('ul.team-list').append($listItem);
                });
            });

            // Reinitialize Webflow tabs after populating content
            Webflow.require('tabs').ready();
        }
    };

    // Send the request to load the team data
    request.send();
}

// Run the getTeamData function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    getTeamData();
});
